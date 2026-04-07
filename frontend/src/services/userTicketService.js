import axios from 'axios';
import { API_BASE_URL } from '../api/apiConfig';

export const downloadUserTicketPDF = async (ticketId) => {
    try {
        // endpoint khusus user
        const response = await axios.get(`${API_BASE_URL}/user-ticket-pdf/`, {
            params: { ticket_id: ticketId },
            responseType: 'blob', 
            withCredentials: true
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = `E-Ticket_Surya_Kencana_${ticketId}.pdf`; 
        
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1].replace(/['"]/g, ''); 
            }
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.setAttribute('download', fileName);
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error("Gagal mengunduh PDF User:", error);
        throw error;
    }
};