import React, { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

// HANYA IMPORT DARI CHAKRA UI
import {
  Box, Flex, Heading, Text, Input, Button, 
  TableContainer, Table, Thead, Tbody, Tr, Th, Td, Badge,
  Card, CardBody, Spinner, useToast, Icon
} from "@chakra-ui/react";

import { FaCalendarAlt, FaSearch } from "react-icons/fa";

import Sidebar from "../layout/Sidebar";
import AdminNavbar from "../layout/AdminNavbar";
import ModalValidasiTransfer from "../../components/ui/ModalValidasiTransfer";

const Btransfer = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [transferData, setTransferData] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchTransferData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/accounts/admin/laporan-transaksi/", {
        withCredentials: true,
        params: { start_date: startDate, end_date: endDate, q: searchTerm }
      });
      setTransferData(response.data);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      toast({
        title: "Gagal memuat data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleOpenValidasi = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const getStatusStyle = (status) => {
    const s = status ? status.toUpperCase() : ""; 
    switch (s) {
      case "MENUNGGU": return { colorScheme: "yellow", label: "PENDING" };
      case "DITERIMA": return { colorScheme: "green", label: "SUDAH BAYAR" };
      case "DITOLAK":  return { colorScheme: "red", label: "DITOLAK" };
      default: return { colorScheme: "gray", label: s };
    }
  };

  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num || 0);

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar />
      <Box flex="1" flexDirection="column">
        <AdminNavbar />
        
        <Box p={8}>
          <Box mb={6}>
            <Heading size="lg" color="gray.800" mb={1}>Laporan Agent Transfer</Heading>
            <Text color="gray.500">Kelola dan validasi transfer komisi agent</Text>
          </Box>

          <Card mb={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <CardBody>
              <Flex gap={4} align="center" wrap="wrap">
                <Flex align="center" gap={3} flex={1} minW="200px">
                  <Icon as={FaCalendarAlt} color="blue.500" boxSize={5} />
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} size="md" />
                  <Text color="gray.500">—</Text>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} size="md" />
                </Flex>
                
                <Flex align="center" gap={3} flex={1} minW="200px">
                  <Icon as={FaSearch} color="gray.400" boxSize={5} />
                  <Input 
                    type="text" 
                    placeholder="Cari nama agent..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTransferData()}
                  />
                </Flex>
                
                <Button colorScheme="blue" px={8} onClick={fetchTransferData}>Cari</Button>
              </Flex>
            </CardBody>
          </Card>

          <TableContainer bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" shadow="sm">
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>No</Th>
                  <Th>Periode</Th>
                  <Th>Agent</Th>
                  <Th isNumeric>Tagihan</Th>
                  <Th isNumeric>Setor</Th>
                  <Th textAlign="center">Bukti</Th>
                  <Th textAlign="center">Status</Th>
                  <Th textAlign="center">Aksi</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan={8} textAlign="center" py={10}>
                      <Spinner size="md" color="blue.500" mr={3} /> Memuat data...
                    </Td>
                  </Tr>
                ) : transferData.length === 0 ? (
                  <Tr><Td colSpan={8} textAlign="center" py={10} color="gray.500">Belum ada data setoran.</Td></Tr>
                ) : (
                  transferData.map((item, index) => {
                    const style = getStatusStyle(item.status); 

                    return (
                      <Tr key={item.id} _hover={{ bg: "blue.50" }} transition="all 0.2s">
                        <Td>{index + 1}</Td>
                        <Td fontSize="sm">{item.periode_awal} s/d {item.periode_akhir}</Td>
                        <Td fontWeight="bold" color="gray.700">{item.agent_name}</Td>
                        
                        <Td isNumeric fontWeight="semibold" color="green.600">{formatRupiah(item.total_tagihan)}</Td>
                        <Td isNumeric fontWeight="extrabold" color="red.600">{formatRupiah(item.total_bayar)}</Td>
                        
                        <Td textAlign="center">
                          <Badge 
                            as="button"
                            onClick={() => window.open(`http://127.0.0.1:8000${item.bukti_transfer}`, "_blank")}
                            colorScheme="orange" variant="outline" px={3} py={1} borderRadius="full" cursor="pointer"
                          >
                            VIEW FILE
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          <Badge colorScheme={style.colorScheme} px={3} py={1} borderRadius="full">
                            {style.label}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          {item.status === 'MENUNGGU' && (
                            <Button colorScheme="blue" size="sm" onClick={() => handleOpenValidasi(item)} boxShadow="sm">
                              Validasi
                            </Button>
                          )}
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* MODAL CHAKRA UI */}
      <ModalValidasiTransfer 
        open={openModal} 
        onClose={() => { 
          setOpenModal(false); 
          fetchTransferData(); // Otomatis refresh tabel kalau modal ditutup (habis validasi)
        }} 
        data={selectedItem} 
      />
    </Flex>
  );
};

export default Btransfer;