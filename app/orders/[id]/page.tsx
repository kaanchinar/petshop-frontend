"use client";

import React from "react";
import { useGetApiOrdersId } from "@/lib/api/orders/orders";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  MapPin, 
  Package, 
  Receipt,
  Truck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ReviewButton from "@/components/reviews/review-button";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

function OrderDetailsPageContent({ params }: OrderDetailsPageProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Handle async params
  const [resolvedParams, setResolvedParams] = React.useState<{ id: string } | null>(null);
  
  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Always call hooks in the same order - use a default orderId that won't cause issues
  const orderId = resolvedParams ? parseInt(resolvedParams.id) : 0;
  
  // Always call the hook, but skip the query if we don't have a valid orderId or not authenticated
  const { data: orderData, isLoading, error } = useGetApiOrdersId(orderId, {
    query: {
      enabled: !!resolvedParams && orderId > 0 && isAuthenticated, // Only enable when authenticated
    },
  });

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <CardTitle>Sign In Required</CardTitle>
                <CardDescription>
                  You need to be signed in to view order details.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <Button asChild className="w-full">
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="text-primary hover:underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Wait for params to resolve
  if (!resolvedParams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orderData?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const order = orderData.data;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "confirmed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">
                Order #{order.orderNumber || order.id}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className={getStatusColor(order.status)}
            >
              {order.status || "Unknown"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Order Date
                  </div>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    Total Amount
                  </div>
                  <p className="font-medium text-lg">{formatCurrency(order.totalAmount)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Status
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(order.status)}
                  >
                    {order.status || "Unknown"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
              <CardDescription>
                {order.orderItems?.length || 0} item(s) in this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.productImageUrl || "/placeholder.jpg"}
                          alt={item.productName || "Product image"}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {item.productName || "Unknown Product"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Unit Price: {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{item.quantity || 0}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                      </div>
                      
                      {/* Review Button for Completed Orders */}
                      <div className="flex flex-col items-end gap-2">
                        <ReviewButton
                          productId={item.productId || 0}
                          orderId={order.id || 0}
                          productName={item.productName || "Product"}
                          orderStatus={order.status || ""}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-medium">Order Total:</span>
                    <span className="text-lg font-bold">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No items found in this order.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Shipping Address</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {order.shippingAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return <OrderDetailsPageContent params={params} />;
}
