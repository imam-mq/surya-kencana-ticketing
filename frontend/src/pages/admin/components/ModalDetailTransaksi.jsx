import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaFlagCheckered, FaClock, FaCalendarAlt, FaChair, FaBus, FaTimes } from "react-icons/fa";
import { getAdminTransaksiDetail } from "../../../api/adminApi";


const ModalDetailTransaksi = ({ isOpen, onClose, transaksiId }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && transaksiId) {
            const fetchDetail = async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await getAdminTransaksiDetail(transaksiId);
                    if (res.success){
                        setDetail(res.data);
                    } else {
                        setError(res.error || "Gagal Mengambil Data");
                    }
                } catch (err) {
                    setError("Terjadi Kesalahan Koneksi");
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [isOpen, transaksiId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* ── Header ── */}
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <span className="font-bold text-lg">i</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Detail Informasi</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Informasi lengkap tiket dan data perjalanan penumpang.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-10">{error}</div>
                    ) : detail ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Kolom Kiri (Data Penumpang & Rute) */}
                            <div className="space-y-6">
                                <div className="flex gap-3">
                                    <FaUser className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nama Pembeli</p>
                                        <p className="text-sm font-bold text-gray-800">{detail.nama_pembeli}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaEnvelope className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-sm font-semibold text-gray-700">{detail.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaMapMarkerAlt className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rute Keberangkatan</p>
                                        <p className="text-sm font-semibold text-gray-800">{detail.rute_keberangkatan}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaFlagCheckered className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rute Kedatangan</p>
                                        <p className="text-sm font-semibold text-gray-800">{detail.rute_kedatangan}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom Kanan (Box Abu-abu Data Tiket) */}
                            <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-100">
                                <div className="flex gap-3">
                                    <FaClock className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jam Keberangkatan</p>
                                        <p className="text-sm font-bold text-gray-800">{detail.jam_keberangkatan}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaCalendarAlt className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tanggal Keberangkatan</p>
                                        <p className="text-sm font-bold text-gray-800">{detail.tanggal_keberangkatan}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaChair className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nomor Kursi</p>
                                        <p className="text-lg font-bold text-blue-600">{detail.nomor_kursi}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <FaBus className="text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tipe Bus</p>
                                        <p className="text-sm font-semibold text-gray-800">{detail.tipe_bus}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50">
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        <FaTimes /> Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDetailTransaksi;
