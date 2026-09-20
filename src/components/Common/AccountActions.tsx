"use client";

import { ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppSelector } from "../Redux/hooks";
import { useCurrentUserInfo } from "../Redux/Slice/authSlice";
import CartSheet from "../ui/CartSheet";
import UserDropdown from "../ui/user-dropdown";

export const AccountActions = ({ cartItems }: { cartItems: any }) => {
    const user = useAppSelector(useCurrentUserInfo);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalQty = Array.isArray(cartItems)
        ? cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
        : 0;

    return (
        <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. Offers / Deals Pill - Desktop only */}
            <Link
                href="/offers"
                aria-label="View special offers"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 hover:bg-amber-100/80 text-amber-900 border border-amber-200/70 text-xs font-bold transition-all shadow-2xs hover:scale-105"
            >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>Offers</span>
            </Link>

            {/* 2. Premium Cart Button */}
            <CartSheet cartItems={cartItems}>
                <button
                    aria-label="Open Shopping Cart"
                    className="relative flex items-center gap-2 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full border border-slate-200/90 bg-white hover:border-amber-400 text-[#002447] active:scale-95 transition-all shadow-2xs hover:shadow-sm group"
                >
                    <div className="relative">
                        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-[#002447] group-hover:text-amber-600 transition-colors" />
                        {mounted && totalQty > 0 && (
                            <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-[10px] font-black text-white ring-2 ring-white shadow-xs">
                                {totalQty}
                            </span>
                        )}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 group-hover:text-[#002447] transition-colors">
                        Cart
                    </span>
                </button>
            </CartSheet>

            {/* 3. User Dropdown (Sign In / Account) */}
            <div className="shrink-0">
                {mounted && <UserDropdown />}
            </div>
        </div>
    );
};
