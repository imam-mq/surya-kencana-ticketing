import React, { useEffect, useState } from "react";
import { FaTicketAlt, FaWallet } from 'react-icons/fa';
import Agent_Navbar from './layout/Agent_Navbar';
import Sidebar_Agent from './layout/Sidebar_Agent';

const API_BASE = "http://127.0.0.1:8000/api"; 
const LOGIN_AGENT_ROUTE = "/LoginAdminAgent";

const StatCard = ({ title, value, icon: Icon, iconClass, bgClass }) => (
  <div className={`relative p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] ${bgClass} border border-gray-100 overflow-hidden group`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl shadow-md ${iconClass} bg-white/50 backdrop-blur-sm group-hover:rotate-6 transition-transform duration-300`}>
        <Icon className="text-3xl" />
      </div>
    </div>
  </div>
);

const DashboardAgent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // State tambahan untuk menampung data statistik dari API
  const [stats, setStats] = useState({
    tiketTerjual: "0",
    penumpangHariIni: "0",
    totalKomisi: "Rp. 0",
    totalPembayaranAdmin: "Rp. 0"
  });

  const dashboardStats = [
    { title: "Tiket Terjual", value: stats.tiketTerjual, icon: FaTicketAlt, iconClass: "text-blue-600", bgClass: "bg-gradient-to-br from-blue-50 to-blue-100" },
    { title: "Total Penumpang Hari Ini", value: stats.penumpangHariIni, icon: FaTicketAlt, iconClass: "text-green-600", bgClass: "bg-gradient-to-br from-green-50 to-green-100" },
    { title: "Total Komisi", value: stats.totalKomisi, icon: FaWallet, iconClass: "text-purple-600", bgClass: "bg-gradient-to-br from-purple-50 to-purple-100" },
    { title: "Total Pembayaran Admin", value: stats.totalPembayaranAdmin, icon: FaWallet, iconClass: "text-purple-600", bgClass: "bg-gradient-to-br from-purple-50 to-purple-100" },
  ];

  useEffect(() => {
    let mounted = true;

    const verifyAndFetch = async () => {
      setLoading(true);
      try {
        // 1. VERIFIKASI SESI (Ganti pengecekan localStorage)
        const resSession = await fetch(`${API_BASE}/accounts/auth/check-session/`, {
          credentials: "include" // Penting agar cookie terkirim
        });

        if (!resSession.ok) {
          window.location.href = LOGIN_AGENT_ROUTE;
          return;
        }
        
        const sessionData = await resSession.json();

        // 2. AMBIL DATA JADWAL & STATISTIK
        // (Headers tidak perlu Authorization Bearer karena pakai Session)
        const fetchOptions = { credentials: "include" };

        const [resJadwal, resStats] = await Promise.all([
          fetch(`${API_BASE}/accounts/agent/jadwal/`, fetchOptions),
          fetch(`${API_BASE}/accounts/agent/commission-report/`, fetchOptions)
        ]);

        if (mounted) {
          const dataJadwal = await resJadwal.json();
          const dataStats = await resStats.json();

          setItems(Array.isArray(dataJadwal) ? dataJadwal : []);
          
          if (dataStats) {
            const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
            
            const totalBayarAdmin = (dataStats.results || []).reduce((acc, curr) => {
              return acc + (parseFloat(curr.harga_tiket || 0) - parseFloat(curr.komisi || 0));
            }, 0);

            setStats({
              tiketTerjual: dataStats.results?.length.toString() || "0",
              penumpangHariIni: dataStats.passengers_today?.toString() || "0",
              totalKomisi: formatter.format(dataStats.total_komisi_aktif || 0),
              totalPembayaranAdmin: formatter.format(totalBayarAdmin)
            });
          }
        }
      } catch (e) {
        if (mounted) setErr("Gagal terhubung ke server");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    verifyAndFetch();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar_Agent />
      <div className="flex-1 flex flex-col">
        <Agent_Navbar />

        <main className="flex-1 p-4 md:p-8">
          {/* --- statistik --- */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard Agent</h2>
                <p className="text-gray-600 text-lg">Ringkasan status terkini untuk Agent.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardStats.map((s, i) => <StatCard key={i} {...s} />)}
            </div>
          </section>

          {/* --- tabel jadwal --- */}
          <section>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Nama Bus</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Tanggal</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Jam</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Keberangkatan</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Kedatangan</th>
                      <th className="py-4 px-6 text-left text-xs font-bold text-white uppercase tracking-wider">Sisa Kursi</th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-6 text-gray-500">Loading...</td></tr>
                    ) : err ? (
                      <tr><td colSpan={6} className="text-center py-6 text-red-600">Error: {err}</td></tr>
                    ) : items.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-6 text-gray-500">Tidak ada keberangkatan.</td></tr>
                    ) : items.map(it => {
                      const available = (it.capacity ?? 0) - (it.sold_seats ?? 0);
                      const busLabel = it.bus ? `${it.bus.name}${it.bus.code ? ` (${it.bus.code})` : ""}` : "-";

                      return (
                        <tr key={it.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4">{busLabel}</td>
                          <td className="px-6 py-4">{it.date}</td>
                          <td className="px-6 py-4">{it.time?.slice(0,5) || "-"}</td>
                          <td className="px-6 py-4">{it.origin}</td>
                          <td className="px-6 py-4">{it.destination || it.arrival_destination || "-"}</td>
                          <td className="px-6 py-4">{available}</td>
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