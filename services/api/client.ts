import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from '@/config/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  post<T = any>(url: string, data?: any, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config = {}) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T = any>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
