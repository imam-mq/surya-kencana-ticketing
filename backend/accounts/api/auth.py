from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

User = get_user_model()


@csrf_exempt
@require_POST
def register_user(request):
    data = json.loads(request.body.decode("utf-8"))

    required = ["nama", "email", "password", "noKtp", "jenisKelamin", "alamat", "kotaKab", "noHp"]
    if not all(data.get(k) for k in required):
        return JsonResponse({"error": "Semua field wajib diisi"}, status=400)

    if User.objects.filter(email=data["email"]).exists():
        return JsonResponse({"error": "Email sudah digunakan"}, status=400)

    user = User.objects.create(
        username=data["nama"],
        email=data["email"],
        password=make_password(data["password"]),
        no_ktp=data["noKtp"],
        jenis_kelamin=data["jenisKelamin"],
        address=data["alamat"],
        kota_kab=data["kotaKab"],
        phone=data["noHp"],
        role="user",
    )

    return JsonResponse({"success": True, "user_id": user.id}, status=201)

@csrf_exempt
def login_admin_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")

    user = authenticate(request, username=username, password=password)

    if not user:
        return JsonResponse({"error": "Login gagal"}, status=401)

    if user.role != "admin":
        return JsonResponse({"error": "Bukan admin"}, status=403)

    login(request, user)

    return JsonResponse({
        "success": True,
        "id": user.id,
        "username": user.username,
        "role": user.role,
    })



@csrf_exempt
@require_POST
def login_user(request):
    data = json.loads(request.body.decode("utf-8"))
    user = authenticate(
        request,
        username=data.get("username"),
        password=data.get("password")
    )

    if not user or user.role != "user":
        return JsonResponse({"success": False, "message": "Login gagal"}, status=401)

    login(request, user)
    return JsonResponse({
        "success": True,
        "id": user.id,
        "email": user.email,
        "role": user.role,
    })


@csrf_exempt
@require_POST
def logout_user(request):
    logout(request)
    return JsonResponse({"success": True, "message": "Logout berhasil"})

@csrf_exempt
@require_POST
def login_agent(request):
    data = json.loads(request.body.decode("utf-8"))
    user = authenticate(
        request,
        username=data.get("username"),
        password=data.get("password")
    )

    if not user:
        return JsonResponse({"success": False, "message": "Username atau password salah"}, status=401)

    if user.role != "agent":
        return JsonResponse({"success": False, "message": "Bukan agent"}, status=403)

    login(request, user)  # ✅ INI KUNCI UTAMA

    return JsonResponse({
        "id": user.id,
        "success": True,
        "message": "Login agent berhasil",
        "email": user.email, 
        "username": user.username,
        "role": user.role,
    })

@csrf_exempt
def logout_agent(request):
    if request.method != "POST":
        return JsonResponse({"success": False, "message": "Gunakan metode POST"}, status=405)

    try:
        # Jika ingin memastikan hanya agent boleh akses, cek request.user.role (opsional)
        # but since session may not be authenticated, don't block logout.
        logout(request)
        return JsonResponse({"success": True, "message": "Logout berhasil"}, status=200)
    except Exception as e:
        return JsonResponse({"success": False, "message": str(e)}, status=500)
    

@csrf_exempt
def check_session(request):
    """Mengecek apakah session di browser masih valid atau sudah mati"""
    if request.user.is_authenticated:
        return JsonResponse({
            "isAuthenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "role": request.user.role,
                "email": request.user.email
            }
        })
    return JsonResponse({"isAuthenticated": False}, status=401)
