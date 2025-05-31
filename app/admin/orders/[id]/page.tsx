"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, MapPin, FileText, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { useGetApiOrdersId, usePutApiOrdersIdStatus } from "@/lib/api/orders/orders";
import { format } from "date-fns";
import type { OrderStatus } from "@/lib/api/petPetAPI.schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statusColors = {
  Waiting: "bg-yellow-100 text-yellow-800",
  InProcessing: "bg-blue-100 text-blue-800", 
  Completed: "bg-green-100 text-green-800",
  Withdrawn: "bg-gray-100 text-gray-800",
  Rejected: "bg-red-100 text-red-800",
};

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  
  const { data: orderData, isLoading, error, refetch } = useGetApiOrdersId(parseInt(id));
  const updateStatusMutation = usePutApiOrdersIdStatus();

  const order = orderData?.data;

  const handleStatusUpdate = async () => {
    if (!newStatus || !order?.id) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        data: { status: newStatus as OrderStatus }
      });
      
      // Refetch order data
      refetch();
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Loading Order...</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Order Not Found</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-lg text-destructive mb-4">Failed to load order details</p>
            <Button asChild>
              <Link href="/admin/orders">Back to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.id?.toString().padStart(6, '0')}
          </h1>
          <p className="text-muted-foreground">
            {order.orderNumber && `Order Number: ${order.orderNumber}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Order Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge
                  variant="secondary"
                  className={statusColors[order.status as keyof typeof statusColors]}
                >
                  {order.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">${order.totalAmount?.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {order.updatedAt ? format(new Date(order.updatedAt), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Order Items ({order.orderItems?.length || 0})</h3>
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.productImageUrl && (
                        <img 
                          src={item.productImageUrl} 
                          alt={item.productName || "Product"} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.unitPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${item.totalPrice?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <p className="text-sm bg-muted p-3 rounded-lg">{order.shippingAddress}</p>
                </div>
              </>
            )}

            {/* Notes */}
            {order.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Order Notes
                  </h3>
                  <p className="text-sm bg-muted p-3 rounded-lg">{order.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm">{order.userId || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Waiting">Waiting</SelectItem>
                  <SelectItem value="InProcessing">In Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={!newStatus || updateStatusMutation.isPending}
                className="w-full"
              >
                {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                Print Order
              </Button>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                Export PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
