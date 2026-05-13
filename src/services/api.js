import axios from 'axios';

const API_URL = 'https://securevault-api-o0tw.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  getMe: () => api.get('/users/me'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getLogs: () => api.get('/admin/logs'),
};

export const documentService = {
  getMyDocuments: () => api.get('/documents/my'),
  getDocumentById: (id) => api.get(`/documents/${id}`),
};

export default api;