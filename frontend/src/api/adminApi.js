import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const adminClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// --- DASHBOARD & USERS ---
export const getAdminUsers = async () => {
  const res = await adminClient.get('/admin/users/');
  return res.data;
};

// --- AGENTS ---
export const getAdminAgents = async () => {
  const res = await adminClient.get('/admin/agents/');
  return res.data;
};
export const createAdminAgent = async (payload) => {
  const res = await adminClient.post('/admin/agents/', payload);
  return res.data;
};
export const updateAdminAgent = async (id, payload) => {
  const res = await adminClient.put(`/admin/agents/${id}/`, payload);
  return res.data;
};
export const deleteAdminAgent = async (id) => {
  const res = await adminClient.delete(`/admin/agents/${id}/`);
  return res.data;
};

// --- JADWAL & BUS ---
export const getAdminBusList = async () => {
  const res = await adminClient.get('/admin/bus/');
  return res.data;
};
export const getAdminJadwalList = async () => {
  const res = await adminClient.get('/admin/jadwal/');
  return res.data;
};
export const createAdminJadwal = async (payload) => {
  const res = await adminClient.post('/admin/jadwal/', payload);
  return res.data;
};
export const getAdminJadwalDetail = async (id) => {
  const res = await adminClient.get(`/admin/jadwal/${id}/`);
  return res.data;
};
export const updateAdminJadwal = async (id, payload) => {
  const res = await adminClient.put(`/admin/jadwal/${id}/`, payload);
  return res.data;
};
export const deleteAdminJadwal = async (id) => {
  const res = await adminClient.delete(`/admin/jadwal/${id}/`);
  return res.data;
};
export const getAdminJadwalPenumpang = async (id) => {
  const res = await adminClient.get(`/admin/jadwal/${id}/detail-penumpang/`);
  return res.data;
};

// status user
export const toggleUserStatus = async (id) => {
  const res = await adminClient.patch(`/admin/users/${id}/toggle/`);
  return res.data;
};

// --- PROMO ---
export const getAdminPromoList = async () => {
  const res = await adminClient.get('/admin/promo/');
  return res.data;
};
export const createAdminPromo = async (payload) => {
  const res = await adminClient.post('/admin/promo/', payload);
  return res.data;
};
export const getPromoDetail = async (id) => {
  const res = await adminClient.get(`/admin/promo/${id}/`);
  return res.data;
};
export const updateAdminPromo = async (id, payload) => {
  const res = await adminClient.put(`/admin/promo/${id}/`, payload);
  return res.data;
};
export const deleteAdminPromo = async (id) => {
  const res = await adminClient.delete(`/admin/promo/${id}/`);
  return res.data;
};

// --- LAPORAN TRANSAKSI ---
export const getAdminLaporanTransaksi = async (filters) => {
  const res = await adminClient.get('/admin/laporan-transaksi/', { params: filters });
  return res.data;
};

export const getAdminLaporanTransaksiDetail = async (id) => {
  const res = await adminClient.get(`/admin/laporan-transaksi/${id}/detail/`);
  return res.data;
};