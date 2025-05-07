import type { Product } from "./types";

// Mock data for products
const allProducts: Product[] = [
  // Cat Products
  {
    id: "cat-food-1",
    name: "Premium Cat Food - Salmon",
    description: "High-quality salmon-based cat food for all life stages.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    image:
      "https://images.unsplash.com/photo-1655210913315-e8147faf7600?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "PetNutrition",
    rating: 4.5,
    reviewCount: 128,
    isNew: false,
    inStock: true,
    tags: ["food", "premium", "salmon"],
  },
  {
    id: "cat-toy-1",
    name: "Interactive Feather Wand",
    description: "Engaging toy to stimulate your cat's hunting instincts.",
    price: 12.99,
    originalPrice: 12.99,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1640529410767-d9e02123d789?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "PlayPets",
    rating: 4.8,
    reviewCount: 95,
    isNew: true,
    inStock: true,
    tags: ["toy", "interactive"],
  },
  {
    id: "cat-bed-1",
    name: "Cozy Cat Cave Bed",
    description: "Soft, warm bed that provides security and comfort.",
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1573682127988-f67136e7f12a?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "ComfyPets",
    rating: 4.7,
    reviewCount: 62,
    isNew: false,
    inStock: true,
    tags: ["bed", "comfort"],
  },
  {
    id: "cat-litter-1",
    name: "Odor Control Clumping Litter",
    description: "Superior odor control with minimal dust.",
    price: 18.99,
    originalPrice: 18.99,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1727510152470-84074e7acd9b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "CleanPets",
    rating: 4.3,
    reviewCount: 214,
    isNew: false,
    inStock: true,
    tags: ["litter", "odor control"],
  },
  {
    id: "cat-scratcher-1",
    name: "Multi-level Cat Scratcher Tower",
    description: "Durable cardboard scratcher with multiple levels for play.",
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1636543459628-12fbfb7478c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "ScratchCo",
    rating: 4.6,
    reviewCount: 78,
    isNew: true,
    inStock: true,
    tags: ["scratcher", "furniture"],
  },
  {
    id: "cat-health-1",
    name: "Hairball Control Supplement",
    description:
      "Natural supplement to reduce hairballs and support digestion.",
    price: 15.99,
    originalPrice: 15.99,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1729703551891-d4f2d9ad1ebb?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "cats",
    brand: "PetHealth",
    rating: 4.2,
    reviewCount: 45,
    isNew: false,
    inStock: true,
    tags: ["health", "supplement"],
  },

  // Dog Products
  {
    id: "dog-food-1",
    name: "Grain-Free Dog Food - Chicken",
    description: "Nutritious grain-free formula with real chicken.",
    price: 39.99,
    originalPrice: 49.99,
    discount: 20,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Food",
    category: "dogs",
    brand: "PetNutrition",
    rating: 4.7,
    reviewCount: 156,
    isNew: false,
    inStock: true,
    tags: ["food", "grain-free", "chicken"],
  },
  {
    id: "dog-toy-1",
    name: "Durable Chew Toy",
    description: "Long-lasting rubber toy for aggressive chewers.",
    price: 14.99,
    originalPrice: 14.99,
    discount: 0,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Toy",
    category: "dogs",
    brand: "ToughPlay",
    rating: 4.5,
    reviewCount: 203,
    isNew: true,
    inStock: true,
    tags: ["toy", "durable"],
  },
  {
    id: "dog-bed-1",
    name: "Orthopedic Dog Bed - Large",
    description: "Supportive memory foam bed for joint relief.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Bed",
    category: "dogs",
    brand: "ComfyPets",
    rating: 4.9,
    reviewCount: 87,
    isNew: false,
    inStock: true,
    tags: ["bed", "orthopedic", "large"],
  },
  {
    id: "dog-collar-1",
    name: "Reflective Safety Collar",
    description:
      "Adjustable collar with reflective stitching for night visibility.",
    price: 18.99,
    originalPrice: 18.99,
    discount: 0,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Collar",
    category: "dogs",
    brand: "SafePets",
    rating: 4.6,
    reviewCount: 112,
    isNew: false,
    inStock: true,
    tags: ["collar", "safety"],
  },
  {
    id: "dog-leash-1",
    name: "Retractable Dog Leash",
    description: "Durable leash with comfortable grip and locking mechanism.",
    price: 24.99,
    originalPrice: 29.99,
    discount: 17,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Leash",
    category: "dogs",
    brand: "WalkPro",
    rating: 4.4,
    reviewCount: 94,
    isNew: true,
    inStock: true,
    tags: ["leash", "retractable"],
  },
  {
    id: "dog-treat-1",
    name: "Natural Dog Treats - Assorted",
    description: "Healthy, grain-free treats made with real meat.",
    price: 12.99,
    originalPrice: 12.99,
    discount: 0,
    image: "/placeholder.svg?height=200&width=300&text=Dog+Treats",
    category: "dogs",
    brand: "TastyPets",
    rating: 4.8,
    reviewCount: 176,
    isNew: false,
    inStock: true,
    tags: ["treats", "natural"],
  },

  // Other Animals Products
  {
    id: "bird-food-1",
    name: "Premium Bird Seed Mix",
    description: "Nutritionally complete seed mix for small to medium birds.",
    price: 9.99,
    originalPrice: 12.99,
    discount: 23,
    image: "/placeholder.svg?height=200&width=300&text=Bird+Food",
    category: "other-animals",
    brand: "FeatherFriends",
    rating: 4.5,
    reviewCount: 68,
    isNew: false,
    inStock: true,
    tags: ["bird", "food", "seed"],
  },
  {
    id: "fish-tank-1",
    name: "10-Gallon Aquarium Starter Kit",
    description: "Complete setup with filter, lighting, and decorations.",
    price: 59.99,
    originalPrice: 79.99,
    discount: 25,
    image: "/placeholder.svg?height=200&width=300&text=Fish+Tank",
    category: "other-animals",
    brand: "AquaLife",
    rating: 4.6,
    reviewCount: 42,
    isNew: true,
    inStock: true,
    tags: ["fish", "aquarium", "starter kit"],
  },
  {
    id: "hamster-cage-1",
    name: "Deluxe Hamster Habitat",
    description: "Spacious cage with tunnels, wheel, and accessories.",
    price: 44.99,
    originalPrice: 44.99,
    discount: 0,
    image: "/placeholder.svg?height=200&width=300&text=Hamster+Cage",
    category: "other-animals",
    brand: "SmallPets",
    rating: 4.7,
    reviewCount: 35,
    isNew: false,
    inStock: true,
    tags: ["hamster", "cage", "habitat"],
  },
  {
    id: "reptile-heat-1",
    name: "Reptile Heat Lamp",
    description: "Adjustable lamp to provide essential heat for reptiles.",
    price: 29.99,
    originalPrice: 34.99,
    discount: 14,
    image: "/placeholder.svg?height=200&width=300&text=Reptile+Lamp",
    category: "other-animals",
    brand: "ReptileCare",
    rating: 4.4,
    reviewCount: 28,
    isNew: false,
    inStock: true,
    tags: ["reptile", "heat lamp"],
  },
  {
    id: "rabbit-food-1",
    name: "Premium Rabbit Pellets",
    description: "Nutritionally balanced food for rabbits of all ages.",
    price: 14.99,
    originalPrice: 14.99,
    discount: 0,
    image: "/placeholder.svg?height=200&width=300&text=Rabbit+Food",
    category: "other-animals",
    brand: "BunnyBites",
    rating: 4.8,
    reviewCount: 52,
    isNew: true,
    inStock: true,
    tags: ["rabbit", "food", "pellets"],
  },
  {
    id: "guinea-pig-bedding-1",
    name: "Natural Paper Bedding",
    description: "Soft, absorbent bedding made from recycled paper.",
    price: 12.99,
    originalPrice: 15.99,
    discount: 19,
    image: "/placeholder.svg?height=200&width=300&text=Guinea+Pig+Bedding",
    category: "other-animals",
    brand: "CozyPets",
    rating: 4.5,
    reviewCount: 47,
    isNew: false,
    inStock: true,
    tags: ["guinea pig", "bedding", "natural"],
  },
];

// Function to get products by category
export function getProductsByCategory(category: string): Product[] {
  return allProducts.filter((product) => product.category === category);
}

// Function to get all products
export function getAllProducts(): Product[] {
  return allProducts;
}

// Function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

// Function to get featured products
export function getFeaturedProducts(limit = 4): Product[] {
  return allProducts
    .sort(() => 0.5 - Math.random()) // Simple shuffle
    .slice(0, limit);
}

// Function to get new products
export function getNewProducts(limit = 4): Product[] {
  return allProducts.filter((product) => product.isNew).slice(0, limit);
}

// Function to get discounted products
export function getDiscountedProducts(limit = 4): Product[] {
  return allProducts
    .filter((product) => product.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, limit);
}






