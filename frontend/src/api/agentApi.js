import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

// Konfigurasi Axios Agent
const agentClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Cek Sesi Login
export const checkSession = async () => {
  const res = await agentClient.get('/auth/check-session/');
  return res.data;
};

// Ambil Statistik Dashboard
export const getDashboardStats = async (filters) => {
  const res = await agentClient.get('/agent/dashboard-stats/', { params: filters });
  return res.data;
};

// Ambil Jadwal Keberangkatan Agent
export const getAgentJadwal = async (filters) => {
  const res = await agentClient.get('/agent/jadwal/', { params: filters });
  return res.data;
};

// Cari Jadwal (Pemesanan Tiket Agent)
export const searchAgentSchedule = async (filters) => {
  const res = await agentClient.get('/schedule/search/', { params: filters });
  return res.data;
};

// Ambil Denah Kursi
export const getAgentSeats = async (tripId) => {
  const res = await agentClient.get(`/jadwal/${tripId}/seats/`);
  return res.data;
};

// Buat Booking Agent
export const createAgentBooking = async (payload) => {
  const res = await agentClient.post('/booking/agent/', payload);
  return res.data;
};

// Ambil Laporan Komisi Agent
export const getCommissionReport = async (filters) => {
  const res = await agentClient.get('/agent/commission-report/', { params: filters });
  return res.data;
};

// Ambil Detail Periode Agent
export const getPeriodDetail = async (periodeId) => {
  const res = await agentClient.get(`/agent/periode/${periodeId}/detail/`);
  return res.data;
};

// Ambil Laporan Tiket Agent
export const getTicketReport = async (filters) => {
  const res = await agentClient.get('/agent/ticket-report/', { params: filters });
  return res.data;
};

// Ambil Daftar Tiket Terbit
export const getIssuedTickets = async () => {
  const res = await agentClient.get('/agent/tickets/');
  return res.data;
};

const config = {
  withCredentials: true, // <-- INI KUNCI UTAMANYA! 🔑
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getMyProfile = async () => {
  const res = await agentClient.get('/agen/profil_agent/', config);
  return res.data;
};


export const updateMyProfile = async (payload) => {
  const res = await agentClient.put('/agen/profil_agent/', payload, config);
  return res.data;
};
