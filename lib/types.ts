export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  inStock: boolean;
  tags: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface LoginRequest {
  username?: string | null;
  password?: string | null;
}

export interface RegisterRequest {
  username?: string | null;
  email?: string | null;
  password?: string | null;
}
