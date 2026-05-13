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
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getLogs: () => api.get('/admin/logs'),
  getAllUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  getAllDocuments: () => api.get('/admin/documents'),
  updateUserRole: (id, role) => api.patch(`/admin/users/${id}/role`, { role }),
};

export const documentService = {
  getMyDocuments: () => api.get('/documents/my'),
  getDocumentById: (id) => api.get(`/documents/${id}`),
  createDocument: (formData) => api.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDocument: (id) => api.delete(`/documents/${id}`),
};

export const userService = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/profile', data),
  updatePassword: (data) => api.patch('/users/password', data),
};

export default api;