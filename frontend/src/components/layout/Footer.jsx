import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'; // Ikon media sosial

const Footer = () => {
  return (
    // Menggunakan warna biru gelap (bg-blue-900) untuk konsistensi
    <footer className="bg-blue-900 text-white py-16 font-poppins">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Konten Footer Utama: 5 Kolom */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 border-b border-blue-800 pb-10 mb-8">
            
            {/* Kolom 1: Logo & Deskripsi */}
            <div className="col-span-2 md:col-span-1">
                <h3 className="text-2xl font-bold mb-4 text-blue-100">SK</h3>
                <p className="text-sm text-blue-200 mb-6">
                    Menciptakan pengalaman perjalanan terbaik anda bersama Surya Kencana.
                </p>
                {/* Media Sosial */}
                <div className="flex space-x-4 text-blue-300">
                    <FaFacebook className="text-xl hover:text-white transition cursor-pointer" />
                    <FaTwitter className="text-xl hover:text-white transition cursor-pointer" />
                    <FaInstagram className="text-xl hover:text-white transition cursor-pointer" />
                    <FaLinkedin className="text-xl hover:text-white transition cursor-pointer" />
                </div>
            </div>

            {/* Kolom 2: Perusahaan */}
            <div>
                <h4 className="font-bold text-blue-100 mb-4">Perusahaan</h4>
                <ul className="space-y-3 text-sm text-blue-200">
                    <li className="hover:text-white cursor-pointer">Home</li>
                    <li className="hover:text-white cursor-pointer">Profil</li>
                    <li className="hover:text-white cursor-pointer">Layanan Kami</li>
                    <li className="hover:text-white cursor-pointer">Informasi Jadwal</li>
                </ul>
            </div>

            {/* Kolom 3: Layanan */}
            <div>
                <h4 className="font-bold text-blue-100 mb-4">Layanan Kami</h4>
                <ul className="space-y-3 text-sm text-blue-200">
                    <li className="hover:text-white cursor-pointer">Pesan Tiket Bus</li>
                </ul>
            </div>

             {/* Kolom 4: Bantuan & Kontak (2 Kolom digabung) */}
            <div className="col-span-2 md:col-span-2">
                <h4 className="font-bold text-blue-100 mb-4">Bantuan & Kontak</h4>
                <ul className="space-y-3 text-sm text-blue-200">
                    <li className="hover:text-white cursor-pointer">FAQ</li>
                    <li className="hover:text-white cursor-pointer">Hubungi CS (24 Jam)</li>
                    <li className="hover:text-white cursor-pointer">Kebijakan Privasi</li>
                </ul>
                <div className="mt-6">
                    <h4 className="font-bold text-blue-100 mb-2">Download App</h4>
                     {/* Placeholder Tombol Download */}
                    <button className="bg-white text-blue-900 font-medium text-xs px-4 py-2 rounded-lg mr-2 hover:bg-gray-200 transition duration-300">
                        App Store
                    </button>
                    <button className="bg-white text-blue-900 font-medium text-xs px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300">
                        Google Play
                    </button>
                </div>
            </div>
        </div>
      
        {/* Copyright */}
        <div className="text-center mt-8 text-xs text-blue-300">
            &copy; {new Date().getFullYear()} Surya Kencana. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;