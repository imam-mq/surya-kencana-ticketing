import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Box, 
  VStack, 
  Heading, 
  Text, 
  Button, 
  Icon, 
  Container,
  Divider,
  useColorModeValue
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { FaTicketAlt, FaHome } from 'react-icons/fa';




//fungsi memanggil id
const PaymentSuccess = () => {
    const { orderId } = useParams(); // mengambil id jika payment sukses
    const navigate = useNavigate();

    // latar belakang card
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const cardColor = useColorModeValue('white', 'gray.800');

    return (
        <Box bg={bgColor} minH="100vh" py={20} px={4}>
            <Container maxW="md">
                <VStack 
                    bg={cardColor} 
                    p={10} 
                    rounded="2xl" 
                    shadow="xl" 
                    spacing={6} 
                    textAlign="center"
                    borderWidth="1px"
                    >
                    {/* ikon sukses */}
                    <Box>
                        <Icon as={CheckCircleIcon} w={16} h={16} color="green.500" />
                    </Box>
                    <VStack spacing={2}>
                        <Heading as="h2" size="lg" fontWeight="black">
                            Pembayaran Berhasil!
                        </Heading>
                        <Text color="gray.500" fontSize="sm">
                            Pesanan <Text as="span" fontWeight="bold" color="blue.500">anda</Text> sudah kami terima. Tiket Anda sedang diproses.
                        </Text>
                    </VStack>
                    
                    <Divider borderStyle="dashed" borderColor="gray.300" />

                    {/* aksi */}
                    <VStack w="full" spacing={3}>
                        <Button 
                            leftIcon={<FaTicketAlt />} 
                            colorScheme="blue" 
                            size="lg" 
                            w="full" 
                            rounded="xl"
                            onClick={() => navigate('/user/PesananSaya')}
                            _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                            transition="all 0.2s"
                        >
                            Lihat Tiket Saya
                        </Button>

                        <Button 
                            leftIcon={<FaHome />} 
                            variant="outline" 
                            colorScheme="gray" 
                            size="lg" 
                            w="full" 
                            rounded="xl"
                            onClick={() => navigate('/')}
                        >
                            Kembali ke Beranda
                        </Button>
                    </VStack>

                    <Text fontSize="xs" color="gray.400">
                        E-Tiket sudah muncul dan cek tiket anda.
                    </Text>
                </VStack>
            </Container>
        </Box>
    );   
};

export default PaymentSuccess;