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

export const logoutAdminAccount = async (payload) => {
  const res = await authClient.post('/logout-admin-api/', payload);
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

export const verifyEmailApi = async (token) => {
  const res = await authClient.post('/verify-email/', { token });
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await authClient.post('/request-reset-password/', { email });
  return res.data;
};

export const confirmPasswordReset = async (payload) => {
  const res = await authClient.post('/confirm-reset-password/', payload);
  return res.data;
};