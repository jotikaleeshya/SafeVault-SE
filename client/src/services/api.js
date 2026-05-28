import axios from 'axios';

const API_BASE = '/api';

// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safevault_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth endpoints
export const authService = {
  login: (email, masterPassword) =>
    api.post('/auth/login', { email, masterPassword }),

  register: (email, masterPassword) =>
    api.post('/auth/register', { email, masterPassword }),

  verifyMasterPassword: (masterPassword) =>
    api.post('/auth/verify-master', { masterPassword }),

  getMe: () => api.get('/auth/me'),
};

// Vault endpoints
export const vaultService = {
  getEntries: () => api.get('/vault'),

  getEntry: (id) => api.get(`/vault/${id}`),

  revealEntry: (id) => api.post(`/vault/${id}/reveal`),

  createEntry: (data) => api.post('/vault', data),

  updateEntry: (id, data) => api.put(`/vault/${id}`, data),

  deleteEntry: (id) => api.delete(`/vault/${id}`),

  getSecurityAnalysis: () => api.get('/vault/security'),
};

export default api;
