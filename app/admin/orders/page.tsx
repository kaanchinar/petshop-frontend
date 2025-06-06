"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useGetApiOrders } from "@/lib/api/orders/orders";
import { format } from "date-fns";
import type { OrderStatus } from "@/lib/api/petPetAPI.schemas";

const statusColors = {
  Waiting: "bg-yellow-100 text-yellow-800",
  InProcessing: "bg-blue-100 text-blue-800", 
  Completed: "bg-green-100 text-green-800",
  Withdrawn: "bg-gray-100 text-gray-800",
  Rejected: "bg-red-100 text-red-800",
};

const statusIcons = {
  Waiting: <Clock className="h-4 w-4" />,
  InProcessing: <Package className="h-4 w-4" />,
  Completed: <CheckCircle className="h-4 w-4" />,
  Withdrawn: <XCircle className="h-4 w-4" />,
  Rejected: <XCircle className="h-4 w-4" />,
};

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch pending orders (Waiting + InProcessing)
  const { data: pendingOrdersData, isLoading: pendingLoading } = useGetApiOrders({
    Page: currentPage,
    PageSize: 20,
    Status: activeTab === "pending" ? undefined : undefined, // We'll filter client-side
  });

  // Fetch completed orders
  const { data: completedOrdersData, isLoading: completedLoading } = useGetApiOrders({
    Page: currentPage,
    PageSize: 20,
    Status: "Completed",
  });

  // Get appropriate data based on active tab
  const ordersData = activeTab === "pending" ? pendingOrdersData : completedOrdersData;
  const isLoading = activeTab === "pending" ? pendingLoading : completedLoading;
  
  const allOrders = ordersData?.data?.items || [];
  
  // Filter orders based on tab
  const orders = activeTab === "pending" 
    ? allOrders.filter(order => order.status === 'Waiting' || order.status === 'InProcessing')
    : allOrders;
  
  // Filter orders by search query
  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id?.toString().includes(searchLower) ||
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.userId?.toLowerCase().includes(searchLower)
    );
  });
  
  const totalCount = ordersData?.data?.totalCount || 0;
  const totalPages = ordersData?.data?.totalPages || 1;

  // Get counts for tabs
  const pendingCount = pendingOrdersData?.data?.items?.filter(order => 
    order.status === 'Waiting' || order.status === 'InProcessing'
  ).length || 0;
  
  const completedCount = completedOrdersData?.data?.items?.filter(order => 
    order.status === 'Completed'
  ).length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount + completedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders by ID, customer email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Orders ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed Orders ({completedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <OrdersTable orders={filteredOrders} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <OrdersTable orders={filteredOrders} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCount)} of {totalCount} orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component for the orders table
interface OrdersTableProps {
  orders: any[];
  searchQuery: string;
}

function OrdersTable({ orders, searchQuery }: OrdersTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No orders found</p>
                    {searchQuery && (
                      <p className="text-sm mt-1">Try adjusting your search</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id?.toString().padStart(6, '0')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.userId || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{order.orderNumber || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    ${order.totalAmount?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[order.status as keyof typeof statusColors] || statusColors.Waiting}
                    >
                      <span className="flex items-center gap-1">
                        {statusIcons[order.status as keyof typeof statusIcons]}
                        {order.status}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.orderItems?.length || 0} items
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
