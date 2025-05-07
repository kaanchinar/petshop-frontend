'use client';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function ShopPage() {
  const categories = [
    {
      id: "cats",
      name: "Cats",
      description: "Everything your feline friend needs - from food to toys and accessories.",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2643&auto=format&fit=crop",
    },
    {
      id: "dogs",
      name: "Dogs",
      description: "Quality products for your canine companion - treats, toys, beds, and more.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2670&auto=format&fit=crop",
    },
    {
      id: "other-animals",
      name: "Other Animals",
      description: "Supplies for birds, fish, small pets, and reptiles - cages, tanks, food, and accessories.",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2676&auto=format&fit=crop",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 text-primary tracking-tight">
          Discover Your Pet's Next Favorite Thing
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our curated collections of high-quality pet products. We have everything you need to keep your furry, scaly, or feathered friends happy and healthy.
        </p>
      </div>

      {/* Categories */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold mb-10 text-center text-secondary-foreground">Shop by Pet</h2>
        {/* MODIFIED GRID LAYOUT: 1 col on small, 2 cols on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {categories.map((category) => (
            <div
              key={category.id}
              // MODIFIED CARD LAYOUT: flex-col on small, md:flex-row with image left, content right. md:items-stretch to make them same height.
              className="bg-card border border-border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group flex flex-col md:flex-row md:items-stretch"
            >
              {/* Image Section (Left) */}
              {/* md:w-1/3 for width, aspect-video for small screens, md:aspect-auto for stretched height on medium+ */}
              <div className="relative w-full md:w-1/3 aspect-video md:aspect-auto flex-shrink-0">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              {/* Content Section (Right) */}
              {/* p-6 for padding, flex flex-col for vertical arrangement, text-left, flex-grow to take remaining space */}
              <div className="p-6 flex flex-col text-left flex-grow">
                <h3 className="text-2xl font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-4 text-sm h-20 overflow-hidden"> {/* Keeping original description constraints */}
                  {category.description}
                </p>
                {/* Button wrapper: mt-auto to push to bottom, pt-4 for spacing */}
                <div className="mt-auto pt-4">
                  <Button
                    asChild
                    size="lg" // MADE BUTTON LARGER
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    <Link href={`/shop/${category.id}`}>
                      <span>Browse {category.name}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="mb-20 bg-secondary/50 py-16 rounded-lg">
        <h2 className="text-4xl font-bold mb-10 text-center text-secondary-foreground">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {[
            {
              name: "New Arrivals",
              image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2664&auto=format&fit=crop",
              bgColor: "bg-accent/20",
              textColor: "text-accent-foreground",
              buttonVariant: "outline",
            },
            {
              name: "Best Sellers",
              image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop",
              bgColor: "bg-primary/20",
              textColor: "text-primary-foreground",
               buttonVariant: "default",
            },
            {
              name: "Seasonal Picks",
              image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=2574&auto=format&fit=crop",
              bgColor: "bg-destructive/20",
              textColor: "text-destructive-foreground",
               buttonVariant: "destructive",
            },
            {
              name: "Special Offers",
              image: "https://images.unsplash.com/photo-1560743173-567a3b5658b1?q=80&w=2574&auto=format&fit=crop",
              bgColor: "bg-yellow-400/20", // Custom color example
              textColor: "text-yellow-700",
               buttonVariant: "secondary",
            },
          ].map((collection, index) => (
            <div key={index} className={`relative h-72 rounded-lg overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 ${collection.bgColor}`}>
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-50 group-hover:opacity-70"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className={`text-2xl font-bold mb-3 ${collection.textColor}`}>{collection.name}</h3>
                <Button variant={collection.buttonVariant as any} size="sm">Shop Now</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shopping Benefits */}
      <section className="py-12">
        <h2 className="text-4xl font-bold mb-10 text-center text-secondary-foreground">Why Shop With PetPals?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Free Shipping", description: "On all orders over $49!", icon: "🚚" },
            { title: "Quality Guarantee", description: "Top-notch products for your pets.", icon: "⭐" },
            { title: "Expert Support", description: "Friendly advice from pet lovers.", icon: "💬" },
            { title: "Easy Returns", description: "Hassle-free return policy.", icon: "↩️" },
          ].map((benefit, index) => (
            <div key={index} className="bg-card border border-border p-8 rounded-xl text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
