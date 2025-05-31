"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Filter, Grid3X3, List, Search } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/product-card";
import { useGetApiProducts } from "@/lib/api/products/products";
import { productDtoToProduct } from "@/lib/api-types";
import type { Product } from "@/lib/types";

interface CategoryPageContentProps {
  category: string;
}

export function CategoryPageContent({ category }: CategoryPageContentProps) {
  // Declare ALL hooks at the very top before any logic
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Memoize the search term to prevent unnecessary re-renders
  const memoizedSearchTerm = useMemo(() => {
    return searchQuery.trim() || undefined;
  }, [searchQuery]);

  const { data: productsData, isLoading, error } = useGetApiProducts({
    Page: 1,
    PageSize: 100,
    SearchTerm: memoizedSearchTerm,
  });

  const products = useMemo(() => {
    if (!productsData?.data?.items) return [];
    return productsData.data.items.map(productDtoToProduct);
  }, [productsData]);

  const formattedCategoryName = useMemo(() => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [category]);

  useEffect(() => {
    let result = [...products];

    if (category && category !== "all") {
      const categoryMap: Record<string, string[]> = {
        cats: ["Cats"],
        dogs: ["Dogs"], 
        "other-animals": ["Other"],
      };

      const allowedCategories = categoryMap[category.toLowerCase()] || [category];
      result = result.filter((product) =>
        allowedCategories.includes(product.category)
      );
    }

    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, category, searchQuery, sortBy]);

  // Now we can have conditional returns
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-destructive mb-4">Failed to load products</p>
            <Button asChild>
              <Link href="/shop">Go back to shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to shop</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {formattedCategoryName}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none border-l"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No products found{searchQuery ? ` for "${searchQuery}"` : ""}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
