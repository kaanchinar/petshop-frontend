"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Added import for Link
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/product-form";
import { adminApi } from "@/lib/services/adminApi"; // Corrected: Removed Product import from here
import { Product as ApiProduct } from "@/lib/types"; // Corrected: Import Product from lib/types and alias as ApiProduct
// import { getProductById } from "@/lib/products" // Old mock data import
// import { useProductAdmin } from "@/context/product-admin-context" // Old context import
// import type { Product } from "@/lib/types" // Old type import

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  // const { updateProduct } = useProductAdmin() // Old context usage
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) {
        setError("Product ID is missing.");
        setLoading(false);
        router.push("/admin/products"); // Redirect if no ID
        return;
      }
      try {
        setLoading(true);
        const fetchedProduct = await adminApi.getProductById(params.id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError("Product not found.");
          router.push("/admin/products"); // Redirect if product not found
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        // Optionally redirect or show a more prominent error
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (productData: Omit<ApiProduct, "id">) => {
    if (product && product.id) {
      setIsSubmitting(true);
      setError(null);
      try {
        // productData is Omit<ApiProduct, "id">. We need to add the existing id.
        const updatedProductData: ApiProduct = {
          ...productData,
          id: product.id,
        };
        const updatedProduct = await adminApi.updateProduct(
          product.id,
          updatedProductData
        );
        console.log("Product updated:", updatedProduct);
        // Optionally, show a success toast/notification
        // Redirect to the products list or the updated product's view page
        router.push("/admin/products");
      } catch (err) {
        console.error("Failed to update product:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while updating the product."
        );
        // Optionally, show an error toast/notification
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return <div>Loading product details...</div>;
  }

  if (error && !product) {
    // If error and no product, show error prominently
    return (
      <div className="p-4 text-red-600">
        Error: {error}.{" "}
        <Link href="/admin/products" className="underline">
          Go back to products
        </Link>
        .
      </div>
    );
  }

  if (!product) {
    // Should be caught by loading or error state, but as a fallback
    return (
      <div>
        Product not found.{" "}
        <Link href="/admin/products" className="underline">
          Go back to products
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight ml-2">Edit Product</h1>
      </div>

      {error && (
        <p className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Update the details for {product.name}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            initialData={product}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}

