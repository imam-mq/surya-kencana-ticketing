import React, { useEffect, useState } from "react";
import Agent_Navbar from "./layout/Agent_Navbar";
import Sidebar_Agent from "./layout/Sidebar_Agent";
import ActionBar      from "./tiketterbitcomponent/ActionBar";
import TabelTiket     from "./tiketterbitcomponent/TabelTiket";
import ToastNotifikasi from "./tiketterbitcomponent/ToastNotifikasi";

// --- IMPORT SERVICE ---
import { downloadTicketPDF } from '../../services/ticketService';

// --- IMPORT API ---
import { getIssuedTickets } from "../../api/agentApi"; 

const TiketTerbit = () => {
  const [tickets, setTickets]         = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showToast, setShowToast]     = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Ambil data tiket saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getIssuedTickets(); 
        
        // maping data
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
        if (error.response?.status === 401) {
          alert("Sesi Abang sudah habis, silakan login ulang ya.");
        } else {
          console.error("Waduh, gagal ambil data tiket:", error);
        }
      }
    };
    fetchTickets();
  }, []);

  // Fitur Pencarian (Cari berdasarkan nama, rute, atau bus)
  const filtered = tickets.filter((ticket) =>
    `${ticket.penumpang} ${ticket.tipeRis} ${ticket.asal} ${ticket.tujuan}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem  = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets   = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages       = Math.ceil(filtered.length / itemsPerPage);

  // Fungsi buat download tiket pas tombol di tabel diklik
  const handleDownload = async (ticketId) => {
    if (!ticketId) return;

    try {
      setDownloadingId(ticketId); // Nyalain loading di tombol
      
      // Panggil "jurus" download kita dari service
      await downloadTicketPDF(ticketId); 

      // Kasih notif kalau berhasil
      setToastMessage("Mantap! Tiket sudah berhasil diunduh.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
    } catch (err) {
      console.error("Gagal download:", err);
      alert("Gagal cetak PDF. Coba cek koneksi atau server.");
    } finally {
      setDownloadingId(null); // Matiin loading di tombol
    }
  };

  const handleExportPDF = () => alert("Fitur Export PDF List sedang disiapkan!");
  const handlePrint     = () => window.print();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar_Agent />

      <div className="flex-1 flex flex-col">
        <Agent_Navbar />

        <main className="flex-1 p-8">
          {/* Header Judul */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Tiket Terbit</h1>
            <p className="text-gray-500 text-lg">Kelola semua tiket yang sudah dicetak oleh Agent.</p>
          </div>

          {/* Kolom cari dan tombol aksi */}
          <ActionBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleExportPDF={handleExportPDF}
            handlePrint={handlePrint}
          />

          {/* Tabel Utama */}
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

          {/* Notifikasi Pop-up */}
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