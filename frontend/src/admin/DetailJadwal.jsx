import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import AdminNavbar from "./layout/AdminNavbar";
import { FaArrowLeft } from "react-icons/fa";

const API = "http://127.0.0.1:8000/api/accounts";

const DetailJadwal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/admin/jadwal/${id}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setErr(e.message || "Gagal memuat detail");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const sold = data?.sold_seats ?? 0;
  const total = data?.capacity ?? 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1">
        <AdminNavbar />

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg flex items-center gap-2"
              >
                <FaArrowLeft /> Kembali
              </button>
              <h2 className="text-2xl font-semibold">Detail Jadwal</h2>
            </div>
          </div>

          {err && <div className="text-red-600 mb-4">{err}</div>}
          {loading || !data ? (
            <div className="p-4 text-gray-600">Loading...</div>
          ) : (
            <>
              <div className="bg-white p-6 rounded-xl shadow-sm border borde-gray-200 mb-8">
                <div className="space-y-3">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Rute Keberangkatan</p>
                    <p className="text-gray-800">{data.origin}</p>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Rute Kedatangan</p>
                    <p className="text-gray-800">{data.destination}</p>
                  </div>

                  {/* Row 3 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Nama Bus</p>
                    <p className="text-gray-800">
                      {data.bus ? `${data.bus.name}${data.bus.code ? ` [${data.bus.code}]` : ""}` : "-"}
                    </p>
                  </div>

                  {/* Row 4 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Kursi Terjual</p>
                    <p className="text-gray-800">{sold}</p>
                  </div>

                  {/* Row 5 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Total Kursi</p>
                    <p className="text-gray-800">{total}</p>
                  </div>

                  {/* Row 6 */}
                  <div className="grid grid-cols-2">
                    <p className="font-medium text-gray-700">Status</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${data.status === "active" ? "bg-green-500" : data.status === "inactive" ? "bg-yellow-500" : "bg-red-500"}`}></span>
                      <span className="capitalize text-gray-800">{data.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Daftar Penumpang</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr className="border-b border-gray-300">
                        <th className="p-3 text-left">No</th>
                        <th className="p-3 text-left">Nama</th>
                        <th className="p-3 text-left">No. Kursi</th>
                        <th className="p-3 text-left">Harga</th>
                        <th className="p-3 text-left">Status Bayar</th>
                        <th className="p-3 text-left">Dibeli Oleh</th>
                        <th className="p-3 text-left">Waktu Beli</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.tickets || []).map((t, idx) => (
                        <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-3">{idx + 1}</td>
                          <td className="p-3">{t.buyer_name || "-"}</td>
                          <td className="p-3">{t.seat_id}</td>
                          <td className="p-3">Rp {Number(t.price_paid || 0).toLocaleString("id-ID")}</td>
                          <td className="p-3 capitalize">{t.payment_status}</td>
                          <td className="p-3 capitalize">{t.bought_by}</td>
                          <td className="p-3">{new Date(t.purchased_at).toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                      {(!data.tickets || !data.tickets.length) && (
                        <tr><td colSpan={7} className="p-3 text-center text-gray-500">Belum ada tiket terjual.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailJadwal;
