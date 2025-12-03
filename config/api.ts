// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    GET: (id: string) => `/products/${id}`,
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    SEARCH: '/products/search',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    BY_SUBCATEGORY: (subcategory: string) => `/products/subcategory/${subcategory}`,
    FEATURED: '/products/featured',
    TRENDING: '/products/trending',
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    GET: (id: string) => `/categories/${id}`,
    SUBCATEGORIES: (categoryId: string) => `/categories/${categoryId}/subcategories`,
  },

  // Orders
  ORDERS: {
    LIST: '/orders',
    GET: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
    GET: (id: string) => `/users/${id}`,
  },
};
