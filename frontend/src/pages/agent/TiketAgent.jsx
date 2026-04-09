import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import LogoSK1 from "../../assets/images/SK-Logo1.png";
import Sidebar_Agent from './layout/Sidebar_Agent';
import Agent_Navbar from './layout/Agent_Navbar';
import KonfirmasiPemesanan from "../agent/konfirmasipemesanan/KonfirmasiPemesanan";
import DataPenumpang from "./datapenumpang/DataPenumpang";
import LoadingDanSukses from "./loadingdansukses/LoadingDanSukses";

// Komponen kursi bis
import SeatGridInline28 from '../agent/kursi/SeatGridInline28';
import SeatGridSleeper from '../agent/kursi/SeatGridSleeper';

// --- IMPORT API & FORMATTER ---
import { searchAgentSchedule, getAgentSeats, createAgentBooking } from "../../api/agentApi";
import { formatRupiah } from "../../utils/formatters";

const TripCard = ({ trip, onToggleOpen }) => {
  const dateObj = new Date(trip.waktu_keberangkatan);
  const dateStr = dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const busName = trip.bus_name || "-";
  const busCode = trip.bus_type || "";

  const capacity = trip.kapasitas || 28; 
  const availableSeats = trip.sisa_kursi !== undefined ? trip.sisa_kursi : Math.max(0, capacity - (trip.terjual || 0));
  const soldSeats = capacity - availableSeats;
  const occupancyRate = Math.min(100, Math.round((soldSeats / capacity) * 100));

  const isExpired = dateObj < new Date();
  const isFull = trip.is_full || availableSeats <= 0 || trip.status === "sold_out";
  const isDisabled = isExpired || isFull;

  let statusText = "Lihat Tempat Duduk";
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
      <div className={`bg-white rounded-lg shadow-sm border transition-all duration-300 overflow-hidden ${cardClass}`} onClick={() => !isDisabled && onToggleOpen(trip.id)}>
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
               {formatRupiah(trip.harga)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <div className="text-center">
            <p className={`text-sm font-bold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>{availableSeats}</p>
            <p className="text-xs text-gray-500">Kursi Tersedia</p>
          </div>
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-300 ${occupancyRate >= 80 ? "bg-red-500" : occupancyRate >= 50 ? "bg-yellow-500" : "bg-green-500"}`} style={{ width: `${occupancyRate}%` }} />
          </div>
          <button disabled={isDisabled} onClick={(e) => { e.stopPropagation(); onToggleOpen(trip.id); }} className={`w-full font-semibold py-2 px-3 rounded-lg text-xs transition ${buttonClass}`}>
            {statusText}
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

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await searchAgentSchedule(); // Menggunakan API luar
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
      const data = await searchAgentSchedule({ 
        asal: filters.origin, 
        tujuan: filters.destination, 
        tanggal: filters.date 
      });
      setTrips(Array.isArray(data) ? data : []);
      setOpenTripId(null);
    } catch (e) {
      setErr(e.response?.data?.error || "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  const fetchAndStoreSeats = async (tripId) => {
    try {
      const data = await getAgentSeats(tripId); // Menggunakan API luar

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

  const submitAgentBooking = async (trip) => {
    try {
      const seats = selectedSeatsMap[trip.id] || [];
      if (!seats.length) {
        alert("Pilih kursi terlebih dahulu");
        return false;
      }

      // --- PERBAIKAN PAYLOAD ---
      // Kita samakan persis namanya dengan yang ada di Serializer Django
      const mappedPassengers = passengerData.map((p, index) => ({
        name: p.name,
        no_ktp: p.no_ktp,
        phone: p.phone,
        gender: p.gender,
        seat: seats[index] // Masukkan kursi langsung ke dalam data masing-masing penumpang
      }));

      // seats di luar dihapus karena sudah masuk ke dalam object penumpang
      const payload = { 
        jadwal_id: trip.id, 
        passengers: mappedPassengers 
      };

      // Menggunakan API Luar
      const data = await createAgentBooking(payload);
      
      setIssuedTickets(data.kode_booking || []);
      return true;

    } catch (err) {
      console.error("Detail Error:", err);
      
      // --- PERBAIKAN PENANGKAPAN ERROR ---
      if (err.response?.status === 401) {
        alert("Sesi login habis, silakan login ulang.");
      } else if (err.response?.status === 400) {
        // Ambil error langsung dari JSON yang dikirim Serializer Django
        const errorData = err.response.data;
        let errMsg = "Terjadi kesalahan.";
        
        if (errorData.non_field_errors) {
          errMsg = errorData.non_field_errors[0]; // Tangkap error "NIK sudah terdaftar"
        } else if (errorData.passengers) {
          errMsg = "Format data penumpang ada yang salah/kosong.";
        }
        
        alert(`Gagal Booking: ${errMsg}`);
      } else {
        alert(err.response?.data?.error || "Gagal booking, koneksi bermasalah.");
      }
      
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
        <DataPenumpang showPassengerPopup={showPassengerPopup} activeTrip={activeTrip} passengerData={passengerData} selectedSeatsMap={selectedSeatsMap} setShowPassengerPopup={setShowPassengerPopup} setShowConfirmPopup={setShowConfirmPopup} handlePassengerChange={handlePassengerChange} />

        {/* ===== POPUP 2: KONFIRMASI ===== */}
        <KonfirmasiPemesanan showConfirmPopup={showConfirmPopup} activeTrip={activeTrip} passengerData={passengerData} selectedSeatsMap={selectedSeatsMap} showLoadingPopup={showLoadingPopup} setShowConfirmPopup={setShowConfirmPopup} handleConfirmBooking={handleConfirmBooking} />

        {/* ===== POPUP 3 & 4: LOADING + SUCCESS ===== */}
        <LoadingDanSukses showLoadingPopup={showLoadingPopup} showSuccessPopup={showSuccessPopup} activeTrip={activeTrip} selectedSeatsMap={selectedSeatsMap} setShowSuccessPopup={setShowSuccessPopup} setPassengerData={setPassengerData} setOpenTripId={setOpenTripId} setSelectedSeatsMap={setSelectedSeatsMap} />

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
                                  {formatRupiah(((selectedSeatsMap[t.id]?.length || 0) * Number(t.harga || 0)))}
                                </div>
                              </div>

                              <div className="pt-2">
                                <button
                                  onClick={() => {
                                    if (!(selectedSeatsMap[t.id] || []).length) {
                                      alert("Silakan pilih kursi terlebih dahulu");
                                      return;
                                    }
                                    
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