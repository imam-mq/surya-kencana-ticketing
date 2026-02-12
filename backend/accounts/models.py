from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('agent', 'Agent'),
        ('user', 'User'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # tambahan form register
    no_ktp = models.CharField(max_length=20, blank=True, null=True)
    jenis_kelamin = models.CharField(max_length=10, blank=True, null=True)
    kota_kab = models.CharField(max_length=100, blank=True, null=True)

    # agent detail
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    lokasi = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Promo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    periode = models.CharField(max_length=50, blank=True, null=True)  # contoh: "November"
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title


# ===================== BUS & JADWAL & TIKET =====================

class Bus(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=20, blank=True, null=True)  # AC1/AC2/AC3/SLP dst.
    is_sleeper = models.BooleanField(default=True)
    logo_url = models.URLField(blank=True, null=True)
    notes = models.CharField(max_length=255, blank=True, null=True)
    def __str__(self):
        return f"{self.name} [{self.code}]" if self.code else self.name


class Schedule(models.Model):
    STATUS_CHOICES = (
        ("active", "Aktif"),
        ("inactive", "Tidak Aktif"),
        ("canceled", "Dibatalkan"),
    )
    bus = models.ForeignKey(Bus, on_delete=models.PROTECT, related_name="schedules")
    origin = models.CharField(max_length=120)
    destination = models.CharField(max_length=120)
    arrival_origin = models.CharField(max_length=255, blank=True, null=True)
    arrival_destination = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    capacity = models.PositiveIntegerField(default=28)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.origin} → {self.destination} {self.date} {self.time}"

    @property
    def sold_seats(self):
        return self.tickets.count()


class Ticket(models.Model):
    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name="tickets"
    )
    buyer = models.ForeignKey(
        "accounts.CustomUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # seat
    seat_id = models.CharField(max_length=4)

    # passenger snapshot
    passenger_name = models.CharField(max_length=150, null=True, blank=True)
    passenger_ktp = models.CharField(max_length=20, null=True, blank=True)
    passenger_phone = models.CharField(max_length=20, null=True, blank=True)
    passenger_gender = models.CharField(max_length=10, null=True, blank=True)

    # schedule snapshot
    bus_name = models.CharField(max_length=120, null=True, blank=True)
    bus_code = models.CharField(max_length=20, null=True, blank=True)
    origin = models.CharField(max_length=120, null=True, blank=True)
    destination = models.CharField(max_length=120, null=True, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    departure_time = models.TimeField(null=True, blank=True)

    price_paid = models.DecimalField(max_digits=12, decimal_places=2)

    payment_status = models.CharField(max_length=30, default="paid")
    bought_by = models.CharField(max_length=10, default="user")
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("schedule", "seat_id")

class AgentCommission(models.Model):
    agent = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name="agent_commissions"
    )
    # Menghubungkan ke Ticket yang sudah ada
    ticket = models.OneToOneField(
        Ticket, 
        on_delete=models.CASCADE, 
        related_name="commission_record"
    )
    
    commission_percent = models.DecimalField(max_digits=5, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Status untuk tracking setoran agen
    # unsettled: tiket terjual tapi komisi/setoran belum diproses ke laporan
    # settled: sudah masuk dalam periode laporan/tutup buku
    status = models.CharField(max_length=20, default="unsettled") 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Komisi {self.agent.username} - Tiket {self.ticket.seat_id}"


class CommissionPeriod(models.Model):
    """
    Model ini untuk fitur 'Tutup Buku' atau Rekap Bulanan Agen.
    Belum ada di ringkasan Anda, tapi sangat penting untuk Admin 
    memvalidasi setoran agen.
    """
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    total_commission = models.DecimalField(max_digits=12, decimal_places=2)
    total_setor = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default="open") # open, waiting, paid
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Laporan {self.agent.username} ({self.start_date})"
    
# accounts/models.py

class CommissionPeriod(models.Model):
    # ... (field yang sudah kita bahas sebelumnya) ...

    def update_totals(self):
        """
        Menghitung otomatis semua tiket agen dalam range tanggal periode ini
        """
        from .models import AgentCommission
        
        # Ambil semua komisi agen ini yang terjadi di antara start_date dan end_date
        commissions = AgentCommission.objects.filter(
            agent=self.agent,
            created_at__date__range=[self.start_date, self.end_date]
        )
        
        # Hitung Total Transaksi (Harga Tiket)
        total_tx = sum(c.ticket.price_paid for c in commissions)
        
        # Hitung Total Komisi Agen
        total_km = sum(c.commission_amount for c in commissions)
        
        self.total_transaksi = total_tx
        self.total_komisi = total_km
        self.total_setor = total_tx - total_km  # Uang yang harus disetor ke admin
        self.save()
    
class CommissionPeriod(models.Model):
    STATUS_CHOICES = (
        ('belum_bayar', 'Belum Bayar'),
        ('sudah_bayar', 'Sudah Bayar'),
    )
    
    agent = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    periode_name = models.CharField(max_length=50, default="-") # Contoh: "1-30 November 2025"
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Kolom sesuai UI
    total_transaksi = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_komisi = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_setor = models.DecimalField(max_digits=15, decimal_places=2, default=0) 
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='belum_bayar')
    
    # Bukti Transfer
    bukti_transfer = models.ImageField(upload_to='transfer_agen/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.periode_name} - {self.agent.username}"

    def update_totals(self):
        """
        Menghitung otomatis semua tiket agen dalam range tanggal periode ini
        """
        # Kita gunakan agregasi Django agar lebih cepat & akurat daripada loop manual
        from django.db.models import Sum
        
        # Ambil semua komisi agen ini berdasarkan range tanggal ticket terjual
        commissions = AgentCommission.objects.filter(
            agent=self.agent,
            ticket__purchased_at__date__range=[self.start_date, self.end_date]
        )
        
        # Hitung total menggunakan aggregate
        totals = commissions.aggregate(
            tx=Sum('ticket__price_paid'),
            km=Sum('commission_amount')
        )
        
        self.total_transaksi = totals['tx'] or 0
        self.total_komisi = totals['km'] or 0
        self.total_setor = self.total_transaksi - self.total_komisi
        self.save()