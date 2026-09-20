"use client";

import { useOrderByIdQuery } from "@/components/Redux/RTK/orderApi";
import { useFeaturedProductQuery } from "@/components/Redux/RTK/productApi";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import { TProduct } from "@/types";
import {
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Copy,
    CreditCard,
    Download,
    Home,
    Loader2,
    MapPin,
    Package,
    Phone,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/components/Redux/hooks";
import { clearCart } from "@/components/Redux/Slice/cartSlice";
import { useClearCartServerMutation } from "@/components/Redux/RTK/cartApi";

const OrderSuccess = ({ orderId }: { orderId?: string | null }) => {
    const dispatch = useAppDispatch();
    const [clearCartServer] = useClearCartServerMutation();
    const hasClearedCart = useRef(false);

    const { data: orderData, isLoading: isOrderLoading } = useOrderByIdQuery(orderId || "", {
        skip: !orderId,
    });
    const order = orderData?.data;

    const { data, isLoading } = useFeaturedProductQuery(undefined);
    const products: TProduct[] = data?.data || [];
    const suggestedProducts = products.slice(0, 8);

    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showReturnPolicy, setShowReturnPolicy] = useState(false);
    const hasFiredPurchase = useRef(false);

    useEffect(() => {
        if (!hasClearedCart.current) {
            hasClearedCart.current = true;
            dispatch(clearCart());
            clearCartServer().unwrap().catch(() => {});
        }
    }, [dispatch, clearCartServer]);

    useEffect(() => {
        if (order && order.order_id && !hasFiredPurchase.current) {
            hasFiredPurchase.current = true;
            // Purchase event is tracked securely server-side
        }
    }, [order]);

    const handleCopyOrderId = () => {
        const idToCopy = order?.order_id || orderId || "";
        if (idToCopy) {
            navigator.clipboard.writeText(idToCopy);
            setCopied(true);
            toast.success("Order reference copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadInvoice = async () => {
        const id = order?.order_id || orderId;
        if (!id) {
            toast.error("Order reference not found");
            return;
        }

        try {
            setIsDownloading(true);
            toast.loading("Generating your invoice PDF...", { id: "download-invoice" });

            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
            const res = await fetch(`${baseUrl}/orders/invoice/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Failed to download invoice");
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `MimiSphere_Invoice_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            toast.success("Invoice downloaded successfully!", { id: "download-invoice" });
        } catch (error) {
            console.error("Invoice download error:", error);
            toast.error("Could not download invoice. Please try again.", { id: "download-invoice" });
        } finally {
            setIsDownloading(false);
        }
    };

    const displayOrderId = order?.order_id || orderId || "ORD-2609002";

    const paymentMethodLabel =
        order?.payment_method === "COD"
            ? "Cash On Delivery"
            : order?.payment_method === "ONLINE"
            ? "Online Payment (bKash)"
            : order?.payment_method || "Cash On Delivery";

    const addressParts = [
        order?.village_or_area,
        order?.upazila,
        order?.district,
    ].filter(Boolean);

    const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "Standard Delivery Address";

    const totalValue = order?.total_price ? order.total_price.toLocaleString("en-BD") : "0";

    return (
        <div className="min-h-screen bg-slate-50/70 py-6 md:py-10">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
                {/* Main Receipt Container */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    {/* Reassuring Confirmation Header (Clean informational style) */}
                    <div className="px-4 py-8 sm:px-8 sm:py-10 text-center border-b border-slate-100 bg-white">
                        {/* Circular Green Checkmark */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10b981] text-white mb-5 shadow-lg shadow-emerald-500/20 ring-8 ring-emerald-50 animate-in zoom-in duration-500">
                            <Check className="w-9 h-9" strokeWidth={3.5} />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#10b981] tracking-tight mb-4">
                            Thank you, We&apos;ve received your order.
                        </h1>

                        {/* Informational Text Paragraphs */}
                        <div className="max-w-2xl mx-auto space-y-2.5 text-sm sm:text-base text-slate-700 leading-relaxed text-center font-normal">
                            <p>
                                Your order is placed with{" "}
                                <strong className="font-bold text-slate-900">{paymentMethodLabel}</strong>.{" "}
                                You will receive an SMS notification regarding the order.
                            </p>

                            <p className="flex items-center justify-center flex-wrap gap-1.5">
                                <span>Your order reference is</span>{" "}
                                <button
                                    onClick={handleCopyOrderId}
                                    className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                                    title="Click to copy reference"
                                >
                                    <span>{displayOrderId}</span>
                                    {copied ? (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                                    ) : (
                                        <Copy className="w-3.5 h-3.5 text-slate-500 inline" />
                                    )}
                                </button>{" "}
                                <span>and total order value is</span>{" "}
                                <strong className="font-bold text-slate-900">BDT {totalValue}</strong>.
                            </p>

                            <p>
                                Your shipping address is{" "}
                                <strong className="font-bold text-slate-900">
                                    {order?.customer_name ? `${order.customer_name}, ` : ""}
                                    {fullAddress}
                                </strong>
                                .
                            </p>

                            <p className="text-slate-500 text-xs sm:text-sm pt-1">
                                Please remember these information for any kind of future inconvenience regarding your order.
                            </p>
                        </div>

                        {/* Top Direct Action Buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 active:scale-95"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Shop Again</span>
                            </Link>

                            <button
                                onClick={handleDownloadInvoice}
                                disabled={isDownloading}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 active:scale-95 disabled:opacity-75 cursor-pointer"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Download Invoice</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                        {/* ================= RETURN & EXCHANGE POLICY (Collapsible, hidden by default) ================= */}
                        <div className="border border-slate-200/90 rounded-xl overflow-hidden bg-slate-50/60 transition-all">
                            <button
                                type="button"
                                onClick={() => setShowReturnPolicy(!showReturnPolicy)}
                                className="w-full px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span>Return & Exchange Policy</span>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                                        7 Days Easy Return
                                    </span>
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                        showReturnPolicy ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showReturnPolicy && (
                                <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 border-t border-slate-200/80 space-y-3 text-xs text-slate-600 animate-in fade-in duration-200">
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 space-y-2.5 leading-relaxed text-slate-700">
                                        <p>
                                            <strong className="text-slate-900 font-semibold">1. Defect or Damage:</strong> If any defect is found (damaged/ defective/ wrong product) after opening the box, inform MIMI SPHERE Customer Service (through hotline <strong className="text-[#002447]">+880 1719-713061</strong> or email <strong className="text-[#002447]">support@mimisphere.com</strong>) as soon as possible along with a picture/video proof.
                                        </p>
                                        <p>
                                            <strong className="text-slate-900 font-semibold">2. Return Window:</strong> Return process must be initiated within 7 days of receiving the parcel.
                                        </p>
                                        <p>
                                            <strong className="text-slate-900 font-semibold">3. Product Condition:</strong> Product quality needs to be in the original condition. Products must not be used, worn, altered, or washed. Product hand tags, polybags, and the original invoice must be returned along with the products.
                                        </p>
                                        <p>
                                            <strong className="text-slate-900 font-semibold">4. Delivery Charges:</strong> Exchange delivery cost may be applicable.
                                        </p>
                                        <p>
                                            <strong className="text-slate-900 font-semibold">5. Promotional Items:</strong> Promotional offers are not applicable for returned products.
                                        </p>
                                    </div>
                                    <p className="text-[11px] text-slate-400 italic">
                                        <strong>Disclaimer:</strong> This document & any information transmitted with it are confidential & intended solely for the use of the customer. Copyright © 2026 Mimi Sphere. All Rights Reserved.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Items Table & Breakdown */}
                        {order?.products && order.products.length > 0 && (
                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-slate-500" />
                                        Purchased Items ({order.products.length})
                                    </span>
                                    <span className="text-xs font-bold text-slate-700">
                                        Total: ৳{totalValue}
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                                    {order.products.map((item: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-sm hover:bg-slate-50/50 transition-colors"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900 truncate">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Quantity: {item.quantity} × ৳{item.price?.toLocaleString("en-BD")}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold text-slate-900">
                                                    ৳{(item.total_price || item.price * item.quantity).toLocaleString("en-BD")}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Breakdown */}
                                <div className="bg-slate-50/95 p-4 border-t border-slate-200 space-y-1.5 text-xs sm:text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Delivery Fee:</span>
                                        <span className="font-semibold text-slate-800">
                                            ৳{(order.delivery_charge || 0).toLocaleString("en-BD")}
                                        </span>
                                    </div>
                                    {order.discount_amount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Discount Applied:</span>
                                            <span>-৳{order.discount_amount.toLocaleString("en-BD")}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-900 font-bold text-sm sm:text-base pt-2 border-t border-slate-200">
                                        <span>Grand Total:</span>
                                        <span className="text-[#002447]">
                                            ৳{totalValue}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delivery Details & Live Tracking Link */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="space-y-1 text-xs sm:text-sm">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> Shipping Destination
                                </span>
                                <p className="font-semibold text-slate-900">
                                    {order?.customer_name || "Customer"}
                                    {order?.phone && <span className="text-slate-500 font-normal"> ({order.phone})</span>}
                                </p>
                                <p className="text-slate-600 text-xs">
                                    {fullAddress}
                                </p>
                            </div>

                            <Link
                                href={`/track-order?orderId=${displayOrderId}&phone=${order?.phone || ""}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-semibold text-xs hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-xs"
                            >
                                <Truck className="w-3.5 h-3.5 text-slate-600" />
                                Track Order Live
                            </Link>
                        </div>

                        {/* Bottom Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <Link
                                href="/shop"
                                className="flex-1 py-3 bg-[#002447] hover:bg-[#001933] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 md:py-12">
                <div className="flex items-end justify-between mb-6">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recommended For You</h2>
                        <p className="text-sm text-slate-500">Handpicked products based on your interest</p>
                    </div>
                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-[#002447] hover:text-amber-600 flex items-center gap-1 transition-colors"
                    >
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-slate-200/60 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                        {suggestedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group transition-transform duration-300 hover:-translate-y-1"
                            >
                                <ItemCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderSuccess;