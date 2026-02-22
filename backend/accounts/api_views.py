from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

def get_csrf(request):
    """
    Mengembalikan CSRF Token untuk frontend (React)
    Agar tidak error saat POST data.
    """
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_agent(request, agent_id):
    """
    Fungsi untuk menghapus agent (Dipanggil oleh Admin)
    """
    # Cek apakah yang request adalah admin
    if getattr(request.user, 'peran', None) != 'admin' and not request.user.is_staff:
        return JsonResponse({"error": "Hanya admin yang boleh menghapus"}, status=403)

    try:
        agent = User.objects.get(id=agent_id)
        agent.delete()
        return JsonResponse({"success": True, "message": "Agent berhasil dihapus"})
    except User.DoesNotExist:
        return JsonResponse({"error": "Agent tidak ditemukan"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)