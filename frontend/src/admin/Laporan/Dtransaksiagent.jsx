import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaSearch, FaArrowLeft, FaBus, FaUser, FaMapMarkerAlt, FaClock, FaChair } from "react-icons/fa";

const Dtransaksiagent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  // Ubah initial state menjadi array kosong
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA DARI BACKEND ---
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/accounts/admin/laporan-transaksi/${id}/detail/`, {
          withCredentials: true
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Gagal mengambil detail transaksi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  // --- HELPER FORMAT RUPIAH ---
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.namaPenumpang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Perhitungan total sekarang lebih mudah karena datanya bertipe Number
  const totalHarga = filteredTransactions.reduce((sum, item) => sum + item.harga, 0);
  const totalKomisi = filteredTransactions.reduce((sum, item) => sum + item.komisi, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1">
        <AdminNavbar />

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
              <h2 className="text-3xl font-extrabold text-gray-900">Detail Agent Transaksi</h2>
              <p className="text-gray-600 text-sm mt-1">ID Tagihan: #{id}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="relative max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Nama Penumpang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tanggal</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Bus</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nama Penumpang</th>
                    <th className="py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Kursi</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Rute (Asal - Tujuan)</th>
                    <th className="py-4 px-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Jam</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Harga</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Komisi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="8" className="text-center py-10">Memuat data penumpang...</td></tr>
                  ) : filteredTransactions.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-10 text-gray-500">Tidak ada data tiket pada tagihan ini.</td></tr>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap">
                          {transaction.tanggal}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <FaBus className="text-blue-600 flex-shrink-0" />
                            <span className="truncate max-w-[150px]" title={transaction.bus}>{transaction.bus}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <FaUser className="text-gray-400 flex-shrink-0" />
                            <span className="font-semibold capitalize truncate max-w-[150px]" title={transaction.namaPenumpang}>
                              {transaction.namaPenumpang}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center border-r border-gray-200">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                            <FaChair className="mr-1" />
                            {transaction.kursi}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-green-600 flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={`${transaction.keterangan} ➔ ${transaction.kedatangan}`}>
                              {transaction.keterangan} <strong className="mx-1">➔</strong> {transaction.kedatangan}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center border-r border-gray-200">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">
                            <FaClock className="mr-1" />
                            {transaction.jam} WIB
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-gray-900 border-r border-gray-200">
                          {formatRupiah(transaction.harga)}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-green-600">
                          {formatRupiah(transaction.komisi)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200">
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                      TOTAL:
                    </td>
                    <td className="py-4 px-4 text-sm font-extrabold text-gray-900 border-r border-gray-200">
                      {formatRupiah(totalHarga)}
                    </td>
                    <td className="py-4 px-4 text-sm font-extrabold text-green-600">
                      {formatRupiah(totalKomisi)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Empty State untuk Search */}
            {!loading && filteredTransactions.length === 0 && transactions.length > 0 && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <FaSearch className="text-3xl text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Penumpang tidak ditemukan</p>
                <p className="text-gray-400 text-sm mt-1">Coba kata kunci pencarian lain</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-gray-900">{filteredTransactions.length}</span> dari{" "}
              <span className="font-semibold text-gray-900">{transactions.length}</span> tiket pada tagihan ini
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dtransaksiagent;