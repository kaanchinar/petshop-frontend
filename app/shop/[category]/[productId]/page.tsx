"use client"

import { useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getProductById } from "@/lib/products"
import { useCart } from "@/context/cart-context"
import { ArrowLeft, Check, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"

export default function ProductDetailPage({
  params,
}: {
  params: { category: string; productId: string }
}) {
  const router = useRouter()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)

  const product = getProductById(params.productId)

  if (!product) {
    notFound()
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Generate related products (in a real app, this would be more sophisticated)
  const relatedProducts = [
    {
      id: "related-1",
      name: "Related Product 1",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1583511655826-05700442976d?q=80&w=2574&auto=format&fit=crop",
    },
    {
      id: "related-2",
      name: "Related Product 2",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=2574&auto=format&fit=crop",
    },
    {
      id: "related-3",
      name: "Related Product 3",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1585846888147-3fe14c130048?q=80&w=2574&auto=format&fit=crop",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href={`/shop/${params.category}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {params.category.replace("-", " ")}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.discount > 0 && (
              <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">{product.discount}% OFF</Badge>
            )}
            {product.isNew && <Badge className="absolute top-4 right-4">New</Badge>}
          </div>

          {/* Thumbnail Gallery - In a real app, you'd have multiple images */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-md overflow-hidden border ${index === 0 ? "ring-2 ring-primary" : ""}`}
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : i < product.rating
                        ? "text-yellow-400 fill-yellow-400 opacity-50"
                        : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            <Badge variant={product.inStock ? "outline" : "destructive"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="border-t border-b py-4">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>

                <span className="w-12 text-center">{quantity}</span>

                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 gap-2" size="lg" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                <span className="hidden sm:inline">Add to Wishlist</span>
                <span className="sm:hidden">Wishlist</span>
              </Button>
              <Button variant="outline" size="icon" className="sm:h-12 sm:w-12">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Free shipping on orders over $50
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Brand</div>
                    <div>{product.brand}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Category</div>
                    <div className="capitalize">{product.category.replace("-", " ")}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-muted-foreground">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping & Returns</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>Free standard shipping on orders over $50.</p>
                  <p>Express shipping available for an additional fee.</p>
                  <p>Returns accepted within 30 days of delivery.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p className="mb-4">{product.description}</p>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc pl-5 mb-4">
                <li>Premium quality materials</li>
                <li>Durable construction</li>
                <li>Easy to clean and maintain</li>
                <li>Designed for pet comfort and safety</li>
                <li>Satisfaction guaranteed</li>
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    <div className="font-medium">Dimensions</div>
                    <div>12" x 8" x 4"</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    <div className="font-medium">Weight</div>
                    <div>1.5 lbs</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    <div className="font-medium">Materials</div>
                    <div>Premium eco-friendly materials</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    <div className="font-medium">Country of Origin</div>
                    <div>United States</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-b pb-2">
                    <div className="font-medium">Warranty</div>
                    <div>1 year limited warranty</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Care Instructions</h3>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    To ensure the longevity of your {product.name}, please follow these care instructions:
                  </p>
                  <ul className="list-disc pl-5">
                    <li>Clean with mild soap and water</li>
                    <li>Air dry completely before storage</li>
                    <li>Keep away from direct sunlight when not in use</li>
                    <li>Store in a cool, dry place</li>
                    <li>Inspect regularly for wear and tear</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : i < product.rating
                                ? "text-yellow-400 fill-yellow-400 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">Based on {product.reviewCount} reviews</span>
                  </div>
                </div>
                <Button>Write a Review</Button>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: "John D.",
                    rating: 5,
                    date: "2 months ago",
                    comment: "Excellent product! My pet loves it and the quality is outstanding.",
                  },
                  {
                    name: "Sarah M.",
                    rating: 4,
                    date: "3 months ago",
                    comment: "Good quality and value for money. Would recommend to other pet owners.",
                  },
                  {
                    name: "Michael T.",
                    rating: 5,
                    date: "1 month ago",
                    comment: "Fast shipping and the product exceeded my expectations. Will buy again!",
                  },
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <div className="flex mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
                Load More Reviews
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden group">
              <div className="relative h-48">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">${item.price.toFixed(2)}</span>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
