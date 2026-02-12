# accounts/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import CommissionPeriod

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')

@admin.register(CommissionPeriod)
class CommissionPeriodAdmin(admin.ModelAdmin):
    list_display = ('periode_name', 'agent', 'total_transaksi', 'total_komisi', 'status')
    actions = ['hitung_ulang_total']

    @admin.action(description='Hitung Ulang Total Transaksi & Komisi')
    def hitung_ulang_total(self, request, queryset):
        for period in queryset:
            period.update_totals() # Memanggil fungsi yang kita buat di models.py tadi
        self.message_user(request, "Data berhasil diperbarui berdasarkan transaksi tiket.")
