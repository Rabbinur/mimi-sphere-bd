"use client";

import { ArrowLeft, Clock, Home, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// This would typically come from your Redux store or LocalStorage
const RECENT_PRODUCTS = [
    {
        id: 1,
        title: "Paws Cutter",
        price: 79,
        oldPrice: 160,
        discount: 51,
        image: "/path-to-paws.jpg",
    },
    {
        id: 2,
        title: "Scented Candles",
        price: 89,
        oldPrice: 300,
        discount: 70,
        image: "/path-to-candles.jpg",
    },
    {
        id: 3,
        title: "Fairy Lights",
        price: 69,
        oldPrice: 126,
        discount: 45,
        image: "/path-to-lights.jpg",
    },
    {
        id: 4,
        title: "Object Cover",
        price: 99,
        oldPrice: 200,
        discount: 50,
        image: "/path-to-another.jpg",
    },
    {
        id: 5,
        title: "Mini Knife",
        price: 45,
        oldPrice: 90,
        discount: 50,
        image: "/path-to-knife.jpg",
    },
    {
        id: 6,
        title: "LED Strip",
        price: 120,
        oldPrice: 250,
        discount: 52,
        image: "/path-to-led.jpg",
    },
];

export default function RecentlyViewedPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F9F9F9] pb-10">
            {/* --- Sticky Header --- */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">Recently Viewed</h1>
                </div>
                <Link href="/">
                    <Home className="h-5 w-5 text-gray-400" />
                </Link>
            </header>

            <main className="max-w-2xl mx-auto p-4">
                {/* --- Stats Summary --- */}
                <div className="mb-6">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                        Showing {RECENT_PRODUCTS.length} items from your history
                    </p>
                </div>

                {/* --- Product Grid --- */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {RECENT_PRODUCTS.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 flex flex-col group cursor-pointer"
                        >
                            {/* Image with Sharp Badge */}
                            <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
                                <div className="absolute top-0 left-0 bg-[#FF4D4F] text-white text-[9px] font-bold px-2 py-0.5 rounded-br-md z-10">
                                    <span className="text-[8px] mr-0.5">↓</span>
                                    {product.discount}%
                                </div>
                                <Image
                                    src={`https://img.drz.lazcdn.com/static/bd/p/d5e40599c381bd6b6693ab372f16752b.jpg_720x720q80.jpg`}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Info Area */}
                            <div className="p-2 flex-1 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-[11px] font-medium text-gray-600 line-clamp-1 mb-1">
                                        {product.title}
                                    </h4>
                                    <div className="flex flex-col">
                                        <span className="text-[#FF4D4F] font-bold text-sm leading-none">
                                            ৳{product.price}
                                        </span>
                                        <span className="text-[10px] text-gray-300 line-through font-medium mt-0.5">
                                            ৳{product.oldPrice}
                                        </span>
                                    </div>
                                </div>

                                {/* Quick Add Button - Appears on Mobile/Hover */}
                                <button className="mt-2 w-full py-1.5 bg-gray-900 text-white rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Empty State Placeholder --- */}
                {RECENT_PRODUCTS.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <Clock className="h-8 w-8 text-gray-300" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">
                            No history found
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Products you view will appear here.
                        </p>
                        <Link
                            href="/"
                            className="mt-6 text-sm font-bold text-primary underline"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </main>

            {/* --- Simple Mobile Footer for Quick Actions --- */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 sm:hidden">
                <Link
                    href="/cart"
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-4"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                        Go to Cart
                    </span>
                </Link>
            </div>
        </div>
    );
}
