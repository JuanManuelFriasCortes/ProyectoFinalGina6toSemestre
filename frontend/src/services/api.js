// ============================================
// SERVICIO API (axios)
// Centraliza la conexión al backend. Un "interceptor" agrega
// automáticamente el token a cada petición -> así no lo repetimos
// en cada llamada. Demuestra: consumo de APIs con axios.
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});
 
// Interceptor: antes de cada request, si hay token guardado, lo añade
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('momo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
