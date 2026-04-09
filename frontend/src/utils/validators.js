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

/**
 * Validasi NIK (16 Digit)
*/

export const isValidNIK = (nik) => {
    const nikRegex = /^[0-9]{16}$/;
    return nikRegex.test(nik);
};

/**
 * Validasi nomor telepon
*/
export const isValidPhone = (phone) => {
  const telpRegex = /^08[0-9]{8,11}$/;
  return telpRegex.test(phone);
};

// cek apakah ada data yang duplicate
export const hasDuplicateValues = (arrayValues) => {
    const uniqueValues = new Set(arrayValues);
    return uniqueValues.size !== arrayValues.length;
};