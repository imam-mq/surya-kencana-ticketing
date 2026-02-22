from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.pdfbase.pdfmetrics import stringWidth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# Hapus timedelta jika tidak digunakan lagi untuk windowing

from .models import Tiket, Pemesanan

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_ticket_pdf(request):
    user = request.user

    # Verifikasi peran
    if getattr(user, "peran", None) != "agent":
        return Response({"error": "Hanya agent yang diizinkan"}, status=403)

    ticket_id = request.GET.get("ticket_id")
    if not ticket_id:
        return Response({"error": "ticket_id wajib diisi"}, status=400)

    try:
        # 🔥 PERBAIKAN: Cari tiket berdasarkan ID dan pastikan pemesan-nya adalah user ini
        # Kita filter lewat relasi 'pemesanan' karena field pembeli ada di sana
        target_ticket = Tiket.objects.get(
            id=ticket_id,
            pemesanan__pembeli=user,
            pemesanan__peran_pembeli="agent"
        )
        
        # Ambil semua tiket yang berada dalam satu nomor induk Pemesanan yang sama
        induk_pesanan = target_ticket.pemesanan
        all_tickets_in_order = induk_pesanan.tiket.all().order_by("nomor_kursi")
        
    except Tiket.DoesNotExist:
        return Response({"error": "Tiket tidak ditemukan atau akses ditolak"}, status=404)

    # ================= PDF Generator =================
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="tiket-{target_ticket.kode_tiket}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4
    x = 2 * cm
    y = height - 2 * cm
    line_gap = 14

    def draw(text, bold=False):
        nonlocal y
        p.setFont("Helvetica-Bold" if bold else "Helvetica", 10)
        p.drawString(x, y, str(text))
        y -= line_gap

    def separator(char="=", length=90):
        nonlocal y
        p.setFont("Courier", 9)
        p.drawString(x, y, char * length)
        y -= line_gap

    # Shortcut variabel
    j = target_ticket.jadwal
    seat_list = ", ".join(tk.nomor_kursi for tk in all_tickets_in_order)

    # ================= HEADER =================
    separator("=")
    draw("SURYA KENCANA", bold=True)
    draw("TIKET BUS RESMI - BUKTI PEMBAYARAN", bold=True)
    separator("=")
    y -= 5

    # ================= INFO PERJALANAN =================
    draw("RUTE PERJALANAN", bold=True)
    draw(f"{j.asal} >> {j.tujuan}")
    draw(f"Tanggal   : {j.waktu_keberangkatan.strftime('%d %B %Y')}")
    draw(f"Jam       : {j.waktu_keberangkatan.strftime('%H:%M')} WIB")
    draw(f"Tipe Bus  : {j.bus.nama} ({j.bus.tipe or 'Reguler'})")
    draw(f"No Kursi  : {seat_list}")
    separator("-")

    # ================= DATA PENUMPANG =================
    draw("DAFTAR PENUMPANG", bold=True)
    for idx, tk in enumerate(all_tickets_in_order, start=1):
        draw(f"{idx}. {tk.nama_penumpang} (Kursi: {tk.nomor_kursi})")
        if tk.ktp_penumpang: draw(f"   NIK: {tk.ktp_penumpang}")
    
    separator("-")

    # ================= RINCIAN HARGA =================
    draw("DETAIL TRANSAKSI", bold=True)
    # Harga akhir diambil dari induk Pemesanan
    draw(f"Total Bayar  : Rp {int(induk_pesanan.harga_akhir):,}".replace(",", "."))
    draw(f"Status       : {induk_pesanan.status_pembayaran.upper()}")
    draw(f"Metode       : {induk_pesanan.metode_pembayaran.upper()}")
    draw(f"Agen         : {user.username}")
    draw(f"Waktu Cetak  : {target_ticket.dicetak_pada.strftime('%d/%m/%Y %H:%M')}")
    separator("-")

    # KODE TIKET UTAMA
    draw(f"KODE BOOKING : {target_ticket.kode_tiket}", bold=True)
    y -= 10
    draw("* Simpan tiket ini sebagai bukti sah untuk naik ke bus.")
    separator("=")

    p.showPage()
    p.save()
    return response