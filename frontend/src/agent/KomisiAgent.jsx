import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter, FaCalendarAlt } from 'react-icons/fa';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  TextField,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Agent_Navbar from './layout/Agent_Navbar';
import Sidebar_Agent from './layout/Sidebar_Agent';

const KomisiAgent = () => {
  const [startDate, setStartDate] = useState("2025-01-08");
  const [endDate, setEndDate] = useState("2025-01-08");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedKomisi, setSelectedKomisi] = useState(null);
  const [buktiTransfer, setBuktiTransfer] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const navigate = useNavigate();

  // Sample data
  const allKomisi = [
    { no: 1, periode: "1-31 November", totalTransaksi: "Rp.10.000.000", totalKomisi: "Rp.2.000.000", setor: "Rp.8.000.000", status: "sudah bayar" },
    { no: 2, periode: "1-31 November", totalTransaksi: "Rp.10.000.000", totalKomisi: "Rp.2.000.000", setor: "Rp.8.000.000", status: "sudah bayar" },
    { no: 3, periode: "1-31 November", totalTransaksi: "Rp.10.000.000", totalKomisi: "Rp.2.000.000", setor: "Rp.8.000.000", status: "sudah bayar" },
    { no: 4, periode: "1-31 November", totalTransaksi: "Rp.10.000.000", totalKomisi: "Rp.2.000.000", setor: "Rp.8.000.000", status: "belum bayar" },
  ];

  // Pagination logic
  const totalPages = Math.ceil(allKomisi.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentKomisi = allKomisi.slice(startIndex, endIndex);

  const handleCari = () => {
    alert(`Cari data dari ${startDate} sampai ${endDate}`);
  };

  const handleDetail = (no) => {
    navigate(`/agent/DetailKomisiAgent/${no}`);
  };

  const handleTransfer = (item) => {
    setSelectedKomisi(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedKomisi(null);
    setBuktiTransfer(null);
    setFilePreview(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBuktiTransfer(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKonfirmasiTransfer = () => {
    if (!buktiTransfer) {
      alert("Silakan upload bukti transfer terlebih dahulu!");
      return;
    }
    
    // TODO: Implement API call untuk submit transfer
    alert(`Transfer berhasil dikonfirmasi untuk periode ${selectedKomisi?.periode}`);
    handleCloseModal();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar_Agent />
      
      <div className="flex-1 flex flex-col">
        <Agent_Navbar />
        
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manajemen Komisi Agent</h1>
            <p className="text-gray-600 text-lg">Laporan komisi agent • setor admin</p>
          </div>

          {/* Filter Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-blue-600 text-lg" />
              <h2 className="text-lg font-bold text-gray-900">Pilih Periode</h2>
            </div>
            
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Start Date */}
              <div className="col-span-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Dari Tanggal</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="col-span-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sampai Tanggal</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Cari Button */}
              <div className="col-span-2">
                <button
                  onClick={handleCari}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
                >
                  Cari
                </button>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header with Pagination Control */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Detail komisi & setor</h3>
              
              {/* Items per page selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600 font-medium">data</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">No</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Periode</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Transaksi</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Komisi</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Setor</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-16 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentKomisi.map((item) => (
                    <tr key={item.no} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.no}</td>
                      <td className="py-4 px-6 text-sm text-gray-700 font-medium">{item.periode}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{item.totalTransaksi}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{item.totalKomisi}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{item.setor}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "sudah bayar" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDetail(item.no)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-xs font-semibold"
                          >
                            <span>Detail</span>
                          </button>
                          
                          <button 
                            onClick={() => handleTransfer(item)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-white rounded-lg hover:from-yellow-700 hover:to-yellow-800 transition-all shadow-md hover:shadow-lg text-xs font-semibold"
                          >
                            <span>Transfer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-gray-900">{startIndex + 1}</span> - <span className="font-semibold text-gray-900">{Math.min(endIndex, allKomisi.length)}</span> dari <span className="font-semibold text-gray-900">{allKomisi.length}</span> data
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Transfer */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '8px',
          }
        }}
      >
        <DialogTitle sx={{ 
          position: 'relative', 
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '1.5rem',
          pb: 1
        }}>
          Periode : {selectedKomisi?.periode}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {/* Informasi Komisi */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                Total Komisi :
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2' }}>
                {selectedKomisi?.totalKomisi}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                Total Disetor :
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f' }}>
                {selectedKomisi?.setor}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          {/* Rekening Admin */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
              Rekening Admin :
            </Typography>
            <Box sx={{ pl: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', mb: 0.5 }}>
                BANK BRI
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                Norek : 123xxxxx
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                A/N : Supatji
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          {/* Upload Bukti Transfer */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
              Upload Bukti Transfer
            </Typography>
            
            <input
              accept="image/*"
              id="bukti-transfer-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="bukti-transfer-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  borderColor: '#d0d0d0',
                  color: '#666',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#f5f5f5',
                  }
                }}
              >
                {buktiTransfer ? buktiTransfer.name : 'Choose File'}
              </Button>
            </label>

            {/* Preview Image */}
            {filePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }} 
                />
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button
            onClick={handleKonfirmasiTransfer}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            Konfirmasi Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default KomisiAgent;