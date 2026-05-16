import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaCalendarAlt, FaFileExport, FaPrint } from "react-icons/fa";

const TiketTerjual = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Data dummy (nanti akan diganti dengan API Django)
  const laporanData = [
    {
      tanggal: "18 Okt 2025",
      routes: [
        { 
          rute: "Terminal Jambrong - Terminal Mandalika", 
          bus: "Surya Kencana - AC-1 [AC1]", 
          totalKursi: 28, 
          tiketTerjual: 28, 
          tiketTersedia: 0, 
          persentase: "100%" 
        }
      ]
    },
    {
      tanggal: "20 Okt 2025",
      routes: [
        { 
          rute: "Terminal Jambrong - Terminal Mandalika", 
          bus: "Surya Kencana - AC-2 [AC2]", 
          totalKursi: 28, 
          tiketTerjual: 14, 
          tiketTersedia: 14, 
          persentase: "50%" 
        }
      ]
    },
    {
      tanggal: "30 Nov 2025",
      routes: [
        { 
          rute: "Terminal Jambrong - Terminal Lombok", 
          bus: "Surya Kencana - Sleeper [SLP]", 
          totalKursi: 27, 
          tiketTerjual: 5, 
          tiketTersedia: 22, 
          persentase: "18%" 
        }
      ]
    }
  ];

  const handleCari = () => {
    alert(`Cari laporan dari ${startDate} sampai ${endDate}`);
  };

  const handleExportExcel = () => {
    alert("Export to PDF");
  };

  const handlePrint = () => {
    alert("Print laporan");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />
        <div className="p-8 flex-1">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Laporan Tiket Terjual
            </h2>
            <p className="text-gray-500">Rekapitulasi tingkat okupansi bus berdasarkan rentang tanggal.</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Start Date (Diperlebar jadi col-span-4) */}
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

              {/* End Date (Diperlebar jadi col-span-4) */}
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

              {/* Cari Button (Diperlebar jadi col-span-2) */}
              <div className="col-span-2">
                <button
                  onClick={handleCari}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-bold tracking-wide"
                >
                  Terapkan
                </button>
              </div>

              {/* Export Excel Button */}
              <div className="col-span-1">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center"
                  title="Export PDF"
                >
                  <FaFileExport size={18} />
                </button>
              </div>

              {/* Print Button */}
              <div className="col-span-1">
                <button
                  onClick={handlePrint}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex justify-center items-center"
                  title="Print Laporan"
                >
                  <FaPrint size={18} />
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
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Tanggal
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Rute
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Bus
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Total Kursi
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Tiket Terjual
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Sisa
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Okupansi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {laporanData.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.routes.map((route, routeIndex) => (
                        <tr key={`${index}-${routeIndex}`} className="hover:bg-blue-50 transition-colors duration-200">
                          {/* RowSpan untuk Tanggal */}
                          {routeIndex === 0 && (
                            <td 
                              className="py-4 px-6 text-sm font-bold text-gray-900 border-r border-gray-200 bg-gray-50 align-top" 
                              rowSpan={item.routes.length}
                            >
                              {item.tanggal}
                            </td>
                          )}
                          <td className="py-4 px-6 text-sm font-semibold text-gray-700 border-r border-gray-200">
                            {route.rute}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 border-r border-gray-200">
                            {route.bus}
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-gray-900 text-center border-r border-gray-200">
                            {route.totalKursi}
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-center border-r border-gray-200">
                            {route.tiketTerjual}
                          </td>
                          <td className="py-4 px-6 text-sm font-bold text-rose-600 text-center border-r border-gray-200">
                            {route.tiketTersedia}
                          </td>
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">«</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">‹</button>
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded font-bold shadow">1</button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">2</button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">3</button>
                <span className="text-xs text-gray-600 font-bold px-1">...</span>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">26</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">›</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600 font-bold">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiketTerjual;