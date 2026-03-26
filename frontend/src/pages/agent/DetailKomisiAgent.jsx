import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Agent_Navbar from './layout/Agent_Navbar';
import Sidebar_Agent from './layout/Sidebar_Agent';
import { FaArrowLeft, FaCalendarAlt, FaBus, FaUser, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const DetailKomisiAgent = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Untuk mendapatkan ID dari URL

  // Sample data
  const detailData = {
    periode: "1-31 Nov",
    transactions: [
      {
        no: 1,
        tanggal: "25-12-2025",
        bis: "Surya Kencana - AC-1 [AC1]",
        kursi: "C1",
        namaPenumpang: "Bagus Maulana",
        keberangkatan: "Bima Nusa Tengah",
        kedatangan: "Lombok Nusa",
        totalTransaksi: "Rp.250.000",
        komisi: "Rp.50.000"
      },
      {
        no: 2,
        tanggal: "25-12-2025",
        bis: "Surya Kencana - AC-1 [AC1]",
        kursi: "D1",
        namaPenumpang: "Raditya Denta",
        keberangkatan: "Sumbawa Barat",
        kedatangan: "Bima Nusa",
        totalTransaksi: "Rp.250.000",
        komisi: "Rp.50.000"
      }
    ]
  };

  const totalTransaksi = detailData.transactions.reduce((sum, item) => {
    return sum + parseInt(item.totalTransaksi.replace(/[^0-9]/g, ''));
  }, 0);

  const totalKomisi = detailData.transactions.reduce((sum, item) => {
    return sum + parseInt(item.komisi.replace(/[^0-9]/g, ''));
  }, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar_Agent />
      <div className="flex-1">
        <Agent_Navbar />
        <div className="p-8">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm"
            >
              <FaArrowLeft />
              <span>Kembali</span>
            </button>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Detail Komisi Agent</h2>
            </div>
          </div>

          {/* Periode Info Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-3xl" />
              <div>
                <p className="text-sm font-medium text-blue-100">Periode Transaksi</p>
                <p className="text-2xl font-bold">{detailData.periode}</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      No
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Tanggal
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Bis
                    </th>
                    <th className="py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Kursi
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Nama Penumpang
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Keberangkatan
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Kedatangan
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Total Transaksi
                    </th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Komisi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailData.transactions.map((item) => (
                    <tr key={item.no} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 border-r border-gray-200">
                        {item.no}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                        {item.tanggal}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaBus className="text-blue-600" />
                          <span>{item.bis}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center border-r border-gray-200">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                          {item.kursi}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          <span>{item.namaPenumpang}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-green-600" />
                          <span>{item.keberangkatan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-red-600" />
                          <span>{item.kedatangan}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                        {item.totalTransaksi}
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-green-600">
                        {item.komisi}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200">
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                      TOTAL:
                    </td>
                    <td className="py-4 px-4 text-sm font-extrabold text-gray-900 border-r border-gray-200">
                      Rp.{totalTransaksi.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-4 text-sm font-extrabold text-green-600">
                      Rp.{totalKomisi.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Total <span className="font-semibold text-gray-900">{detailData.transactions.length}</span> transaksi
            </p>
            <p className="text-sm text-gray-500">Data periode {detailData.periode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKomisiAgent;