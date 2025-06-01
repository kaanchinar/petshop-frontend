"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiProducts } from "@/lib/api/products/products";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // Fetch featured products (first 4 products)
  const { data: productsData, isLoading: productsLoading } = useGetApiProducts({
    Page: 1,
    PageSize: 4,
  });

  const featuredProducts = productsData?.data?.items || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const categories = [
    {
      name: "Dogs",
      slug: "dogs",
      image: "/dog.avif",
      description: "Everything your dog needs"
    },
    {
      name: "Cats", 
      slug: "cats",
      image: "/cat.avif",
      description: "Perfect products for your feline friend"
    },
    {
      name: "Other Animals",
      slug: "other-animals", 
      image: "/other-animals.avif",
      description: "Care for all your other pets"
    }
  ];
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome to PetPals Shop
            </h1>
            <p className="text-xl text-muted-foreground">
              Your trusted partner for all your pet needs. Quality products,
              expert advice, and a community that cares.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1602979677071-1781b7f40023?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Happy pets"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Shop by Pet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop/${category.slug}`}
              className="group"
            >
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading ? (
            // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            // Real products
            featuredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0].imageUrl || "/placeholder.svg"}
                      alt={product.images[0].altText || product.name || "Product"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      Sale
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.name || "Unnamed Product"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {product.description || "High-quality product for your pet"}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="font-bold">
                        {formatCurrency(product.price || 0)}
                      </span>
                      {product.originalPrice && product.originalPrice > (product.price || 0) && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/shop/product/${product.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback when no products
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No featured products available at the moment.</p>
              <Button asChild>
                <Link href="/shop">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
        {featuredProducts.length > 0 && (
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-muted rounded-lg my-8 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Alex Johnson",
              text: "My dog loves the toys I bought from PetPals. Great quality and fast shipping!",
            },
            {
              name: "Sarah Miller",
              text: "The cat food selection is amazing. My picky cat finally found something she enjoys.",
            },
            {
              name: "Mark Davis",
              text: "Excellent customer service and product knowledge. Will definitely shop here again.",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
              <p className="italic mb-4">"{testimonial.text}"</p>
              <p className="font-semibold">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

