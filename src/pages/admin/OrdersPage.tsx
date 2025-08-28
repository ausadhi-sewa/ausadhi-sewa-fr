import React, { useState, useEffect } from "react";
import { orderApi, type Order, type OrderFilters } from "../../api/orderApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  AlertCircle,
  Loader2,
  Eye,
  Calendar,
  User,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Printer,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { useNavigate } from "react-router-dom";
import { checkSession } from "@/features/auth/authSlice";
const orderStatuses = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "out_for_delivery",
    label: "Out for Delivery",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "returned",
    label: "Returned",
    color: "bg-orange-100 text-orange-800",
  },
];

const paymentStatuses = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    outForDeliveryOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 20,
    status: undefined,
    paymentStatus: undefined,
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStaffAssignment, setShowStaffAssignment] = useState<string | null>(
    null
  );
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, [filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await orderApi.getAllOrders(filters);
      setOrders(result.orders);
    } catch (error: any) {
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await orderApi.getOrderStatistics();
      setStatistics(stats);
    } catch (error: any) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    if (!status || status.trim() === "") {
      setError("Invalid status value");
      return;
    }

    try {
      await orderApi.updateOrderStatus(orderId, status);
      loadOrders(); // Reload orders
      loadStatistics(); // Reload statistics
    } catch (error: any) {
      setError(error.message || "Failed to update order status");
    }
  };

  const handlePaymentStatusUpdate = async (
    orderId: string,
    paymentStatus: string
  ) => {
    if (!paymentStatus || paymentStatus.trim() === "") {
      setError("Invalid payment status value");
      return;
    }

    try {
      await orderApi.updatePaymentStatus(orderId, paymentStatus);
      loadOrders(); // Reload orders
    } catch (error: any) {
      setError(error.message || "Failed to update payment status");
    }
  };

  const handleAssignStaff = async (orderId: string) => {
    if (!staffId || !staffId.trim()) {
      setError("Please enter a staff ID");
      return;
    }

    try {
      await orderApi.assignOrderToStaff(orderId, staffId.trim());
      setShowStaffAssignment(null);
      setStaffId("");
      loadOrders(); // Reload orders
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to assign staff");
    }
  };

  const handlePrintOrder = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Order ${order.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              .items { margin-bottom: 20px; }
              .total { font-weight: bold; font-size: 18px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Details</h1>
              <h2>Order #${order.id}</h2>
            </div>
            <div class="order-info">
              <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              <p><strong>Payment Method:</strong> ${
                order.paymentMethod === "cash_on_delivery"
                  ? "Cash on Delivery"
                  : "Online Payment"
              }</p>
            </div>
            <div class="items">
              <h3>Order Items:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.product.name}</td>
                      <td>${item.quantity}</td>
                      <td>₹${item.price}</td>
                      <td>₹${item.total}</td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
            <div class="total">
              <p>Subtotal: ₹${order.subtotal}</p>
              <p>Delivery Fee: ₹${order.deliveryFee}</p>
              <p>Discount: ₹${order.discount}</p>
              <p>Total: ₹${order.total}</p>
            </div>
            <div class="address">
              <h3>Delivery Address:</h3>
              <p>${order.address.fullName}</p>
              <p>${order.address.phoneNumber}</p>
              <p>${order.address.addressLine1}</p>
              ${
                order.address.addressLine2
                  ? `<p>${order.address.addressLine2}</p>`
                  : ""
              }
              <p>${order.address.city}, ${order.address.district}, ${
        order.address.province
      }</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleExportOrders = () => {
    const csvContent = [
      [
        "Order Number",
        "Date",
        "Customer",
        "Phone",
        "Status",
        "Payment Status",
        "Total",
        "Items",
      ],
      ...orders.map((order) => [
        order.id,
        formatDate(order.createdAt),
        order.address.fullName,
        order.address.phoneNumber,
        order.status,
        order.paymentStatus,
        order.total,
        order.items.length,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string, type: "order" | "payment") => {
    const statusList = type === "order" ? orderStatuses : paymentStatuses;
    const statusInfo = statusList.find((s) => s.value === status);
    return statusInfo ? (
      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
    ) : (
      <Badge variant="secondary">{status}</Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold">{statistics.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold">{statistics.pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold">
                  {statistics.processingOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Truck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Out for Delivery
                </p>
                <p className="text-2xl font-bold">
                  {statistics.outForDeliveryOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold">
                  {statistics.completedOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cancelled Orders
                </p>
                <p className="text-2xl font-bold">
                  {statistics.cancelledOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">
                  ₹{statistics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Orders
                </p>
                <p className="text-2xl font-bold">{statistics.todayOrders}</p>
                <p className="text-xs text-gray-500">
                  ₹{statistics.todayRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select
                value={filters.paymentStatus || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    paymentStatus: value === "all" ? undefined : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All payment statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payment statuses</SelectItem>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="limit">Items per page</Label>
              <Select
                value={filters.limit?.toString() || "20"}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, limit: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                onClick={() =>
                  setFilters({
                    page: 1,
                    limit: 20,
                    status: undefined,
                    paymentStatus: undefined,
                  })
                }
                variant="outline"
                className="flex-1"
              >
                Clear Filters
              </Button>
              <Button
                onClick={handleExportOrders}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Manage and track all customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.address.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.address.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDate(order.createdAt)}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status, "order")}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(order.paymentStatus, "payment")}
                      <div className="text-xs text-gray-500 capitalize">
                        {order.paymentMethod.replace("_", " ")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{order.total}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder?.id === order.id ? null : order
                            )
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {selectedOrder?.id === order.id
                            ? "Hide"
                            : "View"}{" "}
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handlePrintOrder(order)}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          Print Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <div className="w-full">
                            <Label className="text-xs">Order Status</Label>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(order.id, value)
                              }
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Order Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {orderStatuses.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <div className="w-full">
                            <Label className="text-xs">Payment Status</Label>
                            <Select
                              value={order.paymentStatus}
                              onValueChange={(value) =>
                                handlePaymentStatusUpdate(order.id, value)
                              }
                            >
                              <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Payment Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentStatuses.map((status) => (
                                  <SelectItem
                                    key={status.value}
                                    value={status.value}
                                  >
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Staff Assignment</DropdownMenuLabel>
                        {showStaffAssignment === order.id ? (
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <div className="space-y-2 w-full">
                              <Input
                                placeholder="Enter staff ID"
                                value={staffId}
                                onChange={(e) => setStaffId(e.target.value)}
                                className="w-full"
                              />
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  onClick={() => handleAssignStaff(order.id)}
                                  className="text-xs"
                                >
                                  Assign
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setShowStaffAssignment(null);
                                    setStaffId("");
                                  }}
                                  className="text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => setShowStaffAssignment(order.id)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Assign Staff
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Order Details - {selectedOrder.orderNumber}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {selectedOrder.address.fullName}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.address.phoneNumber}
                  </p>
                  <p>
                    <strong>Address:</strong>
                  </p>
                  <p className="ml-4">{selectedOrder.address.addressLine1}</p>
                  {selectedOrder.address.addressLine2 && (
                    <p className="ml-4">{selectedOrder.address.addressLine2}</p>
                  )}
                  <p className="ml-4">
                    {selectedOrder.address.city},{" "}
                    {selectedOrder.address.district},{" "}
                    {selectedOrder.address.province}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Order Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod.replace("_", " ")}
                  </p>
                  <p>
                    <strong>Subtotal:</strong> ₹{selectedOrder.subtotal}
                  </p>
                  <p>
                    <strong>Delivery Fee:</strong> ₹{selectedOrder.deliveryFee}
                  </p>
                  <p>
                    <strong>Discount:</strong> ₹{selectedOrder.discount}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{selectedOrder.total}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="font-medium mb-2">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                      {item.product.profileImgUrl ? (
                        <img
                          src={item.product.profileImgUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">₹{item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedOrder.specialInstructions && (
              <>
                <Separator className="my-4" />
                <div>
                  <h4 className="font-medium mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-700">
                    {selectedOrder.specialInstructions}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {orders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {orders.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((filters.page || 1) - 1) * (filters.limit || 20) + 1}{" "}
                to{" "}
                {Math.min(
                  (filters.page || 1) * (filters.limit || 20),
                  orders.length
                )}{" "}
                of {orders.length} orders
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page || 1) - 1,
                    }))
                  }
                  disabled={(filters.page || 1) === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 py-2 text-sm">
                  Page {filters.page || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: (prev.page || 1) + 1,
                    }))
                  }
                  disabled={orders.length < (filters.limit || 20)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
