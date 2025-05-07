"use client";

import { useRouter } from "next/navigation";
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
import { adminApi } from "@/lib/services/adminApi"; // Updated import
import { Product as ApiProduct } from "@/lib/types"; // Import Product from lib/types
// import { useProductAdmin } from "@/context/product-admin-context" // Old context import
// import type { Product } from "@/lib/types" // Old type import
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  // const { addProduct } = useProductAdmin() // Old context usage
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (productData: Omit<ApiProduct, "id">) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newProduct = await adminApi.createProduct(productData); // Pass productData directly
      console.log("Product created:", newProduct);
      // Optionally, show a success toast/notification
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while creating the product."
      );
      // Optionally, show an error toast/notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight ml-2">
          Add New Product
        </h1>
      </div>

      {error && (
        <p className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error}</p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter the details for the new product.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  );
}

