import { API_BASE_URL } from './apiConfig';


// Ambil data profil user
export const getUserProfile = async (userId) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}/profile/`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal memuat profil");
  return await res.json();
};

// Update data profil user
export const updateUserProfile = async (userId, userData) => {
  const res = await fetch(`${API_BASE_URL}/user/${userId}/update/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil");
  return data;
};

// mengambil data jadwal
export const getJadwalUser = async (filters = null) => {
  let url = `${API_BASE_URL}/jadwal/search/`;
  if (filters) {
    const params = new URLSearchParams();
    if (filters.origin) params.append("asal", filters.origin);
    if (filters.destination) params.append("tujuan", filters.destination);
    if (filters.date) params.append("tanggal", filters.date);
    url += `?${params.toString()}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// mengambil data kursi
export const getSeatsUser = async (tripId) => {
  const res = await fetch(`${API_BASE_URL}/jadwal/${tripId}/seats/`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// mengambil promo aktif
export const getActivePromos = async () => {
  const res = await fetch(`${API_BASE_URL}/user/active-promo/`, { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat promo");
  return await res.json();
};

// buat pesanan
export const createOrder = async (payload) => {
  const res = await fetch(`${API_BASE_URL}/user/order/create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Gagal membuat pesanan");
  return data;
};

// batal pesanan
export const cancelOrder = async (orderId) => {
  const res = await fetch(`${API_BASE_URL}/order/${orderId}/cancel/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return await res.json();
};

// riwayat pesanan
export const getPesananUser = async (page = 1, perPage = 10) => {
  
  const res = await fetch(`${API_BASE_URL}/user/pesanan-saya/?page=${page}&per_page=${perPage}`, {
    method: "GET",
    headers: {
      "Accept": "application/json", 
    },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Gagal mengambil data pesanan");
  return await res.json();
};

// download tiket pdf
export const downloadTicketPdf = async (orderId) => {
  const res = await fetch(`${API_BASE_URL}/order/${orderId}/download/`, {
    method: "GET",
    credentials: "include",
  });
  
  if (!res.ok) throw new Error("Gagal mengunduh tiket");
  
  return await res.blob(); 
};