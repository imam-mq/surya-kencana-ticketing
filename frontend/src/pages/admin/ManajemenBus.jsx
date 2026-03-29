import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { getAdminBusList, createAdminBus, updateAdminBus, deleteAdminBus } from "../../api/adminApi"; 

const ManajemenBus = () => {
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk melacak ID bus yang sedang diedit (null = mode tambah)
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    nama: "",
    tipe: "",
    total_kursi: ""
  });

  const fetchBuses = async () => {
    try {
      const data = await getAdminBusList();
      setBuses(data);
    } catch (error) {
      console.error("Gagal mengambil data bus:", error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- LOGIC SUBMIT (Bisa Tambah, Bisa Edit) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        nama: form.nama,
        tipe: form.tipe,
        total_kursi: parseInt(form.total_kursi),
        status: "active"
      };

      if (editId) {
        // MODE EDIT
        await updateAdminBus(editId, payload);
        alert("Data bus berhasil diperbarui!");
      } else {
        // MODE TAMBAH
        await createAdminBus(payload);
        alert("Bus baru berhasil ditambahkan!");
      }
      
      // Reset form ke mode awal
      resetForm();
      fetchBuses(); 

    } catch (error) {
      alert("Terjadi kesalahan. Silakan periksa kembali inputan Anda.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIC TOMBOL EDIT ---
  const handleEditClick = (bus) => {
    setForm({
      nama: bus.nama,
      tipe: bus.tipe,
      total_kursi: bus.total_kursi
    });
    setEditId(bus.id); // Ubah mode ke Edit
  };

  // --- LOGIC TOMBOL HAPUS ---
  const handleDeleteClick = async (id) => {
    const isConfirm = window.confirm("Yakin ingin menghapus armada bus ini?");
    if (isConfirm) {
      try {
        await deleteAdminBus(id);
        alert("Bus berhasil dihapus!");
        fetchBuses();
      } catch (error) {
        alert("Gagal menghapus bus. Mungkin bus ini sudah terpakai di jadwal.");
        console.error(error);
      }
    }
  };

  // Fungsi untuk membatalkan edit dan mengosongkan form
  const resetForm = () => {
    setForm({ nama: "", tipe: "", total_kursi: "" });
    setEditId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-poppins">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Manajemen Bus</h2>

          {/* --- FORM BUS --- */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
              {editId ? "Edit Data Bus" : "Tambah Bus Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">Nama Bus</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Cth: Surya Kencana AC1"
                  className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">Tipe Bus</label>
                <input
                  type="text"
                  name="tipe"
                  value={form.tipe}
                  onChange={handleChange}
                  placeholder="Cth: VIP Sleeper"
                  className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">Jumlah Kursi</label>
                <input
                  type="number"
                  name="total_kursi"
                  value={form.total_kursi}
                  onChange={handleChange}
                  placeholder="Cth: 28"
                  className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {isLoading ? "Menyimpan..." : editId ? "Update Bus" : "Simpan Bus"}
                </button>
                {/* Tombol Batal Edit akan muncul jika sedang mode edit */}
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* --- TABEL DAFTAR BUS --- */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 border-b font-semibold">Nama Bus</th>
                  <th className="py-3 px-4 border-b font-semibold">Tipe</th>
                  <th className="py-3 px-4 border-b font-semibold text-center">Kursi</th>
                  <th className="py-3 px-4 border-b font-semibold text-center">Status</th>
                  <th className="py-3 px-4 border-b font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {buses.length > 0 ? (
                  buses.map((bus) => (
                    <tr key={bus.id} className="hover:bg-gray-50 border-b transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{bus.nama}</td>
                      <td className="py-3 px-4 text-gray-600">{bus.tipe || "-"}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{bus.total_kursi}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${bus.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {bus.status === 'active' ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        {/* Tombol Edit */}
                        <button 
                          onClick={() => handleEditClick(bus)}
                          className="text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1.5 rounded text-xs font-medium transition"
                        >
                          Edit
                        </button>
                        {/* Tombol Delete */}
                        <button 
                          onClick={() => handleDeleteClick(bus.id)}
                          className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-xs font-medium transition"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Belum ada armada bus yang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ManajemenBus;