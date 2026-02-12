import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";

const API = "http://127.0.0.1:8000/api/accounts";

const EditJadwal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
    price: "",
    capacity: 28,
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
        // load buses
        try {
          const rb = await fetch(`${API}/admin/bus/`);
          const jb = await rb.json();
          setBuses(Array.isArray(jb) && jb.length ? jb : []);
        } catch {
          setBuses([]);
        }
        // load schedule
        const rs = await fetch(`${API}/admin/jadwal/${id}/`);
        if (!rs.ok) throw new Error(`HTTP ${rs.status}`);
        const s = await rs.json();
        setForm({
          origin: s.origin || "",
          destination: s.destination || "",
          date: s.date || "",
          time: (s.time || "").slice(0,5),
          price: s.price || "",
          capacity: s.capacity ?? 28,
          status: s.status || "active",
          bus: s.bus?.id || "",
        });
      } catch (e) {
        setErr(e.message || "Gagal memuat data");
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
        origin: form.origin,
        destination: form.destination,
        date: form.date,
        time: form.time,
        price: Number(form.price),
        capacity: Number(form.capacity),
        status: form.status,
        bus: Number(form.bus),
      };
      const res = await fetch(`${API}/admin/jadwal/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors ? JSON.stringify(data.errors) : (data?.error || `HTTP ${res.status}`));
      alert("Perubahan jadwal berhasil disimpan!");
      navigate("/admin/jadwaltiket");
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
          <h2 className="text-2xl font-semibold mb-6">Edit Jadwal</h2>
          {err && <div className="mb-4 text-red-600">{err}</div>}
          {loading ? (
            <div className="p-4 text-gray-600">Loading...</div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md"
            >
              <div>
                <label className="block font-medium mb-1">Kota Asal</label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Kota Tujuan</label>
                <input
                  type="text"
                  name="destination"
                  value={form.destination}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Waktu</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Harga Tiket</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Nama Bus</label>
                <select
                  name="bus"
                  value={form.bus}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="">Pilih Bus</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}{b.code ? ` [${b.code}]` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="w-full border-gray-300 rounded-md shadow-sm p-2"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="canceled">Dibatalkan</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md disabled:opacity-60"
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
