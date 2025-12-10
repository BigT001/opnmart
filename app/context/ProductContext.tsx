'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  condition?: string;
  stock?: number;
  description?: string;
  vendorId?: string;
  [key: string]: any;
}

interface ProductContextType {
  allProducts: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySubcategory: (subcategoryId: string) => Product[];
  refetchProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from MongoDB on mount
  useEffect(() => {
    // Clear any cached products from localStorage
    try {
      localStorage.removeItem('opnmart_products');
    } catch (e) {
      console.warn('Could not clear localStorage');
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from http://localhost:3001/products');
      const response = await fetch('http://localhost:3001/products', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.error('API error:', response.status, response.statusText);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products API response:', { status: response.status, dataType: typeof data, isArray: Array.isArray(data), length: Array.isArray(data) ? data.length : 'N/A' });
      
      // Handle both array response (from NestJS) and object response with products property
      const productsList = Array.isArray(data) ? data : (data.products || []);
      console.log('Products list length:', productsList.length);
      
      if (productsList.length === 0) {
        console.warn('No products returned from API');
        setAllProducts([]);
        setIsLoading(false);
        return;
      }
      
      const products = productsList.map((p: any) => ({
        id: p._id || p.id, // Use MongoDB _id or fallback to id
        _id: p._id, // Keep _id for compatibility
        name: p.name,
        description: p.description,
        category: p.category,
        subcategory: p.subcategory,
        brand: p.brand,
        price: p.price,
        oldPrice: p.oldPrice,
        discount: p.discount,
        discountPrice: p.discountPrice,
        image: p.images?.[0] || p.image,
        images: p.images || [],
        imagePublicId: p.imagePublicId,
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge,
        condition: p.condition,
        stock: p.stock,
        available: p.available,
        vendor: p.vendor,
        vendorId: p.vendorId,
      }));
      console.log('Mapped products count:', products.length, 'Sample:', products[0]);
      setAllProducts(products);
    } catch (error) {
      console.error('Failed to fetch products:', error instanceof Error ? error.message : String(error));
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchProducts = async () => {
    console.log('Refetching products...');
    setIsLoading(true);
    await fetchProducts();
  };

  const addProduct = (product: Product) => {
    setAllProducts(prev => [...prev, { ...product }]);
  };

  const removeProduct = (id: string) => {
    setAllProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setAllProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const getProductsByCategory = (categoryId: string) => {
    return allProducts.filter(p => {
      // Find which category this subcategory belongs to
      const CATEGORIES_DATA = [
        {
          id: 'electronics',
          subcategories: ['mobile_phones', 'laptops', 'cameras', 'tablets', 'headphones', 'speakers', 'power_banks', 'microphones', 'televisions', 'cctv', 'networking', 'smart_gadgets', 'office_electronics', 'power_energy'],
        },
        {
          id: 'appliances',
          subcategories: ['refrigerators', 'ac', 'generators', 'washing_machines', 'cookers_ovens', 'cleaning_appliances', 'fans_cooling', 'inverter_solar', 'kitchen_appliances', 'home_appliances'],
        },
        {
          id: 'furniture',
          subcategories: ['sofas', 'beds', 'tables', 'storage', 'lighting'],
        },
        {
          id: 'grocery',
          subcategories: ['fresh_produce', 'dairy', 'beverages', 'snacks', 'spices'],
        },
      ];
      const category = CATEGORIES_DATA.find(c => c.id === categoryId);
      return category?.subcategories.includes(p.subcategory);
    });
  };

  const getProductsBySubcategory = (subcategoryId: string) => {
    return allProducts.filter(p => p.subcategory === subcategoryId);
  };

  return (
    <ProductContext.Provider
      value={{
        allProducts,
        addProduct,
        removeProduct,
        updateProduct,
        getProductsByCategory,
        getProductsBySubcategory,
        refetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
