import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// Fungsi untuk mencari jadwal di halaman informasi publik
export const searchPublicSchedule = async (filters = {}) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/schedule/search/`, {
      params: {
        asal: filters.origin || "",
        tujuan: filters.destination || "",
        tanggal: filters.date || ""
      }
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("Gagal memuat jadwal publik:", error);
    throw error;
  }
};