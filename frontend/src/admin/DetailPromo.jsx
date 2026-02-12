import React, { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { useParams, useNavigate } from "react-router-dom";

const DetailPromo = () => {
  const { id } = useParams(); // Ambil id dari URL
  const navigate = useNavigate();

  const [promoDetail, setPromoDetail] = useState(null);
  const [purchases, setPurchases] = useState([]); // nanti isi dari API kalau ada

  useEffect(() => {
    // fetch detail promo
    fetch(`http://127.0.0.1:8000/api/accounts/admin/promo/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setPromoDetail(data);
      })
      .catch((err) => {
        console.error("Error fetching promo details:", err);
      });

    setPurchases([]); // kosongkan (atau gunakan sample data untuk testing)
  }, [id]);

  // helper format tanggal (simple)
  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    } catch {
      return iso;
    }
  };

  if (!promoDetail) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <AdminNavbar />
          <div className="p-6">
            <div className="text-center py-24">Loading detail promo...</div>
          </div>
        </div>
      </div>
    );
  }

  const PLACEHOLDER_ROWS = 8;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6">Detail Promo</h2>

          <div className="bg-white shadow-lg p-6 rounded-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="font-semibold text-lg text-gray-700 mb-2">Judul Promo</label>
                <p className="text-gray-700">{promoDetail.title}</p>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-lg text-gray-700 mb-2">Deskripsi Promo</label>
                <p className="text-gray-700">{promoDetail.description || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col">
                <label className="font-semibold text-lg text-gray-700 mb-2">Diskon</label>
                <p className="text-gray-700">{promoDetail.discount_percent}%</p>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold text-lg text-gray-700 mb-2">Periode Promo</label>
                <p className="text-gray-700">
                  {promoDetail.periode
                    ? promoDetail.periode
                    : promoDetail.start_date && promoDetail.end_date
                    ? `${formatDate(promoDetail.start_date)} - ${formatDate(promoDetail.end_date)}`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="font-semibold text-lg text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-2">
                <p className="text-gray-700">{promoDetail.active ? "Aktif" : "Tidak Aktif"}</p>
                {promoDetail.active && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12.5l3-3 5 5-1.5 1.5-3.5-3.5-1.5 1.5z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="flex flex-col mb-6">
              <label className="font-semibold text-lg text-gray-700 mb-2">Jumlah Penggunaan Promo</label>
              <p className="text-gray-700">{promoDetail.jumlahPenggunaan || purchases.length || 0}</p>
            </div>
          </div>

          {/* TABLE: Pengguna Promo */}
          <div className="bg-white shadow p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Pengguna Promo</h3>
              <div className="text-sm text-gray-600">Menampilkan riwayat penggunaan promo</div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border">No</th>
                    <th className="px-4 py-2 text-left border">Nama Pembeli</th>
                    <th className="px-4 py-2 text-left border">Tanggal</th>
                    <th className="px-4 py-2 text-right border">Harga Awal</th>
                    <th className="px-4 py-2 text-right border">Diskon</th>
                    <th className="px-4 py-2 text-right border">Harga Akhir</th>
                  </tr>
                </thead>

                <tbody>
                  {purchases.length > 0 ? (
                    purchases.map((row, idx) => (
                      <tr key={idx} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-3 border">{idx + 1}</td>
                        <td className="px-4 py-3 border">{row.buyer_name || "-"}</td>
                        <td className="px-4 py-3 border">{formatDate(row.date) || "-"}</td>
                        <td className="px-4 py-3 border text-right">
                          {row.original_price ? row.original_price.toLocaleString() : "-"}
                        </td>
                        <td className="px-4 py-3 border text-right">
                          {row.discount ? `${row.discount}%` : "-"}
                        </td>
                        <td className="px-4 py-3 border text-right">
                          {row.final_price ? row.final_price.toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    // tampilkan beberapa baris kosong sebagai placeholder UI
                    Array.from({ length: PLACEHOLDER_ROWS }).map((_, idx) => (
                      <tr key={idx} className="odd:bg-white even:bg-gray-50">
                        <td className="px-4 py-3 border text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 border text-gray-300">-</td>
                        <td className="px-4 py-3 border text-gray-300">-</td>
                        <td className="px-4 py-3 border text-gray-300 text-right">-</td>
                        <td className="px-4 py-3 border text-gray-300 text-right">-</td>
                        <td className="px-4 py-3 border text-gray-300 text-right">-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* footer kecil: hint integrasi */}
            <div className="mt-4 text-sm text-gray-500">
              Info: Untuk mengisi tabel ini secara realtime, tambahkan endpoint backend yang mengembalikan daftar penggunaan promo (mis. <code>/api/accounts/admin/promo/{id}/usages/</code>) lalu fetch di useEffect dan set ke <code>setPurchases</code>.
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/admin/manajemenpromo")}
              className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-700 mr-2"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPromo;
