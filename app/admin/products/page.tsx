"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useGetApiProducts, useDeleteApiProductsId } from "@/lib/api/products/products";
import { productDtoToProduct } from "@/lib/api-types";
import type { ProductDto } from "@/lib/api/petPetAPI.schemas";
import type { Product } from "@/lib/types";
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

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // API hooks
  const { data: productsData, isLoading, error, refetch } = useGetApiProducts({
    Page: 1,
    PageSize: 100, // Load more products for admin
    SearchTerm: searchQuery || undefined,
  });
  
  const deleteProductMutation = useDeleteApiProductsId();

  // Convert API products to legacy format
  const products = useMemo(() => {
    if (!productsData?.data?.items) return [];
    return productsData.data.items.map(productDtoToProduct);
  }, [productsData]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Apply URL params for filtering/sorting
  useEffect(() => {
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const direction = searchParams.get("direction");

    if (category) setCategoryFilter(category);
    if (search) setSearchQuery(search);
    if (sort) setSortField(sort);
    if (direction && (direction === "asc" || direction === "desc"))
      setSortDirection(direction);
  }, [searchParams]);

  // Filter and sort products when data or filters change
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) =>
        product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort products
    result.sort((a, b) => {
      let aValue: any = a[sortField as keyof Product];
      let bValue: any = b[sortField as keyof Product];

      // Handle string comparison
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchQuery, categoryFilter, sortField, sortDirection]);

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
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete && productToDelete.id) {
      try {
        await deleteProductMutation.mutateAsync({ id: parseInt(productToDelete.id) });
        refetch(); // Refresh the products list
        setDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (err) {
        console.error("Failed to delete product:", err);
        setDeleteDialogOpen(false);
      }
    }
  };

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
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
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
                    {/* Generate categories dynamically from loaded products */}
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
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/products/${product.id}`}
                                target="_blank"
                              >
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
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          productName={productToDelete.name || 'this product'}
        />
      )}
    </div>
  );
}

