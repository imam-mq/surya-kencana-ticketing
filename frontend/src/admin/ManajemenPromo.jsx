import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ManajemenPromo = () => {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPromoId, setSelectedPromoId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch promo dari backend
  const fetchPromos = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/admin/promo/",
        { credentials: "include" }
      );
      const data = await response.json();

      // ⛑️ SAFETY CHECK
      if (Array.isArray(data)) {
        setPromos(data);
      } else {
        console.error("Promo response bukan array:", data);
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

  // ✅ Delete ke backend
  const handleDelete = async () => {
    if (!selectedPromoId) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/accounts/admin/promo/${selectedPromoId}/`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      const res = await response.json();
      if (res.success || response.ok) {
        alert("Promo berhasil dihapus");
        fetchPromos(); // Refresh promo list after delete
      } else {
        alert("Gagal menghapus promo");
      }
    } catch (error) {
      console.error("Error delete promo:", error);
    }

    setShowDeleteModal(false); // Hide modal after deletion
  };

  // ✅ Filter berdasarkan nama/judul
  const filteredPromos = promos.filter((p) =>
    (p.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <AdminNavbar />

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Promo</h2>
            <button
              onClick={() => navigate("/admin/TambahPromo")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaPlus /> Tambah Promo
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Cari promo..."
              className="w-full p-3 pl-10 border rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 font-bold">Judul</th>
                  <th className="p-3 font-bold">Deskripsi</th>
                  <th className="p-3 font-bold">Diskon</th>
                  <th className="p-3 font-bold">Periode</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Tanggal</th>
                  <th className="p-3 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPromos.map((promo) => (
                  <tr key={promo.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{promo.nama}</td>
                    
                    {/* 🔥 Deskripsi dimunculkan di sini */}
                    <td className="p-3 text-gray-700 max-w-xs truncate" title={promo.deskripsi}>
                        {promo.deskripsi || "-"}
                    </td>
                    
                    <td className="p-3">{promo.persen_diskon}%</td>
                    
                    <td className="p-3">
                      {promo.tanggal_mulai} s/d {promo.tanggal_selesai}
                    </td>
                    
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-white text-sm ${
                          promo.status === "active" ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        {promo.status === "active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    
                    {/* 🔥 Tanggal (Diambil dari tanggal pembuatan/tanggal mulai) */}
                    <td className="p-3 text-gray-600">{promo.tanggal_mulai}</td>

                    <td className="p-3 text-center flex gap-3 justify-center">
                      <button
                        onClick={() => navigate(`/admin/DetailPromo/${promo.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-xl"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() => navigate(`/admin/EditPromo/${promo.id}`)}
                        className="text-green-600 hover:text-green-800 text-xl"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedPromoId(promo.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-xl"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredPromos.length === 0 && (
              <p className="text-center p-4 text-gray-600">Tidak ada promo ditemukan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal Delete Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-red-600 text-xl font-bold mb-4">Hapus Data?</h3>
            <p className="text-lg mb-6">
              Apakah Anda yakin ingin menghapus promo{" "}
              <strong>
                {filteredPromos.find((promo) => promo.id === selectedPromoId)?.nama}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700"
              >
                Hapus
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPromo;