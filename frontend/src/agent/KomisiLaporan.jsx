import React, { useState, useEffect } from "react";
import { FaFilter, FaCalendarAlt, FaFilePdf, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Agent_Navbar from './layout/Agent_Navbar';
import Sidebar_Agent from './layout/Sidebar_Agent';

const KomisiLaporan = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/agent/ticket-report/", {
        withCredentials: true, 
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      
      const rawData = response.data.results || response.data || [];
      setAllTransactions(rawData); 

    } catch (error) {
      console.error("Error fetching commission data:", error);
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);


  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number || 0);
  };

  const handleDownloadPDF = () => {
    alert("Fitur Download PDF sedang disiapkan...");
  };

  // --- LOGIKA SEARCH (ARRAY & STRING) ---
  const filteredTransactions = allTransactions.filter((transaction) => {
    const query = searchQuery.toLowerCase();
    
    // Cek Nama Penumpang (Array atau String)
    const matchNama = Array.isArray(transaction.nama_penumpang) 
      ? transaction.nama_penumpang.some(nama => String(nama).toLowerCase().includes(query))
      : String(transaction.nama_penumpang || "").toLowerCase().includes(query);

    // Cek Tujuan (String)
    const tujuan = transaction.tujuan || "";
    const matchTujuan = tujuan.toLowerCase().includes(query);

    return matchNama || matchTujuan;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // --- PAGINATION COMPONENT (ANGKA) ---
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let pages = [];
    // Logic simple: tampilkan semua halaman jika sedikit, atau persingkat (opsional)
    // Di sini kita tampilkan semua angka halaman untuk kesederhanaan sesuai gambar
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-1">
            {/* Tombol Previous (<) */}
            <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                    currentPage === 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
                <FaChevronLeft className="text-xs" />
            </button>

            {/* Angka Halaman */}
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-all ${
                        currentPage === page
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Tombol Next (>) */}
            <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                    currentPage === totalPages 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                }`}
            >
                <FaChevronRight className="text-xs" />
            </button>
        </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar_Agent />
      
      <div className="flex-1 flex flex-col">
        <Agent_Navbar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Komisi Laporan</h1>
            <p className="text-gray-600 text-lg">Laporan komisi transaksi per tiket</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            {/* Header Filter */}
            <div className="flex items-center gap-2 mb-6">
              <FaFilter className="text-blue-600 text-lg" />
              <h2 className="text-base font-bold text-gray-800">Filter Laporan</h2>
            </div>

            <div className="flex flex-col md:flex-row items-end gap-4">
              {/* Grid Input Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                {/* Kolom 1: Dari Tanggal */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                    Dari Tanggal
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    />
                  </div>
                </div>

                {/* Kolom 2: Sampai Tanggal */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                    Sampai Tanggal
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    />
                  </div>
                </div>

                {/* Kolom 3: Cari Penumpang */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase ml-1">
                    Cari Penumpang
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari nama..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Tombol Eksport PDF */}
              <div className="pb-1">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-3 px-6 py-3 bg-[#ce0000] hover:bg-red-700 text-white rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap"
                >
                  <FaFilePdf className="text-xl" />
                  <span className="font-bold text-sm tracking-wide">Eksport PDF</span>
                </button>
              </div>
            </div>

            {/* Tombol Reset */}
            {(startDate || endDate || searchQuery) && (
              <button 
                onClick={() => {setStartDate(""); setEndDate(""); setSearchQuery("");}}
                className="mt-4 text-xs text-gray-400 hover:text-blue-600 transition-colors ml-1"
              >
                × Reset Filter
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Detail Transaksi Tiket</h3>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-600 font-medium">data</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tgl Transaksi</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jadwal</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipe Bis</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kursi</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nama Penumpang</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Keberangkatan</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tujuan</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Harga Tiket</th>
                    <th className="py-4 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Komisi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan="9" className="text-center py-10">Memuat data...</td></tr>
                  ) : currentTransactions.length === 0 ? (
                    <tr><td colSpan="9" className="text-center py-10 text-gray-500">Data penumpang tidak ada</td></tr>
                  ) : currentTransactions.map((transaction, index) => (
                    <tr key={transaction.id || index} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900">{startIndex + index + 1}</td>

                      <td className="py-4 px-4 text-sm font-semibold text-blue-700 whitespace-nowrap">
                        {transaction.tanggal_transaksi}
                      </td>
                      
                      {/* 1. JADWAL */}
                      <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
                        {transaction.jadwal}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700">{transaction.tipe_bis}</td>
                      
                      {/* 2. KURSI (Looping Array agar jadi Badge) */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(transaction.kursi) && transaction.kursi.length > 0 ? (
                            transaction.kursi.map((k, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase border border-blue-200">
                                {k}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* 3. NAMA PENUMPANG (Looping Array agar tersusun rapi) */}
                      <td className="py-4 px-4 text-sm text-gray-700">
                          {Array.isArray(transaction.nama_penumpang) && transaction.nama_penumpang.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {transaction.nama_penumpang.map((name, i) => (
                                <span key={i} className="capitalize font-medium flex items-center gap-1">
                                  • {name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                      </td>

                      <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate">{transaction.keberangkatan}</td>
                      <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate">{transaction.tujuan}</td>
                      
                      {/* 4. HARGA TOTAL */}
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatRupiah(transaction.harga_total)}
                      </td>

                      {/* 5. KOMISI TOTAL */}
                      <td className="py-4 px-4 text-sm font-bold text-green-600 whitespace-nowrap">
                        {formatRupiah(transaction.komisi_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-gray-900">{allTransactions.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-semibold text-gray-900">{Math.min(startIndex + itemsPerPage, allTransactions.length)}</span> dari <span className="font-semibold text-gray-900">{allTransactions.length}</span> data
              </div>

              {/* RENDER PAGINATION HERE */}
              {renderPagination()}
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default KomisiLaporan;