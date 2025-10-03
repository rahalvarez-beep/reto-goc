import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { ApiResponse } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      const errorData = error.response.data as ApiResponse;
      return Promise.reject({
        message: errorData.message || 'An error occurred',
        status: error.response.status,
        data: errorData.data,
        error: errorData.error,
      });
    }

    if (error.request) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0,
        error: 'NETWORK_ERROR',
      });
    }

    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      status: 500,
      error: 'UNKNOWN_ERROR',
    });
  }
);

// API methods
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials: { email: string; password: string }) =>
      api.post('/auth/login', credentials),
    
    register: (data: any) =>
      api.post('/auth/register', data),
    
    logout: (refreshToken: string) =>
      api.post('/auth/logout', { refreshToken }),
    
    logoutAll: () =>
      api.post('/auth/logout-all'),
    
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
      api.put('/auth/change-password', data),
    
    getProfile: () =>
      api.get('/auth/profile'),
    
    verifyToken: () =>
      api.post('/auth/verify-token'),
  },

  // Accident endpoints
  accidents: {
    getAll: (params?: any) =>
      api.get('/accidents', { params }),
    
    getById: (id: string) =>
      api.get(`/accidents/${id}`),
    
    create: (data: any) =>
      api.post('/accidents', data),
    
    update: (id: string, data: any) =>
      api.put(`/accidents/${id}`, data),
    
    delete: (id: string) =>
      api.delete(`/accidents/${id}`),
    
    getStats: (params?: any) =>
      api.get('/accidents/stats', { params }),
  },

  // Health check
  health: () =>
    api.get('/health'),
};

export default api;
