import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

// --- IMPORT API ---
import { getAdminBusList, getAdminJadwalDetail, updateAdminJadwal } from "../../api/adminApi";

const EditJadwal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // state field models 
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
        
        // Load Daftar Bus Menggunakan API Luar
        try {
          const jb = await getAdminBusList();
          setBuses(Array.isArray(jb) ? jb : []);
        } catch {
          setBuses([]);
        }
        
        // Load Detail Jadwal Menggunakan API Luar
        const s = await getAdminJadwalDetail(id);

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
        setErr(e.response?.data?.error || e.message || "Gagal memuat data jadwal");
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
      
      const payload = {
        asal: form.asal,
        tujuan: form.tujuan,
        waktu_keberangkatan: `${form.tanggal}T${form.waktu}:00`,
        harga: Number(form.harga),
        status: form.status,
        bus: Number(form.bus),
      };

      // Simpan Perubahan Menggunakan API Luar
      await updateAdminJadwal(id, payload);
      
      alert("Perubahan jadwal berhasil disimpan!");
      navigate("/admin/jadwaltiket");
    } catch (e) {
      alert(`Gagal menyimpan: ${e.response?.data?.error || e.message}`);
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
                  name="asal"
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
                  name="tujuan"
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
                  name="tanggal" 
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
                  name="waktu"
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
                  name="harga" 
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