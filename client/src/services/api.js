import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('safevault_token') 
             || sessionStorage.getItem('safevault_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register:             (email, masterPassword) => api.post('/auth/register',      { email, masterPassword }),
  login:                (email, masterPassword) => api.post('/auth/login',          { email, masterPassword }),
  getMe:                ()                      => api.get('/auth/me'),
  verifyMasterPassword: (masterPassword)        => api.post('/auth/verify-master',  { masterPassword }),
  updateSettings:       (settings)              => api.patch('/auth/settings',       settings),
  trustDevice:          (deviceId)              => api.post('/auth/trust-device',   { deviceId }),
  verifyDevice:         (email, deviceId)       => api.post('/auth/verify-device',  { email, deviceId }),
  removeDevice: (deviceId) => api.post('/auth/remove-device', { deviceId }),
  checkEmail: (email) => api.post('/auth/check-email', { email }),
};

export const vaultService = {
  getEntries:           ()           => api.get('/vault'),
  getEntry:             (id)         => api.get(`/vault/${id}`),
  revealEntry:          (id)         => api.post(`/vault/${id}/reveal`),
  createEntry:          (data)       => api.post('/vault', data),
  updateEntry:          (id, data)   => api.put(`/vault/${id}`, data),
  deleteEntry:          (id)         => api.delete(`/vault/${id}`),
  getSecurityAnalysis:  ()           => api.get('/vault/security'),
};

export default api;