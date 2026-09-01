"use client";

import UserHeader from "@/components/custom/UserHeader";
import { useCreateBkashPaymentMutation } from "@/components/Redux/RTK/bkashApi";
import { useOrderByIdQuery } from "@/components/Redux/RTK/orderApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, parseISO } from "date-fns";
import { CheckCircle2, Clock, CreditCard, Info, Loader2, MapPin, Package, Phone, Truck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

/* ================= COMPONENT ================= */

const OrderDetails = () => {
  const { order_id } = useParams();
  const { data, isLoading, error } = useOrderByIdQuery(order_id as string);
  const [createBkashPayment, { isLoading: isPaying }] = useCreateBkashPaymentMutation();
  const order = data?.data;

  const handlePayNow = async () => {
    if (!order) return;
    try {
      const res = await createBkashPayment({
        orderId: order.order_id,
        amount: order.total_price
      }).unwrap();
      if (res.bkashURL) {
        window.location.href = res.bkashURL;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  if (isLoading) return <OrderDetailsSkeleton />;
  if (error || !order) return <OrderErrorState />;

  const formattedDate = order.createdAt
    ? format(parseISO(order.createdAt), "dd MMM yyyy, hh:mm a")
    : "N/A";

  const subtotal = order.products.reduce((acc: number, p: any) => acc + p.total_price, 0);

  const statusMap: Record<string, string> = {
    "delivered": "bg-emerald-50 text-emerald-700",
    "canceled": "bg-rose-50 text-rose-700",
    "shipped": "bg-indigo-50 text-indigo-700",
    "processing": "bg-blue-50 text-blue-700",
    "pending": "bg-orange-50 text-orange-700",
    "failed_delivery": "bg-orange-50 text-orange-800",
    "out_for_delivery": "bg-sky-50 text-sky-700",
    "returned": "bg-purple-50 text-purple-700",
  };

  const currentStatus = order.order_status.toLowerCase();
  const statuses = ["pending", "processing", "shipped", "delivered"];
  let currentIdx = statuses.indexOf(currentStatus);
  if (currentStatus === "out_for_delivery" || currentStatus === "failed_delivery") {
    currentIdx = 2;
  } else if (currentStatus === "returned") {
    currentIdx = 4;
  }

  return (
    <TooltipProvider>
      <div className="bg-[#F4F4F4] min-h-screen pb-10">

        <div className="max-w-4xl mx-auto border-x border-gray-100 ">

          <UserHeader title="Order Details " backUrl="/user-account/orders" />
          {/* Section 1: Order ID & Status */}
          <div className="bg-white p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[13px] font-bold text-gray-800 uppercase">
                  Order #{order.order_id}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">Placed on: {formattedDate}</p>
              </div>
              <Badge className={`h-8 px-4 border-none capitalize rounded-lg text-[11px] font-bold 
              ${statusMap[currentStatus] || "bg-gray-100 text-gray-700"}`}>
                {order.order_status}
              </Badge>
            </div>

            {/* Tracking Summary (Like the screenshot) */}
            <div className="mt-6 flex items-center justify-between px-4 relative">
              <div className="absolute top-3 left-10 right-10 h-[2px] bg-gray-100 -z-0" />
              <div
                className="absolute top-3 left-10 h-[2px] bg-pink-500 -z-0 transition-all duration-500"
                style={{ width: currentIdx <= 0 ? '0%' : `${(currentIdx / (statuses.length - 1)) * 80}%` }}
              />

              <StatusIcon icon={<Clock />} active={currentIdx >= 0} label="pending" />
              <StatusIcon icon={<Package />} active={currentIdx >= 1} label="processing" />
              <StatusIcon icon={<Truck />} active={currentIdx >= 2} label="shipped" />
              <StatusIcon icon={<CheckCircle2 />} active={currentIdx >= 3} label="delivered" />
              <StatusIcon icon={<XCircle />} active={currentIdx >= 4} label={currentStatus === "returned" ? "returned" : "canceled"} />
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-pink-500" />
              <h3 className="text-[13px] font-bold text-gray-800">Delivery Address</h3>
            </div>
            <div className="pl-6 space-y-1">
              <p className="text-[13px] font-bold text-gray-700">{order.customer_name}</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                {order.village_or_area}, {order.upazila}, {order.district}
              </p>
              <p className="text-[12px] text-blue-600 font-medium flex items-center gap-1 mt-1">
                <Phone className="h-3 w-3" /> {order.phone}
              </p>
            </div>
          </div>

          {/* Section 3: Products */}
          <div className="bg-white">
            <div className="p-4 border-b border-gray-50 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <h3 className="text-[13px] font-bold text-gray-800">Package Items</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {order.products.map((product: any, idx: number) => (
                <div key={idx} className="p-4 flex gap-4">
                  <div className="h-16 w-16 relative bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0">
                    <Image src={product?.thumbnail || "/placeholder.svg"} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] text-gray-800 font-medium line-clamp-1">{product?.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {Object.values(product?.selected_variant_values || {}).join(", ") || "No variants"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[12px] text-gray-500">৳ {product?.price} x {product?.quantity}</p>
                      <p className="text-[13px] font-bold text-gray-900">৳ {product?.total_price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Order Summary */}
          <div className="bg-white p-4 space-y-3">
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>Subtotal</span>
              <span>৳ {subtotal}</span>
            </div>
            <div className="flex justify-between text-[13px] text-gray-500">
              <span>Shipping Fee</span>
              <span>৳ {order.delivery_charge}</span>
            </div>
            <Separator className="bg-gray-50" />
            <div className="flex justify-between items-center">
              <span className="text-[14px] font-bold text-gray-800">Total Amount</span>
              <span className="text-[16px] font-black text-pink-600">৳ {order.total_price}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 pt-1">
              <span>Payment Method</span>
              <span className="font-bold text-gray-600 uppercase">{order.payment_method}</span>
            </div>

            {order.payment_method === 'ONLINE' && order.payment_status === 'pending' && (
              <div className="pt-4 border-t border-gray-50">
                <div className="flex items-center justify-between mb-3 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-rose-100 p-1.5 rounded-full">
                      <Info className="h-4 w-4 text-rose-500" />
                    </div>
                    <p className="text-[12px] font-bold text-gray-700">Payment Pending</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-[11px] text-rose-600 font-bold underline decoration-dotted underline-offset-4">Why pay now?</button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="z-[100] bg-gray-900 text-white border-none shadow-2xl max-w-[220px] p-3">
                      <p className="text-[11px] leading-relaxed">
                        To ensure your items are reserved and we can begin shipping, please complete the payment. Orders are only processed after successful payment.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Button
                  onClick={handlePayNow}
                  disabled={isPaying}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-pink-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {isPaying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  Confirm & Pay Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

/* ================= HELPERS ================= */

const StatusIcon = ({ icon, active, label }: { icon: any, active?: boolean, label: string }) => (
  <div className="flex flex-col items-center gap-1 z-10">
    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${active ? 'bg-pink-500 border-pink-500 text-white shadow-md shadow-pink-200' : 'bg-white border-gray-100 text-gray-300'
      }`}>
      {cloneElement(icon, { size: 16 })}
    </div>
    <span className={`text-[9px] font-bold uppercase tracking-tighter ${active ? 'text-pink-600' : 'text-gray-300'}`}>
      {label}
    </span>
  </div>
);

import { cloneElement } from "react";

const OrderErrorState = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-white p-6">
    <XCircle className="h-16 w-16 text-gray-200 mb-4" />
    <h2 className="text-lg font-bold text-gray-800">Order Not Found</h2>
    <Button asChild className="mt-6 bg-pink-600 hover:bg-pink-700 rounded-full px-8">
      <Link href="/user-account/orders">Back to Orders</Link>
    </Button>
  </div>
);

const OrderDetailsSkeleton = () => (
  <div className="bg-[#F4F4F4] min-h-screen">
    <div className="max-w-4xl mx-auto border-x border-gray-100 bg-white min-h-screen">
      {/* Header Placeholder */}
      <div className="h-14 border-b border-gray-100 flex items-center px-4">
        <Skeleton className="h-5 w-32" />
      </div>

      {/* Section 1: Order ID & Status */}
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Timeline Skeleton */}
        <div className="flex items-center justify-between px-4 mt-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-2 w-12" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 h-2 w-full" />

      {/* Section 2: Delivery Address */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="pl-6 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-64" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      <div className="bg-gray-50 h-2 w-full" />

      {/* Section 3: Products */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 h-2 w-full" />

      {/* Section 4: Summary */}
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Separator className="bg-gray-50" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  </div>
);

export default OrderDetails;