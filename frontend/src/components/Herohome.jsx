import React, { useEffect } from "react";
import bus from "../images/bus.png";
// Import AOS
import AOS from "aos";
import "aos/dist/aos.css"; // Pastikan CSS AOS diimport

export default function Herohome() {
  // === Inisialisasi AOS ===
  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi dalam milidetik
      once: true, // Animasi hanya dijalankan sekali
    });
  }, []);

  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-4">
      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Text side */}
        <div className="space-y-6" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Lorem Ipsum is simply <br />
          </h1>
          <p className="text-gray-200 max-w-xl sm:text-sm md:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>
          <br />
          <div className="flex items-center gap-4">
            <a
              href="#get-started"
              className="inline-block bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-full font-semibold shadow"
              data-aos="fade-up"
            >
              Get Started
            </a>
            <a
              href="#read-more"
              className="inline-block border border-white/30 px-5 py-2 rounded-full text-white/90 hover:bg-white/10"
              data-aos="fade-up"
            >
              Read More
            </a>
          </div>
        </div>

        {/* Image side */}
        <div className="flex justify-center lg:justify-end" data-aos="zoom-in">
          <div className="w-full">
            <img
              src={bus}
              alt="bus SK"
              className="w-full md:w-[90%] lg:w-[80%] object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
