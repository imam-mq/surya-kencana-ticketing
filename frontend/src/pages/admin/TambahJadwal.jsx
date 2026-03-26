import React, { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

// --- IMPORT API ---
import { getAdminBusList, createAdminJadwal } from "../../api/adminApi";

const TambahJadwal = () => {
  const [form, setForm] = useState({ origin: "", destination: "", date: "", time: "", price: "", capacity: 28, status: "active", bus: "" });
  const [buses, setBuses] = useState([]);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingBus, setLoadingBus] = useState(true);

  // Fetch Bus via API Luar
  useEffect(() => {
    (async () => {
      try {
        setLoadingBus(true);
        const data = await getAdminBusList();
        setBuses(Array.isArray(data) ? data : []); 
      } catch (e) {
        setErr(`Error Load Bus: ${e.response?.data?.error || e.message}`);
        setBuses([]);
      } finally {
        setLoadingBus(false);
      }
    })();
  }, []);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.origin.trim()) return "Kota asal wajib diisi.";
    if (!form.destination.trim()) return "Kota tujuan wajib diisi.";
    if (!form.date) return "Tanggal wajib diisi.";
    if (!form.time) return "Jam wajib diisi.";
    if (!form.price || Number(form.price) <= 0) return "Harga tidak valid.";
    if (!form.capacity || Number(form.capacity) <= 0) return "Kapasitas tidak valid.";
    if (!form.bus) return "Pilih bus.";
    return "";
  };

  const onSubmit = async () => {
    const v = validate();
    if (v) { setErr(v); return; }
    setErr("");

    try {
      setSaving(true);
      const keberangkatan = `${form.date}T${form.time}`;
      const arrivalDate = new Date(keberangkatan);
      arrivalDate.setHours(arrivalDate.getHours() + 10);
      const kedatangan = arrivalDate.toISOString(); 

      const payload = {
        bus: Number(form.bus),
        asal: form.origin,
        tujuan: form.destination,
        waktu_keberangkatan: keberangkatan,
        waktu_kedatangan: kedatangan,
        harga: Number(form.price),
        status: form.status,
      };

      // Simpan menggunakan API Luar
      await createAdminJadwal(payload);

      alert("Jadwal berhasil ditambahkan!");
      window.location.href = "/admin/jadwaltiket"; // Redirect
    } catch (e) {
      console.error(e);
      setErr(`Gagal Simpan: ${e.response?.data?.detail || e.response?.data?.error || e.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />
        <div className="p-8">
          <h2 className="text-2xl font-semibold mb-6">Tambah Jadwal</h2>
          
          {err && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{err}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-lg">
            <div>
              <h3 className="font-semibold mb-4">Isi Rute Keberangkatan</h3>
              <div className="flex gap-4 mb-4">
                <input type="text" name="origin" value={form.origin} onChange={onChange} placeholder="Kota Asal" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input type="text" name="destination" value={form.destination} onChange={onChange} placeholder="Kota Tujuan" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <label className="block mb-2 font-medium">Bus</label>
              <select name="bus" value={form.bus} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4" disabled={loadingBus}>
                <option value="">{loadingBus ? "Memuat..." : "Pilih Bus"}</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>{b.nama} - {b.tipe} ({b.total_kursi} Kursi)</option>
                ))}
              </select>

              <label className="block mb-2 font-medium">Status</label>
              <select name="status" value={form.status} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
                <option value="canceled">Dibatalkan</option>
              </select>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Isi Jam Keberangkatan</h3>
              <div className="flex gap-4 mb-4">
                <input type="date" name="date" value={form.date} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                <input type="time" name="time" value={form.time} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <label className="block mb-2 font-medium">Harga Tiket</label>
              <div className="flex items-center gap-2 mb-4"><span className="font-semibold">Rp.</span><input type="number" name="price" value={form.price} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Masukkan harga" min="0" /></div>

              <label className="block mb-2 font-medium">Jumlah Kursi</label>
              <input type="number" name="capacity" value={form.capacity} onChange={onChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4" min="1" />

              <button onClick={onSubmit} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg font-semibold mt-6 w-full">
                {saving ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TambahJadwal;