import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  VStack,
  HStack,
  Input,
  Image,
  useToast,
  Divider,
  Icon,
  Badge,
} from "@chakra-ui/react";
import axios from "axios";
import { FaCloudUploadAlt, FaMoneyBillWave, FaTrash } from "react-icons/fa";

const ModalTransfer = ({ isOpen, onClose, data, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Reset state ketika modal dibuka/ditutup
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setPreview(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Fungsi untuk menangani perubahan file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validasi tipe file (hanya gambar)
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "File salah!",
          description: "Harap upload file gambar (JPG/PNG).",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Bukti Transfer Kosong",
        description: "Mohon upload foto bukti transfer terlebih dahulu.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Gunakan FormData karena kita mengirim FILE (image)
      const formData = new FormData();
      formData.append('bukti_transfer', file);

      // 2. Kirim ke API Backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/accounts/agent/submit-transfer/",
        formData,
        {
          withCredentials: true, // WAJIB agar session login (cookie) terbawa
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Backend kita mengembalikan success: True atau status 201
      if (response.status === 201 || response.data.success) {
        toast({
          title: "Laporan Terkirim!",
          description: "Admin akan segera memverifikasi pembayaran Anda.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        onSuccess(); // Refresh data di halaman utama
        onClose();   // Tutup modal
      }
    } catch (error) {
      console.error("Error upload bukti:", error);
      toast({
        title: "Gagal Mengirim",
        description: error.response?.data?.error || "Terjadi kesalahan pada server.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
      
      <ModalContent borderRadius="2xl" overflow="hidden">
        <ModalHeader bg="blue.600" color="white" textAlign="center" py={4}>
          Konfirmasi Setoran
          <Text fontSize="xs" fontWeight="normal" opacity={0.9} mt={1}>
            Periode: {data?.periode || "-"}
          </Text>
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody py={6} bg="gray.50">
          <VStack spacing={5} align="stretch">
            
            {/* 1. Card Total Tagihan */}
            <Box bg="white" p={4} borderRadius="xl" shadow="sm" border="1px" borderColor="gray.200">
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.500">Total Wajib Setor</Text>
                  <Text fontSize="2xl" fontWeight="800" color="blue.600">
                    {/* Pastikan data setor sudah dalam format Rp dari halaman sebelumnya */}
                    {data?.setor || "Rp 0"}
                  </Text>
                </VStack>
                <Icon as={FaMoneyBillWave} boxSize={8} color="green.400" />
              </HStack>
            </Box>

            {/* 2. Informasi Rekening Tujuan */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                Transfer ke Rekening Admin:
              </Text>
              <Box bg="blue.50" p={3} borderRadius="lg" border="1px dashed" borderColor="blue.300">
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold" color="blue.800">BANK BRI</Text>
                    <Text fontSize="sm" color="blue.700">1234-5678-9000</Text>
                    <Text fontSize="xs" color="blue.600">A.n: Supatji (Admin)</Text>
                  </Box>
                  <Badge colorScheme="blue" variant="solid">SALIN</Badge>
                </HStack>
              </Box>
            </Box>

            <Divider borderColor="gray.300" />

            {/* 3. Area Upload Bukti */}
            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
                Upload Bukti Transfer
              </Text>

              {!preview ? (
                <Box>
                  <Input
                    type="file"
                    accept="image/*"
                    id="upload-bukti"
                    display="none"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-bukti">
                    <Box
                      h="150px"
                      border="2px dashed"
                      borderColor="gray.400"
                      borderRadius="xl"
                      bg="white"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{ borderColor: "blue.500", bg: "blue.50" }}
                    >
                      <Icon as={FaCloudUploadAlt} w={10} h={10} color="gray.400" mb={2} />
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        Klik untuk upload foto
                      </Text>
                      <Text fontSize="xs" color="gray.400">Format: JPG, PNG</Text>
                    </Box>
                  </label>
                </Box>
              ) : (
                <Box position="relative" borderRadius="xl" overflow="hidden" shadow="md">
                  <Image 
                    src={preview} 
                    alt="Preview Bukti" 
                    objectFit="cover" 
                    w="100%" 
                    maxH="200px" 
                  />
                  <Button
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top={2}
                    right={2}
                    leftIcon={<FaTrash />}
                    onClick={handleRemoveFile}
                  >
                    Hapus
                  </Button>
                </Box>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter bg="white" borderTopWidth="1px">
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>
            Batal
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleSubmit} 
            isDisabled={!file} 
            isLoading={isSubmitting}
            loadingText="Mengirim..."
          >
            Kirim Laporan
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalTransfer;