import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BGjadwal from "../images/bgjadwal.png";
import { FaBus, FaCalendarAlt, FaExchangeAlt, FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";
import axios from "axios";

export default function Informasijadwal() {
    const primaryColor = "#314D9C";
    const API = "http://127.0.0.1:8000/api/accounts";

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");

    // 🔥 FETCH SEMUA JADWAL (Arahkan ke endpoint pencarian public)
    const fetchJadwal = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/schedule/search/`);
            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (e) {
            console.error("Gagal memuat jadwal:", e);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 FILTER JADWAL (Ubah param ke asal, tujuan, tanggal)
    const getJadwal = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/schedule/search/`, {
                params: {
                    asal: origin || "",            // origin -> asal
                    tujuan: destination || "",     // destination -> tujuan
                    tanggal: date || ""            // date -> tanggal
                }
            });

            setItems(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Gagal mencari jadwal:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJadwal();
    }, []);

    return (
        <div className="min-h-screen font-poppins bg-gray-50">
            <Navbar />

            <main className="pt-10">
                {/* FORM PENCARIAN */}
                <section
                    className="relative h-[450px] overflow-hidden"
                    style={{ backgroundColor: primaryColor }}
                >
                    <div
                        className="w-full h-full bg-cover bg-center absolute top-0 left-0 opacity-80"
                        style={{
                            backgroundImage: `url(${BGjadwal})`,
                            backgroundPosition: "top",
                        }}
                    />

                    <div className="container mx-auto px-4 max-w-1xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">

                            {/* ORIGIN */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                                    <FaBus className="text-lg" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kota Asal"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                />
                            </div>

                            {/* EXCHANGE ICON */}
                            <div
                                className="md:w-auto p-2 rounded-full cursor-pointer hover:bg-gray-200 transition"
                                style={{ backgroundColor: "#F3F4F6", color: primaryColor }}
                                onClick={() => {
                                    // Fitur opsional: Tukar asal dan tujuan
                                    const temp = origin;
                                    setOrigin(destination);
                                    setDestination(temp);
                                }}
                            >
                                <FaExchangeAlt className="text-xl rotate-90 md:rotate-0" />
                            </div>

                            {/* DESTINATION */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                                    <FaBus className="text-lg" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kota Tujuan"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>

                            {/* DATE */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                                    <FaCalendarAlt className="text-lg" />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            {/* SEARCH BUTTON */}
                            <button
                                type="button"
                                onClick={getJadwal}
                                className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center hover:opacity-90 transition"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <FaSearch className="mr-2" /> Cari Bus
                            </button>
                        </div>
                    </div>
                </section>

                {/* TABEL */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full bg-white text-left text-sm font-light">
                                <thead
                                    className="border-b font-medium text-white"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <tr>
                                        <th className="px-6 py-4">Rute Keberangkatan</th>
                                        <th className="px-6 py-4">Rute Kedatangan</th>
                                        <th className="px-6 py-4">Nama Bus</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4">Kursi Tersedia</th>
                                        <th className="px-6 py-4">Jam</th>
                                        <th className="px-6 py-4 text-center">Ticket</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                Mencari jadwal bus...
                                            </td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                                Tidak ada jadwal bus yang ditemukan untuk pencarian ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((it) => {
                                            // 1. Parsing Tanggal & Jam
                                            const dateObj = new Date(it.waktu_keberangkatan);
                                            const dateStr = dateObj.toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric"
                                            });
                                            const timeStr = dateObj.toLocaleTimeString("id-ID", {
                                                hour: "2-digit", minute: "2-digit"
                                            });

                                            // 2. Format Nama Bus
                                            const busLabel = it.bus_name 
                                                ? `${it.bus_name} ${it.bus_type ? `(${it.bus_type})` : ""}` 
                                                : "Bus Standar";

                                            // 🔥 3. PERBAIKAN SISA KURSI: Ambil dari backend
                                            const capacity = it.kapasitas || 28;
                                            const sold = it.terjual || 0;
                                            const sisaKursi = Math.max(0, capacity - sold);

                                            return (
                                                <tr key={it.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 font-medium">{it.asal}</td>
                                                    <td className="px-6 py-4 font-medium">{it.tujuan}</td>
                                                    <td className="px-6 py-4">{busLabel}</td>
                                                    <td className="px-6 py-4">{dateStr}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                                            sisaKursi > 0 && it.status === 'active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {/* Jika Nonaktif tampilkan Nonaktif, jika habis tampilkan Penuh, jika ada tampilkan angkanya */}
                                                            {it.status !== 'active' ? 'Nonaktif' : sisaKursi > 0 ? `${sisaKursi} Tersedia` : 'Penuh'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">{timeStr}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            className={`px-6 py-2 rounded-lg text-white font-semibold transition ${
                                                                sisaKursi > 0 && it.status === 'active' 
                                                                ? 'hover:opacity-90' 
                                                                : 'opacity-50 cursor-not-allowed'
                                                            }`}
                                                            style={{ backgroundColor: sisaKursi > 0 && it.status === 'active' ? primaryColor : 'gray' }}
                                                            disabled={sisaKursi === 0 || it.status !== 'active'}
                                                            onClick={() => alert(`Fitur pesan tiket untuk ID ${it.id} sedang dalam pengembangan!`)}
                                                        >
                                                            Pesan
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}