from rest_framework import serializers
from django.db.models import Sum
from django.contrib.auth import get_user_model
from .models import (
    Pengguna, Bus, Jadwal, Promosi, Pemesanan, 
    Tiket, KomisiAgen, PeriodeKomisi, TransferKomisi
)

User = get_user_model()

# ================= USER & PROFILE =================
class PenggunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'nama_lengkap', 'telepon', 'peran', 'status']

# 🔥 PERBAIKAN UTAMA DI SINI 🔥
class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Kita tambahkan 'password' dan 'peran' agar bisa diinput
        fields = ['id', 'username', 'email', 'nama_lengkap', 'telepon', 'alamat', 'password', 'peran']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}, # Password tidak akan tampil saat di-GET
            'id': {'read_only': True}
        }

    def create(self, validated_data):
        # Ambil password dari data yang dikirim Admin
        password = validated_data.pop('password', None)
        
        # Buat instance user
        instance = self.Meta.model(**validated_data)
        
        # Lakukan HASHING password (Enkripsi)
        if password is not None:
            instance.set_password(password)
        
        instance.save()
        return instance

    def update(self, instance, validated_data):
        # Cek jika ada request ganti password
        password = validated_data.pop('password', None)
        
        # Update field lain (nama, telepon, dll)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        # Jika password diisi, hash ulang dan simpan
        if password:
            instance.set_password(password)
            
        instance.save()
        return instance

# ================= BUS & JADWAL =================
class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class ScheduleOutSerializer(serializers.ModelSerializer):
    bus_name = serializers.CharField(source='bus.nama', read_only=True)
    bus_type = serializers.CharField(source='bus.tipe', read_only=True)

    kapasitas = serializers.IntegerField(source='bus.total_kursi', read_only=True)
    
    # 2. Tambahkan Hitungan Tiket Terjual
    terjual = serializers.SerializerMethodField()

    class Meta:
        model = Jadwal
        fields = [
            'id', 'bus', 'bus_name', 'bus_type', 'asal', 'tujuan', 
            'waktu_keberangkatan', 'waktu_kedatangan', 'harga', 'status',
            'kapasitas', 'terjual'
        ]

    def get_terjual(self, obj):
        try:
            # 1. Kita ambil langsung dari tabel Tiket yang terhubung ke jadwal ini
            # 2. Kita hitung yang status pemesanannya 'paid' atau 'pending' (biar yang baru booking langsung ngunci kursi)
            # 3. Jangan lupa import Q jika pakai filter kompleks, atau pakai cara simple ini:
            return Tiket.objects.filter(
                jadwal=obj,
                pemesanan__status_pembayaran__in=['paid', 'pending'] # 🔥 INI KUNCI UTAMANYA!
            ).count()
        except Exception as e:
            print(f"Error hitung kursi untuk Jadwal {obj.id}: {e}")
            return 0
        

class ScheduleInSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jadwal
        fields = '__all__'

class PromoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promosi
        fields = '__all__'

# ================= BOOKING & TICKET =================
class TiketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tiket
        fields = [
            'id', 'kode_tiket', 'nomor_kursi', 'nama_penumpang', 
            'ktp_penumpang', 'telepon_penumpang', 'jenis_kelamin_penumpang'
        ]

class PemesananSerializer(serializers.ModelSerializer):
    tiket = TiketSerializer(many=True, read_only=True)
    jadwal_info = ScheduleOutSerializer(source='jadwal', read_only=True)

    class Meta:
        model = Pemesanan
        fields = [
            'id', 'pembeli', 'peran_pembeli', 'jadwal', 'jadwal_info',
            'metode_pembayaran', 'status_pembayaran', 'total_harga', 
            'jumlah_diskon', 'harga_akhir', 'dibuat_pada', 'tiket'
        ]

class AgentBookingSerializer(serializers.Serializer):
    jadwal_id = serializers.IntegerField()
    seats = serializers.ListField(child=serializers.CharField())
    passengers = serializers.ListField(child=serializers.DictField())

# ================= KOMISI & SETORAN =================
class KomisiAgenSerializer(serializers.ModelSerializer):
    class Meta:
        model = KomisiAgen
        fields = '__all__'

class PeriodeKomisiSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeriodeKomisi
        fields = '__all__'

class TransferKomisiSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferKomisi
        fields = '__all__'

class SetoranAgentAdminSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source='periode.agen.nama_lengkap', read_only=True)
    
    class Meta:
        model = TransferKomisi
        fields = [
            'id', 'periode', 'agent_name', 'tanggal_transfer', 
            'jumlah', 'bukti_file', 'status', 'divalidasi_oleh'
        ]

# ================= TIKET TERBIT =================
class AgentTicketHistorySerializer(serializers.ModelSerializer):
    bus_name = serializers.CharField(source='jadwal.bus.nama', read_only=True)
    bus_code = serializers.CharField(source='jadwal.bus.tipe', read_only=True)
    departure_date = serializers.SerializerMethodField()
    departure_time = serializers.SerializerMethodField()
    origin = serializers.CharField(source='jadwal.asal', read_only=True)
    destination = serializers.CharField(source='jadwal.tujuan', read_only=True)
    passenger_names = serializers.SerializerMethodField()
    seats = serializers.SerializerMethodField()
    tanggal_transaksi = serializers.SerializerMethodField()

    class Meta:
        model = Pemesanan
        fields = [
            'id', 'tanggal_transaksi', 'bus_name', 'bus_code', 'departure_date', 'departure_time', 
            'origin', 'destination', 'passenger_names', 'seats', 'status_pembayaran'
        ]

    def get_departure_date(self, obj):
        return obj.jadwal.waktu_keberangkatan.strftime('%d %b %Y')

    def get_departure_time(self, obj):
        return obj.jadwal.waktu_keberangkatan.strftime('%H:%M')

    def get_passenger_names(self, obj):
        return [t.nama_penumpang for t in obj.tiket.all()]

    def get_seats(self, obj):
        return [t.nomor_kursi for t in obj.tiket.all()]
    
    def get_tanggal_transaksi(self, obj):
        return obj.dibuat_pada.strftime('%d %b %Y %H:%M')



# ================= Komisilaporan =================

class AgentCommissionReportSerializer(serializers.ModelSerializer):
    jadwal = serializers.SerializerMethodField()
    tipe_bis = serializers.SerializerMethodField()
    kursi = serializers.SerializerMethodField()
    nama_penumpang = serializers.SerializerMethodField()
    keberangkatan = serializers.CharField(source='jadwal.asal', read_only=True)
    tujuan = serializers.CharField(source='jadwal.tujuan', read_only=True)
    harga_total = serializers.DecimalField(source='harga_akhir', max_digits=12, decimal_places=2, read_only=True)
    komisi_total = serializers.SerializerMethodField()
    tanggal_transaksi = serializers.SerializerMethodField()

    class Meta:
        model = Pemesanan
        fields = [
            'id', 'tanggal_transaksi', 'jadwal', 'tipe_bis', 'kursi', 'nama_penumpang', 
            'keberangkatan', 'tujuan', 'harga_total', 'komisi_total'
        ]
    
    def get_tanggal_transaksi(self, obj):
        return obj.dibuat_pada.strftime('%d %b %Y %H:%M')

    def get_jadwal(self, obj):
        return obj.jadwal.waktu_keberangkatan.strftime('%d %b %Y %H:%M')

    def get_tipe_bis(self, obj):
        return f"{obj.jadwal.bus.nama} ({obj.jadwal.bus.tipe or 'Standar'})"

    def get_kursi(self, obj):
        return [t.nomor_kursi for t in obj.tiket.all()]

    def get_nama_penumpang(self, obj):
        return [t.nama_penumpang for t in obj.tiket.all()]

    def get_komisi_total(self, obj):
        # Menjumlahkan semua komisi dari setiap tiket yang ada di dalam pemesanan ini
        total = obj.tiket.aggregate(total_komisi=Sum('komisiagen__jumlah_komisi'))['total_komisi']
        return total or 0