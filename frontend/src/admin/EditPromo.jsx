import React, { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { useNavigate, useParams } from "react-router-dom";

const EditPromo = () => {
    const navigate = useNavigate();
    const { id } = useParams();  // Ambil ID dari URL

    const [promo, setPromo] = useState({
        judul: "",
        deskripsi: "",
        diskon: "",
        periode: "November",
        status: "Aktif",
        tanggal: "",
    });

    useEffect(() => {
        // Ambil detail promo berdasarkan ID dari URL
        fetch(`http://127.0.0.1:8000/api/accounts/admin/promo/${id}/`)
            .then((res) => res.json())
            .then((data) => {
                setPromo({
                    judul: data.title,
                    deskripsi: data.description,
                    diskon: data.discount_percent,
                    periode: data.periode,
                    status: data.active ? "Aktif" : "Non-Aktif",
                    tanggal: data.start_date,
                });
            })
            .catch((err) => {
                console.error("Error fetching promo details:", err);
            });
    }, [id]);  // Efek samping untuk memuat data promo ketika ID berubah

    // Fungsi untuk menangani perubahan form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kirim data promo yang sudah diedit ke backend menggunakan PUT
        fetch(`http://127.0.0.1:8000/api/accounts/admin/promo/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: promo.judul,
                description: promo.deskripsi,
                discount_percent: promo.diskon,
                periode: promo.periode,
                start_date: promo.tanggal,
                active: promo.status === "Aktif",  // Mengubah status menjadi boolean
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Promo Updated:", data);
                if (data.success) {
                    alert("Promo berhasil diperbarui");
                    navigate("/admin/manajemenpromo");  // Redirect ke halaman manajemen promo
                } else {
                    alert("Gagal memperbarui promo");
                }
            })
            .catch((err) => {
                console.error("Error updating promo:", err);
                alert("Terjadi kesalahan saat memperbarui promo");
            });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <AdminNavbar />
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-6">Edit Promo</h2>

                    <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            {/* Judul Promo */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">
                                    Nama Promo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="judul"
                                    value={promo.judul}
                                    onChange={handleChange}
                                    className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Masukkan Nama Promo"
                                    required
                                />
                            </div>

                            {/* Deskripsi Promo */}
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
                                    placeholder="Masukkan Deskripsi Promo"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            {/* Presentase Diskon */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">
                                    Persentase Diskon <span className="text-red-500">*</span>
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

                            {/* Periode Promo */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">
                                    Periode Promo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="periode"
                                    value={promo.periode}
                                    onChange={handleChange}
                                    className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="November">November</option>
                                    <option value="December">Desember</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            {/* Status */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">
                                    Status Promo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="status"
                                    value={promo.status}
                                    onChange={handleChange}
                                    className="border p-3 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="Aktif">Aktif</option>
                                    <option value="Non-Aktif">Non-Aktif</option>
                                </select>
                            </div>

                            {/* Tanggal Promo */}
                            <div className="flex flex-col">
                                <label className="font-semibold text-lg text-gray-700 mb-2">
                                    Tanggal Promo <span className="text-red-500">*</span>
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
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                            >
                                Edit Promo
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/manajemenpromo")}
                                className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600"
                            >
                                Batal
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPromo;
