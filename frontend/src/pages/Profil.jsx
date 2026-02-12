import React, { useState } from "react";
import { FaBus, FaChair, FaCreditCard, FaMinus, FaPlus } from "react-icons/fa";
import { IoPricetagOutline, IoShieldCheckmarkOutline } from "react-icons/io5"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Heroprofil from "../components/Heroprofil";
import Unnamed from "../images/unnamed.jpg"

// === Data untuk Visi & Misi ===
const initialVisiMisiData = {
  visi: [
    {
      id: 1,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: false, // Tertutup
    },
    {
      id: 2,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: true, // Terbuka sesuai gambar
    },
    {
      id: 3,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: false, // Tertutup
    },
  ],
  misi: [
    {
      id: 4,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: false, // Tertutup
    },
    {
      id: 5,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: false, // Tertutup
    },
    {
      id: 6,
      text: "Lorem Ipsum is simply dummy text of the printing",
      detail: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley",
      isOpen: true, // Terbuka sesuai gambar
    },
  ],
};

export default function Profil() {

    const [visiMisi, setVisiMisi] = useState(initialVisiMisiData);

    // Fungsi untuk mengelola toggle accordion
    const toggleItem = (type, id) => {
        setVisiMisi(prev => ({
        ...prev,
        [type]: prev[type].map(item => 
            item.id === id 
            ? { ...item, isOpen: !item.isOpen }
            : item // Hanya item yang diklik yang di-toggle
        ),
        }));
    };

    const renderItem = (item, type) => {
        const itemClasses = item.isOpen 
        ? "bg-gray-200 border-gray-300 shadow-md" // Gaya Terbuka: Background abu-abu
        : "bg-white border-gray-200 shadow-md hover:shadow-lg transition duration-300";

        return (
            <div key={item.id} className={`rounded-xl border p-4 cursor-pointer mb-4 ${itemClasses}`} onClick={() => toggleItem(type, item.id)}>
                <div className="flex justify-between items-start">
                    {/* Teks Visi/Misi */}
                    <h3 className="text-base text-gray-700 font-medium leading-relaxed">
                        {item.text}
                    </h3>
                    {/* Ikon + / - */}
                    {item.isOpen ? (
                        <FaMinus className="text-gray-700 flex-shrink-0 ml-4 mt-1" />
                    ) : (
                        <FaPlus className="text-gray-700 flex-shrink-0 ml-4 mt-1" />
                    )}
                </div>
                {item.isOpen && (
                <div className="mt-4 pt-2 text-sm text-gray-600 leading-relaxed">
                    {item.detail}
                </div>
                )}
            </div>
        );
    };
  

  

  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Heroprofil />

        {/* === SECTION VISI DAN MISI (Langsung di Profile.jsx) === */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Judul Utama: VISI DAN MISI */}
            <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-10">
              VISI DAN MISI
              <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Kolom Visi */}
              <div>
                <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">
                  Visi
                  <div className="w-10 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h2>
                {visiMisi.visi.map(item => renderItem(item, 'visi'))}
              </div>

              {/* Kolom Misi */}
              <div>
                <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">
                  Misi
                  <div className="w-10 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
                </h2>
                {visiMisi.misi.map(item => renderItem(item, 'misi'))}
              </div>

            </div>
          </div>
        </section>

        <section className="bg-cover bg-center py-20 md:py-32 flex items-center justify-center relative"  style={{ backgroundImage: `url(${Unnamed})` }}>
          <div className="absolute inset-0 bg-blue-500/20"></div> {/* Overlay gelap */}
          <div className="container mx-auto px-2 max-w-4xl relative z-20 text-center">
            <p className="text-4xl font-extrabold font-poppins text-white tracking-widest mb-2">
              SURYA KENCANA
            </p>
            {/* KOREKSI: Mengganti md:text-1xl dengan ukuran font yang valid (misal: text-3xl, md:text-4xl) */}
            <h2 className="text-1xl md:text-1xl font-bold text-white leading-tight max-w-4xl mx-auto"> 
              Kami melayani dengan memberikan pelayanan terbaik bagi para pelanggan sebagai tamu kami yang terhormat
            </h2>
          </div>
        </section>


        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl font-extrabold font-poppins text-blue-900 text-center mb-10">
              Citra Dan Sumber Daya Manusia
              <div className="w-16 h-1 bg-blue-900 mx-auto mt-2 rounded"></div>
            </h1>
            <p className="text-center text-lg font-medium font-poppins">
              Seluruh karyawan PT Surya Kencana yang terdiri dari tenaga muda dan
              profesional harus dapat menerapkan nilai nilai yang kami pegang
            </p><br /><br />
            <div className="grid grid-cols-1 mf:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Kartu 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>

              {/* Kartu 2 */}
              <div className="bg-white p-6 rounded-lg shadow-mf border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>

              {/* Kartu 3 */}
              <div className="bg-white p-6 rounded-lg shadow-mf border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>

              {/* Kartu 4 */}
              <div className="bg-white p-6 rounded-lg shadow-mf border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>

              {/* Kartu 5 */}
              <div className="bg-white p-6 rounded-lg shadow-mf border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>

              {/* Kartu 6 */}
              <div className="bg-white p-6 rounded-lg shadow-mf border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Lorem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s
                </p>
              </div>
            </div>
          </div>
        </section>

        
      </main>
      <Footer />
    </div>
  );
}
