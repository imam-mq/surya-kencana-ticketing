import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaWallet, FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import Agent_Navbar from './layout/Agent_Navbar';
import Sidebar_Agent from './layout/Sidebar_Agent';

// --- IMPORT API  ---
import { checkSession, getAgentJadwal, getDashboardStats } from "../../api/agentApi";
import { formatRupiah } from "../../utils/formatters";

// Komponen Card
const StatCard = ({ title, value, icon: Icon, iconClass, bgClass }) => (
  <div className={`relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] ${bgClass} border border-gray-100 overflow-hidden group`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-xl md:text-2xl font-extrabold text-gray-900 break-words">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl shadow-md ${iconClass} bg-white/50 backdrop-blur-sm group-hover:rotate-6 transition-transform duration-300`}>
        <Icon className="text-2xl md:text-3xl" />
      </div>
    </div>
  </div>
);

const DashboardAgent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [stats, setStats] = useState({
    periode: "Hari Ini",
    tiketTerjual: "0",
    penumpangHariIni: "0",
    totalKomisi: "Rp 0",
    totalPembayaranAdmin: "Rp 0"
  });

  const [filterDate, setFilterDate] = useState({ start: "", end: "" });
  const [search, setSearch] = useState({ origin: "", destination: "", date: "" });

  const dashboardStats = [
    { title: "Tiket Terjual", value: stats.tiketTerjual, icon: FaTicketAlt, iconClass: "text-blue-600", bgClass: "bg-gradient-to-br from-blue-50 to-blue-100" },
    { title: "Total Penumpang", value: stats.penumpangHariIni, icon: FaUsers, iconClass: "text-green-600", bgClass: "bg-gradient-to-br from-green-50 to-green-100" },
    { title: "Total Komisi", value: stats.totalKomisi, icon: FaWallet, iconClass: "text-purple-600", bgClass: "bg-gradient-to-br from-purple-50 to-purple-100" },
    { title: "Setoran Ke Admin", value: stats.totalPembayaranAdmin, icon: FaMoneyBillWave, iconClass: "text-orange-600", bgClass: "bg-gradient-to-br from-orange-50 to-orange-100" },
  ];

  useEffect(() => {
    let mounted = true;

    const verifyAndFetch = async () => {
      setLoading(true);
      try {
        await checkSession(); //  Cek Sesi

        // Fetch API 
        const [dataJadwal, dataStats] = await Promise.all([
          getAgentJadwal({ origin: search.origin, destination: search.destination, date: search.date }),
          getDashboardStats({ start_date: filterDate.start, end_date: filterDate.end }) 
        ]);
        
        if (mounted) {
          setItems(Array.isArray(dataJadwal) ? dataJadwal : []);
          if (dataStats) {
            setStats({
              periode: dataStats.periode || "Hari Ini",
              tiketTerjual: (dataStats.tiket_aktif || 0).toString(),
              penumpangHariIni: (dataStats.total_penumpang || 0).toString(),
              totalKomisi: formatRupiah(dataStats.total_komisi_pending),
              totalPembayaranAdmin: formatRupiah(dataStats.tagihan_setoran)
            });
          }
        }
      } catch (e) {
        if (mounted) {
          console.error("Error fetching dashboard:", e);
          if (e.response?.status === 401) {
            window.location.href = "/LoginAdminAgent";
          } else {
            setErr("Gagal terhubung ke server");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    verifyAndFetch();
    return () => { mounted = false; };
  }, [filterDate, search]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar_Agent />
      <div className="flex-1 flex flex-col">
        <Agent_Navbar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <section className="mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Dashboard Agent</h2>
                <p className="text-gray-600 text-sm md:text-lg">Ringkasan performa: <span className="font-semibold text-blue-600">{stats.periode}</span></p>
              </div>

              <div className="flex bg-white p-2 rounded-lg shadow-sm border border-gray-200 gap-2">
                <input type="date" className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500" value={filterDate.start} onChange={(e) => setFilterDate({...filterDate, start: e.target.value})} />
                <span className="self-center text-gray-400">-</span>
                <input type="date" className="border rounded px-2 py-1 text-sm outline-none focus:border-blue-500" value={filterDate.end} onChange={(e) => setFilterDate({...filterDate, end: e.target.value})} />
                <button onClick={() => setFilterDate({start: "", end: ""})} className="text-xs text-red-500 hover:underline px-2 font-medium">Reset</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          <section>
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h3 className="text-xl font-bold text-gray-800">Jadwal Keberangkatan Tersedia</h3>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Nama Bus</th>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Tanggal</th>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Jam</th>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Rute Keberangkatan</th>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Rute Kedatangan</th>
                      <th className="py-4 px-6 text-left text-xs font-bold uppercase tracking-wider">Harga</th>
                      <th className="py-4 px-6 text-center text-xs font-bold uppercase tracking-wider">Sisa Kursi</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-500">Memuat data...</td></tr>
                    ) : err ? (
                      <tr><td colSpan={7} className="text-center py-8 text-red-600">{err}</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada jadwal keberangkatan aktif.</td></tr>
                    ) : items.map(it => {
                      const dateObj = new Date(it.waktu_keberangkatan);
                      const available = Math.max(0, (it.kapasitas || 28) - (it.terjual || 0));

                      return (
                        <tr key={it.id} className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {it.bus_name || "Bus Tanpa Nama"} <br/>
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{it.bus_type || "Standard"}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                          <td className="px-6 py-4 text-gray-600 font-mono font-bold">{dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                          <td className="px-6 py-4 text-gray-600 font-semibold">{it.asal}</td>
                          <td className="px-6 py-4 text-gray-600 font-mono font-bold">{it.tujuan}</td>
                          <td className="px-2 py-4 text-gray-900 font-bold">{formatRupiah(it.harga)}</td>
                          <td className="px-2 py-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {available > 0 ? `${available} Kursi Tersedia` : 'Penuh'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardAgent;