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
import { usePostApiProducts } from "@/lib/api/products/products";
import { productToCreateProductDto } from "@/lib/api-types";
import type { Product } from "@/lib/types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const createProductMutation = usePostApiProducts();

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    setError(null);
    try {
      const createDto = productToCreateProductDto(productData);
      await createProductMutation.mutateAsync({ data: createDto });
      
      // Invalidate and refetch products cache
      await queryClient.invalidateQueries({ queryKey: ['getApiProducts'] });
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while creating the product."
      );
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
          <ProductForm 
            onSubmit={handleSubmit} 
            onCancel={() => router.back()}
            isSubmitting={createProductMutation.isPending} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

