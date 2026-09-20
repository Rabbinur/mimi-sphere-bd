"use client";

import { Heart, MapPin, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppSelector } from "../Redux/hooks";
import { useCurrentUserInfo } from "../Redux/Slice/authSlice";
import { selectWishlistCount } from "../Redux/Slice/wishlistSlice";
import CartSheet from "../ui/CartSheet";
import UserDropdown from "../ui/user-dropdown";

export const AccountActions = ({ cartItems }: { cartItems: any }) => {
    const user = useAppSelector(useCurrentUserInfo);
    const wishlistCount = useAppSelector(selectWishlistCount);
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

            {/* 2. Stores / Outlets Button - Desktop only */}
            <Link
                href="/outlets"
                aria-label="View outlet stores"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border border-slate-200/90 bg-white hover:border-slate-300 text-slate-700 hover:text-primary transition-all shadow-2xs group"
                title="Store Locations"
            >
                <MapPin className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
                <span className="hidden sm:inline text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">
                    Stores
                </span>
            </Link>

            {/* 3. Wishlist Button with Badge */}
            <Link
                href="/user-account/wishlist"
                aria-label={`View wishlist, ${wishlistCount} items`}
                className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200/90 bg-white hover:border-pink-300 text-slate-700 hover:text-[#ff3366] transition-all shadow-2xs group"
                title="My Wishlist"
            >
                <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
                {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-[#ff3366] text-[10px] font-black text-white ring-2 ring-white shadow-xs">
                        {wishlistCount}
                    </span>
                )}
            </Link>

            {/* 4. Premium Cart Button */}
            <CartSheet cartItems={cartItems}>
                <button
                    aria-label="Open Shopping Cart"
                    className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-3.5 md:py-2 rounded-full border border-slate-200/90 bg-white hover:border-amber-400 text-[#002447] active:scale-95 transition-all shadow-2xs hover:shadow-sm group"
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

            {/* 5. User Dropdown (Sign In / Account - Desktop Only, mobile has Account in bottom nav & menu) */}
            <div className="hidden md:block shrink-0">
                {mounted && <UserDropdown />}
            </div>
        </div>
    );
};
