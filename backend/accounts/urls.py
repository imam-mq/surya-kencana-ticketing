from django.urls import path
from . import views, api_views
from .api.agent import (
    agent_jadwal_list, 
    agent_create_booking, 
    agent_ticket_list,
    agent_commission_report
)
from .api.user import (
    get_user_profile, 
    update_user_profile, 
    user_jadwal_list, 
    user_jadwal_search, 
    user_jadwal_seats,
)
from accounts.api import (auth, user, agent)
from accounts.api import admin
from .pdf_views import agent_ticket_pdf

urlpatterns = [
    # ... login & logout tetap sama ...
    path("login-admin-api/", auth.login_admin_api),
    path('login-agent/', auth.login_agent),
    path('auth/check-session/', auth.check_session),
    path('logout_agent/', auth.logout_agent),

    # daftar user & agent
    path('users/', admin.user_list),
    path('agents/', admin.agent_list),
    path('agents/add/', admin.add_agent),
    path('agents/<int:agent_id>/delete/', api_views.delete_agent),

    # ===== AGENT =====
    path('agent/jadwal/', agent_jadwal_list),
    path("agent/bookings/", agent_create_booking),
    path("agent/tickets/", agent_ticket_list), 
    path("agent/commission-report/", agent_commission_report),
    path("agent/ticket-pdf/", agent_ticket_pdf),

    # ===== USER AUTH =====
    path("register/", auth.register_user),
    path("login-user/", auth.login_user),
    path("logout-user/", auth.logout_user),
    path("get-csrf/", api_views.get_csrf),

    # profil user
    path("user/<int:user_id>/profile/", get_user_profile), # Sesuaikan dengan import di atas
    path("user/<int:user_id>/update/", update_user_profile), # Sesuaikan dengan import di atas

    # PROMO, BUS, JADWAL ADMIN (Tetap sama karena menggunakan objek modul 'admin')
    path("admin/promo/", admin.admin_promo_list_create),
    path("admin/promo/<int:promo_id>/", admin.admin_promo_detail),
    path('user/active-promo/', user.user_active_promo),
    path("admin/bus/", admin.admin_bus_list_create),
    path("admin/jadwal/", admin.admin_jadwal_list_create),
    path("admin/jadwal/<int:pk>/", admin.admin_jadwal_detail),

    # USER JADWAL
    path('jadwal/<int:pk>/seats/', user_jadwal_seats),
    path('jadwal/search/', user_jadwal_search),
    path('jadwal/', user_jadwal_list),
]