import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../images/SK-Logo1.png";
import Sidebar_Agent from './layout/Sidebar_Agent';
import Agent_Navbar from './layout/Agent_Navbar';

// Komponen kursi — pastikan file ada di path ini
import SeatGridInline28 from "./kursi/SeatGridInline28";
import SeatGridSleeper from "./kursi/SeatGridSleeper";

// API base — sesuaikan bila backend path berbeda
const API = "http://127.0.0.1:8000/api/accounts";

const pickDestination = (trip) =>
  trip.destination ||
  trip.arrival_destination ||
  trip.arrivalDestination ||
  trip.arrival_destination_name ||
  trip.arrivalDestinationName ||
  "";

/**
 * Helper: parse harga dari berbagai format string/number
 * - Menghapus non-digit dan mengembalikan Number
 */
const parsePriceNumber = (priceStr) => {
  if (priceStr === null || priceStr === undefined) return 0;
  const cleaned = String(priceStr).replace(/[^\d.]/g, ""); // keep dot
  // Remove extra dots (e.g. "1.234.567.00") => keep the first dot as decimal separator
  const parts = cleaned.split(".");
  let normalized;
  if (parts.length <= 2) {
    normalized = cleaned;
  } else {
    // join all but last as integer, keep last as fractional (handle thousands dots)
    const frac = parts.pop();
    normalized = parts.join("") + "." + frac;
  }
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : 0;
};
/**
 * priceForTrip:
 * - Jika backend mengirim angka kecil (mis. 200) kita anggap itu 200k => dikali 1000
 * - Jika backend mengirim 200000 maka gunakan langsung
 */
const priceForTrip = (t) => {
  const raw = parsePriceNumber(t?.price ?? 0);
  if (!raw) return 0;
  // jika backend mengirim 200 (maks 3 digit), anggap format 'k' (200 => 200k)
  return raw < 1000 ? Math.round(raw * 1000) : Math.round(raw);
};

const TripCard = ({ trip, onToggleOpen }) => {
  const busName = trip.bus ? trip.bus.name : trip.title || "-";
  const busCode = trip.bus?.code || "";

  const availableSeats = Math.max(0, (trip.capacity ?? 0) - (trip.sold_seats ?? 0));
  const occupancyRate = Math.min(100, Math.round(((trip.sold_seats ?? 0) / (trip.capacity || 1)) * 100));

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
            {busCode && <p className="text-sm text-black-900 mt-0.5 font-semibold">{busCode}</p>}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Keberangkatan</h4>
            <p className="text-sm font-semibold text-gray-900">{trip.time?.slice(0, 5)}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{trip.origin}</p>
            <p className="text-xs text-gray-500">{trip.date}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Kedatangan</h4>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{pickDestination(trip)}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Harga</h4>
            <p className="text-base font-bold text-blue-600">
               Rp {priceForTrip(trip).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>

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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [openTripId, setOpenTripId] = useState(null);

  const [seatsMap, setSeatsMap] = useState({}); // { tripId: seatsArray | { lantaiAtas:[], lantaiBawah:[] } }
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({}); // { tripId: [ids] }

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
  try {
    setLoading(true);
    const res = await fetch(`${API}/jadwal/`, { credentials: "include" });
    const data = await res.json();
    setTrips(Array.isArray(data) ? data : []);
  } catch (e) {
    setErr("Gagal memuat jadwal");
  } finally {
    setLoading(false);
  }
};


  const search = async () => {
    try {
      setErr(""); setLoading(true);
      const params = new URLSearchParams();
      if (filters.origin) params.append("origin", filters.origin);
      if (filters.destination) params.append("destination", filters.destination);
      if (filters.date) params.append("date", filters.date);
      const res = await fetch(`${API}/jadwal/search/?${params.toString()}`, { credentials: "include" });
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

  // Fetch seats and normalize; detect sleeper payload regardless of trip.bus flag
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
        const atas = Array.isArray(atasRaw) ? atasRaw.map(normalize) : [];
        const bawah = Array.isArray(bawahRaw) ? bawahRaw.map(normalize) : [];
        setSeatsMap(prev => ({ ...prev, [tripId]: { lantaiAtas: atas, lantaiBawah: bawah } }));
        setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        return;
      }

      // inline expected array
      if (!Array.isArray(data)) {
        setSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        return;
      }

      const arr = data.map(normalize);
      setSeatsMap(prev => ({ ...prev, [tripId]: arr }));
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

  const trip = trips.find(t => t.id === tripId);
    console.log("DEBUG openTrip:", tripId, { rawPrice: trip?.price, parsedPrice: priceForTrip(trip), destinationCandidates: {
      destination: trip?.destination,
      arrival_destination: trip?.arrival_destination,
      arrivalDestination: trip?.arrivalDestination
    }});

    setTimeout(() => { const el = document.getElementById(`seat-panel-${tripId}`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 80);
  };


  // Toggle seat with duplicate protection (Set)
  const toggleSeat = (tripId, seatId) => {
    // update seatsMap selected flag
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

    // update selectedSeatsMap using Set to avoid duplicates
    setSelectedSeatsMap(prev => {
      const prevArr = Array.isArray(prev[tripId]) ? prev[tripId] : [];
      const set = new Set(prevArr);
      if (set.has(seatId)) set.delete(seatId);
      else set.add(seatId);
      return { ...prev, [tripId]: Array.from(set) };
    });
  };

  const handleProceed = (trip) => {
    const seats = selectedSeatsMap[trip.id] || [];
    if (!seats.length) return alert('Silakan pilih kursi terlebih dahulu');
    localStorage.setItem("agent_selected_seats", JSON.stringify({ tripId: trip.id, seats }));
    alert(`Lanjut ke pembayaran.\nJadwal #${trip.id}\nKursi: ${seats.join(', ')}\nTotal: Rp ${(seats.length * Number(trip.price || 0)).toLocaleString('id-ID')}`);
  };

  const submitAgentBooking = async (trip) => {
  try {
    const seats = selectedSeatsMap[trip.id] || [];
    if (!seats.length) {
      alert("Pilih kursi terlebih dahulu");
      return false;
    }

    // Gunakan fetch dengan credentials: "include" 
    // HAPUS header Authorization karena kita menggunakan Session
    const res = await fetch(`${API}/agent/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": ... <--- HAPUS BARIS INI
      },
      credentials: "include", // WAJIB: Agar Cookie Session & CSRF terkirim
      body: JSON.stringify({
        schedule_id: trip.id,
        seats,
        passengers: passengerData,
      }),
    });

    // Jika masih 401 setelah pakai credentials, berarti session expired
    if (res.status === 401) {
      alert("Sesi login habis, silakan login ulang.");
      return false;
    }

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Gagal booking");
      return false;
    }

    setIssuedTickets(data.tickets || []);
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

    // ✅ TUTUP POPUP KONFIRMASI DULU
    setShowConfirmPopup(false);

    // ✅ BARU TAMPILKAN LOADING
    setShowLoadingPopup(true);

    await delay(1000); // 1 detik

    const ok = await submitAgentBooking(activeTrip);

    setShowLoadingPopup(false);

    if (!ok) {
      // kalau gagal, balikin popup konfirmasi
      setShowConfirmPopup(true);
      return;
    }

    setShowSuccessPopup(true);
  };




  const [showPassengerPopup, setShowPassengerPopup] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  // data sementara
  const [activeTrip, setActiveTrip] = useState(null);
  const [issuedTickets, setIssuedTickets] = useState([]);

  const [passengerData, setPassengerData] = useState([]);

  //perubahan data penumpang
  const handlePassengerChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPassengerData = [...passengerData];
    updatedPassengerData[index] = { ...updatedPassengerData[index], [name]: value };
    setPassengerData(updatedPassengerData);
  };

  const handleAddPassenger = () => {
    setPassengerData([
      ...passengerData,
      {
        name : '',
        no_ktp : '',
        gender : '',
        phone : '',

      }
    ]);
  };


  const renderSeatGrid = (t) => {
    const data = seatsMap[t.id];
    if (data === undefined) return <div>Memuat kursi...</div>;

    // sleeper
    if (data && !Array.isArray(data) && (data.lantaiAtas || data.lantaiBawah)) {
      return <SeatGridSleeper seats={data} onToggleSeat={(sid) => toggleSeat(t.id, sid)} />;
    }

    // inline
    const arr = Array.isArray(data) ? data : [];
    const totalSeats = arr.length || t.capacity || 28;
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
              <p className="text-blue-100 text-sm mt-1">
                Lengkapi informasi penumpang sesuai kursi
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedSeatsMap[activeTrip.id]?.map((seat, index) => (
                <div key={index} className="border rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-gray-700">
                    Penumpang {index + 1} (Kursi {seat})
                  </h4>

                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.name || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />

                  <input
                    type="text"
                    name="no_ktp"
                    placeholder="No. KTP"
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
                    type="tel"
                    name="phone"
                    placeholder="No. HP"
                    className="w-full px-4 py-3 bg-gray-50 border rounded-xl"
                    value={passengerData[index]?.phone || ""}
                    onChange={(e) => handlePassengerChange(index, e)}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={() => setShowPassengerPopup(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
              >
                Batal
              </button>

              <button
                onClick={() => {
                  if (
                    passengerData.length !== (selectedSeatsMap[activeTrip.id]?.length || 0) ||
                    passengerData.some(
                      p => !p?.name || !p?.no_ktp || !p?.gender || !p?.phone
                    )
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
                {/* DETAIL PERJALANAN */}
                <div className="bg-blue-50 rounded-xl p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Detail Perjalanan</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600 font-medium">Bis</p>
                      <p className="font-bold text-gray-900">{activeTrip.bus?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Jam</p>
                      <p className="font-bold text-gray-900">{activeTrip.time?.slice(0, 5)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Keberangkatan</p>
                      <p className="font-bold text-gray-900">{activeTrip.origin}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">Kedatangan</p>
                      <p className="font-bold text-gray-900">{pickDestination(activeTrip)}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-dashed border-gray-300"></div>

                {/* DATA PENUMPANG (UPDATED – MULTI) */}
                <div className="bg-purple-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-3">Data Penumpang</h3>

                  <div className="space-y-2">
                    {passengerData.map((p, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-extrabold text-gray-900">
                            {p.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Kursi: {selectedSeatsMap[activeTrip.id]?.[index]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTAL */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Pembayaran</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedSeatsMap[activeTrip.id]?.length || 0} kursi × Rp{" "}
                        {priceForTrip(activeTrip).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="text-3xl font-extrabold text-green-600">
                      Rp{" "}
                      {(
                        (selectedSeatsMap[activeTrip.id]?.length || 0) *
                        priceForTrip(activeTrip)
                      ).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center italic">
                  Klik konfirmasi jika sudah menerima pembayaran
                </p>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setShowConfirmPopup(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={showLoadingPopup}
                  className={`px-4 py-2 rounded ${
                    showLoadingPopup ? "opacity-50 cursor-not-allowed" : ""
                  }`}
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
              <p className="text-gray-600 text-sm">Mohon tunggu sebentar</p>
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
                <p className="text-gray-600 mb-6">Tiket telah berhasil diterbitkan dan siap untuk dicetak</p>

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
                      // navigate('/agent/tiket-terbit');
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    Lihat Tiket Terbit
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setPassengerData({ name: "", no_ktp: "", phone: "", gender: "" });
                      setOpenTripId(null);
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

        <div className="max-w-6xl mx-auto px-4 py-10">
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
                      <div id={`seat-panel-${t.id}`} className="mt-4 bg-gray-50 p-6 rounded-lg border">
                        <div className="bg-blue-800 text-white px-3 py-2 rounded mb-4">Klik pilihan kursi yang tersedia kemudian lanjut ke bagian pembayaran</div>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            { renderSeatGrid(t) }
                          </div>

                          <div className="w-full md:w-64">
                            <div className="bg-white p-4 rounded-md shadow-md space-y-4">
                              <h4 className="font-semibold text-sm text-gray-800">Keberangkatan</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span className="font-medium text-gray-800">{t.origin}</span>
                                  <span className="text-gray-700">{t.time?.slice(0,5)}</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-gray-800">Kedatangan</h4>
                                <div className="flex justify-between text-sm text-gray-600"><span className="font-medium text-gray-800">{t.destination}</span><span className="text-gray-700"></span></div>
                              </div>

                              <div>
                                <div className="text-sm font-medium text-gray-600">Nomor Tempat Duduk</div>
                                <div className="text-xl font-bold text-gray-800">{(selectedSeatsMap[t.id] || []).join(", ") || "-"}</div>
                              </div>

                              <div className="border-t border-gray-300 my-4"></div>

                              <div>
                                <div className="text-sm font-medium text-gray-600">Detail Harga</div>
                                <div className="text-lg font-bold text-gray-800">
                                  Rp { ((selectedSeatsMap[t.id]?.length || 0) * priceForTrip(t)).toLocaleString('id-ID') }
                                </div>
                              </div>

                              <div className="pt-4 flex gap-2">
                                <button onClick={() => setOpenTripId(null)} className="flex-1 border border-gray-300 py-1.5 rounded-md text-xs hover:bg-gray-50 transition">Tutup</button>
                                <button
                                  onClick={() => {
                                    if (!(selectedSeatsMap[t.id] || []).length) {
                                      alert("Silakan pilih kursi terlebih dahulu");
                                      return;
                                    }
                                    setActiveTrip(t);
                                    setShowPassengerPopup(true);
                                  }}
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md text-xs transition"
                                >
                                  Konfirmasi & Terbitkan Tiket
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
                  <div className="p-4 text-center text-gray-500 bg-white rounded">Jadwal untuk destinasi ini belum tersedia.</div>
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
