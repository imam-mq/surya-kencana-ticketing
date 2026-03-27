import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getCsrfToken = async () => {
  const res = await authClient.get('/get-csrf/');
  return res.data;
};

export const loginUserApi = async (payload) => {
  const res = await authClient.post('/login-user/', payload);
  return res.data;
};

export const loginAdminApi = async (payload) => {
  const res = await authClient.post('/login-admin-api/', payload);
  return res.data;
};

export const loginAgentApi = async (payload) => {
  const res = await authClient.post('/login-agent/', payload);
  return res.data;
};

export const registerUserApi = async (payload) => {
  const res = await authClient.post('/register/', payload);
  return res.data;
};

// --- TAMBAHKAN EMAIL ---
export const verifyEmailApi = async (token) => {
  const res = await authClient.post('/verify-email/', { token });
  return res.data;
};