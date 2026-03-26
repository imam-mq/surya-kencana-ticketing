import React from "react";
import { Link } from 'react-router-dom';
import { FaBus, FaCar, FaMapMarkerAlt, FaClock, FaUserPlus, FaArrowRight } from "react-icons/fa";

// --- IMPORT KOMPONEN LAYOUT ---
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Herolayanan from "../../components/layout/Herolayanan";

// --- IMPORT ASSETS GAMBAR ---
import Unnamed from "../../assets/images/unnamed.jpg";
import BusTipe1 from "../../assets/images/CPBus1.jpg";
import BusTipe2 from "../../assets/images/CPBus2.jpg";
import Sleeper from "../../assets/images/CPBus3.jpg";

const services = [
    {
        title: "Antar Kota",
        icon: FaBus,
        description: "Layanan transportasi antar kota dengan jadwal reguler dan rute tercepat untuk kenyamanan perjalanan Anda.",
        color: "bg-blue-800",
    },
    {
        title: "Pariwisata",
        icon: FaMapMarkerAlt,
        description: "Solusi perjalanan wisata keluarga atau instansi dengan armada yang nyaman dan pengemudi berpengalaman.",
        color: "bg-blue-800",
    },
    {
        title: "Carter Bus",
        icon: FaCar,
        description: "Sewa bus khusus untuk berbagai keperluan acara, pernikahan, atau perjalanan pribadi dengan fleksibilitas tinggi.",
        color: "bg-blue-800",
    },
];

const branchOffices = [
    { no: 1, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04", telp: "04344-23233439", phone: "081234567832" },
    { no: 2, address: "Terminal Pusat Surya Kencana Lantai 2", telp: "04344-23233440", phone: "081234567833" },
    { no: 3, address: "Ruko Sentra Bisnis No. 12, Jl. Sudirman", telp: "04344-23233441", phone: "081234567834" },
];

export default function Layanan() {
  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Herolayanan />

        {/* SECTION JENIS LAYANAN */}
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10">
                    Jenis Layanan Transportasi
                    <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                            <div className={`flex items-center justify-center p-8 ${service.color}`}>
                                <service.icon className="text-white w-16 h-16" />
                            </div>
                            <div className="p-6 text-center">
                                <h2 className="text-xl font-extrabold text-gray-800 mb-4">{service.title}</h2>
                                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* SECTION KONSEP LAYANAN (Background Image) */}
        <section className="bg-cover bg-center py-20 md:py-32 flex items-center justify-center relative" style={{ backgroundImage: `url(${Unnamed})` }}>
            <div className="absolute inset-0 bg-blue-900/40"></div>
            <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-10">Konsep Layanan</h2>
                <div className="grid grid-cols-3 gap-6 md:gap-10 items-start">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaClock className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug text-shadow">Tepat Waktu Sesuai Jadwal</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaUserPlus className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug text-shadow">Pelayanan Ramah & Profesional</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaArrowRight className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug text-shadow">Kenyamanan Armada Utama</p>
                    </div>
                </div>
            </div>
        </section>

        {/* SECTION FASILITAS ARMADA */}
        <section className="py-16 bg-gray-50 text-center">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-10">
                    Fasilitas Armada
                    <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h1>
                <p className="text-lg font-medium">Menjamin keselamatan dan kenyamanan di setiap kilometer perjalanan.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <Link to="/dtipe1" className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
                        <img src={BusTipe1} alt="Tipe 1" className="w-full h-48 object-cover" />
                        <div className="py-6"><h3 className="text-lg font-semibold text-gray-800">Surya Kencana Tipe 1</h3></div>
                    </Link>
                    <Link to="/dtipe2" className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
                        <img src={BusTipe2} alt="Tipe 2" className="w-full h-48 object-cover" />
                        <div className="py-6"><h3 className="text-lg font-semibold text-gray-800">Surya Kencana Tipe 2</h3></div>
                    </Link>
                    <Link to="/dtipe3" className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
                        <img src={Sleeper} alt="Sleeper" className="w-full h-48 object-cover" />
                        <div className="py-6"><h3 className="text-lg font-semibold text-gray-800">Surya Kencana Sleeper</h3></div>
                    </Link>
                </div>
            </div>
        </section>

        {/* SECTION KANTOR CABANG */}
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-6xl text-center">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-10"> Kantor Cabang </h1>
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                    <table className="min-w-full bg-white text-left text-sm">
                        <thead className="bg-blue-600 text-white font-medium">
                            <tr>
                                <th className="px-6 py-4 w-12">No</th>
                                <th className="px-6 py-4">Alamat</th>
                                <th className="px-6 py-4">Telp/Fax</th>
                                <th className="px-6 py-4">No Handphone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchOffices.map((office) => (
                                <tr key={office.no} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium">{office.no}</td>
                                    <td className="px-6 py-4">{office.address}</td>
                                    <td className="px-6 py-4">{office.telp}</td>
                                    <td className="px-6 py-4">{office.phone}</td>
                                </tr>
                            ))}
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