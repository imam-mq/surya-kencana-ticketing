from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth import get_user_model

# IMPORT MODEL BARU (SESUAI ERD)
from accounts.models import (
    Pengguna, Bus, Jadwal, Promosi, 
    Pemesanan, Tiket, PeriodeKomisi, TransferKomisi
)

# IMPORT SERIALIZER BARU
from accounts.serializers import (
    AgentSerializer, 
    BusSerializer, 
    ScheduleOutSerializer, 
    ScheduleInSerializer, 
    PromoSerializer, 
    SetoranAgentAdminSerializer
)

# IMPORT AUTH BYPASS
from accounts.authenticate import CsrfExemptSessionAuthentication

User = get_user_model()

# ================= HELPER =================
def is_admin(user):
    return getattr(user, 'peran', None) == 'admin' or user.is_staff

# ================= 1. MANAJEMEN USER & AGENT =================

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def user_list(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized: Hanya Admin"}, status=403)
    
    # GANTI 'dibuat_pada' menjadi 'date_joined'
    users = Pengguna.objects.filter(peran='user').values(
        'id', 'username', 'email', 'nama_lengkap', 'telepon', 'date_joined'
    )
    return Response(list(users))

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def agent_list(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized: Hanya Admin"}, status=403)
    
    agents = Pengguna.objects.filter(peran='agent')
    serializer = AgentSerializer(agents, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication]) # WAJIB ADA
@permission_classes([IsAuthenticated])
def add_agent(request):
    # Pastikan helper is_admin sudah didefinisikan sebelumnya
    if not is_admin(request.user):
        return Response({"error": "Forbidden: Akun Anda bukan Admin"}, status=403)
    
    serializer = AgentSerializer(data=request.data)
    if serializer.is_valid():
        # Paksa set peran menjadi 'agent'
        serializer.save(peran='agent') 
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# ================= 2. MANAJEMEN BUS =================

@api_view(['GET', 'POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_bus_list_create(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)

    if request.method == 'GET':
        buses = Bus.objects.all()
        return Response(BusSerializer(buses, many=True).data)
    
    elif request.method == 'POST':
        serializer = BusSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# ================= 3. MANAJEMEN JADWAL =================

@api_view(['GET', 'POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_jadwal_list_create(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)

    if request.method == 'GET':
        jadwals = Jadwal.objects.select_related('bus').all().order_by('-waktu_keberangkatan')
        return Response(ScheduleOutSerializer(jadwals, many=True).data)

    elif request.method == 'POST':
        serializer = ScheduleInSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_jadwal_detail(request, pk):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)

    jadwal = get_object_or_404(Jadwal, pk=pk)

    if request.method == 'GET':
        return Response(ScheduleOutSerializer(jadwal).data)

    elif request.method == 'PUT':
        serializer = ScheduleInSerializer(jadwal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        jadwal.delete()
        return Response({"message": "Jadwal berhasil dihapus"}, status=204)

# ================= 4. MANAJEMEN PROMO =================

@api_view(['GET', 'POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_promo_list_create(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)

    if request.method == 'GET':
        promos = Promosi.objects.all().order_by('-id')
        return Response(PromoSerializer(promos, many=True).data)
    
    elif request.method == 'POST':
        serializer = PromoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['GET', 'PUT', 'DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_promo_detail(request, promo_id):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)
    
    promo = get_object_or_404(Promosi, pk=promo_id)

    if request.method == 'GET':
        return Response(PromoSerializer(promo).data)
    
    elif request.method == 'PUT':
        serializer = PromoSerializer(promo, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'DELETE':
        promo.delete()
        return Response({"message": "Promo berhasil dihapus"}, status=204)

# ================= 5. LAPORAN & VALIDASI SETORAN =================

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_setoran_list(request):
    if not is_admin(request.user):
        return Response({"error": "Unauthorized"}, status=403)
    
    
    setorans = TransferKomisi.objects.select_related('periode__agen').all().order_by('-tanggal_transfer')
    return Response(SetoranAgentAdminSerializer(setorans, many=True).data)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_validasi_setoran(request, pk):
    # Pastikan yang login admin
    if getattr(request.user, "peran", None) != "admin":
        return Response({"error": "Unauthorized"}, status=403)
    
    # 🔥 Frontend mengirim ID PeriodeKomisi, jadi cari dari periodenya
    periode = get_object_or_404(PeriodeKomisi, pk=pk)
    transfer = periode.transfer.first() # Ambil transfernya

    if not transfer:
        return Response({"error": "Data bukti transfer tidak ditemukan"}, status=404)

    # 🔥 Tangkap payload 'aksi' dari React ('terima' atau 'tolak')
    aksi = request.data.get('aksi')

    if aksi == 'terima':
        try:
            with transaction.atomic():
                # 1. Update status transfer
                transfer.status = 'approved'
                transfer.divalidasi_oleh = request.user
                transfer.divalidasi_pada = timezone.now()
                transfer.save()
                
                # 2. Update status periode induk
                periode.status = 'approved'
                periode.save()
                
                # 3. Update status komisi tiket menjadi 'paid' (LUNAS)
                from accounts.models import KomisiAgen
                tiket_ids = periode.item.values_list('tiket_id', flat=True)
                KomisiAgen.objects.filter(tiket_id__in=tiket_ids).update(status='paid')
                
            return Response({"success": True, "message": "Setoran berhasil diterima."})
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    elif aksi == 'tolak':
        # Ubah status jadi ditolak dengan catatan audit lengkap
        transfer.status = 'rejected'
        transfer.divalidasi_oleh = request.user
        transfer.divalidasi_pada = timezone.now()
        transfer.save()
        
        periode.status = 'rejected'
        periode.save()
        
        return Response({"success": True, "message": "Setoran ditolak."})
    
    return Response({"error": "Aksi tidak dikenali"}, status=400)

#==================Laporan Agent Transaksi=================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_laporan_transaksi(request):
    # 1. Pastikan yang login benar-benar Admin
    if getattr(request.user, "peran", None) != "admin":
        return Response({"error": "Akses ditolak"}, status=403)

    # 2. Tangkap parameter dari Frontend (React)
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    search_agent = request.GET.get('q')

    # 3. Ambil data setoran (PeriodeKomisi) urut dari yang paling baru
    qs = PeriodeKomisi.objects.all().order_by('-dibuat_pada')

    # 4. Terapkan Filter Tanggal
    if start_date:
        qs = qs.filter(tanggal_mulai__gte=start_date)
    if end_date:
        qs = qs.filter(tanggal_selesai__lte=end_date)

    # 5. Terapkan Filter Pencarian Nama Agent
    if search_agent:
        qs = qs.filter(
            Q(agen__username__icontains=search_agent) | 
            Q(agen__nama_lengkap__icontains=search_agent)
        )

    # 6. Susun Data Sesuai Permintaan Frontend
    data = []
    for periode in qs:
        status_frontend = "MENUNGGU"
        if periode.status == "approved":
            status_frontend = "DITERIMA"
        elif periode.status == "rejected":
            status_frontend = "DITOLAK"
        elif periode.status == "waiting_validation":
            status_frontend = "MENUNGGU"

        # 🔥 AMBIL DATA BUKTI TRANSFER
        transfer = periode.transfer.first() # Mengambil dari relasi related_name='transfer'
        bukti_url = transfer.bukti_file.url if transfer and transfer.bukti_file else None

        data.append({
            "id": periode.id,
            "periode_awal": periode.tanggal_mulai.strftime('%Y-%m-%d'),
            "periode_akhir": periode.tanggal_selesai.strftime('%Y-%m-%d'),
            "agent_name": periode.agen.nama_lengkap or periode.agen.username, 
            "total_tagihan": float(periode.total_setor) + float(periode.total_komisi), # Kotor (Bruto)
            "total_komisi": float(periode.total_komisi),
            "total_bayar": float(periode.total_setor), # 🔥 Ditambahkan untuk React (Nett Setoran)
            "status": status_frontend,
            "bukti_transfer": bukti_url # 🔥 Ditambahkan untuk Modal React
        })

    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_laporan_transaksi_detail(request, pk):
    if getattr(request.user, "peran", None) != "admin":
        return Response({"error": "Akses ditolak"}, status=403)

    periode = get_object_or_404(PeriodeKomisi, pk=pk)
    items = periode.item.select_related('tiket__jadwal__bus', 'tiket__pemesanan').all()

    data = []
    for item in items:
        tiket = item.tiket
        jadwal = tiket.jadwal if tiket else None
        bus = jadwal.bus if jadwal else None
        
        # PENYESUAIAN SESUAI MODELS.PY ABANG
        # Gunakan 'tipe' karena di model Bus Abang kolomnya bernama 'tipe'
        info_bus = f"{bus.nama} [{bus.tipe}]" if bus else "Bus Tidak Ditemukan"
        
        rute_asal = jadwal.asal if jadwal else "-"
        rute_tujuan = jadwal.tujuan if jadwal else "-"
        waktu = jadwal.waktu_keberangkatan.strftime("%H:%M") if jadwal else "00:00"
        harga_tkt = float(jadwal.harga) if jadwal else 0
        
        data.append({
            "tanggal": tiket.pemesanan.dibuat_pada.strftime("%d %b %Y") if tiket and tiket.pemesanan else "-",
            "bus": info_bus, # Sudah menggunakan bus.nama dan bus.tipe
            "namaPenumpang": tiket.nama_penumpang if tiket else "-",
            "kursi": tiket.nomor_kursi if tiket else "-",
            "keterangan": rute_asal,
            "kedatangan": rute_tujuan,
            "jam": waktu,
            "harga": harga_tkt,
            "komisi": float(item.jumlah_komisi),
        })

    return Response(data)