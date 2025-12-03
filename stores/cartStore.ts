import { create } from 'zustand';
import { Product } from '@/types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;

  // Actions
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }

      return {
        items: newItems,
        total: get().calculateTotal(),
      };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== productId);
      return {
        items: newItems,
        total: get().calculateTotal(),
      };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        total: get().calculateTotal(),
      };
    });
  },

  clearCart: () => {
    set({ items: [], total: 0 });
  },

  calculateTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
