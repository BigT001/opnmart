/**
 * Product Database Models
 * Supports the full Electronics marketplace with categories and filters
 */

import { CONDITION, WARRANTY_PERIOD, SUBCATEGORIES } from '@/config/categories';

export interface ProductFilters {
  brand?: string;
  condition?: CONDITION;
  price_range?: { min: number; max: number | null };
  color?: string;
  storage?: string;
  ram?: string;
  screen_size?: string;
  warranty?: WARRANTY_PERIOD;
  processor?: string;
  delivery_option?: string;
  rating_min?: number;
  in_stock?: boolean;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: 'electronics';
  subcategory: string; // Use SUBCATEGORIES values
  type?: string; // e.g., 'gaming_laptops', 'smartphones', etc.
  
  // Pricing
  price: number;
  originalPrice?: number;
  discount?: number; // percentage
  currency: 'NGN';
  
  // Product Details
  brand: string;
  condition: CONDITION; // brand_new, uk_used, refurbished, used
  sku: string;
  upc?: string;
  
  // Media
  image: string; // Main image URL (Cloudinary)
  images?: string[]; // Additional images
  video_url?: string;
  
  // Inventory
  stock: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  
  // Specifications (flexible based on product type)
  specifications?: {
    color?: string;
    storage?: string;
    ram?: string;
    screen_size?: string;
    processor?: string;
    battery_life?: string;
    weight?: string;
    dimensions?: string;
    warranty_period?: WARRANTY_PERIOD;
    [key: string]: any;
  };
  
  // Seller Information
  sellerId: string;
  seller_name?: string;
  seller_rating?: number;
  seller_reviews?: number;
  
  // Customer Reviews
  rating: number; // 1-5
  reviewCount: number;
  reviews?: Review[];
  
  // SEO & Metadata
  slug: string;
  tags?: string[];
  keywords?: string[];
  
  // Shipping & Delivery
  shipping_options: ShippingOption[];
  return_policy?: string;
  warranty: WARRANTY_PERIOD;
  warranty_provider?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  listed_date: Date;
  
  // Status
  is_active: boolean;
  is_featured?: boolean;
  
  // Additional metadata
  views?: number;
  favorites?: number;
}

export interface ShippingOption {
  id: string;
  name: string; // e.g., "Lagos Same Day Delivery", "National Delivery"
  cost: number;
  estimated_days: number;
  available: boolean;
}

export interface Review {
  _id?: string;
  reviewer_id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  comment: string;
  helpful_count?: number;
  created_at: Date;
  verified_purchase: boolean;
}

export interface ProductSearchQuery {
  query?: string;
  subcategory?: string;
  brand?: string;
  condition?: CONDITION;
  price_min?: number;
  price_max?: number;
  color?: string;
  storage?: string;
  ram?: string;
  screen_size?: string;
  warranty?: WARRANTY_PERIOD;
  processor?: string;
  in_stock?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating' | 'reviews';
  page?: number;
  limit?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  filters_applied: ProductFilters;
}

// Device Specifications (for easy type definitions)
export interface PhoneSpecifications {
  color: string;
  storage: string; // 64GB, 128GB, 256GB, etc.
  ram: string; // 4GB, 6GB, 8GB, etc.
  battery: string; // mAh
  screen_size: string; // inches
  processor: string;
  camera: string; // megapixels
  os: string; // Android, iOS
  warranty_period: WARRANTY_PERIOD;
}

export interface LaptopSpecifications {
  color: string;
  storage: string; // 256GB SSD, 512GB SSD, etc.
  ram: string; // 8GB DDR4, 16GB DDR5, etc.
  screen_size: string; // 13", 14", 15.6", etc.
  processor: string; // Intel i7, AMD Ryzen 7, etc.
  graphics: string; // GTX 1650, RTX 3060, etc.
  battery_life: string; // hours
  os: string; // Windows, macOS
  weight: string; // kg
  warranty_period: WARRANTY_PERIOD;
}

export interface TabletSpecifications {
  color: string;
  storage: string;
  ram: string;
  screen_size: string;
  processor: string;
  battery: string;
  os: string; // iPad OS, Android
  warranty_period: WARRANTY_PERIOD;
}

// For filtering products in database queries
export interface FilterQuery {
  $and?: any[];
  $or?: any[];
  category?: string;
  subcategory?: string;
  brand?: { $in: string[] };
  condition?: { $in: CONDITION[] };
  price?: { $gte?: number; $lte?: number };
  'specifications.color'?: string;
  'specifications.storage'?: string;
  'specifications.ram'?: string;
  'specifications.screen_size'?: string;
  'specifications.processor'?: string;
  stock_status?: 'in_stock';
  is_active?: boolean;
}
