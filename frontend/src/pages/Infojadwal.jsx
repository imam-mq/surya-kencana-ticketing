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

    // FETCH SEMUA JADWAL
    const fetchJadwal = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/jadwal/`);
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error("Gagal memuat jadwal:", e);
        } finally {
            setLoading(false);
        }
    };

    // FILTER JADWAL
    const getJadwal = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/jadwal/`, {
                params: {
                    origin: origin || "",
                    destination: destination || "",
                    date: date || ""
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
                        <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-1xl flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 items-center">

                            {/* ORIGIN */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                                    <FaBus className="text-lg" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                    placeholder="Rute Keberangkatan"
                                    value={origin}
                                    onChange={(e) => setOrigin(e.target.value)}
                                />
                            </div>

                            {/* EXCHANGE ICON */}
                            <div
                                className="md:w-auto p-2 rounded-full cursor-pointer"
                                style={{ backgroundColor: "#F3F4F6", color: primaryColor }}
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
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                    placeholder="Rute Kedatangan"
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
                                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            {/* SEARCH BUTTON */}
                            <button
                                type="button"
                                onClick={getJadwal}
                                className="w-full md:w-auto px-6 py-3 rounded-lg text-white font-bold flex items-center justify-center"
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
                                        <th className="px-6 py-4">Ticket</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-6 text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : items.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-6 text-gray-500">
                                                Tidak ada jadwal tersedia.
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((it) => {
                                            const available = (it.capacity ?? 0) - (it.sold_seats ?? 0);
                                            const busLabel = it.bus
                                                ? `${it.bus.name} ${it.bus.code ? `(${it.bus.code})` : ""}`
                                                : "-";

                                            return (
                                                <tr key={it.id} className="border-b border-gray-200">
                                                    <td className="px-6 py-4">{it.origin}</td>
                                                    <td className="px-6 py-4">{it.destination}</td>
                                                    <td className="px-6 py-4">{busLabel}</td>
                                                    <td className="px-6 py-4">{it.date}</td>
                                                    <td className="px-6 py-4">{available}</td>
                                                    <td className="px-6 py-4">{it.time?.slice(0, 5)}</td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            className="px-4 py-2 rounded text-white font-semibold"
                                                            style={{ backgroundColor: primaryColor }}
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
