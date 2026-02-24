import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Spinner,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  SimpleGrid,
  Divider
} from "@chakra-ui/react";
import { HiArrowLeft } from "react-icons/hi";
import Sidebar_Agent from "../layout/Sidebar_Agent"; 
import Agent_Navbar from "../layout/Agent_Navbar";

const DetailPeriodeAgent = () => {
  const {id} = useParams(); //mengambil id priode
  const navigate = useNavigate();
  const toast = useToast();

  const [dataDetail, setDataDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FUNGSI FORMAT RUPIAH ---
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDT",
        minimumFractionDigits: 0,
    }).format(angka || 0);
  };

  // --- FUNGSI FETCH DATA DETAIL DARI API ---
    const fetchDetailData = async () => {
        setLoading(true);
        try {
            // Memanggil endpoint API DetailPriode
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/agent/periode/${id}/detail/`, {
                withCredentials: true,
            });

            // Menyimpan respons ke dalam state
            setDataDetail(response.data);
        }catch (error) {
            console.error("Gagal Mengambil Detail Data:", error);
            toast({
                title: "Gagal memuat data",
                description: "Terjadi kesalahan saat mengambil detail penumpang.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }finally {
            setLoading(false);
        }
    };

    //fetch halaman ketika di buka ID Berubah
    useEffect(() => {
        if (id) {
            fetchDetailData();
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Flex minH="100vh" bg="gray.50">
            <Sidebar_Agent />

            <Box flex="1" flexDirection="column">
                <Agent_Navbar />

                <Box p={8}>
                    {/* Header & Tombol Kembali */}
                    <Flex align="center" mb={6} gap={4}>
                        <Button 
                            leftIcon={<HiArrowLeft />} 
                            colorScheme="gray" 
                            variant="outline" 
                            onClick={handleBack}
                        >
                            Kembali
                        </Button>
                        <Box>
                            <Heading size="lg" color="gray.700">Detail Setoran Komisi</Heading>
                            <Text color="gray.500">Melihat rincian penumpang untuk ID Periode: #{id}</Text>
                        </Box>
                    </Flex>

                    {/* Area Konten */}
                    {loading ? (
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
                        <Flex justify="center" align="center" p={10}>
                            <Spinner size="xl" color="blue.500" />
                            <Text ml={3}>Memuat data detail...</Text>
                        </Flex>
                        </Box>
                    ) : dataDetail ? (
                        <>
                        {/* KARTU RINGKASAN (SUMMARY) */}
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
                            <Box bg="white" p={5} borderRadius="xl" shadow="sm" borderWidth="1px" borderLeftWidth="4px" borderLeftColor="blue.500">
                            <Text fontSize="sm" color="gray.500" fontWeight="bold">Periode Tanggal</Text>
                            <Text fontSize="md" fontWeight="bold" mt={1}>
                                {dataDetail.informasi_periode.periode_awal} - {dataDetail.informasi_periode.periode_akhir}
                            </Text>
                            </Box>
                            <Box bg="white" p={5} borderRadius="xl" shadow="sm" borderWidth="1px" borderLeftWidth="4px" borderLeftColor="purple.500">
                            <Text fontSize="sm" color="gray.500" fontWeight="bold">Total Penumpang</Text>
                            <Text fontSize="xl" fontWeight="bold" mt={1}>
                                {dataDetail.informasi_periode.total_kursi} Kursi
                            </Text>
                            </Box>
                            <Box bg="white" p={5} borderRadius="xl" shadow="sm" borderWidth="1px" borderLeftWidth="4px" borderLeftColor="green.500">
                            <Text fontSize="sm" color="gray.500" fontWeight="bold">Pendapatan Komisi</Text>
                            <Text fontSize="xl" fontWeight="bold" color="green.600" mt={1}>
                                {formatRupiah(dataDetail.informasi_periode.total_komisi)}
                            </Text>
                            </Box>
                            <Box bg="white" p={5} borderRadius="xl" shadow="sm" borderWidth="1px" borderLeftWidth="4px" borderLeftColor="orange.500">
                            <Text fontSize="sm" color="gray.500" fontWeight="bold">Total Setor Admin</Text>
                            <Text fontSize="xl" fontWeight="bold" color="orange.600" mt={1}>
                                {formatRupiah(dataDetail.informasi_periode.total_setor)}
                            </Text>
                            </Box>
                        </SimpleGrid>

                        {/* TABEL DAFTAR PENUMPANG */}
                        <Box bg="white" borderRadius="xl" shadow="sm" overflow="hidden" borderWidth="1px">
                            <Box p={5} bg="gray.50" borderBottomWidth="1px">
                            <Heading size="md" color="gray.700">Rincian Tiket Penumpang</Heading>
                            </Box>
                            
                            <Box overflowX="auto">
                            <Table variant="simple">
                                <Thead bg="gray.50">
                                <Tr>
                                    <Th>No</Th>
                                    <Th>Kode Tiket</Th>
                                    <Th>Nama Penumpang</Th>
                                    <Th>No. Kursi</Th>
                                    <Th>Rute</Th>
                                    <Th>Waktu Keberangkatan</Th>
                                    <Th isNumeric>Harga Tiket</Th>
                                    <Th isNumeric>Komisi Agen</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                {dataDetail.daftar_penumpang && dataDetail.daftar_penumpang.length > 0 ? (
                                    dataDetail.daftar_penumpang.map((penumpang, index) => (
                                    <Tr key={index} _hover={{ bg: "gray.50" }}>
                                        <Td>{index + 1}</Td>
                                        <Td fontWeight="bold" color="blue.600">{penumpang.kode_tiket}</Td>
                                        <Td>{penumpang.nama_penumpang}</Td>
                                        <Td>
                                        <Badge colorScheme="purple" borderRadius="full" px={2}>
                                            {penumpang.nomor_kursi}
                                        </Badge>
                                        </Td>
                                        <Td>{penumpang.rute}</Td>
                                        <Td>{penumpang.waktu_berangkat}</Td>
                                        <Td isNumeric>{formatRupiah(penumpang.harga_tiket)}</Td>
                                        <Td isNumeric fontWeight="bold" color="green.600">
                                        {formatRupiah(penumpang.komisi_agen)}
                                        </Td>
                                    </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                    <Td colSpan={8} textAlign="center" py={6} color="gray.500">
                                        Tidak ada data penumpang untuk periode ini.
                                    </Td>
                                    </Tr>
                                )}
                                </Tbody>
                            </Table>
                            </Box>
                        </Box>
                        </>
                    ) : (
                        <Box bg="white" p={6} borderRadius="xl" shadow="sm" textAlign="center">
                        <Text color="red.500">Data tidak ditemukan atau terjadi kesalahan.</Text>
                        </Box>
                    )}
                </Box>
            </Box>
        </Flex>
    );
};


export default DetailPeriodeAgent;