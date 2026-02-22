import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

const TambahPromo = () => {
    const [promo, setPromo] = useState({
    judul: "",
    deskripsi: "",
    diskon: "",
    periode: "",
    status: "Aktif",
    tanggal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        // Mapping field sesuai dengan Model Django (Bahasa Indonesia)
        const payload = {
            nama: promo.judul,                     // title -> nama
            deskripsi: promo.deskripsi,            // 🔥 TAMBAHKAN BARIS INI DI SINI
            persen_diskon: Number(promo.diskon),   // discount_percent -> persen_diskon
            tanggal_mulai: promo.tanggal,          // start_date -> tanggal_mulai
            tanggal_selesai: promo.tanggal,        // Karena di form cuma ada 1 input tanggal
            status: promo.status === "Aktif" ? "active" : "inactive"
        };

        const response = await fetch("http://127.0.0.1:8000/api/accounts/admin/promo/", {
            method: "POST",
            credentials: "include",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Gunakan payload yang sudah di-mapping
        });

        const result = await response.json();

        if (response.ok) {
            alert("Promo berhasil ditambahkan");
            window.location.href = "/admin/manajemenpromo";  // Redirect
        } else {
            alert(result.message || JSON.stringify(result) || "Gagal menambahkan promo");
        }
        } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menghubungkan backend");
        }
    };



  return (
    <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
            <AdminNavbar />

            <div className="p-6">
                <h2 className="text-3xl font-bold mb-6">Tambah Promo</h2>

                <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Judul Promo <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                name="judul" 
                                value={promo.judul}
                                onChange={handleChange}
                                className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan Judul Promo"
                                required
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Deskripsi Promo <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                name="deskripsi"
                                value={promo.deskripsi}
                                onChange={handleChange}
                                className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukan Deskripsi Promo"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Presentase Diskon <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center">
                                <input 
                                    type="number" 
                                    name="diskon"
                                    value={promo.diskon}
                                    onChange={handleChange}
                                    className="border p-3 rounded-l-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Diskon"
                                    required
                                />
                                <span className="border-t border-b border-r p-3 bg-gray-100 text-gray-700">%</span>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Periode <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="periode"
                                value={promo.periode}
                                onChange={handleChange}
                                className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Masukkan Periode Promo"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={promo.status}
                                onChange={handleChange}
                                className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required>

                                <option value="Aktif">Aktif</option>
                                <option value="Non-Aktif">Non-Aktif</option>
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold text-lg text-gray-700 mb-2">
                                Tanggal <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="date"
                                name="tanggal"
                                value={promo.tanggal}
                                onChange={handleChange}
                                className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
                            Tambah
                        </button>

                        <button 
                            type="button"
                            onClick={() => window.location.href = "/admin/manajemenpromo"}
                            className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600">
                            Cancel
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
  )
}

export default TambahPromo;