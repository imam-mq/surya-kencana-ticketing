from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Pengguna, ProfilAgen, Bus, Promosi, Jadwal, 
    Pemesanan, Tiket, KomisiAgen, PeriodeKomisi, TransferKomisi
)

@admin.register(Pengguna)
class PenggunaAdmin(UserAdmin):
    list_display = ('username', 'email', 'peran', 'status', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Info Tambahan', {'fields': ('peran', 'nama_lengkap', 'telepon', 'alamat', 'status')}),
    )

@admin.register(Jadwal)
class JadwalAdmin(admin.ModelAdmin):
    list_display = ('bus', 'asal', 'tujuan', 'waktu_keberangkatan', 'harga', 'status')
    list_filter = ('asal', 'tujuan', 'status')

@admin.register(Pemesanan)
class PemesananAdmin(admin.ModelAdmin):
    list_display = ('id', 'pembeli', 'jadwal', 'total_harga', 'status_pembayaran', 'dibuat_pada')
    list_filter = ('status_pembayaran', 'metode_pembayaran')

@admin.register(Tiket)
class TiketAdmin(admin.ModelAdmin):
    list_display = ('kode_tiket', 'nomor_kursi', 'nama_penumpang', 'pemesanan')
    search_fields = ('kode_tiket', 'nama_penumpang')

@admin.register(KomisiAgen)
class KomisiAgenAdmin(admin.ModelAdmin):
    list_display = ('agen', 'tiket', 'jumlah_komisi', 'status')
    list_filter = ('status',)

admin.site.register(Bus)
admin.site.register(Promosi)
admin.site.register(ProfilAgen)
admin.site.register(PeriodeKomisi)
admin.site.register(TransferKomisi)