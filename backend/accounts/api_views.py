from .models import Promo
from .serializers import AgentTicketSerializer
from collections import defaultdict
from django.http import HttpResponse
from rest_framework.decorators import api_view
from django.db.models import Count, Min
from django.views.decorators.http import require_http_methods
from django.middleware.csrf import get_token
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
import math
from datetime import datetime

from .models import Promo, Bus, Schedule, Ticket
from .serializers import (
    PromoSerializer, 
    # pastikan BusSerializer ikut diimport
    # kalau belum ada di file ini, tambahkan:
    # from .serializers import BusSerializer
    BusSerializer,
    ScheduleOutSerializer, 
    ScheduleInSerializer, 
    TicketSerializer,
    AgentBookingSerializer,
)

User = get_user_model()


def get_csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})








@csrf_exempt
def delete_agent(request, agent_id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=agent_id, role="agent")
            user.delete()
            return JsonResponse({"success": True, "message": "Agent berhasil dihapus."}, status=200)
        except User.DoesNotExist:
            return JsonResponse({"error": "Agent tidak ditemukan."}, status=404)
    else:
        return JsonResponse({"error": "Gunakan metode DELETE"}, status=405)
    




class PromoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promo
        fields = "__all__"



# ===================== JADWAL & TIKET =====================


@csrf_exempt
def admin_bus_list(request):
    """
    GET /accounts/admin/bus/
    Return daftar bus untuk dropdown Tambah/Edit Jadwal.
    """
    if request.method != "GET":
        return JsonResponse({"error": "Gunakan GET"}, status=405)

    qs = Bus.objects.all().order_by("id")
    data = BusSerializer(qs, many=True).data
    return JsonResponse(data, safe=False)


@csrf_exempt
def admin_jadwal_list_create(request):
    if request.method == "GET":
        qs = Schedule.objects.select_related("bus").all()
        data = ScheduleOutSerializer(qs, many=True).data
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            payload = json.loads(request.body.decode("utf-8"))

            # --- Map bus_code → bus.id kalau bus (pk) nggak dikirim/invalid ---
            bus_pk = payload.get("bus")
            bus_code = payload.get("bus_code")

            if not bus_pk and bus_code:
                bus_obj = Bus.objects.filter(code=bus_code).first()
                if not bus_obj:
                    return JsonResponse({"errors": {"bus_code": [f"Bus dengan code '{bus_code}' tidak ditemukan."]}}, status=400)
                payload["bus"] = bus_obj.id

            # Validasi bus pk jika ada
            if payload.get("bus") and not Bus.objects.filter(id=payload["bus"]).exists():
                return JsonResponse({"errors": {"bus": [f"Bus id {payload['bus']} tidak ditemukan."]}}, status=400)

            ser = ScheduleInSerializer(data=payload)
            if ser.is_valid():
                sch = ser.save()
                out = ScheduleOutSerializer(Schedule.objects.select_related("bus").get(id=sch.id)).data
                return JsonResponse(out, status=201, safe=False)
            return JsonResponse({"errors": ser.errors}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)



@csrf_exempt
def admin_jadwal_detail(request, pk):
    try:
        sch = Schedule.objects.select_related("bus").get(id=pk)
    except Schedule.DoesNotExist:
        return JsonResponse({"error": "Jadwal tidak ditemukan"}, status=404)

    if request.method == "GET":
        out = ScheduleOutSerializer(sch).data
        tickets = Ticket.objects.filter(schedule=sch).order_by("purchased_at")
        out["tickets"] = TicketSerializer(tickets, many=True).data
        return JsonResponse(out, safe=False)

    if request.method in ["PUT", "PATCH"]:
        try:
            payload = json.loads(request.body.decode("utf-8"))

            # Map bus_code → bus.id jika dikirim
            bus_code = payload.get("bus_code")
            if bus_code and not payload.get("bus"):
                bus_obj = Bus.objects.filter(code=bus_code).first()
                if not bus_obj:
                    return JsonResponse({"errors": {"bus_code": [f"Bus dengan code '{bus_code}' tidak ditemukan."]}}, status=400)
                payload["bus"] = bus_obj.id

            # Validasi bus pk jika dikirim
            if payload.get("bus") and not Bus.objects.filter(id=payload["bus"]).exists():
                return JsonResponse({"errors": {"bus": [f"Bus id {payload['bus']} tidak ditemukan."]}}, status=400)

            ser = ScheduleInSerializer(instance=sch, data=payload, partial=(request.method == "PATCH"))
            if ser.is_valid():
                sch = ser.save()
                return JsonResponse(ScheduleOutSerializer(sch).data, safe=False)
            return JsonResponse({"errors": ser.errors}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    if request.method == "DELETE":
        sch.status = "canceled"
        sch.save(update_fields=["status"])
        return JsonResponse({"success": True, "message": "Jadwal dibatalkan"}, status=200)

    return JsonResponse({"error": "Method not allowed"}, status=405)



def _parse_date(s):
    try:
        return datetime.strptime(s, "%Y-%m-%d").date()
    except Exception:
        return None




def _generate_seats(capacity):
    """
    Generate seat ids up to capacity.
    Rows A..Z (but we stop earlier). Columns start from 1.
    Return list of seat ids like ['A1', 'A2', ...]
    """
    rows = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    cols = [1, 2, 3, 4]  # jika layout berubah, sesuaikan
    seats = []
    count = 0
    for r in rows:
        for c in cols:
            seats.append(f"{r}{c}")
            count += 1
            if count >= capacity:
                return seats
    return seats  # fallback











