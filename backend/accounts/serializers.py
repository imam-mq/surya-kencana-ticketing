from rest_framework import serializers
from django.contrib.auth.hashers import make_password
# Menambahkan AgentCommission dan CommissionPeriod ke import
from .models import CustomUser, Promo, Bus, Schedule, Ticket, AgentCommission, CommissionPeriod

class AgentSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=8)
    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email',
            'phone', 'address', 'kota_kab',
            'role', 'date_joined', 'password'
        ]
        read_only_fields = ('id', 'date_joined', 'role')

    def create(self, validated_data):
        validated_data['role'] = 'agent'
        pw = validated_data.pop('password', None)
        user = super().create(validated_data)
        if pw:
            user.set_password(pw)
        else:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        pw = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if pw:
            user.set_password(pw)
            user.save()
        return user


class PromoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promo
        fields = '__all__'


# ===================== BUS & JADWAL & TIKET =====================

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = ["id", "name", "code", "logo_url", "notes"]


class ScheduleOutSerializer(serializers.ModelSerializer):
    bus = BusSerializer()
    sold_seats = serializers.IntegerField(read_only=True)
    class Meta:
        model = Schedule
        fields = [
            "arrival_origin", "arrival_destination",
            "id", "origin", "destination", "date", "time",
            "price", "capacity", "status", "sold_seats", "bus"
        ]


class ScheduleInSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = [
            "origin", "destination", "date", "time",
            "arrival_origin", "arrival_destination",
            "price", "capacity", "status", "bus"
        ]


class TicketSerializer(serializers.ModelSerializer):
    buyer_name = serializers.SerializerMethodField()
    class Meta:
        model = Ticket
        fields = [
            "id", "seat_id", "price_paid", "payment_status",
            "bought_by", "purchased_at", "buyer_name"
        ]
    def get_buyer_name(self, obj):
        return obj.buyer.username if obj.buyer else "-"
    

# ===================== Booking Agent =====================
class AgentBookingSerializer(serializers.Serializer):
    schedule_id = serializers.IntegerField()
    seats = serializers.ListField(
        child=serializers.CharField(max_length=4),
        allow_empty=False
    )
    passengers = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False
    )

    def validate(self, data):
        schedule_id = data["schedule_id"]
        seats = data["seats"]

        try:
            schedule = Schedule.objects.get(id=schedule_id, status="active")
        except Schedule.DoesNotExist:
            raise serializers.ValidationError("Jadwal tidak ditemukan")

        sold = set(
            Ticket.objects.filter(schedule=schedule)
            .values_list("seat_id", flat=True)
        )

        conflict = sold.intersection(seats)
        if conflict:
            raise serializers.ValidationError(
                f"Kursi sudah terjual: {', '.join(conflict)}"
            )

        data["schedule"] = schedule
        return data

# ===================== Tiket Agent =====================

class AgentTicketSerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            "id",
            "seat_id",
            "passenger_name",
            "bus_name",
            "bus_code",
            "origin",
            "destination",
            "departure_date",
            "departure_time",
            "price_paid",
            "payment_status",
            "purchased_at",
            "agent_name",
        ]

    def get_agent_name(self, obj):
        return obj.buyer.username if obj.buyer else "-"

# ===================== PENAMBAHAN BARU: KOMISI AGENT =====================
class AgentCommissionSerializer(serializers.ModelSerializer):
    # Field tambahan agar sesuai dengan kolom di gambar Anda
    tanggal = serializers.SerializerMethodField()
    tipe_bis = serializers.ReadOnlyField(source='ticket.bus_name')
    kursi = serializers.ReadOnlyField(source='ticket.seat_id')
    nama_penumpang = serializers.ReadOnlyField(source='ticket.passenger_name')
    keberangkatan = serializers.ReadOnlyField(source='ticket.origin')
    tujuan = serializers.ReadOnlyField(source='ticket.destination')
    harga_tiket = serializers.ReadOnlyField(source='ticket.price_paid')
    komisi = serializers.ReadOnlyField(source='commission_amount')

    class Meta:
        model = AgentCommission
        fields = [
            'id', 'tanggal', 'tipe_bis', 'kursi', 'nama_penumpang', 
            'keberangkatan', 'tujuan', 'harga_tiket', 'komisi', 'status'
        ]

    def get_tanggal(self, obj):
        # Format tanggal (8-01-2025) sesuai dengan gambar Anda
        return obj.created_at.strftime("%d-%m-%Y")
    
class CommissionPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionPeriod
        fields = [
            'id', 'periode_name', 'total_transaksi', 
            'total_komisi', 'total_setor', 'status'
        ]