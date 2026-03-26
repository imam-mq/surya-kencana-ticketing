import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../images/SK-Logo1.png";
import SeatGridInline28 from "./kursi/SeatGridInline28";
import SeatGridSleeper from "./kursi/SeatGridSleeper";
import Checkout from "./checkout/Checkout";


const API = "http://127.0.0.1:8000/api/accounts";

const TripCard = ({ trip, onToggleOpen }) => {
  // variabel dengan serializer
  const busName = trip.bus_name || "Bus Dihapus";
  const busCode = trip.bus_type || "";

  const capacity = trip.kapasitas || 28;
  const sold = trip.terjual || 0;
  const availableSeats = Math.max(0, capacity - sold);
  const occupancyRate = Math.min(100, Math.round((sold / capacity) * 100));

  // Datetime dari Backend
  const dateObj = trip.waktu_keberangkatan ? new Date(trip.waktu_keberangkatan) : new Date();
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  // cek kondisi
  const isExpired = dateObj < new Date();
  const isFull = availableSeats <= 0 || trip.status === "sold_out";
  const isDisabled = isExpired || isFull;

  let statusText = "Pilih Kursi";
  let buttonClass = "bg-blue-600 hover:bg-blue-700 text-white";
  let cardClass = "border-gray-200 hover:shadow-md cursor-pointer";

  if (isExpired) {
    // kondisi jika bus sudah jalan dan melewati waktu keberangkatan
    statusText = "Sudah Berangkat";
    buttonClass = "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300";
    cardClass = "border-gray-200 opacity-60 grayscale cursor-not-allowed";
  } else if (isFull) {
    // kondisi jika bus belum jalan tapi sudah penuh
    statusText = "Tiket Habis";
    buttonClass = "bg-red-50 text-red-500 cursor-not-allowed border border-red-200";
    cardClass = "border-red-200 opacity-90 cursor-not-allowed";
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border transition-all duration-300 overflow-hidden ${cardClass}`} 
      onClick={() => !isDisabled && onToggleOpen(trip.id)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
        
        {/* Info Bus */}
        <div className="flex items-center gap-3 min-w-[180px] md:mt-[-10px]">
          <img src={LogoSK1} alt="logo" className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{busName}</h3>
            {busCode && (
              <p className="text-sm text-gray-600 mt-0.5 font-semibold">{busCode}</p>
            )}
          </div>
        </div>

        {/* Detail Perjalanan */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Keberangkatan</h4>
            <p className="text-sm font-semibold text-gray-900">{timeStr} WITA</p>
            <p className="text-xs text-gray-600 line-clamp-2">{trip.asal}</p>
            <p className="text-xs text-blue-600 font-medium">{dateStr}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Kedatangan</h4>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{trip.tujuan}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Harga</h4>
            <p className={`text-base font-bold ${isFull ? 'text-gray-400 line-through' : 'text-blue-600'}`}>
              Rp {Number(trip.harga || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/*Kursi & Tombol */}
        <div className="flex flex-col items-center gap-2 min-w-[120px]">
          <div className="text-center">
            <p className={`text-sm font-bold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>

          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? "bg-red-600"
                  : occupancyRate >= 80
                  ? "bg-red-500"
                  : occupancyRate >= 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>

          <button
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              onToggleOpen(trip.id);
            }}
            className={`w-full font-semibold py-2 px-3 rounded-lg text-xs transition ${buttonClass}`}
          >
            {statusText}
          </button>
        </div>

      </div>
    </div>
  );
};


const Tiket = () => {
  const [filters, setFilters] = useState({ origin: "", destination: "", date: "" });
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [openTripId, setOpenTripId] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);

  const [seatsMap, setSeatsMap] = useState({});
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/jadwal/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setErr(err.message);
    } finally { setLoading(false); }
  };

  const search = async () => {
    try {
      setErr(""); setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.origin) params.append("asal", filters.origin);
      if (filters.destination) params.append("tujuan", filters.destination);
      if (filters.date) params.append("tanggal", filters.date);
      
      const res = await fetch(`${API}/jadwal/?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
      setOpenTripId(null);
    } catch (e) { setErr(e.message || "Gagal memuat jadwal"); } finally { setLoading(false); }
  };

  const fetchAndStoreSeats = async (tripId, isSleeperFlag) => {
    try {
      const res = await fetch(`${API}/jadwal/${tripId}/seats/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const looksLikeSleeper = data && (data.lantai_atas || data.lantai_bawah);

      if (isSleeperFlag || looksLikeSleeper) {
        const atas = Array.isArray(data.lantai_atas) ? data.lantai_atas : [];
        const bawah = Array.isArray(data.lantai_bawah) ? data.lantai_bawah : [];
        const mapSeat = (s) => ({ ...s, selected: !!s.selected, available: s.available !== false });
        setSeatsMap(prev => ({ ...prev, [tripId]: { lantaiAtas: atas.map(mapSeat), lantaiBawah: bawah.map(mapSeat) } }));
        setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        return;
      }

      if (!Array.isArray(data)) {
        setSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        return;
      }

      const mapped = data.map(s => ({ ...s, selected: !!s.selected, available: s.available !== false }));
      setSeatsMap(prev => ({ ...prev, [tripId]: mapped }));
      setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
    } catch (e) {
      console.error("fetch seats error", e);
      setSeatsMap(prev => ({ ...prev, [tripId]: isSleeperFlag ? { lantaiAtas: [], lantaiBawah: [] } : [] }));
      setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
    }
  };

  const toggleOpen = async (tripId) => {
    if (openTripId === tripId) { setOpenTripId(null); return; }
    setOpenTripId(tripId);
    const trip = trips.find(t => t.id === tripId);
    const isSleeper = trip?.bus_type?.toLowerCase().includes('sleeper');
    
    if (!seatsMap[tripId]) await fetchAndStoreSeats(tripId, isSleeper);
    setTimeout(() => { const el = document.getElementById(`seat-panel-${tripId}`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 80);
  };

  const toggleSeat = (tripId, seatId) => {
    setSeatsMap(prev => {
      const copy = { ...prev };
      const cur = copy[tripId];
      if (cur && cur.lantaiAtas && cur.lantaiBawah) {
        const up = (arr) => arr.map(s => s.id === seatId ? { ...s, selected: !s.selected } : s);
        copy[tripId] = { lantaiAtas: up(cur.lantaiAtas), lantaiBawah: up(cur.lantaiBawah) };
        return copy;
      }
      if (Array.isArray(cur)) {
        copy[tripId] = cur.map(s => s.id === seatId ? { ...s, selected: !s.selected } : s);
        return copy;
      }
      return prev;
    });

    setSelectedSeatsMap(prev => {
      const arr = prev[tripId] || [];
      if (arr.includes(seatId)) return { ...prev, [tripId]: arr.filter(x => x !== seatId) };
      return { ...prev, [tripId]: [...arr, seatId] };
    });
  };

  const handleProceed = (trip) => {
    const seats = selectedSeatsMap[trip.id] || [];
    if (!seats.length) return alert('Silakan pilih kursi terlebih dahulu');
    setCheckoutData({ trip, seats });
  };

  if (checkoutData) {
    return <Checkout data={checkoutData} onBack={() => setCheckoutData(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-blue-600 font-medium">Beranda</span> / <span className="text-blue-600 font-medium">Ticket</span> / <span className="text-gray-800 font-semibold">Pencarian Jadwal</span>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Pencarian Jadwal Keberangkatan</h2>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-6 border border-gray-100">
          <div className="w-full md:w-1/6 border-r pr-6">
            
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Jenis Bus</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 text-sm"><input type="checkbox" defaultChecked /> Surya SK</label>
              <label className="flex items-center gap-2 text-gray-700 text-sm"><input type="checkbox" /> Sleeper VIP</label>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full lg:w-1/4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaBus className="text-gray-400 mr-2" />
                <input type="text" placeholder="Kota Asal" value={filters.origin} onChange={(e)=>setFilters(s=>({...s, origin: e.target.value}))} className="bg-transparent outline-none w-full text-sm text-gray-800" />
              </div>
              <FaArrowRight className="hidden lg:block text-gray-400" />
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full lg:w-1/4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaBus className="text-gray-400 mr-2" />
                <input type="text" placeholder="Kota Tujuan" value={filters.destination} onChange={(e)=>setFilters(s=>({...s, destination: e.target.value}))} className="bg-transparent outline-none w-full text-sm text-gray-800" />
              </div>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full lg:w-1/4 focus-within:ring-2 focus-within:ring-blue-500">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <input type="date" value={filters.date} onChange={(e)=>setFilters(s=>({...s, date: e.target.value}))} className="bg-transparent outline-none w-full text-sm text-gray-800" />
              </div>
              <button onClick={search} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold w-full lg:w-auto transition shadow-sm">
                {loading ? 'Mencari...' : 'Cari Bus'}
              </button>
            </div>

            {err && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm mb-4 border border-red-100">{err}</div>}

            <div className="space-y-4">
              {trips.map(t => (
                <div key={t.id}>
                  <TripCard trip={t} onToggleOpen={toggleOpen} />

                  {openTripId === t.id && (
                    <div id={`seat-panel-${t.id}`} className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
                      <div className="bg-blue-800 text-white px-4 py-2 rounded-md mb-6 text-sm font-medium shadow-sm">
                        Klik pilihan kursi yang tersedia kemudian lanjut ke bagian pembayaran
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8">
                        {/* Area Kursi Kiri */}
                        <div className="flex-1 overflow-x-auto pb-4">
                          {seatsMap[t.id]?.lantaiAtas ? (
                            <SeatGridSleeper seats={seatsMap[t.id]} onToggleSeat={(seatId)=>toggleSeat(t.id, seatId)}/>
                          ) : (
                            <SeatGridInline28 seats={seatsMap[t.id] || []} onToggleSeat={(seatId)=>toggleSeat(t.id, seatId)}/>
                          )}
                        </div>

                        {/* Kotak Rincian Kanan */}
                        <div className="w-full md:w-72">
                          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-4">
                            
                            <div className="space-y-1 mb-4">
                              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Keberangkatan</h4>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-900 text-sm">{t.asal}</span>
                                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded text-xs">
                                  {new Date(t.waktu_keberangkatan).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-1 mb-5">
                              <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Kedatangan</h4>
                              <div className="font-bold text-gray-900 text-sm">{t.tujuan}</div>
                            </div>

                            <div className="border-t border-dashed border-gray-300 my-4"></div>

                            <div className="mb-4">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kursi Dipilih</div>
                              <div className="text-lg font-bold text-blue-600">
                                {selectedSeatsMap[t.id]?.length > 0 ? selectedSeatsMap[t.id].join(", ") : '-'}
                              </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md mb-5 border border-gray-100">
                              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Harga</div>
                              <div className="text-xl font-black text-gray-900">
                                Rp {(selectedSeatsMap[t.id]?.length * Number(t.harga || 0)).toLocaleString('id-ID')}
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <button onClick={() => handleProceed(t)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold text-sm transition shadow-sm">
                                Lanjutkan Pembayaran
                              </button>
                              <button onClick={() => setOpenTripId(null)} className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 py-2 rounded-lg font-medium text-sm transition">
                                Tutup
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
                <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <FaBus className="mx-auto text-4xl mb-3 text-gray-300" />
                  <p className="font-medium">Jadwal untuk destinasi ini belum tersedia atau sudah penuh.</p>
                  <p className="text-sm mt-1">Coba cari dengan tanggal atau rute yang berbeda.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiket;