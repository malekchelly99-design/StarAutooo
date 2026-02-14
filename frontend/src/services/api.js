'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
};

// Car APIs
export const carAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/cars', { params });
    return res.data;
  },
  
  getById: async (id) => {
    const res = await api.get(`/cars/${id}`);
    return res.data;
  },
  
  create: async (data) => {
    const res = await api.post('/cars', data);
    return res.data;
  },
  
  update: async (id, data) => {
    const res = await api.put(`/cars/${id}`, data);
    return res.data;
  },
  
  delete: async (id) => {
    const res = await api.delete(`/cars/${id}`);
    return res.data;
  },
};

// Favorite APIs
export const favoriteAPI = {
  getAll: async (userId) => {
    const res = await api.get('/favorites', { params: { userId } });
    return res.data;
  },
  
  add: async (userId, carId) => {
    const res = await api.post('/favorites', { userId, carId });
    return res.data;
  },
  
  remove: async (userId, carId) => {
    const res = await api.delete('/favorites', { params: { userId, carId } });
    return res.data;
  },
};

// Message APIs
export const messageAPI = {
  getAll: async () => {
    const res = await api.get('/messages');
    return res.data;
  },
  
  create: async (data) => {
    const res = await api.post('/messages', data);
    return res.data;
  },
};

export default api;
