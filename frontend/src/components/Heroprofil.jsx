import React from "react";
import Profilbus from "../images/Gambar_P1.jpg";

const HeroProfil = () => {
  return (
    <section
      className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${Profilbus})`,
      }}
    >
      {/* Overlay gelap agar teks terlihat jelas */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Konten */}
      <div className="relative text-center text-white z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
          Profil
        </h1>
        <p className="text-sm md:text-base text-gray-200">
          <span className="hover:text-blue-400 cursor-pointer transition">
            Home
          </span>{" "}
          / Profil
        </p>

        {/* Garis dekoratif */}
        <div className="w-20 h-[3px] bg-blue-500 mx-auto mt-4 rounded-full"></div>
      </div>
    </section>
  );
};

export default HeroProfil;
