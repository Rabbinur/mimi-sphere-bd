"use client";

import UserHeader from "@/components/custom/UserHeader";
import { useCreateBkashPaymentMutation } from "@/components/Redux/RTK/bkashApi";
import { useMyOrdersQuery } from "@/components/Redux/RTK/orderApi";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { CreditCard, Info, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function OrdersSkeleton() {
  return (
    <div className="bg-[#F4F4F4] min-h-screen pb-10">
      <div className="max-w-4xl mx-auto border-x border-gray-100">
        {/* Header Placeholder */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center px-4">
           <Skeleton className="h-5 w-32" />
        </div>
        
        {/* Tabs Skeleton */}
        <div className="bg-white sticky top-14 z-40 border-b border-gray-100 flex px-4 py-4 gap-6 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-4 w-16 shrink-0" />
          ))}
        </div>

        {/* Orders List Skeleton */}
        <main className="mt-2 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>

              <div className="flex gap-3">
                <Skeleton className="h-16 w-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                 <Skeleton className="h-8 w-24 rounded-lg" />
              </div>

              <div className="mt-2 pt-3 border-t border-gray-50 flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status");
  const { data, isLoading } = useMyOrdersQuery(currentStatus as string);
  const [createBkashPayment, { isLoading: isPaying }] = useCreateBkashPaymentMutation();
  const orders = data?.data || [];

  if (isLoading) return <OrdersSkeleton />;

  const handlePayNow = async (orderId: string, amount: number) => {
    try {
      const res = await createBkashPayment({ orderId, amount }).unwrap();
      if (res.bkashURL) {
        window.location.href = res.bkashURL;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const tabs = [
    { label: "All", status: null },
    { label: "Pending", status: "pending" },
    { label: "To Ship", status: "processing" },
    { label: "Shipped", status: "shipped" },
    { label: "Delivered", status: "delivered" },
    { label: "Canceled", status: "canceled" },
  ];

  const statusMap: Record<string, string> = {
    "delivered": "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    "canceled": "bg-rose-50 text-rose-700 hover:bg-rose-100",
    "shipped": "bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
    "processing": "bg-blue-50 text-blue-700 hover:bg-blue-100",
    "pending": "bg-orange-50 text-orange-700 hover:bg-orange-100",
    "failed_delivery": "bg-orange-50 text-orange-800 hover:bg-orange-100",
    "out_for_delivery": "bg-sky-50 text-sky-700 hover:bg-sky-100",
    "returned": "bg-purple-50 text-purple-700 hover:bg-purple-100",
  };


  return (
    <div className="bg-[#F4F4F4] min-h-screen pb-10">
      <div className="max-w-4xl mx-auto border-x border-gray-100 ">

        <UserHeader title="All Orders " backUrl="/user-account" />



        {/* 2. Horizontal Tabs */}
        <div className="bg-white sticky top-14 z-40 border-b border-gray-100 flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive =
              (tab.status === null && !currentStatus) ||
              tab.status === currentStatus;

            return (
              <Link
                key={tab.label}
                href={`/user-account/orders${tab.status ? `?status=${tab.status}` : ""}`}
                className={`md:px-4 px-2 py-3 md:text-[13px] text-[12px] md:font-bold font-medium whitespace-nowrap border-b-2 transition-all ${isActive
                  ? "text-pink-600 border-pink-600"
                  : "text-gray-400 border-transparent"
                  }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* 3. Orders List */}
        <TooltipProvider>
          <main className="mt-2 space-y-2">
            {orders.length === 0 ? (
              <div className="bg-white p-10 text-center text-gray-500 text-sm">
                No orders found in this category.
              </div>
            ) : (
              orders.map((order: any) => (
                <Card key={order._id} className="rounded-none border-none shadow-none bg-white p-4">
                  {/* Order Metadata */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[12px] font-bold text-gray-800">
                        Order ID: #{order.order_id || order._id.slice(-8)}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Placed on: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                    <div className="text-right">
                      <Link
                        href={`/user-account/orders/${order.order_id || order._id}`}
                        className="text-[11px] text-blue-600 font-bold"
                      >
                        View Details
                      </Link>


                    </div>
                  </div>

                  {/* Products in this Order */}
                  <div className="space-y-4">
                    {order.products.map((product: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <div className="h-16 w-16 bg-gray-50 rounded border border-gray-100 flex-shrink-0 relative overflow-hidden">
                          <Image
                            src={product.thumbnail || "/placeholder.svg"}
                            alt="img"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] text-gray-800 font-medium line-clamp-2 leading-snug">
                            {product.title}
                          </h4>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-[11px] text-gray-400">
                              ৳{product.price} x {product.quantity}
                            </p>
                            <p className="text-[13px] font-bold text-gray-900">
                              ৳{product.total_price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status and Payment Action */}
                  <div className="flex justify-end items-center gap-3 mt-4 pt-3 border-t border-gray-50">
                    {order.payment_method === 'ONLINE' && order.payment_status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="p-1 cursor-help group">
                              <Info className="h-4 w-4 text-gray-400 group-hover:text-rose-500 transition-colors" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="z-[100] bg-gray-900 text-white border-none shadow-2xl max-w-[200px] p-2">
                            <p className="text-[10px] leading-relaxed">This order is pending payment. Please pay now to confirm your order and start processing.</p>
                          </TooltipContent>
                        </Tooltip>

                        <button
                          onClick={() => handlePayNow(order.order_id, order.total_price)}
                          disabled={isPaying}
                          className="flex items-center justify-center gap-1.5 
                                 h-8 px-4 
                                 bg-pink-600 hover:bg-pink-700 text-white 
                                 text-[11px] font-bold 
                                 rounded-lg shadow-sm transition-all 
                                 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                        >
                          {isPaying ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Paying...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3.5 w-3.5" />
                              Pay Now
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    <Badge
                      className={`flex items-center justify-center 
                    h-8 px-4
                    border-none capitalize rounded-lg 
                    text-[11px] font-bold 
                    ${statusMap[order.order_status.toLowerCase()] || "bg-gray-100 text-gray-700"}`}
                    >
                      {order.order_status}
                    </Badge>
                  </div>

                  {/* Order Footer */}
                  <div className="mt-2 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">
                      Total Amount
                    </p>
                    <p className="text-[15px] font-black text-pink-600">
                      ৳{order.total_price}
                    </p>
                  </div>
                </Card>
              ))
            )}
          </main>
        </TooltipProvider>
      </div>
    </div>
  );
}