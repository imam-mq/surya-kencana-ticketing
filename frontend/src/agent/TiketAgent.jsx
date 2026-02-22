import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../images/SK-Logo1.png";
import Sidebar_Agent from './layout/Sidebar_Agent';
import Agent_Navbar from './layout/Agent_Navbar';

// Komponen kursi — pastikan file ada di path ini
import SeatGridInline28 from "./kursi/SeatGridInline28";
import SeatGridSleeper from "./kursi/SeatGridSleeper";

const API = "http://127.0.0.1:8000/api/accounts";

const TripCard = ({ trip, onToggleOpen }) => {
  // Parsing Tanggal & Jam dari Backend
  const dateObj = new Date(trip.waktu_keberangkatan);
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const busName = trip.bus_name || "-";
  const busCode = trip.bus_type || "";

  // 🔥 PERUBAHAN DI SINI: Baca kapasitas dan terjual langsung dari Backend
  const capacity = trip.kapasitas || 28; 
  const soldSeats = trip.terjual || 0; 
  const availableSeats = Math.max(0, capacity - soldSeats);
  const occupancyRate = Math.min(100, Math.round((soldSeats / capacity) * 100));

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onToggleOpen(trip.id)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
        <div className="flex items-center gap-3 min-w-[180px]">
          <img src={LogoSK1} alt="logo" className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{busName}</h3>
            {busCode && <p className="text-sm text-blue-600 mt-0.5 font-semibold">{busCode}</p>}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Keberangkatan</h4>
            <p className="text-sm font-semibold text-gray-900">{timeStr}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{trip.asal}</p>
            <p className="text-xs text-gray-500">{dateStr}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Kedatangan</h4>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{trip.tujuan}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Harga</h4>
            <p className="text-base font-bold text-blue-600">
               Rp {Number(trip.harga || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <div className="text-center">
            {/* 🔥 Angka ini akan otomatis berkurang kalau ada yang booking */}
            <p className="text-sm font-bold text-gray-900">{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>

          {/* 🔥 Progress bar ini juga akan otomatis maju sesuai tiket terjual */}
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyRate >= 80 ? "bg-red-500" : occupancyRate >= 50 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleOpen(trip.id); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition"
          >
            Lihat Tempat Duduk
          </button>
        </div>
      </div>
    </div>
  );
};

const TiketAgent = () => {
  const [filters, setFilters] = useState({ origin: "", destination: "", date: "" });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [openTripId, setOpenTripId] = useState(null);

  const [seatsMap, setSeatsMap] = useState({});
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({});

  useEffect(() => { loadAll(); }, []);

  // 🔥 1. UBAH KE ENDPOINT SEARCH BARU
  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/schedule/search/`, { credentials: "include" });
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 2. UBAH PARAMETER PENCARIAN (asal, tujuan, tanggal)
  const search = async () => {
    try {
      setErr(""); setLoading(true);
      const params = new URLSearchParams();
      if (filters.origin) params.append("asal", filters.origin);
      if (filters.destination) params.append("tujuan", filters.destination);
      if (filters.date) params.append("tanggal", filters.date);
      
      const res = await fetch(`${API}/schedule/search/?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
      setOpenTripId(null);
    } catch (e) {
      setErr(e.message || "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const fetchAndStoreSeats = async (tripId) => {
    try {
      const res = await fetch(`${API}/jadwal/${tripId}/seats/`, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const looksLikeSleeper = data && (data.lantai_atas || data.lantai_bawah || data.lantaiAtas || data.lantaiBawah);

      const normalize = (s) => ({
        id: s.id || s.seat_id,
        row: s.row || (s.id ? String(s.id).charAt(0) : ""),
        col: s.col !== undefined ? Number(s.col) : (() => {
          const m = (s.id || "").toString().match(/^[A-Z]+(\d+)$/i);
          return m ? Number(m[1]) : 0;
        })(),
        available: s.available === undefined ? true : !!s.available,
        selected: false
      });

      if (looksLikeSleeper) {
        const atasRaw = data.lantai_atas || data.lantaiAtas || [];
        const bawahRaw = data.lantai_bawah || data.lantaiBawah || [];
        setSeatsMap(prev => ({ ...prev, [tripId]: { lantaiAtas: atasRaw.map(normalize), lantaiBawah: bawahRaw.map(normalize) } }));
      } else {
        const arr = Array.isArray(data) ? data.map(normalize) : [];
        setSeatsMap(prev => ({ ...prev, [tripId]: arr }));
      }
      setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
    } catch (e) {
      console.error("fetch seats error", e);
      setSeatsMap(prev => ({ ...prev, [tripId]: [] }));
      setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
    }
  };

  const toggleOpen = async (tripId) => {
    if (openTripId === tripId) { setOpenTripId(null); return; }
    setOpenTripId(tripId);
    if (!seatsMap[tripId]) await fetchAndStoreSeats(tripId);
    setTimeout(() => { const el = document.getElementById(`seat-panel-${tripId}`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 80);
  };

  const toggleSeat = (tripId, seatId) => {
    setSeatsMap(prev => {
      const copy = { ...prev };
      const cur = copy[tripId];
      if (!cur) return prev;

      if (!Array.isArray(cur) && (cur.lantaiAtas || cur.lantaiBawah)) {
        const upd = (arr) => (arr || []).map(s => s.id === seatId ? { ...s, selected: !s.selected } : s);
        copy[tripId] = { lantaiAtas: upd(cur.lantaiAtas), lantaiBawah: upd(cur.lantaiBawah) };
        return copy;
      }

      if (Array.isArray(cur)) {
        copy[tripId] = cur.map(s => s.id === seatId ? { ...s, selected: !s.selected } : s);
        return copy;
      }
      return prev;
    });

    setSelectedSeatsMap(prev => {
      const prevArr = Array.isArray(prev[tripId]) ? prev[tripId] : [];
      const set = new Set(prevArr);
      if (set.has(seatId)) set.delete(seatId);
      else set.add(seatId);
      return { ...prev, [tripId]: Array.from(set) };
    });
  };

  // 🔥 3. MAPPING PAYLOAD BOOKING AGENT
  const submitAgentBooking = async (trip) => {
    try {
      const seats = selectedSeatsMap[trip.id] || [];
      if (!seats.length) {
        alert("Pilih kursi terlebih dahulu");
        return false;
      }

      // Mapping data penumpang dari React ke format Backend (Django)
      const mappedPassengers = passengerData.map(p => ({
        nama: p.name,
        ktp: p.no_ktp,
        hp: p.phone,
        jk: p.gender === "Perempuan" ? "P" : "L"
      }));

      const payload = {
        jadwal_id: trip.id,
        seats: seats,
        passengers: mappedPassengers
      };

      const res = await fetch(`${API}/booking/agent/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        alert("Sesi login habis, silakan login ulang.");
        return false;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || JSON.stringify(data) || "Gagal booking");
        return false;
      }

      setIssuedTickets(data.kode_booking || []);
      return true;

    } catch (err) {
      console.error("Detail Error:", err);
      alert("Koneksi bermasalah");
      return false;
    }
  };

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const handleConfirmBooking = async () => {
    if (!activeTrip) return;
    setShowConfirmPopup(false);
    setShowLoadingPopup(true);
    
    await delay(1000); 
    const ok = await submitAgentBooking(activeTrip);
    
    setShowLoadingPopup(false);
    if (!ok) {
      setShowConfirmPopup(true);
      return;
    }
    setShowSuccessPopup(true);
  };

  const [showPassengerPopup, setShowPassengerPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  const [activeTrip, setActiveTrip] = useState(null);
  const [issuedTickets, setIssuedTickets] = useState([]);
  const [passengerData, setPassengerData] = useState([]);

  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengerData = [...passengerData];
    updatedPassengerData[index] = { ...updatedPassengerData[index], [name]: value };
    setPassengerData(updatedPassengerData);
  };

  const renderSeatGrid = (t) => {
    const data = seatsMap[t.id];
    if (data === undefined) return <div>Memuat kursi...</div>;

    if (data && !Array.isArray(data) && (data.lantaiAtas || data.lantaiBawah)) {
      return <SeatGridSleeper seats={data} onToggleSeat={(sid) => toggleSeat(t.id, sid)} />;
    }

    const arr = Array.isArray(data) ? data : [];
    const totalSeats = arr.length || 28;
    if (totalSeats <= 22) return <SeatGridSleeper seats={arr} onToggleSeat={(sid) => toggleSeat(t.id, sid)} />;
    return <SeatGridInline28 seats={arr} onToggleSeat={(sid) => toggleSeat(t.id, sid)} />;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar_Agent />

      <div className="flex-1 flex flex-col">
        <Agent_Navbar />

        {/* ===== POPUP 1: DATA PENUMPANG ===== */}
        {showPassengerPopup && activeTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 rounded-t-2xl">
              <h2 className="text-2xl font-extrabold text-white">Data Penumpang</h2>
              <p className="text-blue-100 text-sm mt-1">Lengkapi informasi penumpang sesuai kursi</p>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedSeatsMap[activeTrip.id]?.map((seat, index) => (
                <div key={index} className="border rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-gray-700">Penumpang {index + 1} (Kursi {seat})</h4>
                  <input
                    type="text" name="name" placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.name || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                  <input
                    type="text" name="no_ktp" placeholder="No. KTP"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.no_ktp || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                  <select
                    name="gender"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.gender || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <input
                    type="tel" name="phone" placeholder="No. HP"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.phone || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowPassengerPopup(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                Batal
              </button>
              <button
                onClick={() => {
                  if (
                    passengerData.length !== (selectedSeatsMap[activeTrip.id]?.length || 0) ||
                    passengerData.some(p => !p?.name || !p?.no_ktp || !p?.gender || !p?.phone)
                  ) {
                    alert("Mohon lengkapi semua data penumpang");
                    return;
                  }
                  setShowPassengerPopup(false);
                  setShowConfirmPopup(true);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold"
              >
                Simpan dan Lanjut
              </button>
            </div>
          </div>
        </div>
      )}

        {/* ===== POPUP 2: KONFIRMASI ===== */}
        {showConfirmPopup && activeTrip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 rounded-t-2xl">
                <h2 className="text-2xl font-extrabold text-white">Konfirmasi Pemesanan</h2>
                <p className="text-green-100 text-sm mt-1">Periksa kembali detail pemesanan</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-blue-50 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Detail Perjalanan</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Bis</p>
                      <p className="font-bold text-gray-900">{activeTrip.bus_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Jam</p>
                      <p className="font-bold text-gray-900">{new Date(activeTrip.waktu_keberangkatan).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Keberangkatan</p>
                      <p className="font-bold text-gray-900">{activeTrip.asal}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Kedatangan</p>
                      <p className="font-bold text-gray-900">{activeTrip.tujuan}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-300"></div>

                <div className="bg-purple-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Data Penumpang</h3>
                  <div className="space-y-2">
                    {passengerData.map((p, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-extrabold text-gray-900">{p.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Kursi: {selectedSeatsMap[activeTrip.id]?.[index]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Pembayaran</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedSeatsMap[activeTrip.id]?.length || 0} kursi × Rp{" "}
                        {Number(activeTrip.harga || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="text-3xl font-extrabold text-green-600">
                      Rp{" "}
                      {((selectedSeatsMap[activeTrip.id]?.length || 0) * Number(activeTrip.harga || 0)).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center italic">
                  Klik konfirmasi jika sudah menerima pembayaran
                </p>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setShowConfirmPopup(false)} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                  Batal
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={showLoadingPopup}
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg ${showLoadingPopup ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {showLoadingPopup ? "Memproses..." : "Konfirmasi & Terbitkan Tiket"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== POPUP 3: LOADING ===== */}
        {showLoadingPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center w-full max-w-sm">
              <div className="w-20 h-20 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Memproses Pemesanan...</h3>
              <p className="text-gray-600 text-sm">Mohon tunggu sebentar, sedang menghitung komisi</p>
            </div>
          </div>
        )}

        {/* ===== POPUP 4: SUCCESS ===== */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="pt-8 pb-4 text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="px-8 pb-8 text-center">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">Pemesanan Tiket Berhasil!</h3>
                <p className="text-gray-600 mb-6">Tiket telah diterbitkan dan komisi telah dicatat ke akun Anda.</p>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-blue-600">
                      {activeTrip ? (selectedSeatsMap[activeTrip.id] || []).length : 0}
                    </span> tiket telah diterbitkan
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      // navigate('/agent/tiket-terbit'); // Bisa di-uncomment nanti
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    Lihat Tiket Terbit
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setPassengerData([]); // Reset data penumpang
                      setOpenTripId(null);
                      setSelectedSeatsMap({}); // Reset kursi
                    }}
                    className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Buat Pemesanan Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UTAMA */}
        <div className="max-w-6xl mx-auto px-4 py-10 w-full">
          <h2 className="text-2xl font-semibold mb-6">Pencarian Jadwal Tiket Agen</h2>

          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 border-r pr-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Jenis Bus</h3>
              <div className="border-t border-gray-300 my-3"></div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 text-sm"><input type="checkbox" defaultChecked /> Surya SK</label>
                <label className="flex items-center gap-2 text-gray-700 text-sm"><input type="checkbox" /> Sleeper VIP</label>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full lg:w-1/4">
                  <FaBus className="text-gray-500 mr-2" />
                  <input type="text" placeholder="Dari" value={filters.origin} onChange={(e)=>setFilters(s=>({...s, origin: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
                </div>
                <FaArrowRight className="hidden lg:block text-gray-500" />
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full lg:w-1/4">
                  <FaBus className="text-gray-500 mr-2" />
                  <input type="text" placeholder="Ke" value={filters.destination} onChange={(e)=>setFilters(s=>({...s, destination: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full lg:w-1/4">
                  <FaCalendarAlt className="text-gray-500 mr-2" />
                  <input type="date" value={filters.date} onChange={(e)=>setFilters(s=>({...s, date: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
                </div>
                <button onClick={search} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-semibold w-full lg:w-auto">{loading ? 'Mencari...' : 'Cari Bus'}</button>
              </div>

              {err && <div className="text-red-600 text-sm mb-3">Error: {err}</div>}

              <div className="space-y-4">
                {trips.map(t => (
                  <div key={t.id}>
                    <TripCard trip={t} onToggleOpen={toggleOpen} />

                    {openTripId === t.id && (
                      <div id={`seat-panel-${t.id}`} className="mt-4 bg-gray-50 p-6 rounded-lg border shadow-inner">
                        <div className="bg-blue-800 text-white px-3 py-2 rounded mb-4 shadow-sm text-sm">Klik pilihan kursi yang tersedia kemudian lanjut ke bagian pembayaran</div>
                        <div className="flex flex-col md:flex-row gap-6">
                          
                          <div className="flex-1 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            { renderSeatGrid(t) }
                          </div>

                          <div className="w-full md:w-64">
                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-4 sticky top-4">
                              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wider text-center border-b pb-2">Rincian Tiket</h4>
                              
                              <div className="space-y-2">
                                <div className="text-xs text-gray-500 font-semibold uppercase">Rute</div>
                                <div className="flex justify-between text-sm text-gray-800 font-medium bg-gray-50 p-2 rounded">
                                  <span>{t.asal}</span>
                                  <FaArrowRight className="text-gray-400 mt-1 mx-1"/>
                                  <span>{t.tujuan}</span>
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Kursi Dipilih</div>
                                <div className="text-lg font-bold text-blue-600 bg-blue-50 p-2 rounded text-center">
                                  {(selectedSeatsMap[t.id] || []).join(", ") || "Belum dipilih"}
                                </div>
                              </div>

                              <div>
                                <div className="text-xs text-gray-500 font-semibold uppercase mb-1">Total Bayar</div>
                                <div className="text-xl font-black text-green-600 bg-green-50 p-2 rounded text-center">
                                  Rp { ((selectedSeatsMap[t.id]?.length || 0) * Number(t.harga || 0)).toLocaleString('id-ID') }
                                </div>
                              </div>

                              <div className="pt-2">
                                <button
                                  onClick={() => {
                                    if (!(selectedSeatsMap[t.id] || []).length) {
                                      alert("Silakan pilih kursi terlebih dahulu");
                                      return;
                                    }
                                    
                                    // Set data penumpang kosong sesuai jumlah kursi
                                    const seatCount = selectedSeatsMap[t.id].length;
                                    const initialPassengers = Array(seatCount).fill({ name: "", no_ktp: "", phone: "", gender: "" });
                                    setPassengerData(initialPassengers);

                                    setActiveTrip(t);
                                    setShowPassengerPopup(true);
                                  }}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
                                >
                                  Proses Tiket
                                </button>
                                <button onClick={() => setOpenTripId(null)} className="w-full mt-2 text-gray-500 text-xs hover:text-gray-800 transition underline">
                                  Tutup Panel Kursi
                                </button>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {!loading && trips.length === 0 && (
                  <div className="p-10 text-center text-gray-500 bg-white border-2 border-dashed border-gray-300 rounded-xl">
                    <FaBus className="mx-auto text-4xl mb-3 text-gray-300"/>
                    <p className="font-semibold text-lg">Jadwal Bus Tidak Ditemukan</p>
                    <p className="text-sm mt-1">Coba cari dengan rute atau tanggal yang berbeda.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TiketAgent;