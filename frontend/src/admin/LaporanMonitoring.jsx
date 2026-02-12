import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { 
  FaTicketAlt, 
  FaPercent, 
  FaMoneyBillWave, 
  FaUserTie, 
  FaFileInvoice,
  FaChartLine,
  FaArrowRight 
} from "react-icons/fa";

const LaporanMonitoring = () => {
  const navigate = useNavigate();

  const laporanItems = [
    {
      id: 1,
      title: "Total Transaksi",
      description: "Lihat laporan transaksi keseluruhan",
      icon: <FaMoneyBillWave className="text-4xl" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      route: "/admin/Laporan/transaksi",
    },
    {
      id: 2,
      title: "Tiket Terjual",
      description: "Monitor penjualan tiket",
      icon: <FaTicketAlt className="text-4xl" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      gradient: "from-green-500 to-green-600",
      route: "/admin/laporan/tiketterjual",
    },
    {
      id: 3,
      title: "Promo yang Digunakan",
      description: "Statistik penggunaan promo",
      icon: <FaPercent className="text-4xl" />,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
      gradient: "from-pink-500 to-pink-600",
      route: "/admin/laporan/promo",
    },
    {
      id: 4,
      title: "Agent Transaksi",
      description: "Laporan transaksi agent",
      icon: <FaUserTie className="text-4xl" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      gradient: "from-purple-500 to-purple-600",
      route: "/admin/laporan/agentransaksi",
    },
    {
      id: 5,
      title: "Bukti Transfer",
      description: "Verifikasi bukti transfer",
      icon: <FaFileInvoice className="text-4xl" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      route: "/admin/laporan/btransfer",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FaChartLine className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">Laporan & Monitoring</h1>
                <p className="text-gray-600 text-lg mt-1">Pantau dan analisis data bisnis Anda</p>
              </div>
            </div>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {laporanItems.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.route)}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>

                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={item.iconColor}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.description}
                  </p>

                  {/* Arrow Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Lihat Detail
                    </span>
                    <div className={`w-10 h-10 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shadow-md`}>
                      <FaArrowRight className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
              </div>
            ))}
          </div>

          {/* Info Footer */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Tips Monitoring</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Periksa laporan secara berkala untuk memantau performa bisnis. 
                  Data diperbarui secara real-time untuk memberikan insight yang akurat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaporanMonitoring;