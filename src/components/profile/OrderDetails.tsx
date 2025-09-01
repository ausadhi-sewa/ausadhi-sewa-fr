import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { orderApi, type Order } from "@/api/orderApi";
import { useAppSelector } from "@/utils/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  CreditCard,
  MapPin,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !user) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (e: any) {
        setError(e?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const formatCurrency = (amount: string | number) => {
    const n = typeof amount === "string" ? parseFloat(amount) : amount;
    return `₹${(isNaN(n) ? 0 : n).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  const derivedTracking = useMemo(() => {
    if (!order) return null;
    
    // If order is cancelled, show a special cancelled state
    if (order.status === 'cancelled') {
      return {
        estimatedDelivery: null,
        steps: [
          { 
            status: 'cancelled', 
            label: 'Order Cancelled', 
            completed: true, 
            time: formatDate(order.updatedAt) 
          }
        ],
      };
    }
    
    const statusOrder: Array<{ key: Order['status']; label: string }> = [
      { key: "pending", label: "Order Placed" },
      { key: "confirmed", label: "Order Confirmed" },
      { key: "processing", label: "Processing" },
      { key: "out_for_delivery", label: "Out for Delivery" },
      { key: "delivered", label: "Delivered" },
    ];

    const currentIndex = statusOrder.findIndex((s) => s.key === order.status);
    const steps = statusOrder.map((s, idx) => ({
      status: s.key,
      label: s.label,
      completed: idx <= (currentIndex === -1 ? 0 : currentIndex),
      time: idx <= (currentIndex === -1 ? 0 : currentIndex) ? formatDate(order.updatedAt) : "",
    }));
    const estimated = new Date(order.createdAt);
    estimated.setDate(estimated.getDate() + 3);
    return {
      estimatedDelivery: estimated.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      steps,
    };
  }, [order]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "out_for_delivery":
        return <Truck className="h-4 w-4 text-indigo-600" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-amber-700" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "out_for_delivery":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-400";
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !id) return;
    
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }

    try {
      setCancelling(true);
      await orderApi.userCancelOrder(id);
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
      toast.success("Order cancelled successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-12">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-white/60" onClick={() => navigate("/") }>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 text-balance mb-2">Sign in required</h1>
              <p className="text-slate-600 text-lg">Please log in to view order details</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-10 w-10 rounded-md bg-white/60 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-64 bg-white/60 rounded animate-pulse" />
              <div className="h-4 w-40 bg-white/60 rounded animate-pulse" />
            </div>
          </div>
          <div className="bg-white/70 rounded-3xl shadow-xl border border-white/50 overflow-hidden p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-72 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-56 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="h-10 w-40 bg-slate-100 rounded ml-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-4 mb-12">
            <Button variant="ghost" size="sm" className="p-2 hover:bg-white/60" onClick={() => navigate("/profile/orders") }>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 text-balance mb-2">Order Details</h1>
              <p className="text-slate-600 text-lg">There was a problem loading this order</p>
            </div>
          </div>
          <div className="bg-white/70 rounded-3xl shadow-xl border border-red-200 overflow-hidden p-12 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-red-700">{error || "Order not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-white/60" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 text-balance mb-2">Order id: #{order.id || order.orderNumber}</h1>
            <p className="text-slate-600 text-lg">Track your medical order and delivery status</p>
          </div>
        </div>

        <div className="bg-transparent/20 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 p-8 border-b border-slate-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-medium`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-4 py-2 text-sm font-medium">
                    Payment {order.paymentStatus}
                  </Badge>
                  {/* Cancel button - only show for cancellable orders */}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="ml-4"
                    >
                      {cancelling ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <p className="text-slate-700 text-lg">
                  {order.status === "confirmed" 
                    ? "Your medical order has been confirmed and is being prepared for delivery." 
                    : order.status === "cancelled"
                    ? "This order has been cancelled and will not be processed."
                    : "Your order update is shown below."}
                </p>
                <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Ordered {formatDate(order.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated {formatDate(order.updatedAt)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800">{formatCurrency(order.total)}</p>
                <p className="text-slate-600">Total Amount</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-12">
            {/* Only show delivery progress for non-cancelled orders */}
            {order.status !== 'cancelled' && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <Truck className="h-6 w-6 text-blue-600" />
                  Delivery Progress
                </h2>
             
                <div className="relative">
                {(() => {
                  const steps = derivedTracking?.steps || [];
                  
                  // For cancelled orders, show a simple cancelled state
                  if (order.status === 'cancelled') {
                    return (
                      <div className="w-full">
                        <div className="relative h-10">
                          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-red-200" />
                          <div className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-red-500" style={{ width: '100%' }} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-red-500 border-2 border-red-500 flex items-center justify-center text-white">
                              <X className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-sm text-slate-800">Order Cancelled</p>
                          <p className="text-xs text-slate-500">{formatDateShort(order.updatedAt)}</p>
                        </div>
                      </div>
                    );
                  }
                  
                  const completedCount = steps.filter((s) => s.completed).length;
                  const progressPercent = steps.length > 1
                    ? Math.min(100, Math.max(0, ((completedCount - 1) / (steps.length - 1)) * 100))
                    : 0;
                  return (
                    <div className="w-full">
                      {/* Base line */}
                      <div className="relative h-10">
                        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-slate-200" />
                        {/* Progress line */}
                        <div
                          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-emerald-500 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                        {/* Nodes */}
                        <div className="absolute inset-0 flex items-center justify-between">
                          {steps.map((s) => (
                            <div key={s.status} className="relative flex flex-col items-center">
                              <div
                                className={
                                  s.completed
                                    ? "w-7 h-7 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center text-white"
                                    : "w-7 h-7 rounded-full bg-white border-2 border-slate-300"
                                }
                              >
                                {s.completed && <CheckCircle className="w-4 h-4" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Labels and dates */}
                      <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                        {steps.map((s) => (
                          <div key={s.status} className="text-left">
                            <p className={`text-sm ${s.completed ? "text-slate-800" : "text-slate-400"}`}>{s.label}</p>
                            <p className="text-xs text-slate-500">{s.completed ? formatDateShort(order.updatedAt) : ""}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </section>
            )}

            <section>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Package className="h-6 w-6 text-blue-600" />
                Order Items
              </h2>
              <div className="bg-slate-50/50 rounded-2xl p-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <img
                      src={item.product.profileImgUrl || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-white border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-800">{item.product.name}</h3>
                      <p className="text-slate-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Summary */}
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  Payment Details
                </h2>
                <div className="bg-transparent/20 border-2 border-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Payment Method</span>
                    <span className="font-semibold text-slate-800">{order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                  <Separator className="bg-slate-200" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="text-slate-800">{formatCurrency(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Delivery Fee</span>
                      <span className="text-slate-800">{formatCurrency(order.deliveryFee)}</span>
                    </div>
                    <Separator className="bg-slate-200" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-slate-800">Total</span>
                      <span className="text-slate-800">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Delivery Address
                </h2>
                <div className="bg-transparent/20 border-2 border-white/60 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="font-semibold text-slate-800 text-lg">{order.address.fullName}</p>
                      <p className="text-slate-600">{order.address.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="text-slate-700 leading-relaxed">
                    <p>{order.address.addressLine1}</p>
                    {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                    <p>
                      {order.address.city}, {order.address.district}, {order.address.province}
                    </p>
                    {order.address.postalCode && <p>PIN: {order.address.postalCode}</p>}
                  </div>
                </div>
              </section>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Special Instructions
                </h2>
                <div className="bg-slate-50/50 rounded-2xl p-6">
                  <p className="text-gray-700">{order.specialInstructions}</p>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

