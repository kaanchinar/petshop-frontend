"use client";

import { useState, useEffect, useMemo } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getProductsByCategory } from "@/lib/products";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product-card";

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const router = useRouter();

  // Validate category
  const validCategories = ["cats", "dogs", "other-animals"];
  if (!validCategories.includes(params.category)) {
    notFound();
  }

  // Get products for this category - use useMemo to prevent recalculation on every render
  const allProducts = useMemo(
    () => getProductsByCategory(params.category),
    [params.category]
  );

  // Calculate min and max prices once using useMemo
  const { minPrice, maxPrice, brands } = useMemo(() => {
    const minPrice = Math.floor(
      Math.min(...allProducts.map((product) => product.price))
    );
    const maxPrice = Math.ceil(
      Math.max(...allProducts.map((product) => product.price))
    );
    const brands = [
      ...new Set(allProducts.map((product) => product.brand)),
    ].sort();
    return { minPrice, maxPrice, brands };
  }, [allProducts]);

  // State initialization
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Initialize price range only once on mount
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    // Empty dependency array ensures this only runs once on mount
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Apply price filter
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Apply in-stock filter
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter((product) => product.inStock);
    }

    // Apply on-sale filter
    if (onSaleOnly) {
      filteredProducts = filteredProducts.filter(
        (product) => product.discount > 0
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filteredProducts.sort((a, b) =>
          a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1
        );
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        filteredProducts.sort((a, b) => b.discount - a.discount);
        break;
      // Default is "featured" which is the original order
    }

    setProducts(filteredProducts);
  }, [
    allProducts,
    priceRange,
    selectedBrands,
    inStockOnly,
    onSaleOnly,
    sortOption,
    searchQuery,
  ]);

  // Get formatted category name
  const getCategoryName = () => {
    switch (params.category) {
      case "cats":
        return "Cats";
      case "dogs":
        return "Dogs";
      case "other-animals":
        return "Other Animals";
      default:
        return "";
    }
  };

  // Get banner image based on category
  const getCategoryBanner = () => {
    switch (params.category) {
      case "cats":
        return "https://images.unsplash.com/photo-1574144113084-b6f450cc5e0c?q=80&w=2664&auto=format&fit=crop";
      case "dogs":
        return "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=2671&auto=format&fit=crop";
      case "other-animals":
        return "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=2670&auto=format&fit=crop";
      default:
        return "";
    }
  };

  // Handle brand selection
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortOption("featured");
    setSearchQuery("");
  };

  // Filter and sort controls UI
  const filterControls = (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <Slider
          min={minPrice}
          max={maxPrice}
          step={1}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <label
                htmlFor={`brand-${brand}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {brand}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Stock & Sale Filters */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStockOnly"
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <label
            htmlFor="inStockOnly"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            In Stock Only
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onSaleOnly"
            checked={onSaleOnly}
            onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)}
          />
          <label
            htmlFor="onSaleOnly"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            On Sale Only
          </label>
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/shop"
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
        >
          ← Back to Shop
        </Link>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-primary tracking-tight">
          {getCategoryName()}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our curated selection of premium products for your{" "}
          {getCategoryName().toLowerCase()}.
        </p>
      </div>

      {/* Category Banner - Optional: Consider a more subtle or integrated banner if used */}
      {/* <div className="relative h-64 rounded-lg overflow-hidden mb-12 shadow-lg">
        <Image
          src={getCategoryBanner() || "/placeholder.svg"}
          alt={`${getCategoryName()} products`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center p-6">
          <h2 className="text-white text-4xl font-bold text-center">{getCategoryName()} Essentials</h2>
        </div>
      </div> */}

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-3 text-base border-primary text-primary hover:bg-primary/5"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters & Sorting
        </Button>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products in this category..."
            className="pl-12 pr-4 py-3 text-base rounded-md border-border focus:ring-primary focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-72">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="py-3 text-base rounded-md border-border focus:ring-primary focus:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="discount">Biggest Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-6 space-y-8 p-6 bg-card border border-border rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="font-semibold text-xl flex items-center text-primary">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </h3>
              {(selectedBrands.length > 0 ||
                inStockOnly ||
                onSaleOnly ||
                priceRange[0] > minPrice ||
                priceRange[1] < maxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-3 text-sm text-muted-foreground hover:text-primary"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <Accordion
                type="multiple"
                defaultValue={["price", "brand", "availability"]}
                className="w-full"
              >
                <AccordionItem value="price">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">Price Range</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        min={minPrice}
                        max={maxPrice}
                        step={1}
                        onValueChange={(value) =>
                          setPriceRange(value as [number, number])
                        }
                        className="[&>span:first-child]:h-2 [&>span:first-child>span]:bg-primary [&>span:nth-child(2)>span]:bg-primary/30"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="brand">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">Brand</AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {brands.map((brand) => (
                        <div
                          key={brand}
                          className="flex items-center space-x-3 p-1 rounded-md hover:bg-secondary/50"
                        >
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) =>
                              handleBrandChange(brand, checked as boolean)
                            }
                            className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <label
                            htmlFor={`brand-${brand}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="availability">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary">Availability</AccordionTrigger>
                  <AccordionContent className="pt-3">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-1 rounded-md hover:bg-secondary/50">
                        <Checkbox
                          id="in-stock"
                          checked={inStockOnly}
                          onCheckedChange={(checked) =>
                            setInStockOnly(checked as boolean)
                          }
                          className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="in-stock"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          In Stock Only
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 p-1 rounded-md hover:bg-secondary/50">
                        <Checkbox
                          id="on-sale"
                          checked={onSaleOnly}
                          onCheckedChange={(checked) =>
                            setOnSaleOnly(checked as boolean)
                          }
                           className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor="on-sale"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                        >
                          On Sale Only
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Active Filters */}
            {(selectedBrands.length > 0 || inStockOnly || onSaleOnly) && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground">Active Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map((brand) => (
                    <Badge
                      key={brand}
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      {brand}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 hover:bg-transparent hover:text-destructive"
                        onClick={() => handleBrandChange(brand, false)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove {brand} filter</span>
                      </Button>
                    </Badge>
                  ))}
                  {inStockOnly && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      In Stock
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 hover:bg-transparent hover:text-destructive"
                        onClick={() => setInStockOnly(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove in stock filter</span>
                      </Button>
                    </Badge>
                  )}
                  {onSaleOnly && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      On Sale
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 p-0 hover:bg-transparent hover:text-destructive"
                        onClick={() => setOnSaleOnly(false)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove on sale filter</span>
                      </Button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Filters */}
        {mobileFiltersOpen && (
          <div className="lg:hidden fixed inset-0 bg-background z-50 overflow-auto p-4 pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl text-primary">Filters & Sorting</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFiltersOpen(false)}
                className="text-muted-foreground hover:text-primary"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Sort By</h4>
                <Select value={sortOption} onValueChange={(value) => {setSortOption(value); setMobileFiltersOpen(false);}}>
                  <SelectTrigger className="py-3 text-base">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="discount">Biggest Discount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Price Range</h4>
                <Slider
                  value={priceRange}
                  min={minPrice}
                  max={maxPrice}
                  step={1}
                  onValueChange={(value) =>
                    setPriceRange(value as [number, number])
                  }
                  className="[&>span:first-child]:h-2 [&>span:first-child>span]:bg-primary [&>span:nth-child(2)>span]:bg-primary/30"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Brand</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) =>
                          handleBrandChange(brand, checked as boolean)
                        }
                        className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`mobile-brand-${brand}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-lg">Availability</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-in-stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) =>
                        setInStockOnly(checked as boolean)
                      }
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor="mobile-in-stock"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      In Stock Only
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-on-sale"
                      checked={onSaleOnly}
                      onCheckedChange={(checked) =>
                        setOnSaleOnly(checked as boolean)
                      }
                      className="border-muted-foreground data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor="mobile-on-sale"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      On Sale Only
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  className="flex-1 py-3 text-base"
                  onClick={() => {clearFilters(); setMobileFiltersOpen(false);}}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card">
              <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold mb-3 text-secondary-foreground">No Products Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting your search or clearing some filters.
              </p>
              <Button variant="outline" onClick={clearFilters} className="text-primary border-primary hover:bg-primary/5">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{products.length}</span>{" "}
                  {products.length === 1 ? "product" : "products"}
                </p>
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                  </Button>
                </div>
              </div>
              <div
                className={`transition-all duration-300 ${
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-6'
                }`}
              >
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${params.category}/${product.id}`}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

