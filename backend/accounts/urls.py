from django.urls import path
from django.views.decorators.csrf import csrf_exempt # Tambahkan import ini
from . import api_views 
from .pdf_views import agent_ticket_pdf as download_pdf_views

from .api import auth, user, agent, admin
from .api.master_data import search_schedule
from .api.booking import create_booking_agent

urlpatterns = [
    # untuk auth login pengguna
    path('login-admin-api/', auth.login_admin_api, name='login_admin_api'),
    path('logout-admin/', auth.logout_admin),
    path('login-agent/', auth.login_agent),
    path('login-user/', auth.login_user),
    path('auth/check-session/', auth.check_session),
    path('logout-agent/', auth.logout_agent),
    path('logout-user/', auth.logout_user),
    path('register/', auth.register_user),
    path('get-csrf/', api_views.get_csrf), 

    # fitur admin
    path('users/', admin.user_list),
    path('agents/', admin.agent_list),
    path('agents/add/', admin.add_agent),
    path('agents/<int:agent_id>/delete/', api_views.delete_agent), 
    path("admin/bus/", admin.admin_bus_list_create),
    path("admin/jadwal/", admin.admin_jadwal_list_create),
    path("admin/jadwal/<int:pk>/", admin.admin_jadwal_detail),
    path("admin/promo/", admin.admin_promo_list_create),
    path("admin/promo/<int:promo_id>/", admin.admin_promo_detail),
    path("jadwal/<int:pk>/detail-penumpang/", admin.admin_detail_jadwal_penumpang),
    path('admin/laporan-transaksi/', admin.admin_laporan_transaksi, name='admin_laporan_transaksi'),
    path('admin/laporan-transaksi/<int:pk>/detail/', admin.admin_laporan_transaksi_detail),
    path("admin/validasi-setoran/<int:pk>/", admin.admin_validasi_setoran),

    # fitur agent
    path("agent/download-tiket-pdf/", download_pdf_views),
    path('agent/dashboard-stats/', agent.agent_dashboard_stats),
    path("agent/ticket-report/", agent.agent_ticket_report),
    path("agent/commission-report/", agent.agent_commission_report),
    path("agent/submit-transfer/", agent.agent_submit_transfer),
    path('agent/jadwal/', agent.agent_jadwal_list),
    path("agent/tickets/", agent.agent_ticket_list), 
    path('agent/periode/<int:periode_id>/detail/', agent.agent_periode_detail, name='agent_periode_detail'),

    # end point web profile
    path('schedule/search/', search_schedule), 
    path('booking/agent/', create_booking_agent),
    path("user/<int:user_id>/profile/", user.get_user_profile),
    path("user/<int:user_id>/update/", user.update_user_profile),
    path('user/active-promo/', user.user_active_promo),
    path('jadwal/', user.user_jadwal_list),
    path('jadwal/search/', user.user_jadwal_search),
    path('jadwal/<int:pk>/seats/', user.user_jadwal_seats),

    # endpoint user creat order
    path('user/order/create/', user.user_create_order, name='user-create-order'),
    
    # Bungkus fungsi webhook dengan csrf_exempt di sini
    path('midtrans-webhook/', csrf_exempt(user.midtrans_webhook), name='midtrans_webhook'),
]