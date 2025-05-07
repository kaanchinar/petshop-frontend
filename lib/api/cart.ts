import type { Product, CartItem } from "@/lib/types";

const CART_STORAGE_KEY = "shoppingCart";

// Helper function to get cart from localStorage
const getCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === 'undefined') { // Guard against SSR
    return [];
  }
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  try {
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToLocalStorage = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') { // Guard against SSR
    return;
  }
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

export const getCart = async (): Promise<CartItem[]> => {
  return getCartFromLocalStorage();
};

export const addToCart = async (product: Product): Promise<CartItem> => {
  const cart = getCartFromLocalStorage();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  let updatedItem: CartItem;

  if (existingItemIndex > -1) {
    // Product exists, update quantity
    cart[existingItemIndex].quantity += 1;
    updatedItem = cart[existingItemIndex];
  } else {
    // Product does not exist, add as new item
    // Assuming Product type has 'id', 'name', 'price', and 'imageUrl'
    // and CartItem extends Product with 'quantity'
    updatedItem = { ...product, quantity: 1 };
    cart.push(updatedItem);
  }
  saveCartToLocalStorage(cart);
  return updatedItem;
};

export const removeFromCart = async (productId: string): Promise<void> => {
  let cart = getCartFromLocalStorage();
  cart = cart.filter(item => item.id !== productId);
  saveCartToLocalStorage(cart);
};

export const updateCartItem = async (
  productId: string,
  quantity: number
): Promise<CartItem | null> => { // Return null if item not found or removed
  let cart = getCartFromLocalStorage();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.splice(itemIndex, 1);
      saveCartToLocalStorage(cart);
      return null; // Item removed
    } else {
      // Update quantity
      cart[itemIndex].quantity = quantity;
      saveCartToLocalStorage(cart);
      return cart[itemIndex];
    }
  }
  return null; // Item not found
};

export const clearCart = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
};
