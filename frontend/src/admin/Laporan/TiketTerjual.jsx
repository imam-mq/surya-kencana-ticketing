import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaCalendarAlt, FaFileExport, FaPrint } from "react-icons/fa";

const TiketTerjual = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Sample data grouped by date
  const laporanData = [
    {
      tanggal: "18 Okt 2025",
      routes: [
        { 
          rute: "Terminal Jambrong - Terminal Mandalika", 
          bus: "Surya Kencana - AC-1 [AC1]", 
          totalKursi: 28, 
          tiketTerjual: 0, 
          tiketTersedia: 0, 
          persentase: "80%" 
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
          tiketTerjual: 0, 
          tiketTersedia: 0, 
          persentase: "80%" 
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
          tiketTerjual: 0, 
          tiketTersedia: 0, 
          persentase: "80%" 
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
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Laporan Tiket Terjual
            </h2>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Start Date */}
              <div className="col-span-3">
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

              {/* End Date */}
              <div className="col-span-3">
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

              {/* Select Date Dropdown */}
              <div className="col-span-3">
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="">Pilih Tanggal</option>
                  <option value="2025-10-18">18 Okt 2025</option>
                  <option value="2025-10-20">20 Okt 2025</option>
                  <option value="2025-11-30">30 Nov 2025</option>
                </select>
              </div>

              {/* Cari Button */}
              <div className="col-span-1">
                <button
                  onClick={handleCari}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Cari
                </button>
              </div>

              {/* Export Excel Button */}
              <div className="col-span-1">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
                  title="Export PDF"
                >
                  <FaFileExport className="mx-auto" />
                </button>
              </div>

              {/* Print Button */}
              <div className="col-span-1">
                <button
                  onClick={handlePrint}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg font-semibold"
                  title="Print"
                >
                  <FaPrint className="mx-auto" />
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
                      Tiket Tersedia
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Persentase
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {laporanData.map((item, index) => (
                    <React.Fragment key={index}>
                      {item.routes.map((route, routeIndex) => (
                        <tr key={`${index}-${routeIndex}`} className="hover:bg-blue-50 transition-colors duration-200">
                          {routeIndex === 0 && (
                            <td 
                              className="py-4 px-6 text-sm font-bold text-gray-900 border-r border-gray-200 bg-gray-50" 
                              rowSpan={item.routes.length}
                            >
                              {item.tanggal}
                            </td>
                          )}
                          <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                            {route.rute}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                            {route.bus}
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-gray-900 text-center border-r border-gray-200">
                            {route.totalKursi}
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-gray-900 text-center border-r border-gray-200">
                            {route.tiketTerjual}
                          </td>
                          <td className="py-4 px-6 text-sm font-semibold text-gray-900 text-center border-r border-gray-200">
                            {route.tiketTersedia}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
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
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">«</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">‹</button>
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">3</button>
                <span className="text-xs text-gray-600">...</span>
                <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">26</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">›</button>
                <button className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">»</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiketTerjual;