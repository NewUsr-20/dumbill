import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  decrement: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  
  addToCart: (product) => {
    set((state) => {
      const existingItem = state.cart.find(item => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    });
  },

  decrement: (productId) => {
    set((state) => ({
      cart: state.cart.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0)
    }));
  },

  clearCart: () => set({ cart: [] }),

  getTotal: () => {
    const items = get().cart;
    const totalCents = items.reduce((acc, item) => acc + (Math.round(item.price * 100) * item.quantity), 0);
    return totalCents / 100;
  },

  getItemCount: () => {
    return get().cart.reduce((acc, item) => acc + item.quantity, 0);
  }
}));