import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from './authStore';

// Validar y obtener la URL del API
const getApiBaseUrl = (): string => {
  // En el servidor (SSR), usar la URL interna de Railway si está disponible
  // En el cliente (navegador), usar la URL pública
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    // En el servidor, intentar usar la URL interna primero
    const internalUrl = process.env.RAILWAY_API_URL_INTERNAL || process.env.API_URL_INTERNAL;
    if (internalUrl) {
      try {
        new URL(internalUrl);
        return internalUrl;
      } catch (error) {
        console.warn('URL interna no válida, usando URL pública:', internalUrl);
      }
    }
  }
  
  // Usar la URL pública (funciona tanto en cliente como servidor)
  const url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url || url.trim() === '') {
    console.warn('NEXT_PUBLIC_API_URL no está configurado, usando localhost por defecto');
    return 'http://localhost:3002/api';
  }
  
  // Validar que sea una URL válida
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.error('NEXT_PUBLIC_API_URL no es una URL válida:', url);
    return 'http://localhost:3002/api';
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

