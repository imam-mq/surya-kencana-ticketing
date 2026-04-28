import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

authClient.interceptors.request.use((config) => {
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break
        }
      }
    }
    return cookieValue;
  };
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken; 
  }
  
  return config;
});

export const getCsrfToken = async () => {
  const res = await authClient.get('/get-csrf/');
  return res.data;
};

// Auth Login Logout User
export const loginUserApi = async (payload) => {
  const res = await authClient.post('/login-user/', payload);
  return res.data;
};

export const logoutUserApi = async (payload) => {
  const res = await authClient.post('/logout-user/', payload);
  return res.data;
}

// Auth Admin Login Logout
export const loginAdminApi = async (payload) => {
  const res = await authClient.post('/login-admin-api/', payload);
  return res.data;
};

export const logoutAdminAccount = async (payload) => {
  const res = await authClient.post('/logout-admin-api/', payload);
  return res.data;
};

// Auth Login Logout Agent 
export const loginAgentApi = async (payload) => {
  const res = await authClient.post('/login-agent/', payload);
  return res.data;
};

export const logoutAgentAccount = async (payload) => {
  const res = await authClient.post('/logout_agent/', payload);
  return res.data;
}

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