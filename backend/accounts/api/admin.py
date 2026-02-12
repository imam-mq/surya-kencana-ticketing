from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login
from accounts.models import CustomUser
import json

# Import model
from accounts.models import Bus, Schedule, Ticket, Promo
from accounts.serializers import (
    BusSerializer,
    ScheduleOutSerializer,
    ScheduleInSerializer,
    PromoSerializer,
)

# ==========================
# 1. CLASS AUTH FIX (PENTING)
# ==========================
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        # Return None artinya: Jangan cek CSRF, lewatkan saja.
        return None

# ==========================
# 2. LOGIC ADMIN FIX (PENTING)
# ==========================
def _is_admin(user):
    # Cek 1: User harus login
    if not user or not user.is_authenticated:
        return False
    
    # Cek 2: User boleh masuk jika dia 'admin' ATAU 'superuser' ATAU 'staff'
    # Akun dari 'createsuperuser' biasanya role-nya kosong/user, jadi perlu user.is_superuser
    return (
        getattr(user, "role", None) == "admin" or 
        user.is_superuser or 
        user.is_staff
    )

# ==========================
# BUS
# ==========================
@api_view(["GET", "POST"])
@authentication_classes([CsrfExemptSessionAuthentication]) # Wajib ada
@permission_classes([IsAuthenticated])
def admin_bus_list_create(request):
    # Debug print untuk melihat siapa yang akses di terminal
    print(f"DEBUG BUS: User={request.user}, Role={getattr(request.user, 'role', 'N/A')}, Super={request.user.is_superuser}")

    if not _is_admin(request.user):
        return Response({"error": "Hanya admin (Akses Ditolak)"}, status=403)

    if request.method == "GET":
        qs = Bus.objects.all().order_by("id")
        return Response(BusSerializer(qs, many=True).data)

    # POST
    serializer = BusSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    bus = serializer.save()
    return Response(BusSerializer(bus).data, status=201)


# ==========================
# JADWAL
# ==========================
@api_view(["GET", "POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_jadwal_list_create(request):
    if not _is_admin(request.user):
        return Response({"error": "Hanya admin (Akses Ditolak)"}, status=403)

    if request.method == "GET":
        qs = Schedule.objects.select_related("bus").all()
        return Response(ScheduleOutSerializer(qs, many=True).data)

    # POST
    print("DEBUG JADWAL DATA:", request.data) # Cek data yang dikirim frontend
    serializer = ScheduleInSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    schedule = serializer.save()
    return Response(ScheduleOutSerializer(schedule).data, status=201)


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_jadwal_detail(request, pk):
    if not _is_admin(request.user):
        return Response({"error": "Hanya admin (Akses Ditolak)"}, status=403)

    try:
        schedule = Schedule.objects.select_related("bus").get(pk=pk)
    except Schedule.DoesNotExist:
        return Response({"error": "Jadwal tidak ditemukan"}, status=404)

    if request.method == "GET":
        tickets = Ticket.objects.filter(schedule=schedule)
        data = ScheduleOutSerializer(schedule).data
        data["tickets"] = [
            {
                "seat": t.seat_id,
                "passenger": t.passenger_name,
                "status": t.payment_status,
            }
            for t in tickets
        ]
        return Response(data)

    if request.method == "PUT":
        serializer = ScheduleInSerializer(schedule, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save()
        return Response(ScheduleOutSerializer(schedule).data)

    # DELETE/CANCEL
    schedule.status = "canceled"
    schedule.save(update_fields=["status"])
    return Response({"success": True, "message": "Jadwal dibatalkan"})


# ==========================
# PROMO
# ==========================
from django.utils.timezone import now
import calendar
from datetime import datetime

@api_view(["GET", "POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_promo_list_create(request):
    if not _is_admin(request.user):
        return Response({"error": "Hanya admin"}, status=403)

    if request.method == "GET":
        promos = Promo.objects.all().order_by("-created_at")
        return Response(PromoSerializer(promos, many=True).data)

    # ===== POST PROMO =====
    data = request.data.copy()
    start_date_str = data.get("start_date")
    
    if not start_date_str:
        return Response({"error": "start_date wajib"}, status=400)

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Format tanggal harus YYYY-MM-DD"}, status=400)

    year = start_date.year
    month = start_date.month
    last_day = calendar.monthrange(year, month)[1]
    end_date = start_date.replace(day=last_day)

    data["start_date"] = start_date
    data["end_date"] = end_date

    serializer = PromoSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    promo = serializer.save()

    return Response(PromoSerializer(promo).data, status=201)


@api_view(["GET", "PUT", "DELETE"])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_promo_detail(request, promo_id):
    if not _is_admin(request.user):
        return Response({"error": "Hanya admin"}, status=403)

    try:
        promo = Promo.objects.get(id=promo_id)
    except Promo.DoesNotExist:
        return Response({"error": "Promo tidak ditemukan"}, status=404)

    if request.method == "GET":
        return Response(PromoSerializer(promo).data)

    if request.method == "PUT":
        serializer = PromoSerializer(promo, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(PromoSerializer(serializer.save()).data)

    promo.delete()
    return Response({"success": True, "message": "Promo dihapus"})


# ==========================
# LOGIN API (JANGAN LUPA BAGIAN INI)
# ==========================
@csrf_exempt
def login_admin_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")

        user = authenticate(request, username=username, password=password)

        if not user:
            return JsonResponse({"success": False, "message": "Login gagal"}, status=401)

        # Cek Logic yang sama dengan _is_admin
        is_authorized = (
            getattr(user, "role", None) == "admin" or 
            user.is_superuser or 
            user.is_staff
        )

        if not is_authorized:
            return JsonResponse({"success": False, "message": "Bukan akun admin"}, status=403)

        login(request, user)  # SESSION DIBUAT DI SINI

        return JsonResponse({
            "success": True,
            "id": user.id,
            "username": user.username,
            "role": getattr(user, "role", "superuser"), # Kirim role biar frontend ga bingung
        })
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)

# ==========================
# USER LIST Bagian Yang Sudah Registrasi
# ==========================
@csrf_exempt
def user_list(request):
    """Tampilkan hanya user biasa (bukan admin, bukan agent)"""
    users = CustomUser.objects.filter(role='user', is_superuser=False).values(
        "id", "username", "email", "date_joined", "is_active"
    )
    return JsonResponse(list(users), safe=False)

# ==========================
# AGEN LIST Bagian Yang Sudah Di Buatkan Akun Oleh Admin
# ==========================

@csrf_exempt
def agent_list(request):
    """Tampilkan hanya agent (bukan admin)"""
    agents = CustomUser.objects.filter(role='agent', is_superuser=False).values(
        "id", "first_name", "last_name", "email", "phone",
        "commission_percent", "lokasi", "role", "date_joined", "is_active"
    )
    return JsonResponse(list(agents), safe=False)

# ==========================
# Bagian admin jika ingin menambahkan agent baru
# ==========================


@csrf_exempt
def add_agent(request):
    """Admin menambahkan agent baru"""
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            nama = data.get("first_name")
            email = data.get("email")
            password = data.get("password")
            phone = data.get("phone")

            if not all([nama, email, password]):
                return JsonResponse({"error": "Nama, email, dan password wajib diisi"}, status=400)

            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({"error": "Email sudah digunakan"}, status=400)

            agent = CustomUser.objects.create_user(
                username=nama,
                email=email,
                password=password,
                first_name=nama,
                last_name=data.get("last_name", ""),
                phone=phone,
                role="agent",
                commission_percent=data.get("commission_percent", 10.0),  # default 10%
                lokasi=data.get("lokasi") or data.get("location", "-"),
            )

            return JsonResponse({
                "id": agent.id,
                "username": agent.username,
                "email": agent.email,
                "role": agent.role,
                "date_joined": agent.date_joined,
            }, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"message": "Gunakan metode POST"}, status=405)