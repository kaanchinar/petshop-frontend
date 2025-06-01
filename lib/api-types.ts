// Re-export types from the generated API schemas
export type {
  ProductDto,
  ProductDtoPagedResult,
  CreateProductDto,
  UpdateProductDto,
  AnimalSection,
  ProductCategory,
  ProductState,
  CartItemDto,
  CartSummaryDto,
  AddToCartDto,
  UpdateCartItemDto,
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  UserDto,
  OrderDto,
  OrderStatus,
} from "./api/petPetAPI.schemas";

// Legacy types for backward compatibility
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
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  password?: string | null;
}

// Utility functions to convert between legacy and API types
export function productDtoToProduct(dto: import("./api/petPetAPI.schemas").ProductDto): Product {
  const primaryImage = dto.images?.find(img => img.isPrimary) || dto.images?.[0];
  
  return {
    id: dto.id?.toString() || "",
    name: dto.name || "",
    description: dto.description || "",
    price: dto.price || 0,
    originalPrice: dto.originalPrice || dto.price || 0,
    discount: dto.originalPrice && dto.price ? 
      Math.round(((dto.originalPrice - dto.price) / dto.originalPrice) * 100) : 0,
    image: primaryImage?.imageUrl || "/placeholder.svg",
    category: dto.section || "", // Use section for category filtering (Cats, Dogs, Other)
    brand: dto.brand || "",
    rating: dto.averageRating || 0, // Use actual average rating from API
    reviewCount: dto.reviewCount || 0, // Use actual review count from API
    isNew: dto.state === "NewProduct",
    inStock: dto.stockQuantity ? dto.stockQuantity > 0 : false,
    tags: [], // Default empty tags since it's not in the API
  };
}

export function cartItemDtoToCartItem(dto: import("./api/petPetAPI.schemas").CartItemDto): CartItem {
  return {
    id: dto.productId?.toString() || "",
    name: dto.productName || "",
    description: "", // Not available in CartItemDto
    price: dto.productPrice || 0,
    originalPrice: dto.productPrice || 0,
    discount: 0,
    image: dto.productImageUrl || "/placeholder.svg",
    category: "",
    brand: "",
    rating: 4.5,
    reviewCount: 0,
    isNew: false,
    inStock: dto.isInStock || false,
    tags: [],
    quantity: dto.quantity || 0,
  };
}

export function productToCreateProductDto(product: Omit<Product, "id">): import("./api/petPetAPI.schemas").CreateProductDto {
  // Map category string to ProductCategory enum
  const categoryMap: Record<string, import("./api/petPetAPI.schemas").ProductCategory> = {
    toys: "Toys",
    food: "Food", 
    litters: "Litters",
    medicines: "Medicines",
    accessories: "Accessories",
    grooming: "Grooming",
  };

  // Map form category to animal section
  const sectionMap: Record<string, import("./api/petPetAPI.schemas").AnimalSection> = {
    cats: "Cats",
    dogs: "Dogs",
    "other-animals": "Other",
  };

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    category: categoryMap[product.category.toLowerCase()] || "Accessories",
    brand: product.brand,
    stockQuantity: product.inStock ? 10 : 0, // Default stock quantity
    state: product.isNew ? "NewProduct" : "InStock",
    section: sectionMap[product.category.toLowerCase()] || "Other", // Map form category to section
    images: product.image ? [{ 
      imageUrl: product.image, 
      isPrimary: true 
    }] : [],
  };
}

export function productToUpdateProductDto(product: Omit<Product, "id">, id: number): import("./api/petPetAPI.schemas").UpdateProductDto {
  // Map category string to ProductCategory enum
  const categoryMap: Record<string, import("./api/petPetAPI.schemas").ProductCategory> = {
    toys: "Toys",
    food: "Food", 
    litters: "Litters",
    medicines: "Medicines",
    accessories: "Accessories",
    grooming: "Grooming",
  };

  // Map form category to animal section
  const sectionMap: Record<string, import("./api/petPetAPI.schemas").AnimalSection> = {
    cats: "Cats",
    dogs: "Dogs",
    "other-animals": "Other",
  };

  return {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || product.price,
    category: categoryMap[product.category.toLowerCase()] || "Accessories",
    brand: product.brand,
    stockQuantity: product.inStock ? 10 : 0,
    state: product.isNew ? "NewProduct" : "InStock",
    section: sectionMap[product.category.toLowerCase()] || "Other", // Map form category to section
    images: product.image ? [{ 
      imageUrl: product.image, 
      isPrimary: true 
    }] : [],
  };
}
