import React, { useState } from "react";
import axios from "axios"; 
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Button, Box, Text, Divider, Flex, Image, useToast
} from "@chakra-ui/react";

const ModalValidasiTransfer = ({ open, onClose, data }) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!data) return null;

  // Helper Format Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  // Helper Cerdas untuk URL Gambar
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x200?text=No+Image"; 
    if (url.startsWith("http")) return url;
    return `http://127.0.0.1:8000${url}`;
  };

  const handleProses = async (aksi) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/accounts/admin/validasi-setoran/${data.id}/`, 
        { aksi: aksi }, 
        { withCredentials: true }
      );

      if (response.data.success) {
        toast({
          title: "Berhasil!",
          description: `Status setoran sekarang: ${aksi.toUpperCase()}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose(); // Tutup modal, parent akan refresh data otomatis
      }
    } catch (error) {
      console.error("Error validasi:", error);
      toast({
        title: "Gagal memproses",
        description: "Cek koneksi server Anda.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={loading ? undefined : onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader textAlign="center" fontWeight="extrabold">Validasi Transfer Agent</ModalHeader>
        <ModalCloseButton isDisabled={loading} />
        
        <ModalBody pb={6}>
          {/* GAMBAR BUKTI */}
          <Box mb={5}>
            <Text fontWeight="bold" mb={2} color="gray.700">Bukti Transfer</Text>
            <Image 
              src={getImageUrl(data.bukti_transfer)} 
              fallbackSrc="https://via.placeholder.com/400x200?text=Gagal+Memuat+Gambar"
              alt="Bukti Transfer"
              w="100%" 
              h="250px" 
              objectFit="contain" 
              borderRadius="lg" 
              border="1px solid" 
              borderColor="gray.200"
              bg="gray.50"
            />
          </Box>

          {/* DETAIL DATA */}
          <Text fontWeight="bold" mb={2} color="gray.700">Detail Pembayaran</Text>
          <Flex direction="column" gap={2} bg="gray.50" p={4} borderRadius="lg" border="1px solid" borderColor="gray.100">
            <Flex justify="space-between">
              <Text color="gray.500" fontSize="sm">Periode</Text>
              <Text fontWeight="semibold" fontSize="sm">{data.periode_awal} - {data.periode_akhir}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.500" fontSize="sm">Total Transaksi</Text>
              <Text fontWeight="semibold" fontSize="sm">{formatRupiah(data.total_tagihan)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="gray.500" fontSize="sm">Total Komisi</Text>
              <Text fontWeight="semibold" fontSize="sm" color="green.600">{formatRupiah(data.total_komisi)}</Text>
            </Flex>
            <Divider my={1} borderColor="gray.300" />
            <Flex justify="space-between" align="center">
              <Text color="gray.600" fontWeight="bold">Total Setor</Text>
              <Text fontWeight="extrabold" color="red.600" fontSize="lg">{formatRupiah(data.total_bayar)}</Text>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter gap={3} pt={0}>
          <Button 
            flex={1} 
            colorScheme="red" 
            variant="outline"
            isLoading={loading} 
            onClick={() => handleProses('tolak')}
          >
            Tolak Setoran
          </Button>
          <Button 
            flex={1} 
            colorScheme="green" 
            isLoading={loading} 
            onClick={() => handleProses('terima')}
          >
            Valid (Terima)
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalValidasiTransfer;