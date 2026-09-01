"use client";

import { Loader2, MapPin, Package, PackageSearch, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useTrackOrderMutation } from "@/components/Redux/RTK/orderApi";

/* ================= HELPERS ================= */

const formatPrice = (amount: number) => `৳${amount.toLocaleString("en-BD")}`;

type StatusKey = "pending" | "processing" | "shipped" | "delivered" | "canceled" | "cancelled" | "returned" | "failed_delivery" | "out_for_delivery";

const STATUS_MAP: Record<StatusKey, { pill: string; bar: string; step: number; label: string }> = {
    pending: { pill: "bg-orange-50 text-orange-700 ring-1 ring-orange-200", bar: "bg-orange-400", step: 1, label: "Placed" },
    processing: { pill: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", bar: "bg-blue-400", step: 2, label: "Processing" },
    shipped: { pill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", bar: "bg-indigo-400", step: 3, label: "Shipped" },
    delivered: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", bar: "bg-emerald-400", step: 4, label: "Delivered" },
    canceled: { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", bar: "bg-rose-400", step: 0, label: "Cancelled" },
    cancelled: { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", bar: "bg-rose-400", step: 0, label: "Cancelled" },
    returned: { pill: "bg-purple-50 text-purple-700 ring-1 ring-purple-200", bar: "bg-purple-400", step: 0, label: "Returned" },
    failed_delivery: { pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", bar: "bg-amber-400", step: 3, label: "Failed Delivery" },
    out_for_delivery: { pill: "bg-sky-50 text-sky-700 ring-1 ring-sky-200", bar: "bg-sky-400", step: 3, label: "Out for Delivery" },
};

const STEPS = ["Placed", "Processing", "Shipped", "Delivered"];

/* ================= PAGE ================= */

export default function TrackOrderPage() {
    const searchParams = useSearchParams();
    const queryOrderId = searchParams.get("orderId") || searchParams.get("order_id") || "";
    const queryPhone = searchParams.get("phone") || "";

    const [orderId, setOrderId] = useState(queryOrderId);
    const [phone, setPhone] = useState(queryPhone);

    const [trackOrder, { data, isLoading, error, isSuccess }] = useTrackOrderMutation();

    useEffect(() => {
        if (queryOrderId && queryPhone) {
            trackOrder({ order_id: queryOrderId, phone: queryPhone });
        }
    }, [queryOrderId, queryPhone, trackOrder]);

    const handleTrack = async () => {
        if (!orderId.trim() || !phone.trim()) return;
        await trackOrder({ order_id: orderId.trim(), phone: phone.trim() });
    };

    const order = data?.data;
    const statusKey = order?.order_status as StatusKey;
    const status = statusKey ? STATUS_MAP[statusKey] : null;
    const isCancelled = statusKey === "canceled" || statusKey === "returned";

    return (
        <div className="min-h-[60vh] md:min-h-screen bg-slate-50/60 flex flex-col items-center justify-center px-2 md:px-4 py-4 md:py-12">

            {/* Card */}
            <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

                {/* Top strip */}
                <div className="px-4 md:px-6 pt-4 md:pt-8 pb-4 md:pb-6 text-center border-b border-slate-100">
                    <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                        <PackageSearch className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-base font-bold text-primary tracking-tight">Track your order</h1>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Enter your details to see live status</p>
                </div>

                {/* Form */}
                <div className="px-4 md:px-6 py-4 md:py-5 space-y-3 border-b border-slate-100">
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Order ID  (e.g. ORD-2604001)"
                            value={orderId}
                            disabled={!!queryOrderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        />
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="tel"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-slate-400 transition"
                        />
                    </div>

                    <button
                        onClick={handleTrack}
                        disabled={isLoading || !orderId || !phone}
                        className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Tracking…
                            </>
                        ) : "Track Order"}
                    </button>

                    {error && (
                        <p className="text-center text-xs font-semibold text-rose-500 pt-1">
                            Order not found. Please check your Order ID & phone.
                        </p>
                    )}
                </div>

                {/* Result */}
                {order && status && (
                    <div className="px-6 py-5 space-y-5">

                        {/* Order ID + status */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</p>
                                <p className="text-sm font-bold text-primary mt-0.5">{order.order_id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${status.pill}`}>
                                {status.label}
                            </span>
                        </div>

                        {/* Progress bar — hidden if cancelled */}
                        {!isCancelled && (
                            <div>
                                <div className="flex justify-between mb-2">
                                    {STEPS.map((s, i) => (
                                        <span
                                            key={s}
                                            className={`text-[9px] font-bold uppercase tracking-wide ${i < status.step ? "text-slate-700" : "text-slate-300"}`}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${status.bar}`}
                                        style={{ width: `${(status.step / 4) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Payment */}
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Payment</span>
                            <span className={`font-bold capitalize ${order.payment_status === "paid" ? "text-emerald-600" : "text-rose-500"}`}>
                                {order.payment_status}
                            </span>
                        </div>

                        {/* Delivery address */}
                        {(order.district || order.upazila) && (
                            <div className="flex items-start gap-2 text-xs text-slate-500">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 text-slate-300 shrink-0" />
                                <span className="font-medium">{[order.upazila, order.district].filter(Boolean).join(", ")}</span>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-slate-100" />

                        {/* Products */}
                        <div className="space-y-2.5">
                            {order.products.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between gap-3">
                                    <p className="text-xs text-slate-700 font-medium truncate flex-1">
                                        {item.title}
                                        <span className="text-slate-400"> × {item.quantity}</span>
                                    </p>
                                    <p className="text-xs font-bold text-primary shrink-0">{formatPrice(item.total_price)}</p>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                            <span className="text-base font-black text-primary tracking-tight">{formatPrice(order.total_price)}</span>
                        </div>

                    </div>
                )}
            </div>

            <p className="mt-6 text-[11px] text-slate-400 font-medium text-center">
                Need help? Contact our support team.
            </p>
        </div>
    );
}