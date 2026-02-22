import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaCalendarAlt, FaSearch, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";

const AgentTransaksi = () => {
  const [startDate, setStartDate] = useState(""); // Default kosong agar ambil semua data
  const [endDate, setEndDate] = useState("");
  const [searchAgent, setSearchAgent] = useState("");
  const [agentData, setAgentData] = useState([]); // State untuk menampung data backend
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- LOGIC FETCH DATA DARI BACKEND ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/admin/laporan-transaksi/", {
        withCredentials: true,
        params: {
          start_date: startDate,
          end_date: endDate,
          q: searchAgent
        }
      });
      setAgentData(response.data);
    } catch (error) {
      console.error("Gagal mengambil data transaksi agent:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jalankan saat pertama kali load
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format Rupiah Helper
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  // Helper Format Tanggal
  const formatTgl = (tgl) => {
    if (!tgl) return "-";
    const d = new Date(tgl);
    return d.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Laporan Agent Transaksi
            </h2>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pilih Priode</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <span className="text-gray-500 font-semibold">—</span>

              <div className="flex-1 w-full">
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Cari Nama Agent..."
                    value={searchAgent}
                    onChange={(e) => setSearchAgent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Tombol Cari */}
              <button 
                onClick={fetchData}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95"
              >
                Cari
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">No</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Priode</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nama Agent</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Total Transaksi</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Total Komisi</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Status</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="7" className="text-center py-10">Memuat data transaksi...</td></tr>
                  ) : agentData.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-10 text-gray-500 font-medium">Data transaksi belum ada</td></tr>
                  ) : (
                    agentData.map((agent, index) => (
                      <tr key={agent.id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">{index + 1}</td>
                        <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                          {formatTgl(agent.periode_awal)} - {formatTgl(agent.periode_akhir)}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                          <div className="max-w-xs truncate font-medium capitalize" title={agent.agent_name}>
                            {agent.agent_name}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-900 border-r border-gray-200">
                          {formatRupiah(agent.total_tagihan)}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-green-600 border-r border-gray-200">
                          {formatRupiah(agent.total_komisi)}
                        </td>
                        <td className="py-4 px-6 border-r border-gray-200 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            agent.status === "DITERIMA" 
                              ? "bg-green-100 text-green-700" // Status sudah divalidasi admin
                              : agent.status === "MENUNGGU"
                              ? "bg-yellow-100 text-yellow-700" // Status menunggu verifikasi admin
                              : "bg-red-100 text-red-700"    // Status ditolak
                          }`}>
                            {/* Logika Teks Status Baru */}
                            {agent.status === "DITERIMA" ? "sudah bayar" : 
                            agent.status === "MENUNGGU" ? "menunggu verifikasi" : "ditolak"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => navigate(`/admin/Laporan/Dtransaksiagent/${agent.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-xs font-semibold"
                          >
                            <FaEye />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>
              Menampilkan <span className="font-semibold text-gray-900">{agentData.length}</span> agent
            </p>
            {/* Pagination UI - Seperti yang diminta pada gambar */}
            <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"><FaChevronLeft className="text-xs"/></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white font-bold shadow-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100"><FaChevronRight className="text-xs"/></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTransaksi;