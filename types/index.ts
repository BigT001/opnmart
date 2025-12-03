// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'buyer';
  avatar?: string;
  createdAt: string;
}

// Product Types (Basic - for quick use)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  sellerId: string;
  stock: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

// Advanced Product Types (for detailed marketplace)
export * from './product';

// Order Types
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
