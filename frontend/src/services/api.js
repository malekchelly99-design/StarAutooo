import axios from 'axios';

// Use environment variable for API URL, or relative path in development
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Car APIs
export const carAPI = {
  // Get all cars with optional filters
  getAll: async (params = {}) => {
    const res = await api.get('/cars', { params });
    return res.data;
  },
  
  // Get single car by ID
  getById: async (id) => {
    const res = await api.get(`/cars/${id}`);
    return res.data;
  },
  
  // Create car (admin only)
  create: async (carData) => {
    const res = await api.post('/cars', carData);
    return res.data;
  },
  
  // Update car (admin only)
  update: async (id, carData) => {
    const res = await api.put(`/cars/${id}`, carData);
    return res.data;
  },
  
  // Delete car (admin only)
  delete: async (id) => {
    const res = await api.delete(`/cars/${id}`);
    return res.data;
  }
};

export default api;
