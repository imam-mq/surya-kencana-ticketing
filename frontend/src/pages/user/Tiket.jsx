import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../../assets/images/SK-Logo1.png";
import Checkout from "./checkout/Checkout";
import SeatGridInline28 from '../../components/kursi/SeatGridInline28';
import SeatGridSleeper from '../../components/kursi/SeatGridSleeper';

// --- IMPORT FUNGSI API ---
import { getJadwalUser, getSeatsUser } from "../../api/userApi";

const TripCard = ({ trip, onToggleOpen }) => {
  const busName = trip.bus_name || "Bus Dihapus";
  const busCode = trip.bus_type || "";
  const capacity = trip.kapasitas || 28;
  const sold = trip.terjual || 0;
  const availableSeats = Math.max(0, capacity - sold);
  const occupancyRate = Math.min(100, Math.round((sold / capacity) * 100));

  const dateObj = trip.waktu_keberangkatan ? new Date(trip.waktu_keberangkatan) : new Date();
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const isExpired = dateObj < new Date();
  const isFull = availableSeats <= 0 || trip.status === "sold_out";
  const isDisabled = isExpired || isFull;

  let statusText = "Pilih Kursi";
  let buttonClass = "bg-blue-600 hover:bg-blue-700 text-white";
  let cardClass = "border-gray-200 hover:shadow-md cursor-pointer";

  if (isExpired) {
    statusText = "Sudah Berangkat";
    buttonClass = "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300";
    cardClass = "border-gray-200 opacity-60 grayscale cursor-not-allowed";
  } else if (isFull) {
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
        <div className="flex items-center gap-3 min-w-[180px]">
          <img src={LogoSK1} alt="logo" className="w-12 h-12 object-contain" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm md:text-base">{busName}</h3>
            {busCode && <p className="text-sm text-gray-600 mt-0.5 font-semibold">{busCode}</p>}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Keberangkatan</h4>
            <p className="text-sm font-semibold text-gray-900">{timeStr} WITA</p>
            <p className="text-xs text-gray-600">{trip.asal}</p>
            <p className="text-xs text-blue-600 font-medium">{dateStr}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Kedatangan</h4>
            <p className="text-sm font-semibold text-gray-900">{trip.tujuan}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase">Harga</h4>
            <p className={`text-base font-bold ${isFull ? 'text-gray-400 line-through' : 'text-blue-600'}`}>
              Rp {Number(trip.harga || 0).toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[120px]">
          <div className="text-center">
            <p className={`text-sm font-bold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>
          <button disabled={isDisabled} className={`w-full font-semibold py-2 px-3 rounded-lg text-xs transition ${buttonClass}`}>
            {statusText}
          </button>
        </div>
      </div>
    </div>
  );
};

const Tiket = () => {
  const [filters, setFilters] = useState({ origin: "", destination: "", date: "" });
  const [selectedBusTypes, setSelectedBusTypes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [openTripId, setOpenTripId] = useState(null);
  const [checkoutData, setCheckoutData] = useState(null);
  const [seatsMap, setSeatsMap] = useState({});
  const [selectedSeatsMap, setSelectedSeatsMap] = useState({});

  useEffect(() => { loadAll(); }, []);

  const handleFilterChange = (tipeBus) => {
    setSelectedBusTypes((prev) => {
      if (prev.includes(tipeBus)) {
        return prev.filter((item) => item !== tipeBus);
      }
      return [...prev, tipeBus];
    });
  };

  const filteredTrips = trips.filter((trip) => {
    if (selectedBusTypes.length === 0) return true;

    return selectedBusTypes.includes(trip.bus_type);
  });

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await getJadwalUser();
      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      setErr(err.message);
    } finally { setLoading(false); }
  };

  const search = async () => {
    try {
      setErr(""); setLoading(true);
      const data = await getJadwalUser(filters);
      setTrips(Array.isArray(data) ? data : []);
      setOpenTripId(null);
    } catch (e) { 
      setErr(e.message || "Gagal memuat jadwal"); 
    } finally { setLoading(false); }
  };

  const fetchAndStoreSeats = async (tripId, isSleeperFlag) => {
    try {
      const data = await getSeatsUser(tripId);
      // deteksi sleeper bus
      const isSleeper = data && (data.lantai_atas !== undefined || data.lantai_bawah !== undefined);
      
      if (isSleeperFlag || isSleeper) {
        setSeatsMap(prev => ({ 
          ...prev, 
          [tripId]: { 
            // nge cek default arry
            lantai_atas: data.lantai_atas || [], 
            lantai_bawah: data.lantai_bawah || [] 
          } 
        }));
      } else {
        setSeatsMap(prev => ({ ...prev, [tripId]: Array.isArray(data) ? data : [] }));
      }
      setSelectedSeatsMap(prev => ({ ...prev, [tripId]: [] }));
    } catch (e) {
      console.error("fetch seats error", e);
    }
  };
  
  const toggleOpen = async (tripId) => {
    if (openTripId === tripId) { setOpenTripId(null); return; }
    setOpenTripId(tripId);
    const trip = trips.find(t => t.id === tripId);
    const isSleeper = trip?.bus_type?.toLowerCase().includes('sleeper');
    if (!seatsMap[tripId]) await fetchAndStoreSeats(tripId, isSleeper);
    setTimeout(() => document.getElementById(`seat-panel-${tripId}`)?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const toggleSeat = (tripId, seatId) => {
    setSeatsMap(prev => {
      const copy = { ...prev };
      const cur = copy[tripId];
      
      if (!cur) return copy; 

      const update = (s) => s.id === seatId ? { ...s, selected: !s.selected } : s;
      
      if (cur.lantai_atas !== undefined || cur.lantai_bawah !== undefined) {
        copy[tripId] = { 
          lantai_atas: (cur.lantai_atas || []).map(update),   
          lantai_bawah: (cur.lantai_bawah || []).map(update)  
        };
      } else if (Array.isArray(cur)) {
        copy[tripId] = cur.map(update);
      }
      return copy;
    });

    setSelectedSeatsMap(prev => {
      const arr = prev[tripId] || [];
      return { ...prev, [tripId]: arr.includes(seatId) ? arr.filter(x => x !== seatId) : [...arr, seatId] };
    });
  };

  const handleProceed = (trip) => {
    const seats = selectedSeatsMap[trip.id] || [];
    if (!seats.length) return alert('Silakan pilih kursi terlebih dahulu');
    setCheckoutData({ trip, seats });
  };

  if (checkoutData) return <Checkout data={checkoutData} onBack={() => setCheckoutData(null)} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-600 mb-4">
          <span className="text-blue-600">Beranda</span> / <span className="text-blue-600">Ticket</span> / <span className="text-gray-800 font-semibold">Pencarian Jadwal</span>
        </div>
        <h2 className="text-2xl font-semibold mb-6">Pencarian Jadwal Keberangkatan</h2>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6 border border-gray-100">
          <div className="w-full md:w-1/4 border-r pr-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Jenis Bus</h3>
            <div className=" border-t border-gray-700 my-3"></div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input type="checkbox" 
                  checked={selectedBusTypes.includes("Reguler")} 
                  onChange={() => handleFilterChange("Reguler")}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                /> Surya Kencana Reguler
              </label>

              <label className="flex items-center gap-2 text-gray-700 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input 
                  type="checkbox" 
                  checked={selectedBusTypes.includes("VIP Sleeper")}
                  onChange={() => handleFilterChange("VIP Sleeper")}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                /> Surya Kencana Sleeper
              </label>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 w-full lg:w-1/4">
                <FaBus className="text-gray-400 mr-2" />
                <input type="text" placeholder="Kota Asal" value={filters.origin} onChange={(e)=>setFilters(s=>({...s, origin: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
              </div>
              <FaArrowRight className="hidden lg:block text-gray-400" />
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 w-full lg:w-1/4">
                <FaBus className="text-gray-400 mr-2" />
                <input type="text" placeholder="Kota Tujuan" value={filters.destination} onChange={(e)=>setFilters(s=>({...s, destination: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
              </div>
              <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 w-full lg:w-1/4">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <input type="date" value={filters.date} onChange={(e)=>setFilters(s=>({...s, date: e.target.value}))} className="bg-transparent outline-none w-full text-sm" />
              </div>
              <button onClick={search} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition">
                {loading ? 'Mencari...' : 'Cari Bus'}
              </button>
            </div>

            {err && <div className="text-red-600 bg-red-50 p-3 rounded-md text-sm mb-4">{err}</div>}

            <div className="space-y-4">
              {filteredTrips.map(t => (
                <div key={t.id}>
                  <TripCard trip={t} onToggleOpen={toggleOpen} />
                  {openTripId === t.id && (
                    <div id={`seat-panel-${t.id}`} className="mt-4 bg-gray-50 p-6 rounded-lg border shadow-inner flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        {seatsMap[t.id]?.lantai_atas ? (
                          <SeatGridSleeper seats={seatsMap[t.id]} onToggleSeat={(sid)=>toggleSeat(t.id, sid)}/>
                        ) : (
                          <SeatGridInline28 seats={seatsMap[t.id] || []} onToggleSeat={(sid)=>toggleSeat(t.id, sid)}/>
                        )}
                      </div>
                      <div className="w-full md:w-72 bg-white p-5 rounded-lg border sticky top-4 h-fit">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-4">Rincian Tiket</h4>
                        <div className="mb-4">
                          <p className="text-xs text-gray-500">Kursi Dipilih</p>
                          <p className="text-lg font-bold text-blue-600">{selectedSeatsMap[t.id]?.length ? selectedSeatsMap[t.id].join(", ") : '-'}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md mb-5">
                          <p className="text-xs text-gray-500">Total Harga</p>
                          <p className="text-xl font-black">Rp {(selectedSeatsMap[t.id]?.length * Number(t.harga || 0)).toLocaleString('id-ID')}</p>
                        </div>
                        <button onClick={() => handleProceed(t)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">Lanjutkan Pembayaran</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {!loading && trips.length === 0 && (
                <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-xl border-dashed border-2">
                  <FaBus className="mx-auto text-4xl mb-3 text-gray-300" />
                  <p>Jadwal tidak tersedia. Coba rute lain.</p>
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