"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/types"
import { useCart } from "@/context/cart-context"

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list"; // Added viewMode prop
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) { // Default to grid if not provided
  const { addItem } = useCart();

  if (viewMode === "list") {
    return (
      <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
        <Link href="#" className="block relative h-48 sm:h-auto sm:w-1/3 lg:w-1/4 flex-shrink-0">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded z-10">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded z-10">
              {product.discount}% OFF
            </span>
          )}
        </Link>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg line-clamp-2 sm:line-clamp-1">{product.name}</h3>
            <div className="flex items-center sm:hidden"> {/* Price for mobile in list view header */}
              {product.discount > 0 ? (
                <div className="flex flex-col items-end">
                  <span className="text-sm line-through text-muted-foreground">${product.originalPrice.toFixed(2)}</span>
                  <span className="font-bold text-destructive text-lg">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.brand}</p>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 sm:line-clamp-3 flex-grow">
            {product.description} {/* Show more description in list view */}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= product.rating ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
            </div>
            <div className="hidden sm:flex items-center"> {/* Price for desktop in list view footer */}
              {product.discount > 0 ? (
                <div className="flex flex-col items-end mr-4">
                  <span className="text-sm line-through text-muted-foreground">${product.originalPrice.toFixed(2)}</span>
                  <span className="font-bold text-destructive text-lg">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-bold text-lg mr-4">${product.price.toFixed(2)}</span>
              )}
            </div>
            <Button size="sm" variant="default" className="rounded-md whitespace-nowrap" onClick={() => addItem(product)}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View
  return (
    <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href="#" className="block relative h-48">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            New
          </span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{product.brand}</p>
          </div>
          <div className="flex items-center">
            {product.discount > 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-sm line-through text-muted-foreground">${product.originalPrice.toFixed(2)}</span>
                <span className="font-bold text-destructive">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= product.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">({product.reviewCount})</span>
          </div>
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => addItem(product)}>
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
