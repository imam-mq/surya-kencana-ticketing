import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Herolayanan from "../components/Herolayanan";
import Gambar1 from "../images/gambarbus1.png"
import Gambar2 from "../images/gambarbus2.png"
import Gambar3 from "../images/gambarbus3.png"


export default function Dtipe3() {
    return (
    <div className="min-h-screen font-poppins">
      <Navbar />
      <main>
        <Herolayanan />

        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                    {/* KOLOM KIRI */}
                    <div className="space-y-6 col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                            <img
                                src={Gambar1}
                                alt="Tampak Bus Eksterior Surya Kencana Tipe 1"
                                className="w-full h-[300px] object-cover"
                            />
                            <p className="p-2 text-xs text-white bg-blue-900/80 absolute bottom-0 left-0 w-full">
                                Tampak Bus Eksterior Surya Kencana Tipe 1
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                            <img
                                src={Gambar2}
                                alt="Tampak Bus Eksterior Surya Kencana Tipe 1"
                                className="w-full h-[300px] object-cover"
                            />
                            <p className="p-2 text-xs text-white bg-blue-900/80 absolute bottom-0 left-0 w-full">
                                Tampak Tempat Duduk Bus Surya Kencana Tipe 1
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
                            <img
                                src={Gambar3}
                                alt="Tampak Bus Eksterior Surya Kencana Tipe 1"
                                className="w-full h-[300px] object-cover"
                            />
                            <p className="p-2 text-xs text-white bg-blue-900/80 absolute bottom-0 left-0 w-full">
                                Tampak Makanan Bus Eksterior Surya Kencana Tipe 1
                            </p>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="bg-white rounded-lg shadow-lg p-4 self-start w-full">
                        <h3 className="text-blue-900 font-semibold mb-4 border-b border-gray-200 pb-2">
                            Galery
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <img src={Gambar1} alt="Gallery 1" className="rounded-lg h-24 w-full object-cover" />
                            <img src={Gambar2} alt="Gallery 1" className="rounded-lg h-24 w-full object-cover" />
                            <img src={Gambar3} alt="Gallery 1" className="rounded-lg h-24 w-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
      </main>
      <Footer />
    </div>
  );
}