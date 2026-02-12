import React, { useState, useEffect } from "react";
import { FaBus, FaChair, FaCreditCard, FaMinus, FaPlus } from "react-icons/fa";
import { IoPricetagOutline, IoShieldCheckmarkOutline } from "react-icons/io5"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Herohome";
import OrangMudik from "../images/orangmudik.png";

// Import AOS
import AOS from "aos";
import "aos/dist/aos.css"; // Pastikan CSS AOS diimport

export default function Home() {
  // === Data untuk Tata Cara Pemesanan ===
  const steps = [
    {
      icon: FaBus,
      title: "Pilih rincian perjalanan",
      description:
        "Masukkan tempat keberangkatan, tujuan, tanggal perjalanan dan kemudian klik 'Cari'",
    },
    {
      icon: FaChair,
      title: "Pilih bis dan tempat duduk",
      description:
        "Pilih bis, tempat duduk, tempat keberangkatan, tujuan, isi rincian penumpang dan klik 'Pembayaran'",
    },
    {
      icon: FaCreditCard,
      title: "Pembayaran yang mudah",
      description:
        "Pembayaran dapat dilakukan melalui transfer ATM, Internet banking, Alfamart, kartu Kredit/Debit, Mandiri Clickpay, BCA Clickpay dll",
    },
  ];

  // === Data untuk Kelebihan Layanan ===
  const features = [
    {
      icon: IoPricetagOutline,
      title: "Tanpa biaya Tambahan",
      description: "Pesan tiket bis anda dengan harga terbaik",
    },
    {
      icon: IoShieldCheckmarkOutline,
      title: "Pembayaran Online Aman & Nyaman",
      description:
        "Bayar tiket online anda dengan cara aman dan nyaman melalui berbagai metode",
    },
    {
      icon: FaChair, // diganti dengan FaChair karena IoChairOutline tidak ada
      title: "Pilih Tempat Duduk Anda",
      description: "Pesan tempat duduk sesuai pilihan anda",
    },
  ];

  const [promos, setPromos] = useState([]);

  // === Data FAQs ===
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "Bagaimana cara memesan tiket di Surya Kencana?",
      answer:
        "Anda dapat memesan tiket secara online melalui situs resmi kami dengan memilih rute, tanggal, dan kursi yang diinginkan.",
      isOpen: false,
    },
    {
      id: 2,
      question: "Apakah bisa melakukan pembatalan tiket?",
      answer:
        "Ya, pembatalan dapat dilakukan maksimal 24 jam sebelum keberangkatan dengan ketentuan yang berlaku.",
      isOpen: false,
    },
    {
      id: 3,
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Kami menerima pembayaran melalui transfer bank, kartu debit/kredit, dan gerai minimarket seperti Alfamart dan Indomaret.",
      isOpen: false,
    },
  ]);

  // === Fungsi Toggle FAQ ===
  const toggleFAQ = (id) => {
    setFaqs((prevFaqs) =>
      prevFaqs.map((item) =>
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  // === Inisialisasi AOS ===
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi dalam milidetik
      once: true, // Animasi hanya dijalankan sekali
    });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/accounts/user/active-promo/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Promo data fetched:", data); // Log to check the response structure
        if (Array.isArray(data)) {
          setPromos(data);
        } else {
          setPromos([]);
        }
      })
      .catch((err) => console.error("Error fetching promo:", err));
  }, []);


  return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Hero />

        {/* === SECTION PROMO === */}
        <section className="py-16 bg-gray-50">
          <h2 className="text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-10">
            Segera pesan sekarang dan dapatkan <br />
            promo khusus
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            {promos.length > 0 ? (
              promos.map((promo, i) => (
                <div
                  key={i}
                  className="bg-blue-900 text-white rounded-xl shadow-lg p-6 border border-blue-400/60 hover:scale-105 transition-transform duration-300"
                  data-aos="fade-up"
                >
                  <h3 className="text-lg sm:text-base md:text-lg font-semibold mb-1">{promo.title}</h3>
                  <p className="text-sm sm:text-xs md:text-sm text-gray-200 mb-4">
                    {promo.description || "Dapatkan diskon khusus bulan ini!"}
                  </p>
                  <div className="flex items-start justify-between gap-4">
                    <div className="bg-blue-1000 border border-white/50 rounded-lg px-4 py-3 text-center flex flex-col items-center w-[110px]">
                      <p className="text-[10px] sm:text-[11px] bg-blue-500 text-white font-semibold rounded-md px-2 py-0.5 mb-1">
                        Potongan
                      </p>
                      <p className="text-[12px] font-medium">Hingga</p>
                      <p className="text-xl font-extrabold leading-tight">{promo.discount_percent}%</p>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm sm:text-xs md:text-sm mb-2">
                        {promo.periode ? promo.periode : `${promo.start_date} - ${promo.end_date}`}
                      </p>
                      <div className="flex items-center bg-blue-800 rounded-md px-3 py-2 border border-blue-500 overflow-hidden">
                        <input
                          type="text"
                          readOnly
                          value="surya-kencana.com/id"
                          className="bg-transparent text-white text-xs flex-1 outline-none truncate"
                        />
                      </div>
                      <span className="text-[10px] bg-yellow-400 text-blue-900 font-semibold rounded-sm px-2 py-0.5 inline-block mt-2">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-lg font-semibold text-gray-500">Tidak ada promo aktif saat ini</div>
            )}
          </div>
        </section>

        {/* === SECTION MUDIK === */}
        <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl shadow-lg max-w-6xl mx-auto my-16 overflow-hidden">
          <div className="p-8 md:w-1/2 text-white space-y-4">
            <h3 className="text-3xl font-bold leading-snug">
              Dapatkan promo mudik <br /> Sekarang
            </h3>
            <p className="text-base text-blue-100">
              Dapatkan promo mudik Sekarang
            </p>
            <p className="text-sm text-blue-200 font-semibold">
              #Pastimudikpastisuryakencana
            </p>
          </div>

          <div className="relative md:w-1/2 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center -translate-x-20" data-aos="fade-left">
              <div className="border border-white/40 rounded-md w-1/2 aspect-video flex items-center justify-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.5 5.5v9l8-4.5-8-4.5z" />
                  </svg>
                </div>
              </div>
              <img
                src={OrangMudik}
                alt="Mudik"
                className="relative z-10 rounded-md md:w-[65%] w-[80%] object-contain translate-x-20"
              />
            </div>
          </div>
        </section>

        {/* === SECTION TATA CARA PEMESANAN === */}
        <section className="py-16 bg-gray-50">
          <h2 className="text-center text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 mb-10">
            Tata Cara Pemesanan Tiket Bus <br />
            Surya Kencana
          </h2>
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center justify-center">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center max-w-xs p-6 transition-all duration-300 transform hover:scale-105"
                    data-aos="fade-up" // Menambahkan efek fade-up pada elemen ini
                  >
                    <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105">
                      <StepIcon className="text-6xl text-blue-800" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* === SECTION KELEBIHAN LAYANAN KAMI === */}
        <section className="py-16 bg-gray-50">
          <h2 className="text-center text-3xl font-bold text-blue-900 mb-10">
            Kelebihan Layanan Kami
          </h2>

          <div className="bg-blue-800 py-16">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-xl shadow-2xl overflow-hidden">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center text-center p-10 ${index > 0 ? "md:border-l border-gray-200" : ""} hover:bg-gray-50 transition duration-300`}
                      data-aos="fade-up" // Menambahkan efek fade-up pada elemen ini
                    >
                      <Icon className="text-6xl text-blue-900 mb-6" />
                      <h3 className="text-lg font-bold text-blue-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-base text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION FAQ === */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-10">
              FAQs
            </h2>

            <div className="space-y-4">
              {faqs.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 cursor-pointer ${item.isOpen ? "bg-gray-200 border-gray-300 shadow-lg" : "bg-white border-gray-200 shadow-md hover:shadow-lg transition duration-300"}`}
                  onClick={() => toggleFAQ(item.id)}
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-base leading-relaxed ${item.isOpen ? "text-gray-800 font-semibold" : "text-gray-700 font-medium"}`}
                    >
                      {item.question}
                    </h3>
                    {item.isOpen ? (
                      <FaMinus className="text-gray-700 ml-4 mt-1" />
                    ) : (
                      <FaPlus className="text-gray-700 ml-4 mt-1" />
                    )}
                  </div>

                  {item.isOpen && (
                    <div className="mt-4 pt-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.answer}
                      </p>
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
