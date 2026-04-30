import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// --- IMPORT API ---
import { getAdminPromoList, deleteAdminPromo } from "../../api/adminApi";

const ManajemenPromo = () => {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const fetchPromos = async () => {
    try {
      const res = await getAdminPromoList(); 
      const promoData = res.data ? res.data : res; 

      if (Array.isArray(promoData)) {
        setPromos(promoData);
      } else {
        setPromos([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data promo:", error);
      setPromos([]);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleDelete = async () => {
    if (!selectedPromoId) return;

    try {
      await deleteAdminPromo(selectedPromoId);
      alert("Promo berhasil dihapus");
      fetchPromos(); 
    } catch (error) {
      console.error("Error delete promo:", error);
      alert("Gagal menghapus promo");
    }
    setShowDeleteModal(false); 
  };

  const filteredPromos = promos.filter((p) =>
    (p.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminNavbar />

        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              Daftar Promo
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Kelola semua penawaran dan diskon untuk Surya Kencana</p>
            </h2>
            <button onClick={() => navigate("/admin/TambahPromo")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <FaPlus /> Tambah Promo
            </button>
          </div>

          <div className="relative mb-4">
            <input type="text" placeholder="Cari nama promo..." className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Nama Promo</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-left">Deskripsi</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Diskon</th>
                    {/* ✅ PERBAIKAN 2: Tambah Kolom Maksimal Potongan */}
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Maks. Potongan</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Periode Berlaku</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPromos.length > 0 ? (
                    filteredPromos.map((promo, index) => (
                      <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-center text-sm">{index + 1}</td>
                        <td className="px-6 py-4"><div className="font-semibold text-gray-900">{promo.nama}</div></td>
                        <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate" title={promo.deskripsi}>{promo.deskripsi || "-"}</td>
                        <td className="px-6 py-4 text-center"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{promo.persen_diskon}%</span></td>
                        {/* ✅ PERBAIKAN 3: Menampilkan data maksimal_diskon dengan format Rupiah */}
                        <td className="px-6 py-4 text-center text-sm font-medium">Rp {promo.maksimal_diskon?.toLocaleString('id-ID')}</td>
                        <td className="px-6 py-4 text-center text-sm whitespace-nowrap">{promo.tanggal_mulai} s/d {promo.tanggal_selesai}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${promo.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {promo.status === "active" ? "Aktif" : "Non-Aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button onClick={() => navigate(`/admin/DetailPromo/${promo.id}`)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Lihat Laporan Promo"><FaEye size={18}/></button>
                            <button onClick={() => navigate(`/admin/EditPromo/${promo.id}`)} className="text-amber-500 hover:text-amber-700 transition-colors" title="Edit Promo"><FaEdit size={18}/></button>
                            <button onClick={() => { setSelectedPromoId(promo.id); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-800 transition-colors" title="Hapus Promo"><FaTrash size={18}/></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">Tidak ada data promo ditemukan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-red-600 text-xl font-bold mb-3">Hapus Data Promo?</h3>
            <p className="text-gray-700 mb-6">Apakah Anda yakin ingin menghapus promo <strong className="text-gray-900">{filteredPromos.find((promo) => promo.id === selectedPromoId)?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium transition-colors">Batal</button>
              <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPromo;