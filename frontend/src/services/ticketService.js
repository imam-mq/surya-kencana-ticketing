import axios from 'axios';
import { API_BASE_URL } from '../api/apiConfig';

/**
 * Service khusus untuk download PDF Tiket
 * Logika ini dipisah dari API biasa karena menangani data Binary (Blob)
 */
export const downloadTicketPDF = async (ticketId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/agent-ticket-pdf/`, {
            params: { ticket_id: ticketId },
            responseType: 'blob', // WAJIB: Supaya PDF tidak rusak saat diterima
            withCredentials: true
        });

        // 1. Ambil nama file dari header Content-Disposition (yang kita buat di Django tadi)
        const contentDisposition = response.headers['content-disposition'];
        let fileName = `Tiket_Surya_Kencana_${ticketId}.pdf`; 
        
        if (contentDisposition) {
            // Regex yang lebih aman untuk menangkap nama file
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1].replace(/['"]/g, ''); // Hapus tanda kutip jika ada
            }
        }

        // 2. Proses pembuatan file download di browser (Logika Blob)
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.setAttribute('download', fileName);
        
        // 3. Eksekusi "Klik" Bayangan
        document.body.appendChild(link);
        link.click();
        
        // 4. Bersihkan (Cleanup)
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error("Gagal mengunduh PDF:", error);
        throw error;
    }
};