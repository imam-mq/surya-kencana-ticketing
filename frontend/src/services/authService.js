import { requestPasswordReset, confirmPasswordReset } from '../api/authApi';
import { isValidEmail, isStrongPassword } from '../utils/validators';

/**
 * Service untuk proses permintaan reset pass
*/

export const processForgotPassword = async (email) => {
    // validasi
    if (!email) {
        throw new Error("Email tidak boleh kosong.");
    }
    if (!isValidEmail(email)) {
        throw new Error("Format email tidak valid.");
    }

    // Eksekusi API
    try {
        const response = await requestPasswordReset(email);
        return response; // Berisi { success: true, message: "..." }
    } catch (error) {
        // Tangkap error dari backend agar formatnya rapi
        const errorMessage = error.response?.data?.error || "Terjadi kesalahan pada server.";
        throw new Error(errorMessage);
    }
};

/**
 * Service untuk memproses penggantian password baru menggunakan token
*/

export const processResetPassword = async (token, newPassword, confirmPassword) => {
    // validasi passwod
    if (newPassword !== confirmPassword) {
        throw new Error("Password baru dan konfirmasi password tidak cocok.");
    }

    // validasi confir kecocokan pass
    if (!isStrongPassword(newPassword)) {
        throw new Error("Password terlalu lemah. Gunakan minimal 8 karakter.");
    }

    // 3. Eksekusi API
    try {
        // Mengirim data dalam bentuk object payload 
        const response = await confirmPasswordReset({ 
            token: token, 
            newPassword: newPassword 
        });
        return response;
    } catch (error) {
        const errorMessage = error.response?.data?.error || "Gagal mereset password. Token mungkin tidak valid atau kadaluarsa.";
        throw new Error(errorMessage);
    }
};