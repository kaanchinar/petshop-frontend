import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
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
          {["Cats", "Dogs", "Other Animals"].map((category) => (
            <Link
              key={category}
              href={`/shop/${category.toLowerCase().replace(" ", "-")}`}
              className="group"
            >
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=${category}`}
                  alt={category}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">{category}</h3>
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
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={`/placeholder.svg?height=200&width=300&text=Product ${item}`}
                  alt={`Product ${item}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">Premium Pet Product</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  High-quality item for your pet
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-bold">$29.99</span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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

