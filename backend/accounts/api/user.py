import json
import math
from datetime import datetime
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from accounts.models import Schedule, Ticket
from accounts.serializers import ScheduleOutSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import Promo
from accounts.serializers import PromoSerializer
from datetime import date


@api_view(["GET"])
@permission_classes([AllowAny])
def user_active_promo(request):
    promos = Promo.objects.filter(active=True).order_by("-created_at")
    return Response(PromoSerializer(promos, many=True).data)


User = get_user_model()

def _parse_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except Exception:
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
            if count >= capacity:
                return seats

    return seats

@csrf_exempt
def get_user_profile(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        data = {
            "id": user.id,
            "nama": user.username,
            "email": user.email,
            "noKtp": getattr(user, "no_ktp", ""),
            "jenisKelamin": getattr(user, "jenis_kelamin", ""),
            "alamat": getattr(user, "address", ""),
            "kotaKab": getattr(user, "kota_kab", ""),
            "noHp": getattr(user, "phone", ""),
        }
        return JsonResponse(data, status=200)
    except User.DoesNotExist:
        return JsonResponse({"error": "User tidak ditemukan"}, status=404)
    
@csrf_exempt
def update_user_profile(request, user_id):
    if request.method in ["PUT", "POST"]:
        try:
            user = User.objects.get(id=user_id)
            data = json.loads(request.body.decode("utf-8"))

            user.username = data.get("nama", user.username)
            user.email = data.get("email", user.email)
            user.no_ktp = data.get("noKtp", user.no_ktp)
            user.jenis_kelamin = data.get("jenisKelamin", user.jenis_kelamin)
            user.address = data.get("alamat", user.address)
            user.kota_kab = data.get("kotaKab", user.kota_kab)
            user.phone = data.get("noHp", user.phone)

            if data.get("password"):
                user.password = make_password(data["password"])

            user.save()
            return JsonResponse({"success": True, "message": "Profil berhasil diperbarui"}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"error": "User tidak ditemukan"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Gunakan metode PUT atau POST"}, status=405)

@csrf_exempt
def user_jadwal_list(request):
    if request.method != "GET":
        return JsonResponse({"error": "Gunakan GET"}, status=405)

    origin = request.GET.get("origin")
    destination = request.GET.get("destination")
    date = request.GET.get("date")

    qs = Schedule.objects.select_related("bus").filter(status="active")

    if origin:
        qs = qs.filter(origin__icontains=origin)

    if destination:
        qs = qs.filter(destination__icontains=destination)

    if date:
        qs = qs.filter(date=date)

    data = ScheduleOutSerializer(qs, many=True).data
    return JsonResponse(data, safe=False)


@csrf_exempt
def user_jadwal_search(request):
    if request.method != "GET":
        return JsonResponse({"error": "Gunakan GET"}, status=405)

    origin = request.GET.get("origin", "").strip()
    destination = request.GET.get("destination", "").strip()
    date_str = request.GET.get("date", "").strip()

    qs = Schedule.objects.select_related("bus").filter(status="active")

    if origin:
        qs = qs.filter(origin__icontains=origin)

    if destination:
        qs = qs.filter(destination__icontains=destination)

    if date_str != "":
        date_val = _parse_date(date_str)
        if not date_val:
            return JsonResponse({"error": "Format tanggal salah (YYYY-MM-DD)"}, status=400)
        qs = qs.filter(date=date_val)

    qs = qs.order_by("date", "time")
    data = ScheduleOutSerializer(qs, many=True).data
    return JsonResponse(data, safe=False)

@csrf_exempt
def user_jadwal_seats(request, pk):
    if request.method != "GET":
        return JsonResponse({"error": "Gunakan GET"}, status=405)

    try:
        sch = Schedule.objects.get(id=pk, status__in=["active", "inactive"])
    except Schedule.DoesNotExist:
        return JsonResponse({"error": "Jadwal tidak ditemukan"}, status=404)

    seats = _generate_seats(sch.capacity)  # list of seat ids

    # Ambil kursi yang sudah terjual
    sold = set(Ticket.objects.filter(schedule=sch).values_list("seat_id", flat=True))

    # Jika sleeper, bagi seats menjadi dua bagian (atas / bawah) — agar semua kursi dikembalikan
    if sch.bus.is_sleeper:
        total = len(seats)
        half = math.ceil(total / 2)  # put extra seat ke lantai_atas
        atas_ids = seats[:half]
        bawah_ids = seats[half:]

        def mk_list(ids):
            out = []
            for sid in ids:
                row = sid[0]
                col = sid[1:]  # support multi-digit columns
                out.append({
                    "id": sid,
                    "row": row,
                    "col": int(col),
                    "available": sid not in sold
                })
            return out

        data = {
            "lantai_atas": mk_list(atas_ids),
            "lantai_bawah": mk_list(bawah_ids),
        }
    else:
        # inline: semua kursi satu list
        data = []
        for sid in seats:
            row = sid[0]
            col = sid[1:]
            data.append({
                "id": sid,
                "row": row,
                "col": int(col),
                "available": sid not in sold
            })

    return JsonResponse(data, safe=False)