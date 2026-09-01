"use client";

import { useFeaturedProductQuery } from "@/components/Redux/RTK/productApi";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import { TProduct } from "@/types";
import {
    AlertCircle,
    ArrowRight,
    ChevronRight,
    Headphones,
    Home,
    RotateCcw,
    X
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ISSUES = [
    "Insufficient bKash account balance",
    "Incorrect OTP or PIN entered",
    "Session timeout with payment gateway",
    "Network interruption during transaction",
];

const PaymentFailedPage = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const { data, isLoading } = useFeaturedProductQuery(undefined);
    const products: TProduct[] = data?.data || [];
    const suggestedProducts = products.slice(0, 8);

    return (
        <div className="min-h-screen bg-slate-50/50 selection:bg-red-100">
            {/* Main Failed Card */}
            <div className="max-w-3xl mx-auto px-2 md:px-4 mt-3 md:py-6 lg:py-8 lg:mt-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    {/* Failed Header */}
                    <div className="bg-red-50/50 px-4 py-6 md:px-6 md:py-10 text-center border-b border-red-100">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-500 text-white mb-4 shadow-lg shadow-red-200 animate-in zoom-in duration-700 delay-300">
                            <X className="w-8 h-8" strokeWidth={3} />
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold text-slate-900 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                            Payment was not processed
                        </h1>
                        <p className="text-slate-600 mt-2 text-sm md:text-base max-w-md mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
                            Your order is safe — no charges were made. Please review the potential causes below and try again.
                        </p>
                    </div>

                    {/* Details Section (Issues & Support) */}
                    <div className="p-3 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-600">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" /> Possible Causes
                                </span>
                                <ul className="space-y-2">
                                    {ISSUES.map((issue, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            {issue}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500 delay-600">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Headphones className="w-3.5 h-3.5" /> Need Support?
                                </span>
                                <p className="text-sm text-slate-500 leading-relaxed font-normal">
                                    If your account was debited but the order fails, contact us with your
                                    <span className="font-bold text-slate-700"> transaction ID</span>.
                                </p>
                                <Link href="/contact" className="inline-flex items-center text-red-500 text-sm font-bold hover:underline underline-offset-4 transition-all">
                                    Contact Team <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-700">
                            <Link
                                href="/checkout"
                                className="flex-1 py-2 md:py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Try Payment Again
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 py-2 md:py-3.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]"
                            >
                                <Home className="w-4 h-4" />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div className="container mx-auto px-2 md:px-4 py-8 md:py-12">
                <div className="flex items-end justify-between mb-8">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-900">Recommended for you</h2>
                        <p className="text-sm text-slate-500">Items you might love based on your interest.</p>
                    </div>
                    <Link href="/shop" className="text-sm font-bold text-slate-600 flex items-center hover:text-slate-900 transition-colors">
                        View all <ChevronRight className="w-4 h-4 ml-0.5" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-slate-200/60 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 md:gap-4 lg:gap-5">
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

export default PaymentFailedPage;