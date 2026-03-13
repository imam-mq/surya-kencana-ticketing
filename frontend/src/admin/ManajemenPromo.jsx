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

  //Fetch promo dari backend
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

  // Delete ke backend
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

  // Filter berdasarkan nama/judul
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
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              Daftar Promo
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Kelola semua penawaran dan diskon untuk surya kencana</p>
            </h2>
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

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">No</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Judul Promo</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Deskripsi</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Diskon</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Periode</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Tanggal</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {filteredPromos.map((promo, index) => (
                    <tr key={promo.id} className="hover:bg-gray-50">

                      {/* NO */}
                      <td className="px-6 py-4 text-center text-sm">
                        {index + 1}
                      </td>

                      {/* JUDUL */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {promo.nama}
                        </div>
                      </td>

                      {/* DESKRIPSI */}
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {promo.deskripsi || "-"}
                      </td>

                      {/* DISKON */}
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                          {promo.persen_diskon}%
                        </span>
                      </td>

                      {/* PERIODE */}
                      <td className="px-6 py-4 text-center text-sm">
                        {promo.tanggal_mulai} - {promo.tanggal_selesai}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            promo.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {promo.status === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>

                      {/* TANGGAL */}
                      <td className="px-6 py-4 text-center text-sm">
                        {promo.tanggal_mulai}
                      </td>

                      {/* AKSI */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() => navigate(`/admin/DetailPromo/${promo.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/EditPromo/${promo.id}`)}
                            className="text-amber-600 hover:text-amber-800"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPromoId(promo.id);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
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