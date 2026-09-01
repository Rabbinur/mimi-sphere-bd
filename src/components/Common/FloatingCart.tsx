"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/components/Redux/hooks";
import { selectCartItems, selectCartSubtotal, selectCartTotalQuantity } from "@/components/Redux/Slice/cartSlice";
import CartSheet from "@/components/ui/CartSheet";
import { ShoppingBag } from "lucide-react";

export default function FloatingCart() {
    const [mounted, setMounted] = useState(false);
    const cartItems = useAppSelector(selectCartItems);
    const totalQuantity = useAppSelector(selectCartTotalQuantity);
    const subtotal = useAppSelector(selectCartSubtotal);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden md:block cursor-pointer">
            <CartSheet cartItems={cartItems}>
                <button aria-label="Open shopping cart" className="flex flex-col items-center bg-white shadow-2xl rounded-l-2xl overflow-hidden border border-slate-200 hover:scale-105 transition-all">

                    {/* Top: Item Count (Brand Navy Gradient) */}
                    <div className="w-14 h-14 bg-gradient-to-b from-[#001f3f] to-[#002b4d] flex flex-col items-center justify-center text-white">
                        <div className="relative mb-0.5">
                            <ShoppingBag className="w-5 h-5 text-amber-400 stroke-[2.2]" />
                        </div>
                        <div className="flex flex-col items-center leading-none">
                            <span className="text-[12px] font-bold text-amber-400">{totalQuantity}</span>
                            <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-tighter">Items</span>
                        </div>
                    </div>

                    {/* Bottom: Subtotal (Amber Gold Accent) */}
                    <div className="w-14 py-2 bg-[#071426] flex items-center justify-center text-white border-t border-amber-500/20">
                        <span className="text-[11px] font-bold flex items-center gap-0.5 text-amber-400">
                            <span className="text-[9px] opacity-80">৳</span>
                            {subtotal.toLocaleString()}
                        </span>
                    </div>

                </button>
            </CartSheet>
        </div>
    );
}