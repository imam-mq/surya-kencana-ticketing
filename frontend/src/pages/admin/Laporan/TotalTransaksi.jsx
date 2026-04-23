import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import { FaFileExport, FaFilePdf, FaSearch, FaEye } from "react-icons/fa";
import { getTransaksiUserOnline } from "../../../api/adminApi";
// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent, sub }) => (
  <div
    className="relative bg-white rounded-2xl p-5 overflow-hidden"
    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
  >
    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: accent }} />
    <div className="flex items-start justify-between mt-1">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}18` }}
      >
        <Icon style={{ color: accent }} size={18} />
      </div>
    </div>
  </div>
);



// ─── Main ─────────────────────────────────────────────────────
const TotalTransaksi = () => {
  const navigate = useNavigate();

  const [transaksi, setTransaksi] = useState([]);
  const [summary, setSummary] = useState({ total_pendapatan: 0, total_tiket: 0 });
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect( () => {
    const fetchTransaksi = async () => {
      try {
        setLoading(true);
        const res = await getTransaksiUserOnline();
        console.log("Data dari Django:", res);
        
        if (res.success) {
          setTransaksi(res.data.transactions);
          setSummary({
            total_pendapatan: res.data.summary.total_pendapatan,
            total_tiket: res.data.summary.total_tiket_terjual
          });
        }
      } catch(err) {
        console.error("Gagal memuat Transaksi", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaksi();
  }, []);

  // ── Filter ──
  const filtered = transaksi.filter((t) => {
    // Tambahkan pengaman || "" agar tidak error jika data null
    const namaAkun = t.nama_akun || "";
    const tipeBus = t.tipe_bus || "";
    
    const matchSearch = `${namaAkun} ${tipeBus}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
    // Pastikan membandingkan string dengan string kosong jika date tidak ada
    const matchFrom = dateFrom && t.tanggal_transaksi !== "-" 
      ? new Date(t.tanggal_transaksi) >= new Date(dateFrom) 
      : true;
    const matchTo   = dateTo && t.tanggal_transaksi !== "-"
      ? new Date(t.tanggal_transaksi) <= new Date(dateTo)   
      : true;
      
    return matchSearch && matchFrom && matchTo;
  });

  // ── Pagination ──
  const totalPages       = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const indexOfFirst     = (currentPage - 1) * itemsPerPage;
  const indexOfLast      = indexOfFirst + itemsPerPage;
  const currentRows      = filtered.slice(indexOfFirst, indexOfLast);

  // ── Summary ──
  const totalPendapatan  = transaksi.reduce((s, t) => s + Number(t.harga || 0), 0);

  const handleExportPDF  = () => alert("Export PDF");
  const handleExportExcel = () => alert("Export Excel");

  const PLACEHOLDER = 8;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">

          {/* ── Page Header ── */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 mb-1">
              Admin / Laporan
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Laporan User Total Transaksi</h2>
            <p className="text-sm text-gray-400 mt-1">Laporan transaksi penumpang surya kencana</p>
          </div>

          
          {/* ── Filter & Action Bar ── */}
          <div
            className="bg-white rounded-2xl p-5 mb-6 flex flex-wrap items-center gap-3"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
          >
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Cari Nama..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Date range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <span className="text-gray-400 text-sm font-medium">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
            </div>

            <div className="flex-1" />

            {/* Export buttons */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "#ef4444" }}
            >
              <FaFilePdf size={13} />
              Ekspor PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "#f59e0b" }}
            >
              <FaFileExport size={13} />
              Ekspor Excel
            </button>
          </div>

          {/* ── Table Card ── */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)" }}
          >
            {/* Table top bar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Data Transaksi
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Lihat</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  {[10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <span>data</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["No", "Tanggal Transaksi", "Nama Akun", "Tipe Bus", "Harga", "Aksi"].map(
                      (col, i) => (
                        <th
                          key={col}
                          className={`px-6 py-3 text-xs font-semibold uppercase tracking-widest text-gray-400 ${
                            i === 4 ? "text-right" : i === 5 ? "text-center" : "text-left"
                          }`}
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      // Skeleton loading - Sejajar dengan 6 Header Kolom
                      Array.from({ length: PLACEHOLDER }).map((_, idx) => (
                        <tr key={idx}>
                          {/* 1. No (Rata Kiri) */}
                          <td className="px-5 py-4 text-sm text-gray-300">{idx + 1}</td>
                          
                          {/* 2. Tanggal Transaksi (Rata Kiri) */}
                          <td className="px-5 py-4">
                            <div className="h-4 w-24 rounded bg-gray-100" />
                          </td>
                          
                          {/* 3. Nama Akun (Rata Kiri) */}
                          <td className="px-5 py-4">
                            <div className="h-4 w-32 rounded bg-gray-100" />
                          </td>
                          
                          {/* 4. Tipe Bus (Rata Kiri) */}
                          <td className="px-5 py-4">
                            <div className="h-4 w-28 rounded bg-gray-100" />
                          </td>
                          
                          {/* 5. Harga (Rata Kanan) */}
                          <td className="px-5 py-4 flex justify-end">
                            <div className="h-4 w-20 rounded bg-gray-100" />
                          </td>
                          
                          {/* 6. Aksi (Rata Tengah) */}
                          <td className="px-5 py-4 text-center">
                            <div className="h-7 w-16 rounded-lg bg-gray-100 mx-auto" />
                          </td>
                        </tr>
                      ))
                    ) : currentRows.length > 0 ? (
                    currentRows.map((t, idx) => (
                      <tr key={t.id || idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm text-gray-400 font-medium">
                          {indexOfFirst + idx + 1}
                        </td>
                        {/* TODO: sesuaikan field dengan response API */}
                        <td className="px-5 py-3.5 text-sm text-gray-600">{t.tanggal_transaksi}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{t.nama_akun}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{t.tipe_bus}</td>
                        <td className="px-5 py-3.5 text-sm font-bold text-gray-800 text-right">
                          Rp {Number(t.harga || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => navigate(`/admin/transaksi/${t.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                          >
                            <FaEye size={11} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <p className="text-sm text-gray-400 font-medium">Tidak ada data transaksi</p>
                        <p className="text-xs text-gray-300 mt-1">Coba ubah filter pencarian</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-gray-400">
                {filtered.length === 0
                  ? "Tidak ada data"
                  : `Menampilkan ${indexOfFirst + 1}–${Math.min(indexOfLast, filtered.length)} dari ${filtered.length} data`}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`e-${i}`} className="px-2 text-xs text-gray-400">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          p === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TotalTransaksi;