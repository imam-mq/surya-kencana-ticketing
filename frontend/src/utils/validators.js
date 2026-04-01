/**
 * Cek email apakah ada format @
*/

export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Cek apakah password sudah 8 karakter
*/

export const isStrongPassword = (password) => {
    return password.length >= 8; 
};