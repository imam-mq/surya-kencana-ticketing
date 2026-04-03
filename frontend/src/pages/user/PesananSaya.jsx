import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";

// Printer icon inline SVG
const PrinterIcon = () => (
  <Icon
    viewBox="0 0 16 16"
    boxSize="13px"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="1" width="10" height="6" rx="1" />
    <path d="M3 7H1v6h14V7h-2" />
    <rect x="4" y="10" width="8" height="4" rx="0.5" />
  </Icon>
);

export default function PesananSaya() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntri, setTotalEntri] = useState(0);
  const perPage = 10;

  useEffect(() => {
    fetchPesanan(currentPage);
  }, [currentPage]);

  const fetchPesanan = async (page) => {
    setLoading(true);
    try {
      // endpoint dari be
      const res = await fetch(`/api/pesanan-saya?page=${page}&per_page=${perPage}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
      });
      const json = await res.json();
      // respon data dari BE
      setPesanan(json.data ?? []);
      setTotalEntri(json.total ?? 0);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalEntri / perPage));
  const from = totalEntri === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, totalEntri);

  const handleCetakTiket = (id) => {
    // TODO: Implementasi cetak tiket
    window.open(`/cetak-tiket/${id}`, "_blank");
  };

  // Pagination dengan ellipsis
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
    <Box px={{ base: 4, md: 8 }} py={6}>
      {/* Breadcrumb */}
      <Breadcrumb
        spacing="4px"
        separator={<ChevronRightIcon color="gray.400" boxSize="14px" />}
        fontSize="sm"
        mb={4}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/" color="blue.500">
            Beranda
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="gray.500">Pesanan saya</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading as="h1" fontSize="xl" fontWeight="600" mb={5} color="gray.800">
        Pesanan saya
      </Heading>

      {/* Card tabel */}
      <Box
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <Tr>
                {[
                  "No",
                  "Tanggal",
                  "No Kursi",
                  "Keberangkatan",
                  "Kedatangan",
                  "Jenis.K",
                  "Nama",
                  "Email",
                  "Kontak",
                  "Status",
                ].map((col) => (
                  <Th
                    key={col}
                    fontSize="10px"
                    letterSpacing="0.07em"
                    textTransform="uppercase"
                    color="gray.500"
                    fontWeight="500"
                    py={3}
                    px={4}
                    whiteSpace="nowrap"
                  >
                    {col}
                  </Th>
                ))}
                <Th
                  fontSize="10px"
                  letterSpacing="0.07em"
                  textTransform="uppercase"
                  color="gray.500"
                  fontWeight="500"
                  py={3}
                  px={4}
                  isNumeric
                >
                  Aksi
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={11} textAlign="center" py={12}>
                    <Flex justify="center" align="center" gap={3}>
                      <Spinner size="sm" color="blue.500" />
                      <Text fontSize="sm" color="gray.400">Memuat data...</Text>
                    </Flex>
                  </Td>
                </Tr>
              ) : pesanan.length === 0 ? (
                <Tr>
                  <Td colSpan={11} textAlign="center" py={14}>
                    <Text fontSize="sm" color="gray.400">Belum ada pesanan.</Text>
                  </Td>
                </Tr>
              ) : (
                pesanan.map((item, index) => (
                  <Tr
                    key={item.id}
                    _hover={{ bg: "gray.50" }}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                    transition="background 0.15s"
                  >
                    <Td px={4} py={3} color="gray.400" fontSize="sm">{from + index}</Td>
                    <Td px={4} py={3} color="gray.500" fontSize="sm" whiteSpace="nowrap">{item.tanggal}</Td>
                    <Td px={4} py={3}>
                      <Badge bg="blue.50" color="blue.600" borderRadius="md" px={2} py="3px" fontSize="xs" fontWeight="500">
                        {item.no_kursi}
                      </Badge>
                    </Td>
                    <Td px={4} py={3} fontSize="sm" color="gray.700">{item.keberangkatan}</Td>
                    <Td px={4} py={3} fontSize="sm" color="gray.700">{item.kedatangan}</Td>
                    <Td px={4} py={3} fontSize="sm" color="gray.500">{item.jenis_kelamin}</Td>
                    <Td px={4} py={3} fontSize="sm" fontWeight="500" color="gray.800">{item.nama}</Td>
                    <Td px={4} py={3} fontSize="xs" color="gray.500">{item.email}</Td>
                    <Td px={4} py={3} fontSize="xs" color="gray.500">{item.kontak}</Td>
                    
                    {/* Render Status Pembayaran */}
                    <Td px={4} py={3}>
                      <Badge
                        bg={item.status === 'PAID' ? "green.50" : "orange.50"}
                        color={item.status === 'PAID' ? "green.600" : "orange.600"}
                        borderRadius="md" px={2} py="3px" fontSize="xs" fontWeight="600"
                      >
                        {item.status || "PENDING"}
                      </Badge>
                    </Td>

                    <Td px={4} py={3} isNumeric>
                      <Button
                        size="sm"
                        bg="blue.500"
                        color="white"
                        _hover={{ bg: "blue.600" }}
                        _active={{ bg: "blue.700" }}
                        fontSize="xs"
                        fontWeight="500"
                        borderRadius="md"
                        leftIcon={<PrinterIcon />}
                        isDisabled={item.status !== 'PAID'} // <-- Sesuai SRS: akan aktif jika pembayaran berhasil
                        onClick={() => handleCetakTiket(item.id)}
                      >
                        Cetak tiket
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Footer pagination */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={3}
          borderTop="1px solid"
          borderColor="gray.100"
          flexWrap="wrap"
          gap={2}
        >
          <Text fontSize="xs" color="gray.400">
            {totalEntri === 0
              ? "Tidak ada entri"
              : `Menampilkan ${from}–${to} dari ${totalEntri} entri`}
          </Text>

          <HStack spacing={1}>
            <IconButton
              icon={<ChevronLeftIcon />}
              size="sm"
              variant="outline"
              borderColor="gray.200"
              color="gray.500"
              borderRadius="md"
              isDisabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Sebelumnya"
              _hover={{ bg: "gray.50" }}
              h="30px"
              minW="30px"
            />

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <Text key={`e-${i}`} fontSize="xs" color="gray.400" px={1}>
                  ...
                </Text>
              ) : (
                <Button
                  key={p}
                  size="sm"
                  h="30px"
                  minW="30px"
                  px={0}
                  fontSize="xs"
                  fontWeight="500"
                  borderRadius="md"
                  variant={p === currentPage ? "solid" : "outline"}
                  bg={p === currentPage ? "blue.500" : "transparent"}
                  color={p === currentPage ? "white" : "gray.600"}
                  borderColor={p === currentPage ? "blue.500" : "gray.200"}
                  _hover={{ bg: p === currentPage ? "blue.600" : "gray.50" }}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </Button>
              )
            )}

            <IconButton
              icon={<ChevronRightIcon />}
              size="sm"
              variant="outline"
              borderColor="gray.200"
              color="gray.500"
              borderRadius="md"
              isDisabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Selanjutnya"
              _hover={{ bg: "gray.50" }}
              h="30px"
              minW="30px"
            />
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}