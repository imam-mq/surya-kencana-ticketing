from collections import defaultdict
from django.db import transaction
from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework import status

from accounts.models import (
    Schedule, 
    Ticket, 
    AgentCommission, 
    CommissionPeriod
)
from accounts.serializers import (
    ScheduleOutSerializer,
    AgentBookingSerializer,
    AgentTicketSerializer,
    AgentCommissionSerializer,
    CommissionPeriodSerializer
)

# Custom Auth untuk menangani masalah 403 Forbidden pada Session Agent (CORS/CSRF)
class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return None

# --- FITUR PEMESANAN (BOOKING) ---

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_jadwal_list(request):
    """List jadwal aktif khusus untuk role agent"""
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Akses ditolak"}, status=403)

    origin = request.GET.get("origin")
    destination = request.GET.get("destination")
    date = request.GET.get("date")

    qs = Schedule.objects.select_related("bus").filter(status="active")

    if origin: qs = qs.filter(origin__icontains=origin)
    if destination: qs = qs.filter(destination__icontains=destination)
    if date: qs = qs.filter(date=date)

    return Response(ScheduleOutSerializer(qs, many=True).data)

@api_view(["POST"])
@authentication_classes([UnsafeSessionAuthentication])
@permission_classes([IsAuthenticated])
def agent_create_booking(request):
    """Proses pembuatan tiket oleh agent dengan komisi OTOMATIS 15%"""
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Hanya agent yang diizinkan"}, status=403)

    data = request.data.copy()
    if 'schedule_id' in data and 'schedule' not in data:
        data['schedule'] = data['schedule_id']

    serializer = AgentBookingSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    schedule = serializer.validated_data["schedule"]
    seats = serializer.validated_data["seats"]
    passengers = serializer.validated_data["passengers"]
    agent = request.user 

    if len(seats) != len(passengers):
        return Response({"error": "Data tidak ditemukan untuk periode tersebut"}, status=400)

    try:
        with transaction.atomic():
            tickets = []
            
            # --- LOGIKA UTAMA KOMISI 15% ---
            # Mengambil komisi agen, jika di database null/0, dipaksa ke 15
            comm_percent = getattr(agent, 'commission_percent', 15) or 15
            
            # Perhitungan nominal rupiah (15% dari harga tiket)
            # Menggunakan float() untuk keamanan perhitungan matematis
            comm_amount_per_ticket = (float(comm_percent) / 100) * float(schedule.price)
            # -------------------------------

            for idx, seat in enumerate(seats):
                p = passengers[idx]
                ticket = Ticket.objects.create(
                    schedule=schedule,
                    buyer=agent,
                    seat_id=seat,
                    passenger_name=p.get("name"),
                    passenger_ktp=p.get("no_ktp") or p.get("ktp"),
                    passenger_phone=p.get("phone"),
                    passenger_gender=p.get("gender"),
                    bus_name=schedule.bus.name,
                    bus_code=schedule.bus.code,
                    origin=schedule.origin,
                    destination=schedule.destination,
                    departure_date=schedule.date,
                    departure_time=schedule.time,
                    price_paid=schedule.price,
                    payment_status="paid",
                    bought_by="agent",
                )

                # Simpan catatan komisi ke database
                AgentCommission.objects.create(
                    agent=agent,
                    ticket=ticket,
                    commission_percent=comm_percent,
                    commission_amount=comm_amount_per_ticket,
                    status="unsettled"
                )
                tickets.append(ticket)

            return Response({
                "success": True,
                "message": f"{len(tickets)} Tiket berhasil diterbitkan (Komisi {comm_percent}%)",
                "tickets": AgentTicketSerializer(tickets, many=True).data
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": f"Gagal memproses: {str(e)}"}, status=500)

# --- FITUR RIWAYAT TIKET ---

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_ticket_list(request):
    """Riwayat tiket agent dikelompokkan per transaksi"""
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Hanya agent yang diizinkan"}, status=403)

    q = request.GET.get("q", "").lower()
    tickets = Ticket.objects.filter(buyer=request.user, bought_by="agent").order_by("-purchased_at")

    grouped = defaultdict(lambda: {
        "id": None, "bus_name": "", "bus_code": "", "origin": "", "destination": "",
        "departure_date": "", "departure_time": "", "seats": [], "passenger_names": [],
        "purchased_at": None,
    })

    for t in tickets:
        key = (t.schedule_id, t.purchased_at.strftime('%Y-%m-%d %H:%M'))
        g = grouped[key]

        if g["id"] is None:
            g.update({
                "id": t.id, "bus_name": t.bus_name, "bus_code": t.bus_code,
                "origin": t.origin, "destination": t.destination,
                "departure_date": t.departure_date, "departure_time": t.departure_time,
                "purchased_at": t.purchased_at,
            })
        g["seats"].append(t.seat_id)
        if t.passenger_name: g["passenger_names"].append(t.passenger_name)

    result = list(grouped.values())
    if q:
        result = [r for r in result if any(q in name.lower() for name in r["passenger_names"])]

    return Response(result, status=200)

# --- FITUR MANAJEMEN KOMISI & SETORAN ---

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_commission_management(request):
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Akses ditolak"}, status=403)

    user = request.user
    dari = request.GET.get('dari_tanggal')
    sampai = request.GET.get('sampai_tanggal')

    qs = CommissionPeriod.objects.filter(agent=user).order_by('-start_date')

    if dari and sampai:
        qs = qs.filter(start_date__gte=dari, end_date__lte=sampai)

    serializer = CommissionPeriodSerializer(qs, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@authentication_classes([UnsafeSessionAuthentication])
@permission_classes([IsAuthenticated])
def agent_submit_transfer(request, period_id):
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Akses ditolak"}, status=403)

    try:
        period = CommissionPeriod.objects.get(id=period_id, agent=request.user)
        bukti = request.FILES.get('bukti_transfer')
        
        if not bukti:
            return Response({"error": "Bukti transfer wajib diunggah"}, status=400)
            
        period.bukti_transfer = bukti
        period.save()
        
        return Response({
            "success": True, 
            "message": "Bukti transfer berhasil dikirim."
        })
    except CommissionPeriod.DoesNotExist:
        return Response({"error": "Data periode tidak ditemukan"}, status=404)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_commission_report(request):
    """Laporan Komisi Grouping per Transaksi"""
    if getattr(request.user, "role", None) != "agent":
        return Response({"error": "Akses ditolak"}, status=403)

    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    search_query = request.GET.get('q', '').lower()

    if start_date and not end_date:
        return Response({
            "error": "Filter tidak lengkap",
            "message": "Data tidak ditemukan untuk periode tersebut"
        }, status=status.HTTP_400_BAD_REQUEST)

    commissions = AgentCommission.objects.filter(agent=request.user).select_related('ticket')

    # Filter hanya dijalankan jika KEDUANYA ada
    if start_date and end_date:
        commissions = commissions.filter(ticket__departure_date__range=[start_date, end_date])
        
        # Opsi: Jika hasil filter kosong, kirim error 404
        if not commissions.exists():
            return Response({"error": "Data tidak ditemukan untuk periode tersebut"}, status=404)
    
    # Filter berdasarkan nama penumpang
    if search_query:
        commissions = commissions.filter(ticket__passenger_name__icontains=search_query)

    grouped_data = defaultdict(lambda: {
        "id": None, "tanggal": "", "tipe_bis": "", "kursi": [],
        "nama_penumpang": [], "keberangkatan": "", "tujuan": "",
        "harga_tiket": 0, "komisi": 0
    })

    for comm in commissions:
        ticket = comm.ticket
        time_key = ticket.purchased_at.strftime('%Y-%m-%d %H:%M:%S') 
        unique_key = f"{ticket.schedule.id}_{time_key}"

        item = grouped_data[unique_key]

        if item["id"] is None:
            item.update({
                "id": ticket.id, "tanggal": ticket.departure_date,
                "tipe_bis": ticket.bus_name, "keberangkatan": ticket.origin,
                "tujuan": ticket.destination,
            })

        item["kursi"].append(ticket.seat_id)
        item["nama_penumpang"].append(ticket.passenger_name)
        item["harga_tiket"] += float(ticket.price_paid or 0)
        item["komisi"] += float(comm.commission_amount or 0)

    total_unsettled = AgentCommission.objects.filter(
        agent=request.user, 
        status="unsettled"
    ).aggregate(total=Sum('commission_amount'))['total'] or 0

    return Response({
        "total_komisi_aktif": total_unsettled,
        "results": list(grouped_data.values()) 
    })