import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaFileExport, FaPrint, FaSpinner } from "react-icons/fa";
import Agent_Navbar from "./layout/Agent_Navbar";
import Sidebar_Agent from "./layout/Sidebar_Agent";

// Tambahkan CSS Animation untuk Toast
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  .animate-progress {
    animation: progress 2s linear forwards;
  }
`;
if (!document.getElementById('toast-animation-style')) {
  style.id = 'toast-animation-style';
  document.head.appendChild(style);
}

const TiketTerbit = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {

        const response = await fetch(
          "http://127.0.0.1:8000/api/accounts/agent/tickets/",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 401) {
          alert("Session habis, silakan login ulang");
          return;
        }

        const data = await response.json();

        const mappedTickets = data.map((item, index) => ({
            no: index + 1,
            id: item.id,
            tipeRis: `${item.bus_name} ${item.bus_code ?? ""}`,
            jam: item.departure_time?.slice(0, 5),
            jadwal: item.departure_date,
            rute: `${item.origin} - ${item.destination}`,
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

  const filtered = tickets.filter((ticket) =>
  `${ticket.penumpang} ${ticket.tipeRis} ${ticket.rute}`
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleExportPDF = () => alert("Export PDF functionality");
  const handlePrint = () => alert("Print functionality");
  
  const handleDownload = async (ticketId) => {
    try {
      setDownloadingId(ticketId); // ⏳ aktifkan loading

      // ⏱️ TAMBAHKAN DELAY 2 DETIK (simulasi loading)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const res = await fetch(
        `http://127.0.0.1:8000/api/accounts/agent/download-tiket-pdf/?ticket_id=${ticketId}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Download gagal");

      const blob = await res.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "tiket.pdf";
      link.click();

      // ✅ toast sukses
      setToastMessage("File tiket berhasil diunduh ke perangkat anda");
      setShowToast(true);

      // auto close 3 detik
      setTimeout(() => {
        setShowToast(false);
      }, 2000);

    } catch (err) {
      alert("Gagal download tiket");
    } finally {
      setDownloadingId(null); // ⛔ stop loading
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari Tiket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  <FaFileExport />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  <FaPrint />
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Show Data Dropdown - Di dalam card */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Lihat</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={7}>7</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>data</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      No
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Nama Penumpang
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Tipe Bus
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Jam
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Jadwal
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Rute
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-900">
                      Download Tiket
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {ticket.no}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {ticket.penumpang}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {ticket.tipeRis}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {ticket.jam}
                      </td>
                      <td className="py-4 px-1">
                        <span className="inline-flex items-center px-1 py-2 rounded text-xs font-bold bg-blue-100 text-blue-700">
                          {ticket.jadwal}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {ticket.rute}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleDownload(ticket.id)}
                          disabled={downloadingId === ticket.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${
                            downloadingId === ticket.id 
                              ? "bg-gray-400 cursor-not-allowed text-white" 
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {downloadingId === ticket.id ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Menyiapkan...</span>
                            </>
                          ) : (
                            <>
                              <FaDownload />
                              <span>Download</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {currentTickets.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Tidak ada tiket ditemukan</p>
                <p className="text-gray-400 text-sm mt-1">Coba kata kunci pencarian lain</p>
              </div>
            )}

            {/* Pagination - Di dalam card */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                {/* Info Text */}
                <p className="text-sm text-gray-600">
                  Lihat {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} data
                </p>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        currentPage === index + 1
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {showToast && (
            <div className="fixed top-6 right-6 z-50 animate-slide-in">
              <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200 min-w-[400px]">
                {/* Progress Bar */}
                <div className="h-1 bg-gray-200 w-full">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-500 animate-progress"></div>
                </div>
                
                {/* Content */}
                <div className="px-6 py-4 flex items-center gap-4">
                  {/* Icon Checkmark */}
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg 
                      className="w-8 h-8 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900 mb-1">Download Berhasil</p>
                    <p className="text-sm text-gray-500">{toastMessage}</p>
                  </div>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowToast(false)}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TiketTerbit;