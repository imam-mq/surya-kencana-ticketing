import React, { useState, useEffect } from "react";
import { FaBus, FaChair, FaCreditCard, FaMinus, FaPlus } from "react-icons/fa";
import { IoPricetagOutline, IoShieldCheckmarkOutline } from "react-icons/io5";

// --- 1. Import Komponen Layout & Assets ---
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "../../components/layout/Herohome";
import OrangMudik from "../../assets/images/orangmudik.png";

// --- 2. Import Integrasi API & Library Animasi ---
import { getActivePromos } from "../../api/userApi";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  // --- 3. Data Statis: Alur Pemesanan & Keunggulan ---
  const steps = [
    {
      icon: FaBus,
      title: "Pilih rincian perjalanan",
      description: "Masukkan tempat keberangkatan, tujuan, tanggal perjalanan dan kemudian klik 'Cari'",
    },
    {
      icon: FaChair,
      title: "Pilih bis dan tempat duduk",
      description: "Pilih bis, tempat duduk, isi rincian penumpang dan klik 'Pembayaran'",
    },
    {
      icon: FaCreditCard,
      title: "Pembayaran yang mudah",
      description: "Pembayaran aman otomatis melalui Midtrans via Transfer Bank, E-Wallet, atau Minimarket.",
    },
  ];

  const features = [
    {
      icon: IoPricetagOutline,
      title: "Tanpa biaya Tambahan",
      description: "Pesan tiket bis anda dengan harga terbaik tanpa biaya tersembunyi.",
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: "Pembayaran Online Aman",
      description: "Bayar tiket online anda dengan cara aman dan nyaman melalui Midtrans.",
    },
    {
      icon: FaChair,
      title: "Pilih Tempat Duduk Anda",
      description: "Pesan tempat duduk sesuai pilihan anda secara real-time.",
    },
  ];

  // --- 4. State Management ---
  const [promos, setPromos] = useState([]);
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "Bagaimana cara memesan tiket di Surya Kencana?",
      answer: "Anda dapat memesan tiket secara online melalui situs resmi kami dengan memilih rute, tanggal, dan kursi yang diinginkan.",
      isOpen: false,
    },
    {
      id: 2,
      question: "Apakah bisa melakukan pembatalan tiket?",
      answer: "Ya, pembatalan dapat dilakukan sesuai ketentuan. Silakan hubungi CS kami untuk bantuan proses pembatalan.",
      isOpen: false,
    },
    {
      id: 3,
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami bekerja sama dengan Midtrans, mendukung transfer bank (VA), kartu kredit, LinkAja, hingga Alfamart/Indomaret.",
      isOpen: false,
    },
  ]);

  // --- 5. Logic: Sinkronisasi Animasi & Data API ---
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Mengambil data promo aktif dari file API terpusat
    getActivePromos()
      .then((data) => setPromos(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Gagal memuat promo:", err));
  }, []);

  const toggleFAQ = (id) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, isOpen: !f.isOpen } : f)));
  };

  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Hero />

        {/* === SECTION PROMO === */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-2xl md:text-4xl font-bold text-blue-900 mb-10">
              Segera pesan sekarang dan dapatkan <br /> promo khusus
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {promos.length > 0 ? (
                promos.map((promo, i) => (
                  <div
                    key={i}
                    className="bg-blue-900 text-white rounded-xl shadow-lg p-6 border border-blue-400/60 hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
                    data-aos="fade-up"
                  >
                    <div>
                      <h3 className="text-lg font-semibold mb-1 truncate">{promo.nama}</h3>
                      <p className="text-sm text-gray-200 mb-4 line-clamp-2">{promo.deskripsi}</p>
                    </div>

                    <div className="flex items-start justify-between gap-4 mt-auto">
                      <div className="bg-blue-800 border border-white/50 rounded-lg px-4 py-3 text-center flex flex-col items-center w-[110px] shrink-0">
                        <p className="text-[10px] bg-blue-500 text-white font-semibold rounded-md px-2 py-0.5 mb-1">Potongan</p>
                        <p className="text-xl font-extrabold">{promo.persen_diskon}%</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs mb-2">Hingga: {promo.tanggal_selesai}</p>
                        <span className="text-[10px] bg-yellow-400 text-blue-900 font-semibold rounded-sm px-2 py-0.5">TERBATAS</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 italic">Belum ada promo aktif saat ini.</div>
              )}
            </div>
          </div>
        </section>

        {/* === SECTION MUDIK === */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-lg max-w-6xl mx-auto my-16 overflow-hidden">
          <div className="p-8 md:w-1/2 text-white space-y-4">
            <h3 className="text-3xl font-bold leading-snug">Dapatkan promo mudik <br /> Sekarang</h3>
            <p className="text-base text-blue-100">#Pastimudikpastisuryakencana</p>
          </div>
          <div className="relative md:w-1/2 flex items-center justify-center p-8">
            <img src={OrangMudik} alt="Mudik" className="rounded-md w-full max-w-sm object-contain" data-aos="fade-left" />
          </div>
        </section>

        {/* === SECTION TATA CARA PEMESANAN === */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-center text-2xl md:text-4xl font-bold text-blue-900 mb-12">Tata Cara Pemesanan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center group" data-aos="fade-up">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-md group-hover:bg-blue-900 group-hover:text-white transition-all duration-300">
                      <StepIcon className="text-4xl" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* === SECTION FAQ === */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-blue-900 mb-8 text-center">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  <button onClick={() => toggleFAQ(item.id)} className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition">
                    <span className="font-semibold text-gray-700">{item.question}</span>
                    {item.isOpen ? <FaMinus className="text-blue-600" /> : <FaPlus className="text-blue-600" />}
                  </button>
                  {item.isOpen && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
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