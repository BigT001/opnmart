'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Product {
  id: number;
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
  removeProduct: (id: number) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsBySubcategory: (subcategoryId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products from MongoDB on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const products = data.products.map((p: any) => ({
            id: parseInt(p.id) || Date.now(),
            name: p.name,
            description: p.description,
            category: p.category,
            subcategory: p.subcategory,
            brand: p.brand,
            price: p.price,
            oldPrice: p.oldPrice,
            image: p.image,
            imagePublicId: p.imagePublicId,
            rating: p.rating,
            reviews: p.reviews,
            badge: p.badge,
            condition: p.condition,
            stock: p.stock,
            vendorId: p.vendorId,
          }));
          setAllProducts(products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = (product: Product) => {
    setAllProducts(prev => [...prev, { ...product, id: Date.now() }]);
  };

  const removeProduct = (id: number) => {
    setAllProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id: number, updatedData: Partial<Product>) => {
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
          subcategories: ['mobile_phones', 'laptops', 'cameras', 'tablets', 'headphones', 'speakers', 'power_banks', 'microphone'],
        },
        {
          id: 'appliances',
          subcategories: ['refrigerators', 'generators'],
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
