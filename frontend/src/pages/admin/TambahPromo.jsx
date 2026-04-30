import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { createAdminPromo } from "../../api/adminApi";

const TambahPromo = () => {
    const navigate = useNavigate();

    // State kolom db
    const [promo, setPromo] = useState({
        nama: "",
        deskripsi: "",
        persen_diskon: "",
        maksimal_diskon: "20000", // Default dari model Django
        tanggal_mulai: "",
        tanggal_selesai: "",
        status: "active",
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
            const payload = {
                nama: promo.nama,
                deskripsi: promo.deskripsi,
                persen_diskon: parseInt(promo.persen_diskon),
                maksimal_diskon: parseInt(promo.maksimal_diskon),
                tanggal_mulai: promo.tanggal_mulai,
                tanggal_selesai: promo.tanggal_selesai,
                status: promo.status,
            };

            await createAdminPromo(payload);
            alert("Promo berhasil ditambahkan!");
            navigate("/admin/manajemenpromo");
        } catch (err) {
            console.error("Error creating promo:", err);
            alert("Terjadi kesalahan: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <AdminNavbar />
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-6">Tambah Promo Baru</h2>

                    <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
                        
                        {/* BARIS 1: NAMA & DESKRIPSI */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Nama Promo <span className="text-red-500">*</span></label>
                                <input type="text" name="nama" value={promo.nama} onChange={handleChange} className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Promo Lebaran" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Deskripsi</label>
                                <input type="text" name="deskripsi" value={promo.deskripsi} onChange={handleChange} className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Penjelasan singkat promo" />
                            </div>
                        </div>

                        {/* BARIS 2: DISKON & MAKSIMAL DISKON */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Persentase Diskon <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <input type="number" name="persen_diskon" value={promo.persen_diskon} onChange={handleChange} className="border p-3 rounded-l-md focus:ring-2 focus:ring-blue-500 w-full" placeholder="Contoh: 10" required />
                                    <span className="border-t border-b border-r p-3 bg-gray-100 text-gray-700">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Maksimal Potongan (Rp) <span className="text-red-500">*</span></label>
                                <div className="flex items-center">
                                    <span className="border-t border-b border-l p-3 bg-gray-100 text-gray-700 rounded-l-md">Rp</span>
                                    <input type="number" name="maksimal_diskon" value={promo.maksimal_diskon} onChange={handleChange} className="border p-3 rounded-r-md focus:ring-2 focus:ring-blue-500 w-full" required />
                                </div>
                            </div>
                        </div>

                        {/* BARIS 3: TANGGAL MULAI & TANGGAL SELESAI */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                                <input type="date" name="tanggal_mulai" value={promo.tanggal_mulai} onChange={handleChange} className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                                <input type="date" name="tanggal_selesai" value={promo.tanggal_selesai} onChange={handleChange} className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500" required />
                            </div>
                        </div>

                        {/* BARIS 4: STATUS */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">Status Promo <span className="text-red-500">*</span></label>
                                <select name="status" value={promo.status} onChange={handleChange} className="border p-3 rounded-md focus:ring-2 focus:ring-blue-500" required>
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Non-Aktif</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Tambah Promo</button>
                            <button type="button" onClick={() => navigate("/admin/manajemenpromo")} className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors">Batal</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TambahPromo;