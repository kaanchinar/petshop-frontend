"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useGetApiProductsId, usePutApiProductsId } from "@/lib/api/products/products";
import { productDtoToProduct, productToUpdateProductDto } from "@/lib/api-types";
import type { Product } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export default function EditProductContent({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const productId = parseInt(id);
  const { data: productData, isLoading, error: fetchError } = useGetApiProductsId(productId);
  
  const updateProductMutation = usePutApiProductsId();
  
  const product = productData?.data ? productDtoToProduct(productData.data) : null;

  const handleSubmit = async (productData: Omit<Product, "id">) => {
    setError(null);
    try {
      const updateDto = productToUpdateProductDto(productData, productId);
      await updateProductMutation.mutateAsync({ 
        id: productId, 
        data: updateDto 
      });
      
      // Invalidate and refetch products cache
      await queryClient.invalidateQueries({ queryKey: ['getApiProducts'] });
      router.push("/admin/products");
    } catch (err) {
      console.error("Failed to update product:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while updating the product."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (fetchError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-destructive mb-4">Product not found</p>
            <Button asChild>
              <Link href="/admin/products">Go back to products</Link>
            </Button>
          </div>
        </div>
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
            onCancel={() => router.back()}
            isSubmitting={updateProductMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
