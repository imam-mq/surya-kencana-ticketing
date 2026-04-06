import React, { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { useParams, useNavigate } from "react-router-dom";
import { formatTanggal } from "../../utils/formatters";
import { getPromoDetail } from "../../api/adminApi";
import { usePromoDetail } from "../../hooks/usePromoDetail";

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent }) => (
  <div
    className="relative bg-white rounded-2xl p-5 overflow-hidden"
    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
  >
    <div
      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between mt-1">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ─── Info Row ─────────────────────────────────────────────────
const InfoRow = ({ label, children }) => (
  <div className="py-4 grid grid-cols-5 gap-4 border-b border-gray-100 last:border-0">
    <dt className="col-span-2 text-xs font-semibold uppercase tracking-widest text-gray-400 flex items-start pt-0.5">
      {label}
    </dt>
    <dd className="col-span-3 text-sm font-medium text-gray-800">{children}</dd>
  </div>
);

// ─── Main ─────────────────────────────────────────────────────
const DetailPromo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // call hook
  const { promoDetail, purchases, loading, error } = usePromoDetail(id);

  // Loading Eror
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <AdminNavbar />
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <p className="text-sm text-gray-400 font-medium">Memuat detail promo...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // error detail promo
  if (error || !promoDetail) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <AdminNavbar />
          <div className="p-10 text-center">
            <p className="text-red-500 font-bold mb-4">Gagal memuat data: {error}</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Kembali</button>
          </div>
        </div>
      </div>
    );
  }

  const PLACEHOLDER_ROWS = 8;

  // get data field be (tanggal_mulai, tanggal_berakhir)
  const periode = promoDetail.tanggal_mulai && promoDetail.tanggal_selesai
      ? `${formatTanggal(promoDetail.tanggal_mulai)} — ${formatTanggal(promoDetail.tanggal_selesai)}`
      : "-";
  const jumlahPenggunaan = promoDetail.jumlahPenggunaan || purchases.length || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              Daftar Promo
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Kelola semua penawaran dan diskon untuk surya kencana</p>
            </h2>
            <button
              onClick={() => navigate("/admin/manajemenpromo")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
          </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Diskon"
                value={`${promoDetail.persen_diskon}%`} 
                icon="🏷️"
                accent="#6366f1"
              />
              <StatCard
                label="Penggunaan"
                value={jumlahPenggunaan}
                icon="🎟️"
                accent="#10b981"
              />
              <StatCard
                label="Status"
                value={promoDetail.status === 'active' ? "Aktif" : "Nonaktif"}
                icon={promoDetail.status === 'active' ? "✅" : "⛔"}
                accent={promoDetail.status === 'active' ? "#10b981" : "#ef4444"}
              />
              <StatCard
                label="Mulai"
                value={promoDetail.tanggal_mulai ? formatTanggal(promoDetail.tanggal_mulai) : "-"}
                icon="📅"
                accent="#f59e0b"
              />
            </div>
         
            
          

            {/* ── Info Card ── */}
            <div className="bg-white rounded-2xl p-6 mb-6" style={{boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)"}}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Informasi Promo
                </h3>
              </div>

              <dl>
                {/* NAMA FIELD DARI BACKEND */}
                <InfoRow label="Judul/Kode Promo">{promoDetail.kode_promo}</InfoRow>
                <InfoRow label="Deskripsi">{promoDetail.deskripsi || "-"}</InfoRow>
                <InfoRow label="Diskon">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    🏷️ {promoDetail.persen_diskon}% OFF
                  </span>
                </InfoRow>
                <InfoRow label="Batas Maksimal">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700">
                    🛑 Rp {(promoDetail.maksimal_diskon || 20000).toLocaleString("id-ID")}
                  </span>
                </InfoRow>
                <InfoRow label="Periode Promo">{periode}</InfoRow>
                <InfoRow label="Status">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      promoDetail.status === 'active'
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        promoDetail.status === 'active' ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                    {promoDetail.status === 'active' ? "Aktif" : "Tidak Aktif"}
                  </span>
                </InfoRow>
                <InfoRow label="Jumlah Penggunaan">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                    🎟️ {jumlahPenggunaan} kali digunakan
                  </span>
                </InfoRow>
              </dl>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}>
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Pengguna Promo
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["No", "Nama Pembeli", "Tanggal", "Harga Awal", "Diskon", "Harga Akhir"].map((col, i) => (
                          <th key={col} className={`px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 ${i >= 3 ? "text-right" : "text-left"}`}>
                            {col}
                          </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {purchases.length > 0 ? (
                      purchases.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 text-sm text-gray-400 font-medium w-10">{idx + 1}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{row.buyer_name || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-500">{formatTanggal(row.date) || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-700 text-right">Rp {row.original_price?.toLocaleString("id-ID") || "-"}</td>
                          <td className="px-5 py-3.5 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                              Rp {row.discount?.toLocaleString("id-ID") || "-"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-emerald-600 text-right">Rp {row.final_price?.toLocaleString("id-ID") || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-gray-400">Belum ada riwayat penggunaan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
};

export default DetailPromo;