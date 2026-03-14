import React, { useEffect, useState } from "react";
import Agent_Navbar from "./layout/Agent_Navbar";
import Sidebar_Agent from "./layout/Sidebar_Agent";
import ActionBar      from "./tiketterbitcomponent/ActionBar";
import TabelTiket     from "./tiketterbitcomponent/TabelTiket";
import ToastNotifikasi from "./tiketterbitcomponent/ToastNotifikasi";

const TiketTerbit = () => {
  const [tickets, setTickets]         = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showToast, setShowToast]     = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/agent/tickets/",
          { method: "GET", credentials: "include" }
        );
        if (response.status === 401) {
          alert("Session habis, silakan login ulang");
          return;
        }
        const data = await response.json();
        const mappedTickets = data.map((item, index) => ({
          no: index + 1,
          id: item.id,
          tanggal_transaksi: item.tanggal_transaksi,
          tipeRis: `${item.bus_name} ${item.bus_code ?? ""}`,
          jam: item.departure_time?.slice(0, 5),
          jadwal: item.departure_date,
          asal: item.origin,
          tujuan: item.destination,
          penumpang: item.passenger_names?.join(", "),
          seats: item.seats.join(", "),
          status: "Berhasil",
        }));
        setTickets(mappedTickets);
      } catch (error) {
        console.error("Gagal mengambil tiket:", error);
      }
    };
    fetchTickets();
  }, []);

  // Filter
  const filtered = tickets.filter((ticket) =>
    `${ticket.penumpang} ${ticket.tipeRis} ${ticket.asal} ${ticket.tujuan}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets   = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(filtered.length / itemsPerPage);

  // Handlers
  const handleExportPDF = () => alert("Export PDF functionality");
  const handlePrint     = () => alert("Print functionality");

  const handleDownload = async (ticketId) => {
    try {
      setDownloadingId(ticketId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await fetch(
        `http://127.0.0.1:8000/api/accounts/agent/download-tiket-pdf/?ticket_id=${ticketId}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Download gagal");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "tiket.pdf";
      link.click();

      setToastMessage("File tiket berhasil diunduh ke perangkat anda");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      alert("Gagal download tiket");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar_Agent />

      <div className="flex-1 flex flex-col">
        <Agent_Navbar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Tiket Terbit</h1>
            <p className="text-gray-600 text-lg">Daftar Tiket Yang Telah Diterbitkan</p>
          </div>

          {/* Action Bar */}
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleExportPDF={handleExportPDF}
            handlePrint={handlePrint}
          />

          {/* Tabel */}
          <TabelTiket
            currentTickets={currentTickets}
            filtered={filtered}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            totalPages={totalPages}
            downloadingId={downloadingId}
            handleDownload={handleDownload}
          />

          {/* Toast */}
          <ToastNotifikasi
            showToast={showToast}
            toastMessage={toastMessage}
            setShowToast={setShowToast}
          />
        </main>
      </div>
    </div>
  );
};

export default TiketTerbit;