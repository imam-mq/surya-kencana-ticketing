import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaCalendarAlt, FaFileExport, FaSpinner } from "react-icons/fa";
import { getLaporanTiketTerjual } from "../../../api/adminApi";

const TiketTerjual = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await getLaporanTiketTerjual(startDate, endDate);

      if (res.success) {
        setLaporan(res.data);
      } else {
        setErr("Gagal Memuat Data Laporan");
      }
    } catch (error) {
      setErr(error.response?.data?.error || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCari = () => {
    fetchLaporan();
  };

  const handleExportExcel = () => {
    alert("Fitur Export to PDF sedang dikembangkan");
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <div>
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div>
          <AdminNavbar />
        </div>

        <div className="p-8 flex-1">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Laporan Tiket Terjual
            </h2>
            <p className="text-gray-500">Rekapitulasi tingkat okupansi bus berdasarkan rentang tanggal.</p>
          </div>

          {err && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm font-medium">
              {err}
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tanggal Mulai</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="col-span-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tanggal Selesai</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <button
                  onClick={handleCari}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-bold tracking-wide disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Terapkan"}
                </button>
              </div>

              {/* Export PDF Button (Diperlebar menjadi col-span-2) */}
              <div className="col-span-2">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2 font-bold"
                  title="Export PDF"
                >
                  <FaFileExport size={18} /> Export PDF
                </button>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Jadwal</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Rute</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Bus</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Total Kursi</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tiket Terjual</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Sisa</th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Okupansi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                        <FaSpinner className="animate-spin inline-block mr-2 text-xl text-blue-600" /> Sedang memuat data laporan...
                      </td>
                    </tr>
                  ) : laporan.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500 font-medium">
                        Tidak ada data jadwal pada rentang tanggal tersebut.
                      </td>
                    </tr>
                  ) : (
                    laporan.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.routes.map((route, routeIndex) => (
                          <tr key={`${index}-${routeIndex}`} className="hover:bg-blue-50 transition-colors duration-200">
                            {routeIndex === 0 && (
                              <td 
                                className="py-4 px-6 text-sm font-bold text-gray-900 border-r border-gray-200 bg-gray-50 align-top" 
                                rowSpan={item.routes.length}
                              >
                                {item.tanggal}
                              </td>
                            )}
                            <td className="py-4 px-6 text-sm font-semibold text-gray-700 border-r border-gray-200">{route.rute}</td>
                            <td className="py-4 px-6 text-sm text-gray-600 border-r border-gray-200">{route.bus}</td>
                            <td className="py-4 px-6 text-sm font-bold text-gray-900 text-center border-r border-gray-200">{route.totalKursi}</td>
                            <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-center border-r border-gray-200">{route.tiketTerjual}</td>
                            <td className="py-4 px-6 text-sm font-bold text-rose-600 text-center border-r border-gray-200">{route.tiketTersedia}</td>
                            <td className="py-4 px-6 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                parseInt(route.persentase) >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                                parseInt(route.persentase) >= 40 ? 'bg-amber-100 text-amber-700' : 
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {route.persentase}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 font-medium">
              Menampilkan total {laporan.length} hari keberangkatan.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiketTerjual;