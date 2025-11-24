import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from './authStore';

// Validar y obtener la URL del API
const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url || url.trim() === '') {
    console.warn('NEXT_PUBLIC_API_URL no está configurado, usando localhost por defecto');
    return 'http://localhost:3001/api';
  }
  
  // Validar que sea una URL válida
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('NEXT_PUBLIC_API_URL no es una URL válida:', url);
    return 'http://localhost:3001/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar token Bearer en cada request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStore.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 y redirigir a login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      authStore.clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

