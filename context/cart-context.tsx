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
  useGetApiCart,
  usePostApiCartItems,
  useDeleteApiCart,
  usePutApiCartItemsCartItemId,
  useDeleteApiCartItemsCartItemId
} from "@/lib/api/cart/cart";
import { cartItemDtoToCartItem } from "@/lib/api-types";
import type { AddToCartDto, UpdateCartItemDto } from "@/lib/api/petPetAPI.schemas";

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: number; // Add cart item ID for API operations
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
  isLoading: boolean;
  isAdding: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // API hooks
  const { data: cartData, isLoading, refetch } = useGetApiCart();
  const addToCartMutation = usePostApiCartItems();
  const clearCartMutation = useDeleteApiCart();
  const updateCartItemMutation = usePutApiCartItemsCartItemId();
  const removeCartItemMutation = useDeleteApiCartItemsCartItemId();

  // Update local state when cart data changes
  useEffect(() => {
    if (cartData?.data?.items) {
      const cartItems = cartData.data.items.map((item) => ({
        ...cartItemDtoToCartItem(item),
        cartItemId: item.id, // Store the cart item ID for API operations
      }));
      setItems(cartItems);
    }
  }, [cartData]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const addItem = useCallback(async (product: Product) => {
    if (isAdding) return; // Prevent double-clicks
    
    try {
      setIsAdding(true);
      
      // Check if product already exists in cart
      const existingItem = items.find(item => item.id === product.id);
      
      if (existingItem && existingItem.cartItemId) {
        // Product exists, update quantity by incrementing by 1
        const newQuantity = existingItem.quantity + 1;
        const updateDto: UpdateCartItemDto = { quantity: newQuantity };
        await updateCartItemMutation.mutateAsync({ 
          cartItemId: existingItem.cartItemId, 
          data: updateDto 
        });
      } else {
        // Product doesn't exist, add new item
        const addToCartDto: AddToCartDto = {
          productId: parseInt(product.id),
          quantity: 1,
        };
        await addToCartMutation.mutateAsync({ data: addToCartDto });
      }
      
      refetch(); // Refresh cart data
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setIsAdding(false);
    }
  }, [addToCartMutation, updateCartItemMutation, refetch, isAdding, items]);

  const removeItem = useCallback(async (productId: string) => {
    try {
      // Find the cart item by product ID
      const cartItem = items.find(item => item.id === productId);
      if (cartItem && cartItem.cartItemId) {
        await removeCartItemMutation.mutateAsync({ cartItemId: cartItem.cartItemId });
        refetch();
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  }, [items, removeCartItemMutation, refetch]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }

      const cartItem = items.find(item => item.id === productId);
      if (cartItem && cartItem.cartItemId) {
        const updateDto: UpdateCartItemDto = { quantity };
        await updateCartItemMutation.mutateAsync({ 
          cartItemId: cartItem.cartItemId, 
          data: updateDto 
        });
        refetch();
      }
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  }, [items, updateCartItemMutation, removeItem, refetch]);

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
      setItems([]);
      refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [clearCartMutation, refetch]);

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
        isLoading,
        isAdding,
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

