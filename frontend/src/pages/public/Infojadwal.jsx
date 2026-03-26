import React, { useEffect, useState } from "react";
import { FaBus, FaCalendarAlt, FaExchangeAlt, FaSearch } from "react-icons/fa";

// --- PERBAIKAN IMPORT ASSETS & LAYOUT ---
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import BGjadwal from "../../assets/images/bgjadwal.png";

// --- IMPORT API ---
import { searchPublicSchedule } from "../../api/publicApi";

export default function Informasijadwal() {
    const primaryColor = "#314D9C";
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");

    // Fungsi fetch utama
    const handleSearch = async (isInitial = false) => {
        setLoading(true);
        try {
            // Gunakan filter hanya jika bukan loading awal
            const filters = isInitial ? {} : { origin, destination, date };
            const data = await searchPublicSchedule(filters);
            setItems(data);
        } catch (e) {
            console.error("Error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(true); // Load awal tanpa filter
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen font-poppins bg-gray-50">
            <Navbar />
            <main className="pt-10">
                <section className="relative h-[450px] overflow-hidden" style={{ backgroundColor: primaryColor }}>
                    <div
                        className="w-full h-full bg-cover bg-center absolute top-0 left-0 opacity-80"
                        style={{ backgroundImage: `url(${BGjadwal})`, backgroundPosition: "top" }}
                    />

                    <div className="container mx-auto px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">
                            {/* Input Kota Asal */}
                            <div className="flex-1 w-full relative">
                                <FaBus className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kota Asal"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                />
                            </div>

                            {/* Tombol Tukar */}
                            <div
                                className="p-2 rounded-full cursor-pointer hover:bg-gray-200 transition bg-gray-100"
                                style={{ color: primaryColor }}
                                onClick={() => {
                                    const temp = origin;
                                    setOrigin(destination);
                                    setDestination(temp);
                                }}
                            >
                                <FaExchangeAlt className="text-xl rotate-90 md:rotate-0" />
                            </div>

                            {/* Input Kota Tujuan */}
                            <div className="flex-1 w-full relative">
                                <FaBus className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Kota Tujuan"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>

                            {/* Input Tanggal */}
                            <div className="flex-1 w-full relative">
                                <FaCalendarAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            {/* Tombol Cari */}
                            <button
                                onClick={() => handleSearch(false)}
                                className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center hover:opacity-90 transition"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <FaSearch className="mr-2" /> Cari Bus
                            </button>
                        </div>
                    </div>
                </section>

                {/* Tabel Jadwal */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full bg-white text-left text-sm">
                                <thead className="text-white" style={{ backgroundColor: primaryColor }}>
                                    <tr>
                                        <th className="px-6 py-4">Rute Keberangkatan</th>
                                        <th className="px-6 py-4">Rute Kedatangan</th>
                                        <th className="px-6 py-4">Nama Bus</th>
                                        <th className="px-6 py-4">Tanggal</th>
                                        <th className="px-6 py-4">Kursi Tersedia</th>
                                        <th className="px-6 py-4">Jam</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan={7} className="text-center py-8 text-gray-500 italic">Memuat jadwal bus...</td></tr>
                                    ) : items.length === 0 ? (
                                        <tr><td colSpan={7} className="text-center py-8 text-gray-500 italic">Jadwal tidak ditemukan.</td></tr>
                                    ) : (
                                        items.map((it) => {
                                            const dateObj = new Date(it.waktu_keberangkatan);
                                            const sisaKursi = Math.max(0, (it.kapasitas || 28) - (it.terjual || 0));

                                            return (
                                                <tr key={it.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 font-medium">{it.asal}</td>
                                                    <td className="px-6 py-4 font-medium">{it.tujuan}</td>
                                                    <td className="px-6 py-4">{it.bus_name} ({it.bus_type})</td>
                                                    <td className="px-6 py-4">{dateObj.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sisaKursi > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {it.status !== 'active' ? 'Nonaktif' : sisaKursi > 0 ? `${sisaKursi} Kursi` : 'Penuh'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-bold">
                                                        {dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                                    </td>
                                                    {/* <td className="px-6 py-4 text-center text-blue-600 font-bold italic">Info Saja</td> */}
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