from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.pdfbase.pdfmetrics import stringWidth
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import timedelta

from .models import Ticket


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def agent_ticket_pdf(request):
    user = request.user

    if user.role != "agent":
        return Response({"error": "Hanya agent"}, status=403)

    ticket_id = request.GET.get("ticket_id")
    if not ticket_id:
        return Response({"error": "ticket_id wajib"}, status=400)

    try:
        first_ticket = Ticket.objects.get(
            id=ticket_id,
            buyer=user,
            bought_by="agent"
        )
    except Ticket.DoesNotExist:
        return Response({"error": "Tiket tidak ditemukan"}, status=404)

    # Ambil semua tiket dalam 1 transaksi (window 1 menit)
    start = first_ticket.purchased_at.replace(second=0, microsecond=0)
    end = start + timedelta(minutes=1)

    tickets = (
        Ticket.objects
        .filter(
            buyer=user,
            bought_by="agent",
            schedule=first_ticket.schedule,
            purchased_at__gte=start,
            purchased_at__lt=end
        )
        .order_by("seat_id")
    )

    seat_list = ", ".join(t.seat_id for t in tickets)

    # ================= PDF =================
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="tiket-surya-kencana.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    x = 2 * cm
    y = height - 2 * cm
    line_gap = 14

    def draw(text, bold=False):
        nonlocal y
        p.setFont("Helvetica-Bold" if bold else "Helvetica", 10)
        p.drawString(x, y, text)
        y -= line_gap

    def draw_multiline(text, max_width, bold=False):
        nonlocal y
        font = "Helvetica-Bold" if bold else "Helvetica"
        font_size = 10
        p.setFont(font, font_size)

        words = text.split(" ")
        line = ""

        for word in words:
            test_line = line + word + " "
            if stringWidth(test_line, font, font_size) <= max_width:
                line = test_line
            else:
                p.drawString(x, y, line)
                y -= line_gap
                line = word + " "

        if line:
            p.drawString(x, y, line)
            y -= line_gap

    def separator(char="=", length=90):
        nonlocal y
        p.setFont("Courier", 9)
        p.drawString(x, y, char * length)
        y -= line_gap

    t = first_ticket

    # ================= HEADER =================
    separator("=")
    draw("SURYA KENCANA", bold=True)
    draw("TIKET BUS RESMI", bold=True)
    separator("=")
    y -= line_gap

    # ================= RUTE =================
    draw("RUTE PERJALANAN", bold=True)
    draw_multiline(f"{t.origin} → {t.destination}", width - (4 * cm))
    y -= line_gap

    draw(f"Tanggal      : {t.departure_date.strftime('%d %B %Y')}")
    draw(f"Jam          : {t.departure_time.strftime('%H:%M')} WIB")
    draw(f"Tipe Bus     : {t.bus_name} {t.bus_code or ''}")
    draw(f"No Kursi     : {seat_list}")

    y -= line_gap
    separator("-")

    # ================= DATA PENUMPANG (FIXED) =================
    draw("DATA PENUMPANG", bold=True)

    for idx, tk in enumerate(tickets, start=1):
        draw(f"{idx}. {tk.passenger_name or '-'} | Kursi {tk.seat_id}")
        draw(f"   KTP : {tk.passenger_ktp or '-'}")
        draw(f"   HP  : {tk.passenger_phone or '-'}")
        y -= 4

    y -= line_gap
    separator("-")

    # ================= PEMBELIAN =================
    total_price = sum(tk.price_paid for tk in tickets)

    draw("DETAIL PEMBELIAN", bold=True)
    draw(f"Harga        : Rp {int(total_price):,}".replace(",", "."))
    draw("Status       : LUNAS")
    draw("Dibeli Oleh  : Agent")
    draw(f"Nama Agent   : {user.username}")
    draw(f"Terbit       : {t.purchased_at.strftime('%d %b %Y %H:%M')}")

    y -= line_gap
    separator("-")

    kode_tiket = f"SK-{t.purchased_at.strftime('%Y%m%d')}-{t.id:06d}"
    draw(f"Kode Tiket   : {kode_tiket}", bold=True)

    y -= line_gap
    draw("* Tiket ini sah tanpa tanda tangan")
    separator("=")

    p.showPage()
    p.save()

    return response
