import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { 
  FaArrowLeft, FaInfoCircle, FaUsers, FaSearch, 
  FaMapMarkerAlt, FaBus, FaCheckCircle 
} from "react-icons/fa";

const API = "http://127.0.0.1:8000/api/accounts";

const DetailJadwal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // 🔴 PERBAIKAN: Gunakan API baru yang mengirimkan Jadwal + Daftar Penumpang
        const res = await fetch(`${API}/jadwal/${id}/detail-penumpang/`, {
          method: "GET",
          credentials: "include", // Penting untuk otentikasi sesi
          headers: { "Content-Type": "application/json" }
        });
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setErr(e.message || "Gagal memuat detail");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Data mapping (Aman dari undefined)
  const jadwal = data?.jadwal || {};
  const penumpang = data?.penumpang || [];

  // Filter pencarian nama penumpang
  const filteredPenumpang = penumpang.filter(p => 
    p.nama_penumpang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Kalkulasi Progress Bar Kursi
  const kapasitas = jadwal.kapasitas || 40;
  const terjual = jadwal.tiket_terjual || 0;
  const tersedia = jadwal.kursi_tersedia || (kapasitas - terjual);
  const persentaseTerisi = Math.round((terjual / kapasitas) * 100);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-8">
          {/* Header Section */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-blue-600 mb-3 flex items-center gap-2 transition"
            >
              <FaArrowLeft /> Kembali
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Detail Jadwal</h2>
            <p className="text-gray-500">Kelola detail keberangkatan bus dan pantau daftar penumpang</p>
          </div>

          {err && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 border border-red-200">{err}</div>}
          
          {loading || !data ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-medium">Memuat data...</div>
          ) : (
            <div className="space-y-6">
              
              {/* CARD 1: INFORMASI KEBERANGKATAN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center border-b pb-4 mb-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FaInfoCircle className="text-blue-600 text-xl" /> Informasi Keberangkatan
                  </h3>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> {jadwal.status || "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Rute Berangkat */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rute Keberangkatan</p>
                    <p className="font-semibold flex items-center gap-2">
                      <FaBus className="text-gray-400" /> {jadwal.rute_asal}
                    </p>
                  </div>
                  
                  {/* Rute Datang */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rute Kedatangan</p>
                    <p className="font-semibold flex items-center gap-2">
                      <FaBus className="text-gray-400" /> {jadwal.rute_tujuan}
                    </p>
                  </div>

                  {/* Nama Bus */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Bus</p>
                    <p className="font-semibold flex items-center gap-2">
                      <FaBus className="text-gray-400" /> {jadwal.nama_bus}
                    </p>
                  </div>

                  {/* Progress Bar Kursi */}
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-sm text-gray-500">Kursi Tersedia</p>
                      <p className="font-bold text-sm">{terjual}/{kapasitas}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 overflow-hidden">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${persentaseTerisi}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400">{tersedia} Kursi tersedia</p>
                  </div>

                  {/* Waktu Keberangkatan */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Waktu keberangkatan</p>
                    <p className="font-bold text-gray-900">{jadwal.waktu_keberangkatan}</p>
                  </div>

                  {/* Harga Tiket */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Harga Tiket</p>
                    <p className="font-bold text-gray-900">
                      Rp. {Number(jadwal.harga_tiket).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD 2: DAFTAR PENUMPANG */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-5 gap-4">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FaUsers className="text-purple-600 text-xl" /> Daftar Penumpang
                  </h3>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama penumpang..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-purple-50/50 text-gray-600 text-sm border-y border-gray-200">
                        <th className="py-3 px-4 font-semibold w-16">No</th>
                        <th className="py-3 px-4 font-semibold">Nama Penumpang</th>
                        <th className="py-3 px-4 font-semibold">Kursi</th>
                        <th className="py-3 px-4 font-semibold">Harga</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold">Dibeli Oleh</th>
                        <th className="py-3 px-4 font-semibold">Waktu Beli</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPenumpang.length > 0 ? (
                        filteredPenumpang.map((p, idx) => (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                            <td className="py-3 px-4 text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-4 font-bold text-gray-800">{p.nama_penumpang}</td>
                            
                            {/* Badge Kursi */}
                            <td className="py-3 px-4">
                              <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-md">
                                {p.kursi}
                              </span>
                            </td>
                            
                            <td className="py-3 px-4 font-medium text-gray-600">
                              Rp {Number(p.harga).toLocaleString("id-ID")}
                            </td>
                            
                            {/* Badge Status */}
                            <td className="py-3 px-4">
                              <span className="bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full text-xs">
                                {p.status}
                              </span>
                            </td>
                            
                            {/* Dibeli Oleh (Agent/User) */}
                            <td className="py-3 px-4">
                              <span className={`flex items-center gap-1 font-semibold ${p.dibeli_oleh === 'Agent' ? 'text-blue-600' : 'text-purple-600'}`}>
                                <FaCheckCircle /> {p.dibeli_oleh}
                              </span>
                            </td>
                            
                            <td className="py-3 px-4 text-gray-500">{p.waktu_beli}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            {searchTerm ? "Penumpang tidak ditemukan." : "Belum ada tiket yang terjual untuk jadwal ini."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Footer Pagination (Simulasi) */}
                {filteredPenumpang.length > 0 && (
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
                    <p>Menampilkan 1 sampai {filteredPenumpang.length} dari {filteredPenumpang.length} data</p>
                    <div className="flex gap-1">
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">&lt;</button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-100">&gt;</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailJadwal;