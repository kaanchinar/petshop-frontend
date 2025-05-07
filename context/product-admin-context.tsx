"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { getAllProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

interface ProductAdminContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getProductById: (productId: string) => Product | undefined;
}

const ProductAdminContext = createContext<ProductAdminContextType | undefined>(
  undefined
);

export function ProductAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize products from localStorage or fallback to static data
  useEffect(() => {
    const storedProducts = localStorage.getItem("admin_products");

    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error("Failed to parse stored products:", error);
        setProducts(getAllProducts());
      }
    } else {
      // If no stored products, use the static data
      setProducts(getAllProducts());
    }

    setInitialized(true);
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("admin_products", JSON.stringify(products));
    }
  }, [products, initialized]);

  const getProductById = useCallback(
    (productId: string) => {
      return products.find((product) => product.id === productId);
    },
    [products]
  );

  const addProduct = useCallback((product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  }, []);

  return (
    <ProductAdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
      }}
    >
      {children}
    </ProductAdminContext.Provider>
  );
}

export function useProductAdmin() {
  const context = useContext(ProductAdminContext);
  if (context === undefined) {
    throw new Error(
      "useProductAdmin must be used within a ProductAdminProvider"
    );
  }
  return context;
}

