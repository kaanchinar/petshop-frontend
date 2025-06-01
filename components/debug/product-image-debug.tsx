"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetApiProductsId, usePutApiProductsId } from "@/lib/api/products/products";

export default function ProductImageDebug({ productId }: { productId: number }) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const { data: productData, refetch } = useGetApiProductsId(productId);
  const updateMutation = usePutApiProductsId();

  const currentImage = productData?.data?.images?.find(img => img.isPrimary)?.imageUrl || "";

  const handleUpdateImage = async () => {
    if (!newImageUrl || !productData?.data) return;

    try {
      const updateData = {
        name: productData.data.name!,
        description: productData.data.description!,
        price: productData.data.price!,
        originalPrice: productData.data.originalPrice!,
        category: productData.data.category!,
        brand: productData.data.brand!,
        stockQuantity: productData.data.stockQuantity!,
        state: productData.data.state!,
        section: productData.data.section!,
        images: [{ 
          imageUrl: newImageUrl, 
          isPrimary: true 
        }],
      };

      await updateMutation.mutateAsync({ 
        id: productId, 
        data: updateData 
      });
      
      // Refetch to see if the change took effect
      await refetch();
      alert("Update attempt completed. Check current image above.");
    } catch (error) {
      console.error("Update failed:", error);
      alert(`Update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Image Update Debug - Product {productId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Current Image:</p>
          <p className="text-xs text-muted-foreground break-all">{currentImage}</p>
        </div>
        
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="New image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <Button 
            onClick={handleUpdateImage} 
            disabled={!newImageUrl || updateMutation.isPending}
            className="w-full"
          >
            {updateMutation.isPending ? "Updating..." : "Test Image Update"}
          </Button>
        </div>

        {updateMutation.error && (
          <p className="text-xs text-destructive">
            {updateMutation.error instanceof Error ? updateMutation.error.message : "Unknown error"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
