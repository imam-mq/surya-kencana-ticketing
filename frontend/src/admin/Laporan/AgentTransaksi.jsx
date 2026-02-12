import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaCalendarAlt, FaSearch, FaEye } from "react-icons/fa";

const AgentTransaksi = () => {
  const [startDate, setStartDate] = useState("2025-01-08");
  const [endDate, setEndDate] = useState("2025-01-31");
  const [searchAgent, setSearchAgent] = useState("");
  const navigate = useNavigate();

  // Sample data
  const agentData = [
  {
    id: 1,
    no: 1,
    periode: "01 Nov 2025 - 30 Nov 2025",
    namaAgent: "Agentsuryakencanamandalikagandiberih",
    totalTransaksi: "Rp.5.800.000",
    totalKomisi: "Rp.1.350.000",
    status: "sudah bayar"
  },
  {
    id: 2,
    no: 2,
    periode: "01 Nov 2025 - 30 Nov 2025",
    namaAgent: "Agentsuryakencanamandalikagandiberih",
    totalTransaksi: "Rp.5.800.000",
    totalKomisi: "Rp.1.350.000",
    status: "sudah bayar"
  },
  {
    id: 3,
    no: 3,
    periode: "01 Nov 2025 - 30 Nov 2025",
    namaAgent: "Agentsuryakencanamandalikagandiberih",
    totalTransaksi: "Rp.5.800.000",
    totalKomisi: "Rp.1.350.000",
    status: "belum bayar"
  }
];

  const filteredData = agentData.filter(agent =>
    agent.namaAgent.toLowerCase().includes(searchAgent.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Laporan Agent Transaksi
            </h2>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pilih Priode</h3>
            
            <div className="flex items-center gap-4">
              {/* Start Date */}
              <div className="flex-1">
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

              {/* End Date */}
              <div className="flex-1">
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

              {/* Search Agent */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Cari Nama Agent..."
                    value={searchAgent}
                    onChange={(e) => setSearchAgent(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
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
                      No
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Priode
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Nama Agent
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Total Transaksi
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Total Komisi
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Status
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((agent) => (
                    <tr key={agent.no} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900 border-r border-gray-200">
                        {agent.no}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                        {agent.periode}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-700 border-r border-gray-200">
                        <div className="max-w-xs truncate" title={agent.namaAgent}>
                          {agent.namaAgent}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900 border-r border-gray-200">
                        {agent.totalTransaksi}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900 border-r border-gray-200">
                        {agent.totalKomisi}
                      </td>
                      <td className="py-4 px-6 border-r border-gray-200">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          agent.status === "sudah bayar" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {agent.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/Laporan/Dtransaksiagent/${agent.id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-xs font-semibold">
                            <FaEye />
                            <span>Detail</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Tidak ada data ditemukan</p>
                <p className="text-gray-400 text-sm mt-1">Coba kata kunci pencarian lain</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <p>
              Menampilkan <span className="font-semibold text-gray-900">{filteredData.length}</span> dari{" "}
              <span className="font-semibold text-gray-900">{agentData.length}</span> agent
            </p>
            {/* <p className="text-gray-500">Total transaksi agent</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentTransaksi;