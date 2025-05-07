"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Product } from "@/lib/types";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart,
  updateCartItem,
  clearCart as apiClearCart,
} from "@/lib/api/cart";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from API on initial render
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartItems = await getCart();
        setItems(cartItems);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const addItem = async (product: Product) => {
    try {
      const updatedItem = await apiAddToCart(product);
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);

        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id ? updatedItem : item
          );
        } else {
          return [...prevItems, updatedItem];
        }
      });
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    try {
      const updatedItem = await updateCartItem(productId, quantity);
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === productId ? updatedItem : item))
      );
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  const clearCart = useCallback(async () => {
    try {
      await apiClearCart();
      setItems([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

