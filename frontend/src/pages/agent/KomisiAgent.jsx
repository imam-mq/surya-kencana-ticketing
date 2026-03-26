import React, { useState, useEffect } from "react";
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Flex, Input, useDisclosure, Spinner, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { HiSwitchHorizontal } from "react-icons/hi";
import Sidebar_Agent from "./layout/Sidebar_Agent";
import Agent_Navbar from "./layout/Agent_Navbar";
import ModalTransfer from "../../components/ui/ModalTransfer";

// --- IMPORT API ---
import { getCommissionReport } from "../../api/agentApi";
import { formatRupiah } from "../../utils/formatters";

const KomisiAgent = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataKomisi, setDataKomisi] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      // endpoint agentApi
      const riwayatList = await getCommissionReport({ start_date: startDate, end_date: endDate });

      const formattedData = riwayatList.map((item) => ({
        id: item.id,
        isCurrentBill: item.status === "BELUM BAYAR", 
        periode: `${item.periode_awal || '-'} s/d ${item.periode_akhir || '-'}`,
        totalTiket: item.total_kursi || 0,
        totalTransaksi: item.total_transaksi,
        totalKomisi: item.total_komisi,
        setor: item.total_setor_admin,
        status: item.status === "BELUM BAYAR" ? "belum bayar" :
                item.status === "MENUNGGU" ? "menunggu verifikasi" : 
                item.status === "DITERIMA" ? "sudah bayar" : "ditolak",
        canTransfer: item.status === "BELUM BAYAR", 
        bukti_transfer: item.bukti_transfer
      }));

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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTransferClick = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const handleSuccessTransfer = () => {
    onClose();
    fetchData(); 
  };

  const handleDetailClick = (periodeId) => {
    navigate(`/agent/komisi/detailpriodeagent/${periodeId}`);
  };

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar_Agent />

      <Box flex="1" flexDirection="column">
        <Agent_Navbar />

        <Box p={8}>
          <Box mb={8}>
            <Heading size="lg" color="gray.700">Manajemen Komisi Agent</Heading>
            <Text color="gray.500">Laporan komisi agent • setor admin</Text>
          </Box>

          <Box bg="white" p={6} borderRadius="xl" shadow="sm" mb={6}>
            <Flex gap={4} align="end" wrap="wrap">
              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.600">Dari Tanggal</Text>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </Box>
              <Box flex="1" minW="200px">
                <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.600">Sampai Tanggal</Text>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </Box>
              <Button colorScheme="blue" px={8} alignSelf="end" onClick={fetchData}>Cari</Button>
            </Flex>
          </Box>

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
                        <Tr><Td colSpan={8} textAlign="center" py={6} color="gray.500">Tidak ada data tagihan atau riwayat.</Td></Tr>
                    ) : (
                        dataKomisi.map((item, index) => (
                          <Tr key={index} _hover={{ bg: "gray.50" }}>
                            <Td>{index + 1}</Td>
                            <Td fontWeight="medium">{item.periode}</Td>
                            <Td>{item.totalTiket}</Td>
                            <Td isNumeric>{formatRupiah(item.totalTransaksi)}</Td>
                            <Td isNumeric color="green.600">{formatRupiah(item.totalKomisi)}</Td>
                            <Td isNumeric fontWeight="bold" color="blue.600">{formatRupiah(item.setor)}</Td>
                            <Td>
                              <Badge px={3} py={1} borderRadius="full" colorScheme={item.status === "sudah bayar" ? "green" : item.status === "menunggu verifikasi" ? "yellow" : "red"}>
                                {item.status.toUpperCase()}
                              </Badge>
                            </Td>
                            <Td>
                              {item.canTransfer ? (
                                  <Button size="sm" textColor="white" leftIcon={<HiSwitchHorizontal />} colorScheme="yellow" onClick={() => handleTransferClick(item)} boxShadow="sm">Transfer</Button>
                                ) : (
                                  <Button size="sm" colorScheme="blue" variant="outline" onClick={() => handleDetailClick(item.id)}>Detail</Button>
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
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>

      <ModalTransfer isOpen={isOpen} onClose={onClose} data={selectedItem} onSuccess={handleSuccessTransfer} />
    </Flex>
  );
};

export default KomisiAgent;