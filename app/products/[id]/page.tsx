"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetApiProductsId } from "@/lib/api/products/products";
import { productDtoToProduct } from "@/lib/api-types";
import { useCart } from "@/context/cart-context";
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, RotateCcw } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productId = params.id as string;
  
  const { data: productData, isLoading, error } = useGetApiProductsId(
    parseInt(productId)
  );

  const product = productData?.data ? productDtoToProduct(productData.data) : null;

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

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-destructive mb-4">Product not found</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNew && (
              <Badge className="absolute top-4 left-4">New</Badge>
            )}
            {product.discount > 0 && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                {product.discount}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.brand}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= product.rating 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-bold text-destructive">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              <Badge variant={product.inStock ? "default" : "destructive"}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <label htmlFor="quantity" className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>

          {/* Product Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Features</h3>
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">Free shipping on orders over $49</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm">Quality guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">Easy 30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
