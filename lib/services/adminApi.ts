import { Product } from '@/lib/types'; // Added import for Product

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5232";

// Define interfaces based on Swagger schema definitions
// These might need to be in a separate types file (e.g., @/lib/types/admin.ts)

// Removed local Product interface definition as it was inconsistent with swagger and lib/types.ts

export interface LoginRequest {
  username?: string | null; // from v1.json components.schemas.LoginRequest
  password?: string | null;
}

export interface RegisterRequest {
  username?: string | null; // from v1.json components.schemas.RegisterRequest
  password?: string | null;
  email?: string | null;
  // Add other fields if present in the schema
}

// Helper function for API calls
async function fetchApi(path: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    // Add Authorization header if/when token management is implemented
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Attempt to parse error response body
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use text
      errorData = await response.text();
    }
    console.error("API Error:", response.status, errorData);
    throw new Error(
      `API request failed with status ${response.status}: ${JSON.stringify(
        errorData
      )}`
    );
  }

  // Handle cases where response might be empty or not JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    // No content
    return null;
  }
  // For application/octet-stream, it might return a string or need special handling
  // For now, let's assume it's text if not JSON. This needs to be verified against actual backend responses.
  return response.text();
}

// Admin Product Endpoints
export const adminApi = {
  getAllProducts: async (category?: string): Promise<Product[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    // Swagger says octet-stream, but usually this would be JSON array of Products
    // Adjust parsing if backend truly sends binary data for a list of products
    return fetchApi(`/api/admin/products${query}`);
  },

  createProduct: async (productData: Omit<Product, "id">): Promise<Product> => { // Changed 'product: Product' to 'productData: Omit<Product, "id">'
    // Swagger says octet-stream response. Assuming it returns the created Product as JSON.
    return fetchApi("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(productData), // productData (Omit<Product, "id">) is stringified
    });
  },

  getProductById: async (id: string): Promise<Product> => {
    // Swagger says octet-stream. Assuming it returns a Product as JSON.
    return fetchApi(`/api/admin/products/${id}`);
  },

  updateProduct: async (
    id: string,
    updatedProduct: Product
  ): Promise<Product> => {
    // Swagger says octet-stream. Assuming it returns the updated Product as JSON.
    return fetchApi(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updatedProduct),
    });
  },

  deleteProduct: async (id: string): Promise<void> => {
    // Swagger says octet-stream. DELETE usually returns 204 No Content or 200 OK.
    await fetchApi(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
  },

  resetProducts: async (): Promise<any> => {
    // Swagger says octet-stream. Response type unknown.
    return fetchApi("/api/admin/products/reset", {
      method: "POST",
    });
  },

  // Auth Endpoints
  login: async (request: LoginRequest): Promise<any> => {
    // Adjust 'any' to actual login response type (e.g., { token: string })
    // Swagger says octet-stream. Login usually returns a token or user info as JSON.
    return fetchApi("/api/Auth/login", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  register: async (request: RegisterRequest): Promise<any> => {
    // Adjust 'any' to actual register response type
    // Swagger says octet-stream. Register usually returns user info or success message as JSON.
    return fetchApi("/api/Auth/register", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

// It's good practice to define more specific types for API responses if known
// For example, if login returns a token:
// export interface LoginResponse {
//   token: string;
//   userId: string;
//   // other user details
// }

// And then use it:
// login: async (request: LoginRequest): Promise<LoginResponse> => {
//   return fetchApi('/api/Auth/login', {
//     method: 'POST',
//     body: JSON.stringify(request),
//   });
// },
