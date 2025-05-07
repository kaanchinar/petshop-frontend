"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { adminApi, Product as ApiProduct } from "@/lib/services/adminApi"; // Updated import
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await adminApi.getAllProducts();
        setProducts(fetchedProducts || []); // Handle null response from API
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate some stats for the dashboard
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + (product.price || 0),
    0
  );
  // Assuming 'stock' indicates availability. If stock is 0 or undefined, it's out of stock.
  const lowStockProducts = products.filter(
    (product) => (product.stock ?? 0) === 0
  ).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      description: "Products in inventory",
      icon: <Package className="h-5 w-5 text-muted-foreground" />,
      link: "/admin/products",
    },
    {
      title: "Inventory Value",
      value: `$${totalValue.toFixed(2)}`,
      description: "Total product value",
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      link: "/admin/products",
    },
    {
      title: "Out of Stock", // Changed from Low Stock to Out of Stock for clarity with 'stock' field
      value: lowStockProducts,
      description: "Products with zero stock",
      icon: <ShoppingCart className="h-5 w-5 text-muted-foreground" />,
      link: "/admin/products",
    },
    {
      title: "Categories",
      // Dynamically count unique categories from products
      value: new Set(products.map((p) => p.category)).size,
      description: "Product categories",
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
      link: "/admin/products",
    },
  ];

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  if (error) {
    return <p>Error loading dashboard: {error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <Link
                href={stat.link}
                className="text-xs text-primary hover:underline mt-2 inline-block"
              >
                View details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>
              The latest products added to your inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div
                    key={product.id || product.name}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          (product.stock ?? 0) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {(product.stock ?? 0) > 0
                          ? `In Stock (${product.stock})`
                          : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Inventory Status by Category</CardTitle>
            <CardDescription>
              Overview of your product inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p>No product data to display inventory status.</p>
            ) : (
              <div className="space-y-4">
                {[...new Set(products.map((p) => p.category))].map(
                  (category) => {
                    const categoryProducts = products.filter(
                      (p) => p.category === category
                    );
                    const categoryProductCount = categoryProducts.length;
                    return (
                      <div key={category}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium capitalize">
                            {category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {categoryProductCount} product
                            {categoryProductCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${
                                totalProducts > 0
                                  ? (categoryProductCount / totalProducts) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

