import axios from 'axios';

// Change this URL to your Render backend URL after deployment
// For local development, use: const API_BASE_URL = 'http://localhost:5000/api';
// For production on Render, use: const API_BASE_URL = 'https://your-backend-name.onrender.com/api';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  delete: (id) => api.delete(`/skills/${id}`),
};

export const certificatesAPI = {
  getAll: () => api.get('/certificates'),
  create: (data) => api.post('/certificates', data),
  update: (id, data) => api.put(`/certificates/${id}`, data),
  delete: (id) => api.delete(`/certificates/${id}`),
};

export const settingsAPI = {
  getWorkStatus: () => api.get('/settings/work-status'),
  updateWorkStatus: (workStatus) => api.put('/settings/work-status', { workStatus }),
  getCV: () => api.get('/settings/cv'),
  updateCV: (cvUrl) => api.put('/settings/cv', { cvUrl }),
  getProfileImage: () => api.get('/settings/profile-image'),
  updateProfileImage: (profileImage) => api.put('/settings/profile-image', { profileImage }),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (publicId) => api.delete(`/upload/${publicId}`),
};

export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getAllMessages: () => api.get('/contact/messages'),
  markAsRead: (id) => api.put(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
};

export default api;