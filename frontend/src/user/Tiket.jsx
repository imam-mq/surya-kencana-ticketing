// Tiket.jsx — Fix: recognize sleeper payload even if trip.bus.is_sleeper mismatch
import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../images/SK-Logo1.png";
import SeatGridInline28 from "./kursi/SeatGridInline28";
import SeatGridSleeper from "./kursi/SeatGridSleeper";

const API = "http://127.0.0.1:8000/api/accounts";

const TripCard = ({ trip, onToggleOpen }) => {
  const busName = trip.bus ? trip.bus.name : trip.title || "-";
  const busCode = trip.bus?.code || "";

  const availableSeats = Math.max(0, (trip.capacity ?? 0) - (trip.sold_seats ?? 0));
  const occupancyRate = Math.min(
    100,
    Math.round(((trip.sold_seats ?? 0) / (trip.capacity || 1)) * 100)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => onToggleOpen(trip.id)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4">
        
        {/* Bagian Kiri - Info Bus */}
        <div className="flex items-center gap-3 min-w-[180px] mt-[-30px]">
          <img src={LogoSK1} alt="logo" className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{busName}</h3>
            {busCode && (
              <p className="text-sm text-black-900 mt-0.5 font-semibold">{busCode}</p>
            )}
          </div>
        </div>

        {/* Tengah - Detail Perjalanan */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Keberangkatan</h4>
            <p className="text-sm font-semibold text-gray-900">{trip.time?.slice(0, 5)}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{trip.origin}</p>
            <p className="text-xs text-gray-500">{trip.date}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Kedatangan</h4>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2">{trip.destination}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Harga</h4>
            <p className="text-base font-bold text-blue-600">
              Rp {Number(trip.price || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Kanan - Kursi & Tombol */}
        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>

          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyRate >= 80
                  ? "bg-red-500"
                  : occupancyRate >= 50
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleOpen(trip.id);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition"
          >
            Lihat Tempat Duduk
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
      if (filters.origin) params.append("origin", filters.origin);
      if (filters.destination) params.append("destination", filters.destination);
      if (filters.date) params.append("date", filters.date);
      const res = await fetch(`${API}/jadwal/search/?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
      setOpenTripId(null);
    } catch (e) { setErr(e.message || "Gagal memuat jadwal"); } finally { setLoading(false); }
  };

  // fetch seats — improved: detect sleeper payload from response regardless of trip.bus flag
  const fetchAndStoreSeats = async (tripId, isSleeperFlag) => {
    try {
      const res = await fetch(`${API}/jadwal/${tripId}/seats/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // If backend returned sleeper structure (even if trip.bus flag mismatches), treat as sleeper
      const looksLikeSleeper = data && (data.lantai_atas || data.lantai_bawah);

      if (isSleeperFlag || looksLikeSleeper) {
        const atas = Array.isArray(data.lantai_atas) ? data.lantai_atas : [];
        const bawah = Array.isArray(data.lantai_bawah) ? data.lantai_bawah : [];
        const mapSeat = (s) => ({ ...s, selected: !!s.selected, available: s.available !== false });
        setSeatsMap(prev => ({ ...prev, [tripId]: { lantaiAtas: atas.map(mapSeat), lantaiBawah: bawah.map(mapSeat) } }));
        setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
        return;
      }

      // inline expected array
      if (!Array.isArray(data)) {
        console.error("Inline expected array but got:", data);
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
    const isSleeper = !!trip?.bus?.is_sleeper;
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
    alert(`Lanjut ke pembayaran.\nJadwal #${trip.id}\nKursi: ${seats.join(', ')}\nTotal: Rp ${(seats.length * Number(trip.price || 0)).toLocaleString('id-ID')}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-blue-600 font-medium">Beranda</span> / <span className="text-blue-600 font-medium">Ticket</span> / <span className="text-gray-800 font-semibold">Pencarian Jadwal</span>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Pencarian Jadwal</h2>

        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/6 border-r pr-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 cursor-pointer hover:bg-blue-600 hover:text-white p-2 rounded-md transition">Promo 25%</h3>
            <div className="border-t border-gray-300 my-3"></div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Jenis Bus</h3>
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
                          {seatsMap[t.id]?.lantaiAtas ? (
                            <SeatGridSleeper seats={seatsMap[t.id]} onToggleSeat={(seatId)=>toggleSeat(t.id, seatId)}/>
                          ) : (
                            <SeatGridInline28 seats={seatsMap[t.id] || []} onToggleSeat={(seatId)=>toggleSeat(t.id, seatId)}/>
                          )}
                        </div>

                        <div className="w-full md:w-64">
                          <div className="bg-white p-4 rounded-md shadow-md space-y-4">
                            <h4 className="font-semibold text-sm text-gray-800">Keberangkatan</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-600"><span className="font-medium text-gray-800">{t.origin}</span><span className="text-gray-700">{t.time?.slice(0,5)}</span></div>
                              <div className="text-xs text-gray-600"></div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-800">Kedatangan</h4>
                              <div className="flex justify-between text-sm text-gray-600"><span className="font-medium text-gray-800">{t.destination}</span><span className="text-gray-700"></span></div>
                            </div>

                            <div className="border-t border-gray-300 my-4"></div>

                            <div>
                              <div className="text-sm font-medium text-gray-600">Nomor Tempat Duduk</div>
                              <div className="text-xl font-bold text-gray-800">{selectedSeatsMap[t.id]?.join(", ") || '-'}</div>
                            </div>

                            <div className="border-t border-gray-300 my-4"></div>

                            <div>
                              <div className="text-sm font-medium text-gray-600">Detail Harga</div>
                              <div className="text-lg font-bold text-gray-800">Rp {(selectedSeatsMap[t.id]?.length * Number(t.price || 0)).toLocaleString('id-ID')}</div>
                            </div>

                            <div className="pt-4 flex gap-2">
                              <button onClick={() => setOpenTripId(null)} className="flex-1 border border-gray-300 py-1.5 rounded-md text-xs hover:bg-gray-50 transition">Tutup</button>
                              <button onClick={() => handleProceed(t)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-md text-xs transition">Lanjutkan Pembayaran</button>
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
  );
};

export default Tiket;
