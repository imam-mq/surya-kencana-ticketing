import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaBus, FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { FaClock, FaUserPlus, FaArrowRight  } from "react-icons/fa";
import Herolayanan from "../components/Herolayanan";
import Unnamed from "../images/unnamed.jpg"
import BusTipe1 from "../images/CPBus1.jpg";
import BusTipe2 from "../images/CPBus2.jpg";
import Sleeper from "../images/CPBus3.jpg";

const services = [
    {
        title: "Antar Kota",
        icon: FaBus,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        color: "bg-blue-800",
    },
    {
        title: "Pariwisata",
        icon: FaMapMarkerAlt,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        color: "bg-blue-800",
    },
    {
        title: "Carter Bus",
        icon: FaCar,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        color: "bg-blue-800",
    },
];

const branchOffices = [
    { no: 1, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04 Samping Ahmad Laundry Cucian Mapping", telp: "04344-23233439", phone: "081234567832" },
    { no: 2, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04 Samping Ahmad Laundry Cucian Mapping", telp: "04344-23233439", phone: "081234567832" },
    { no: 3, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04 Samping Ahmad Laundry Cucian Mapping", telp: "04344-23233439", phone: "081234567832" },
    { no: 4, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04 Samping Ahmad Laundry Cucian Mapping", telp: "04344-23233439", phone: "081234567832" },
    { no: 5, address: "Jln Ahmad Yani Gang Kalender RT 08 RW 04 Samping Ahmad Laundry Cucian Mapping", telp: "04344-23233439", phone: "081234567832" },
];

export default function Layanan() {

  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Herolayanan />

        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Judul Layanan*/}
                <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10">
                    Jenis Layanan Transportasi
                    <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h1>
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Grid Kartu Layanan */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                        {services.map((service, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
                                {/* Area Ikon */}
                                <div className={`flex items-center justify-center p-8 ${service.color}`}>
                                    <service.icon className="text-white w-16 h-16" />
                                </div>
                                    
                                {/* Area Konten */}
                                <div className="p-6 text-center">
                                    <h2 className="text-xl font-extrabold text-gray-800 mb-4">{service.title}</h2>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-cover bg-center py-20 md:py-32 flex items-center justify-center relative"  style={{ backgroundImage: `url(${Unnamed})` }}>
            <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-10">
                    Konsep Layanan
                </h2>
                <div className="grid grid-cols-3 gap-6 md:gap-10 items-start">
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaClock className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">
                            Kapasitas Muat Tepat Waktu <br /> Sesuai Jadwal
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaUserPlus className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">
                            Kapasitas Muat Tepat Waktu <br /> Sesuai Jadwal
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="p-4 rounded-full border-2 border-white mb-3 inline-block">
                            <FaArrowRight className="text-white w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white leading-snug">
                            Kapasitas Muat Tepat Waktu <br /> Sesuai Jadwal
                        </p>
                    </div>
                </div>
            </div>
        </section>

        

        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10">
                    Fasilitas Armada
                    <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h1>
                <p className="text-center text-lg font-medium font-poppins">
                    Bus Sebagai Alat Harus Benar-Benar Dapat Menjamin <br /> Keselamatan
                </p>
                <br /><br />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Link to="/dtipe1" className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                            src={BusTipe1} // Pastikan variabel ini diimpor di atas file
                            alt="Surya Kencana Tipe 1" 
                            className="w-full h-auto object-cover rounded-t-xl"
                        />
                        <div className="py-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Surya Kencana Tipe 1
                            </h3>
                        </div>
                    </Link>

                    <Link to="/dtipe2" className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                            src={BusTipe2} // Pastikan variabel ini diimpor di atas file
                            alt="Surya Kencana Tipe 1" 
                            className="w-full h-auto object-cover rounded-t-xl"
                        />
                        <div className="py-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Surya Kencana Tipe 2
                            </h3>
                        </div>
                    </Link>

                    <Link to="/dtipe3" className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <img 
                            src={Sleeper} // Pastikan variabel ini diimpor di atas file
                            alt="Surya Kencana Tipe 1" 
                            className="w-full h-auto object-cover rounded-t-xl"
                        />
                        <div className="py-6">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Surya Kencana Sleeper
                            </h3>
                        </div>
                    </Link>
                </div>
            </div>
        </section>

        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10">
                    Kantor Cabang
                    <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h1>

                <div className="overflow-x-auto rounded mt-10">
                    <table className="min-w-full bg-white text-left text-sm font-light">
                        <thead className="border-b bg-blue-600 text-white font-medium border-neutral-200">
                            <tr>
                                <th scope="col" className="px-6 py-4 w-12">No</th>
                                <th scope="col" className="px-6 py-4 w-auto">Alamat</th>
                                <th scope="col" className="px-6 py-4 w-32">Telp/Fax</th>
                                <th scope="col" className="px-6 py-4 w-32">No Handphone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Metode Mapping Data (Rekomendasi) */}
                            {branchOffices.map((office) => (
                                <tr key={office.no} className="border-b transition duration-300 ease-in-out hover:bg-gray-100">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-700">{office.no}</td>
                                    <td className="px-6 py-4 text-gray-600">{office.address}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{office.telp}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">{office.phone}</td>
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
