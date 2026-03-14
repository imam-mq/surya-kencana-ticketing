import json
import math
from datetime import datetime
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from accounts.models import Jadwal, Tiket, Promosi, Pemesanan 
from django.db import transaction
from django.utils import timezone


from accounts.models import Jadwal, Tiket, Promosi
from accounts.serializers import ScheduleOutSerializer, PromoSerializer

User = get_user_model()

def _parse_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except:
        return None

def _generate_seats(capacity):
    rows = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    cols = [1, 2, 3, 4]
    seats = []
    count = 0
    for r in rows:
        for c in cols:
            seats.append(f"{r}{c}")
            count += 1
            if count >= capacity: return seats
    return seats

@api_view(["GET"])
@permission_classes([AllowAny])
def user_active_promo(request):
    promos = Promosi.objects.filter(status='active').order_by("-tanggal_mulai")
    return Response(PromoSerializer(promos, many=True).data)

@csrf_exempt
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return JsonResponse({
            "id": user.id,
            "nama": user.username,
            "email": user.email,
            "noKtp": getattr(user, "no_ktp", ""),
            "jenisKelamin": getattr(user, "jenis_kelamin", ""),
            "alamat": getattr(user, "alamat", ""),
            "kotaKab": getattr(user, "kota_kab", ""),
            "noHp": getattr(user, "telepon", ""),
        })
    except User.DoesNotExist:
        return JsonResponse({"error": "User tidak ditemukan"}, status=404)

@csrf_exempt
def update_user_profile(request, user_id):
    if request.method not in ["PUT", "POST"]:
        return JsonResponse({"error": "Method not allowed"}, status=405)
    try:
        user = User.objects.get(id=user_id)
        data = json.loads(request.body.decode("utf-8"))
        user.username = data.get("nama", user.username)
        user.email = data.get("email", user.email)
        user.alamat = data.get("alamat", user.alamat)
        user.telepon = data.get("noHp", user.telepon)
        if data.get("password"):
            user.password = make_password(data["password"])
        user.save()
        return JsonResponse({"success": True, "message": "Profil diperbarui"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def user_jadwal_list(request):
    asal = request.GET.get("asal")
    tujuan = request.GET.get("tujuan")
    tanggal = request.GET.get("tanggal")
    qs = Jadwal.objects.select_related("bus").filter(status="active")
    if asal: qs = qs.filter(asal__icontains=asal)
    if tujuan: qs = qs.filter(tujuan__icontains=tujuan)
    if tanggal: qs = qs.filter(waktu_keberangkatan__date=tanggal)
    return JsonResponse(ScheduleOutSerializer(qs, many=True).data, safe=False)

@csrf_exempt
def user_jadwal_search(request):
    asal = request.GET.get("asal", "").strip()
    tujuan = request.GET.get("tujuan", "").strip()
    date_str = request.GET.get("tanggal", "").strip()
    qs = Jadwal.objects.select_related("bus").filter(status="active")
    if asal: qs = qs.filter(asal__icontains=asal)
    if tujuan: qs = qs.filter(tujuan__icontains=tujuan)
    if date_str:
        dv = _parse_date(date_str)
        if dv: qs = qs.filter(waktu_keberangkatan__date=dv)
    qs = qs.order_by("waktu_keberangkatan")
    return JsonResponse(ScheduleOutSerializer(qs, many=True).data, safe=False)

@csrf_exempt
def user_jadwal_seats(request, pk):
    try:
        sch = Jadwal.objects.get(id=pk)
        seats = _generate_seats(sch.bus.total_kursi)
        sold = set(Tiket.objects.filter(jadwal=sch).values_list("nomor_kursi", flat=True))
        is_sleeper = "sleeper" in (sch.bus.tipe or "").lower()

        def mk_item(sid):
            return {"id": sid, "row": sid[0], "col": int(sid[1:]), "available": sid not in sold}

        if is_sleeper:
            half = math.ceil(len(seats) / 2)
            return JsonResponse({
                "lantai_atas": [mk_item(s) for s in seats[:half]],
                "lantai_bawah": [mk_item(s) for s in seats[half:]]
            })
        return JsonResponse([mk_item(s) for s in seats], safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=404)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_create_order(request):
    user = request.user
    data = request.data

    jadwal_id = data.get('jadwal_id')
    penumpang_list = data.get('penumpang') # mengambil data {kursi, nama, nik, nomor telepon & jenis kelamin}
    promosi_id = data.get('promosi_id')

    try:
        jadwal = Jadwal.objects.get(id=jadwal_id)
    except Jadwal.DoesNotExist:
        return Response({'error': 'Jadwal tidak ditemukan'}, status=404)

    # harga awal
    harga_per_tiket = jadwal.harga
    jumlah_tiket = len(penumpang_list)
    total_harga = harga_per_tiket * jumlah_tiket

    jumlah_diskon = 0
    promosi = None

    # 2. Pengecekan Promo (Voucher)
    if promosi_id:
        try:
            promosi = Promosi.objects.get(id=promosi_id, status='active')
            hari_ini = timezone.now().date()
            
            # mengecek apakah promo masih active
            if promosi.tanggal_mulai <= hari_ini <= promosi.tanggal_selesai:
                jumlah_diskon = (total_harga * promosi.persen_diskon) / 100
            else:
                return Response({'error': 'Maaf, masa berlaku promo ini sudah habis.'}, status=400)
                
        except Promosi.DoesNotExist:
            return Response({'error': 'Voucher tidak valid.'}, status=400)

    harga_akhir = total_harga - jumlah_diskon

    # menyimpan Database
    try:
        with transaction.atomic():
            # Pemesanan
            pemesanan = Pemesanan.objects.create(
                pembeli=user,
                peran_pembeli='user',
                jadwal=jadwal,
                promosi=promosi,
                total_harga=total_harga,
                jumlah_diskon=jumlah_diskon,
                harga_akhir=harga_akhir,
                status_pembayaran='pending',
                metode_pembayaran='midtrans' # Placeholder sebelum midtrans merespon
            )

            # data tiket
            for p in penumpang_list:
                
                if Tiket.objects.filter(jadwal=jadwal, nomor_kursi=p['kursi']).exists():
                    raise Exception(f"Waduh! Kursi {p['kursi']} baru saja dipesan orang lain. Silakan pilih kursi lain.")

                Tiket.objects.create(
                    pemesanan=pemesanan,
                    jadwal=jadwal,
                    nomor_kursi=p['kursi'],
                    nama_penumpang=p['nama'],
                    ktp_penumpang=p['nik'],
                    telepon_penumpang=p.get('telepon', ''),
                    jenis_kelamin_penumpang=p.get('gender', ''),
                    harga_kursi=harga_per_tiket
                )

        # jika succes akan menampilkan
        return Response({
            'success': True,
            'message': 'Pesanan berhasil diamankan!',
            'order_id': pemesanan.id,
            'harga_akhir': pemesanan.harga_akhir
        })

    except Exception as e:
        # jika kursi sudah di isi oleh orang lain maka tidak bisa melanjutkan pembayaran
        return Response({'error': str(e)}, status=400)