import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

const API = "http://127.0.0.1:8000/api/accounts";

const EditJadwal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔴 PERBAIKAN 1: Sesuaikan state dengan field di models.py (asal, tujuan, harga)
  const [form, setForm] = useState({
    asal: "",
    tujuan: "",
    tanggal: "",
    waktu: "",
    harga: "",
    status: "active",
    bus: "",
  });
  
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        setLoading(true);
        
        // Load Daftar Bus (PERBAIKAN: Tambah credentials 'include')
        try {
          const rb = await fetch(`${API}/admin/bus/`, { credentials: "include" });
          const jb = await rb.json();
          setBuses(Array.isArray(jb) ? jb : []);
        } catch {
          setBuses([]);
        }
        
        // Load Detail Jadwal (PERBAIKAN: Tambah credentials 'include')
        const rs = await fetch(`${API}/admin/jadwal/${id}/`, { credentials: "include" });
        if (!rs.ok) throw new Error(`HTTP ${rs.status}`);
        const s = await rs.json();

        // 🔴 PERBAIKAN 2: Memisahkan DateTime dari Django menjadi Date & Time untuk input HTML
        const datetimeString = s.waktu_keberangkatan || "";
        const [datePart, timePart] = datetimeString.split("T");

        setForm({
          asal: s.asal || "",
          tujuan: s.tujuan || "",
          tanggal: datePart || "",
          waktu: timePart ? timePart.slice(0, 5) : "", // Ambil HH:MM
          harga: s.harga || "",
          status: s.status || "active",
          bus: s.bus?.id || s.bus || "", 
        });
      } catch (e) {
        setErr(e.message || "Gagal memuat data jadwal");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      // 🔴 PERBAIKAN 3: Bungkus payload dengan nama yang sesuai dan gabungkan datetime
      const payload = {
        asal: form.asal,
        tujuan: form.tujuan,
        waktu_keberangkatan: `${form.tanggal}T${form.waktu}:00`, // Gabungkan lagi saat dikirim
        harga: Number(form.harga),
        status: form.status,
        bus: Number(form.bus),
      };

      // 🔴 PERBAIKAN 4: Ganti PATCH jadi PUT & sertakan credentials
      const res = await fetch(`${API}/admin/jadwal/${id}/`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json().catch(() => null);
      
      if (!res.ok) {
        const errorMsg = data?.error || data?.detail || JSON.stringify(data);
        throw new Error(errorMsg || `HTTP ${res.status}`);
      }
      
      alert("Perubahan jadwal berhasil disimpan!");
      navigate("/admin/jadwaltiket"); // Pastikan rute ini benar sesuai App.js Abang
    } catch (e) {
      alert(`Gagal menyimpan: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Edit Jadwal Keberangkatan</h2>
          {err && <div className="mb-4 text-red-600 bg-red-100 p-3 rounded">{err}</div>}
          
          {loading ? (
            <div className="p-4 text-gray-600 font-medium">Memuat data jadwal...</div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div>
                <label className="block font-medium mb-1">Kota Asal</label>
                <input
                  type="text"
                  name="asal" // Sudah disesuaikan
                  value={form.asal}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Kota Tujuan</label>
                <input
                  type="text"
                  name="tujuan" // Sudah disesuaikan
                  value={form.tujuan}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Tanggal Keberangkatan</label>
                <input
                  type="date"
                  name="tanggal" // Sudah disesuaikan
                  value={form.tanggal}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Waktu Keberangkatan</label>
                <input
                  type="time"
                  name="waktu" // Sudah disesuaikan
                  value={form.waktu}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Harga Tiket (Rp)</label>
                <input
                  type="number"
                  name="harga" // Sudah disesuaikan
                  value={form.harga}
                  onChange={onChange}
                  required
                  min="0"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-1">Nama Bus</label>
                <select
                  name="bus"
                  value={form.bus}
                  onChange={onChange}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Bus --</option>
                  {/* 🔴 PERBAIKAN 5: Sesuai dengan field di models.py (nama & tipe) */}
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama} {b.tipe ? `[${b.tipe}]` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Status Jadwal</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="canceled">Dibatalkan</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="mr-3 px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm disabled:opacity-60 transition"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditJadwal;