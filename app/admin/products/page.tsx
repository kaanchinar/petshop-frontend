"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/services/adminApi"; // Updated import
import { Product as ApiProduct } from "@/lib/types"; // Import Product from lib/types
// import { getAllProducts } from "@/lib/products" // Old mock data import
// import { useProductAdmin } from "@/context/product-admin-context" // Old context import
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import DeleteProductDialog from "@/components/admin/delete-product-dialog";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const { deleteProduct } = useProductAdmin() // Old context usage

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ApiProduct | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await adminApi.getAllProducts(
          categoryFilter === "all" ? undefined : categoryFilter
        );
        setProducts(fetchedProducts || []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Apply any URL params for filtering/sorting - this might need adjustment if API handles it
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const direction = searchParams.get("direction");

    if (category) setCategoryFilter(category);
    if (search) setSearchQuery(search); // Client-side search for now
    if (sort) setSortField(sort);
    if (direction && (direction === "asc" || direction === "desc"))
      setSortDirection(direction);
  }, [searchParams, categoryFilter]); // Re-fetch if categoryFilter changes for API-side filtering

  // Filter and sort products when filters change (client-side for now, except category)
  useEffect(() => {
    let result = [...products];

    // Apply search filter (client-side)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product?.name?.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query)) // description can be null
        // product.brand is not in ApiProduct, remove or adjust if needed
      );
    }

    // Apply sorting (client-side)
    result.sort((a, b) => {
      let aValue: any = a[sortField as keyof ApiProduct];
      let bValue: any = b[sortField as keyof ApiProduct];

      // Handle string comparison
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = (bValue || "").toLowerCase(); // Ensure bValue is a string
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchQuery, sortField, sortDirection]);

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle product deletion
  const handleDeleteClick = (product: ApiProduct) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete && productToDelete.id) {
      try {
        await adminApi.deleteProduct(productToDelete.id);
        // Remove from local state
        setProducts(products.filter((p) => p.id !== productToDelete.id));
        setDeleteDialogOpen(false);
        setProductToDelete(null);
        // Optionally, show a success toast/notification
      } catch (err) {
        console.error("Failed to delete product:", err);
        // Optionally, show an error toast/notification
        setError(
          err instanceof Error ? err.message : "Failed to delete product"
        );
        setDeleteDialogOpen(false); // Close dialog even on error, or keep open for retry
      }
    }
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error && !products.length) {
    // Show error prominently if no products loaded
    return <p>Error loading products: {error}. Please try refreshing.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      {error && <p className="text-red-500">Error: {error}</p>}{" "}
      {/* Show non-blocking error */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products by name or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {/* Dynamically populate categories if possible, or use predefined ones */}
                    {[...new Set(products.map((p) => p.category))]
                      .sort()
                      .map((cat) => (
                        <SelectItem
                          key={cat}
                          value={cat}
                          className="capitalize"
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    {/* <SelectItem value="cats">Cats</SelectItem>
                    <SelectItem value="dogs">Dogs</SelectItem>
                    <SelectItem value="other-animals">Other Animals</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => toggleSort("category")}
                  >
                    <div className="flex items-center">
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => toggleSort("price")}
                  >
                    <div className="flex items-center">
                      Price
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="hidden md:table-cell cursor-pointer"
                    onClick={() => toggleSort("inStock")}
                  >
                    <div className="flex items-center">
                      Stock
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id || product.name}>
                      <TableCell>
                        <Image
                          alt={product.name || 'Product image'}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.image || "/placeholder.svg"}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell capitalize">
                        {product.category}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        ${(product.price || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            product.inStock ? "default" : "destructive"
                          }
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                {" "}
                                {/* Ensure ID is available */}
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/products/${product.id}`}
                                target="_blank"
                              >
                                {" "}
                                {/* View on site */}
                                <Eye className="mr-2 h-4 w-4" /> View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {productToDelete && (
        <DeleteProductDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen} // Changed from onClose to onOpenChange and passed setDeleteDialogOpen directly
          onConfirm={confirmDelete}
          productName={productToDelete.name || 'this product'}
        />
      )}
    </div>
  );
}

