import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Input,
  useDisclosure,
  Spinner,
  useToast
} from "@chakra-ui/react";
import { HiSwitchHorizontal } from "react-icons/hi";
import Sidebar_Agent from "./layout/Sidebar_Agent";
import Agent_Navbar from "./layout/Agent_Navbar";
import ModalTransfer from "../components/ui/ModalTransfer";

const KomisiAgent = () => {
  // State Filter Tanggal
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State Data
  const [dataKomisi, setDataKomisi] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const toast = useToast();

  // --- 1. FUNGSI FETCH DATA DARI API ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Panggil endpoint (URL tetap sama)
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/agent/commission-report/", {
        withCredentials: true,
        params: {
            start_date: startDate,
            end_date: endDate
        }
      });

      // PERUBAHAN DISINI:
      // Data respon sekarang langsung Array, tidak perlu destructuring { tagihan_berjalan... } lagi.
      const riwayatList = response.data; 

      // map data riwayat ke format tabel
      const formattedData = riwayatList.map((item) => ({
        id: item.id,
        // Gunakan item.id === 0 atau status 'BELUM BAYAR' untuk mendeteksi tagihan aktif
        isCurrentBill: item.status === "BELUM BAYAR", 
        
        periode: `${item.periode_awal || '-'} s/d ${item.periode_akhir || '-'}`,
        totalTiket: item.total_kursi || 0,
        totalTransaksi: item.total_transaksi,
        totalKomisi: item.total_komisi,
        setor: item.total_setor_admin,
        
        // Mapping Status: Tambahkan case untuk "BELUM BAYAR"
        status: item.status === "BELUM BAYAR" ? "belum bayar" :
                item.status === "MENUNGGU" ? "menunggu verifikasi" : 
                item.status === "DITERIMA" ? "sudah bayar" : "ditolak",
        
        // Tombol Transfer hanya nyala jika status 'BELUM BAYAR'
        canTransfer: item.status === "BELUM BAYAR", 
        
        bukti_transfer: item.bukti_transfer
      }));

      // Simpan ke state
      setDataKomisi(formattedData);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
      toast({
        title: "Gagal memuat data",
        description: "Pastikan server backend berjalan.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // memanggil data untuk filter perubahan
  useEffect(() => {
    fetchData();
  }, []);

  // --- FORMAT RUPIAH ---
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  // --- LOGIKA KLIK TOMBOL TRANSFER ---
  const handleTransferClick = (item) => {
    setSelectedItem(item);
    onOpen(); // Buka ModalTransfer
  };

  // --- CALLBACK SAAT SUKSES UPLOAD ---
  const handleSuccessTransfer = () => {
    onClose();
    // Refresh data dari server agar status berubah otomatis jadi 'menunggu verifikasi'
    fetchData(); 
    toast({
      title: "Berhasil",
      description: "Bukti transfer berhasil dikirim. Menunggu verifikasi admin.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar_Agent />

      <Box flex="1" flexDirection="column">
        <Agent_Navbar />

        <Box p={8}>
          {/* Header */}
          <Box mb={8}>
            <Heading size="lg" color="gray.700">Manajemen Komisi Agent</Heading>
            <Text color="gray.500">Laporan komisi agent • setor admin</Text>
          </Box>

          {/* Filter Card */}
          <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6}>
            <Flex gap={4} align="end" wrap="wrap">
              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.600">Dari Tanggal</Text>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Box>
              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.600">Sampai Tanggal</Text>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
              <Button colorScheme="blue" px={8} alignSelf="end" onClick={fetchData}>
                Cari
              </Button>
            </Flex>
          </Box>

          {/* Tabel Utama */}
          <Box bg="white" borderRadius="xl" shadow="md" overflow="hidden" borderWidth="1px">
            {loading ? (
                <Flex justify="center" align="center" p={10}>
                    <Spinner size="xl" color="blue.500" />
                    <Text ml={3}>Memuat data...</Text>
                </Flex>
            ) : (
                <Table variant="simple">
                <Thead bg="gray.50">
                    <Tr>
                    <Th>No</Th>
                    <Th>Periode</Th>
                    <Th>Total Kursi</Th>
                    <Th isNumeric>Total Transaksi</Th>
                    <Th isNumeric>Total Komisi</Th>
                    <Th isNumeric>Setor Admin</Th>
                    <Th>Status</Th>
                    <Th>Aksi</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {dataKomisi.length === 0 ? (
                        <Tr>
                            <Td colSpan={8} textAlign="center" py={6} color="gray.500">
                                Tidak ada data tagihan atau riwayat.
                            </Td>
                        </Tr>
                    ) : (
                        dataKomisi.map((item, index) => (
                          <Tr key={index} _hover={{ bg: "gray.50" }}>
                            <Td>{index + 1}</Td>
                            <Td fontWeight="medium">{item.periode}</Td>
                            <Td>{item.totalTiket}</Td>
                            <Td isNumeric>{formatRupiah(item.totalTransaksi)}</Td>
                            <Td isNumeric color="green.600">{formatRupiah(item.totalKomisi)}</Td>
                            <Td isNumeric fontWeight="bold" color="blue.600">{formatRupiah(item.setor)}</Td>
                            
                            {/* Badge Status */}
                            <Td>
                              <Badge
                                px={3}
                                py={1}
                                borderRadius="full"
                                colorScheme={
                                item.status === "sudah bayar" ? "green" : 
                                item.status === "menunggu verifikasi" ? "yellow" : 
                                item.status === "ditolak" ? "red" : "red" // Merah untuk 'belum bayar'
                                }
                              >
                                {item.status.toUpperCase()}
                              </Badge>
                            </Td>

                            {/* Tombol Aksi */}
                            <Td>
                            {item.canTransfer ? (
                                <Button
                                size="sm"
                                textColor="white"
                                leftIcon={<HiSwitchHorizontal />}
                                colorScheme="yellow" // Kuning Oranye agar mencolok
                                onClick={() => handleTransferClick(item)}
                                boxShadow="sm"
                                >
                                Transfer
                                </Button>
                            ) : (
                                <Button size="sm" colorScheme="blue" variant="outline" isDisabled>
                                Detail
                                </Button>
                            )}
                            </Td>
                          </Tr>
                        ))
                    )}
                </Tbody>
                </Table>
            )}
            
            
            <Box p={4} borderTopWidth="1px">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">Menampilkan {dataKomisi.length} data</Text>
                <Flex gap={2}>
                  <Button size="sm" isDisabled>Previous</Button>
                  <Button size="sm" colorScheme="blue">1</Button>
                  <Button size="sm" isDisabled>Next</Button>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>

      
      <ModalTransfer 
        isOpen={isOpen} 
        onClose={onClose} 
        data={selectedItem}
        onSuccess={handleSuccessTransfer}
      />
    </Flex>
  );
};

export default KomisiAgent;