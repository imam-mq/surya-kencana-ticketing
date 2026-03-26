import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

// --- IMPORT KOMPONEN LAYOUT ---
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Heroprofil from "../../components/layout/Heroprofil";

// --- IMPORT ASSETS ---
import Unnamed from "../../assets/images/unnamed.jpg";

const initialVisiMisiData = {
  visi: [
    { id: 1, text: "Menjadi penyedia transportasi terbaik di Indonesia", detail: "Memberikan standar keamanan internasional dan pelayanan bintang lima bagi setiap penumpang.", isOpen: false },
    { id: 2, text: "Inovasi Teknologi Berkelanjutan", detail: "Terus mengembangkan sistem tiket online dan manajemen armada berbasis digital modern.", isOpen: true },
  ],
  misi: [
    { id: 4, text: "Mengutamakan keselamatan penumpang", detail: "Melakukan pengecekan armada secara berkala dan pelatihan ketat bagi seluruh pengemudi.", isOpen: false },
    { id: 6, text: "Meningkatkan kesejahteraan karyawan", detail: "Membangun lingkungan kerja yang profesional, muda, dan dinamis.", isOpen: true },
  ],
};

export default function Profil() {
  const [visiMisi, setVisiMisi] = useState(initialVisiMisiData);

  const toggleItem = (type, id) => {
    setVisiMisi(prev => ({
      ...prev,
      [type]: prev[type].map(item => item.id === id ? { ...item, isOpen: !item.isOpen } : item),
    }));
  };

  const renderItem = (item, type) => (
    <div key={item.id} className={`rounded-xl border p-4 cursor-pointer mb-4 transition ${item.isOpen ? "bg-gray-200 border-gray-300" : "bg-white border-gray-200 shadow-sm hover:shadow-md"}`} onClick={() => toggleItem(type, item.id)}>
      <div className="flex justify-between items-start">
        <h3 className="text-base text-gray-700 font-semibold">{item.text}</h3>
        {item.isOpen ? <FaMinus className="text-blue-600 mt-1" /> : <FaPlus className="text-blue-600 mt-1" />}
      </div>
      {item.isOpen && <div className="mt-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-300">{item.detail}</div>}
    </div>
  );

  return (
    <div className="min-h-screen font-poppins bg-white">
      <Navbar />
      <main>
        <Heroprofil />

        {/* VISI MISI SECTION */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10"> VISI DAN MISI </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-800 inline-block">Visi</h2>
                {visiMisi.visi.map(item => renderItem(item, 'visi'))}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-800 inline-block">Misi</h2>
                {visiMisi.misi.map(item => renderItem(item, 'misi'))}
              </div>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section className="bg-cover bg-center py-24 flex items-center justify-center relative" style={{ backgroundImage: `url(${Unnamed})` }}>
          <div className="absolute inset-0 bg-blue-900/60"></div>
          <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center text-white">
            <p className="text-3xl md:text-5xl font-black tracking-widest mb-4">SURYA KENCANA</p>
            <h2 className="text-lg md:text-xl font-medium max-w-2xl mx-auto italic">
              "Kami melayani dengan memberikan pelayanan terbaik bagi para pelanggan sebagai tamu kami yang terhormat."
            </h2>
          </div>
        </section>

        {/* SDM SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-4">Citra & Sumber Daya Manusia</h1>
            <p className="text-center text-gray-600 mb-12">Seluruh karyawan PT Surya Kencana terdiri dari tenaga muda profesional yang memegang teguh nilai integritas.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:border-blue-300 transition">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Nilai Profesionalisme</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Menjamin ketepatan waktu, kebersihan armada, dan keramahan dalam menyambut setiap tamu Surya Kencana.</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}