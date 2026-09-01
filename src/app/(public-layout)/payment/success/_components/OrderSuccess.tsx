"use client";

import { useOrderByIdQuery } from "@/components/Redux/RTK/orderApi";
import { useFeaturedProductQuery } from "@/components/Redux/RTK/productApi";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import { trackPixelEvent } from "@/lib/pixel";
import { TProduct } from "@/types";
import {
    ArrowRight,
    Calendar,
    Check,
    ChevronRight,
    Home,
    Package,
    Truck
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

const OrderSuccess = ({ orderId }: { orderId?: string | null }) => {
    const { data: orderData } = useOrderByIdQuery(orderId || "", { skip: !orderId });
    const order = orderData?.data;

    const { data, isLoading } = useFeaturedProductQuery(undefined);
    const products: TProduct[] = data?.data || [];
    const suggestedProducts = products.slice(0, 8);

    const hasFiredPurchase = useRef(false);

    useEffect(() => {
        if (order && order.order_id && !hasFiredPurchase.current) {
            hasFiredPurchase.current = true;
            // Purchase event is now handled securely on the server-side 
            // when the order status changes to 'processing'.
        }
    }, [order]);

    return (
        <div className="min-h-screen bg-slate-50/50 selection:bg-emerald-100">
            {/* Top Minimal Navigation/Status */}
            <div className="max-w-3xl mx-auto  px-2 md:px-4 mt-3 md:py-6 lg:py-8 lg:mt-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    {/* Success Header */}
                    <div className="bg-emerald-50/50 px-4 py-6 md:px-6 md:py-10 text-center border-b border-emerald-100">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white mb-4 animate-in zoom-in duration-700 delay-300">
                            <Check className="w-8 h-8" strokeWidth={3} />
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                            Thank you for your order!
                        </h1>
                        <p className="text-slate-600 mt-2 text-sm md:text-base max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
                            A confirmation email has been sent to your inbox. We&apos;ll notify you when your items are on the way.
                        </p>
                    </div>

                    {/* Order Details Grid */}
                    <div className="p-3 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5" /> Order ID
                                </span>
                                <p className="text-sm font-semibold text-slate-900">#{orderId || '7294-0192'}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" /> Date
                                </span>
                                <p className="text-sm font-semibold text-slate-900">
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Truck className="w-3.5 h-3.5" /> Shipping
                                </span>
                                <p className="text-sm font-semibold text-emerald-600">Standard (3-5 Days)</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/shop"
                                className="flex-1  py-2 md:py-3 bg-slate-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/"
                                className="flex-1  py-2 md:py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className=" container mx-auto px-2 md:px-4  py-4 md:py-6">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900">Recommended for you</h2>
                        <p className="text-sm text-slate-500">Based on your recent purchase</p>
                    </div>
                    <Link href="/shop" className="text-sm font-semibold text-emerald-600 flex items-center hover:underline">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-slate-200/60 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-2">
                        {suggestedProducts.map((product) => (
                            <div
                                key={product._id}
                                className="group transition-transform duration-300 hover:-translate-y-1 animate-in fade-in"
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