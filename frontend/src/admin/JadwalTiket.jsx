import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

const API = "http://127.0.0.1:8000/api/accounts";

const JadwalTiket = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const fetchList = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await fetch(`${API}/admin/jadwal/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

 const onDelete = async (id) => {
    if (!window.confirm("Batalkan jadwal ini? Status akan menjadi 'canceled'.")) return;

    try {
      const res = await fetch(`${API}/admin/jadwal/${id}/`, {
        method: "DELETE",
        credentials: "include", // ⬅️ WAJIB (SESSION ADMIN)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status} - ${errText}`);
      }

      await fetchList();
    } catch (e) {
      alert(`Gagal membatalkan: ${e.message}`);
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Daftar Jadwal Keberangkatan</h2>
            <button
              onClick={() => (window.location.href = "/admin/tambah-jadwal")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPlus /> Tambah Jadwal
            </button>
          </div>

          {err && <div className="mb-3 text-red-600 text-sm">Error: {err}</div>}
          {loading ? (
            <div className="p-6 text-gray-600">Loading...</div>
          ) : (
            <div className="overflow-x-auto p-6 bg-white rounded-lg shadow-sm">
              <table className="w-full border-collapse border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr className="text-left border-b border-gray-200">
                    <th className="p-3">Rute Keberangkatan</th>
                    <th className="p-3">Rute Kedatangan</th>
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Jam</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">KTersedia</th>
                    <th className="p-3">Bus</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                        // 1. Ambil Nama Bus dari Serializer (backend kirim 'bus_name', bukan object 'bus')
                        const busLabel = it.bus_name ? `${it.bus_name} (${it.bus_type || '-'})` : "Bus Dihapus";

                        // 2. Format Tanggal & Jam dari 'waktu_keberangkatan'
                        const dateObj = new Date(it.waktu_keberangkatan);
                        const dateStr = dateObj.toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        });
                        const timeStr = dateObj.toLocaleTimeString("id-ID", {
                          hour: "2-digit", minute: "2-digit"
                        });

                        // 3. Cek Status
                        const statusLower = (it.status || "").toString().toLowerCase();
                        const isActive = statusLower === "active" || statusLower === "aktif";

                        // 🔥 4. PERBAIKAN: Hitung Kursi dari data Backend
                        const capacity = it.kapasitas || 28;
                        const sold = it.terjual || 0;
                        const available = Math.max(0, capacity - sold); 

                        return (
                          <tr key={it.id} className="border-b border-gray-100 hover:bg-gray-50">
                            {/* GANTI origin -> asal */}
                            <td className="p-3 font-medium">{it.asal}</td>
                            
                            {/* GANTI destination -> tujuan */}
                            <td className="p-3 font-medium">{it.tujuan}</td>
                            
                            {/* GANTI date -> dateStr (Format Indo) */}
                            <td className="p-3">{dateStr}</td>
                            
                            {/* GANTI time -> timeStr (Jam) */}
                            <td className="p-3">{timeStr}</td>
                            
                            {/* GANTI price -> harga */}
                            <td className="p-3 font-semibold text-gray-700">
                              Rp {Number(it.harga || 0).toLocaleString("id-ID")}
                            </td>
                            
                            {/* 🔥 TAMPILKAN ANGKA SISA KURSI */}
                            <td className="p-3 text-center font-bold text-blue-700">
                              {available} / {capacity}
                            </td>
                            
                            {/* Gunakan busLabel yg sudah diperbaiki */}
                            <td className="p-3">{busLabel}</td>
                            
                            <td className="p-3 capitalize">
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  px: 2.5,
                                  py: 0.5,
                                  borderRadius: "30px",
                                  fontWeight: 700,
                                  border: `1px solid ${isActive ? "#22c55e" : "#ef4444"}`, // Sedikit diperhalus border-nya
                                  color: isActive ? "#15803d" : "#b91c1c",
                                  backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                                  textTransform: "capitalize",
                                  minWidth: 90,
                                  textAlign: "center",
                                  fontSize: "0.85rem"
                                }}
                              >
                                {it.status}
                              </Box>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex justify-center gap-2">
                                <button 
                                    onClick={() => navigate(`/admin/detail-jadwal/${it.id}`)} 
                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                    title="Lihat Detail"
                                >
                                  <FaEye />
                                </button>
                                <button 
                                    onClick={() => navigate(`/admin/edit-jadwal/${it.id}`)} 
                                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                                    title="Edit Jadwal"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                    onClick={() => onDelete(it.id)} 
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                    title="Hapus Jadwal"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                    })}
                  {!items.length && (
                    <tr><td colSpan={9} className="p-4 text-center text-gray-500">Belum ada jadwal.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JadwalTiket;
