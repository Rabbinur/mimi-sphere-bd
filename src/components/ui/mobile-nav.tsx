"use client";

import {
  Home,
  LayoutGrid,
  ShoppingBag,
  User
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "../Redux/hooks";
import CartSheet from "./CartSheet";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (!mounted) {
    return <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white/80 backdrop-blur-lg rounded-t-[24px] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.05)]" />;
  }

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        aria-label={`Navigate to ${label}`}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 transition-all duration-300",
          isActive ? "text-primary -translate-y-0.5" : "text-slate-700"
        )}
      >
        <div className={cn(
          "p-1 rounded-xl transition-all duration-300",
          isActive ? "bg-primary/10" : "bg-transparent"
        )}>
          <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
        </div>
        <span className={cn(
          "text-[9px] font-semibold tracking-wider uppercase",
          isActive ? "opacity-100" : "opacity-70"
        )}>{label}</span>
      </Link>
    );
  };

  return (
    <div className={cn(
      "fixed border-primary bottom-0 left-0 z-50 w-full h-16 bg-white/95 backdrop-blur-md text-slate-900 border-t rounded-t-[24px] md:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out",
      visible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto px-2 items-center">
        {/* Left 2 items */}
        <NavItem href="/" icon={Home} label="Home" />
        <NavItem href="/categories" icon={LayoutGrid} label="Cats" />

        {/* Center: Floating Button Area (3rd column) */}
        <div className="relative flex items-center justify-center -translate-y-1">
          <CartSheet cartItems={cartItems}>
            <button
              aria-label={`View shopping cart, ${cartItems.length} items`}
              className="
                absolute -top-6
                w-14 h-14 rounded-full 
                bg-gradient-to-tr from-primary via-blue-600 to-blue-400
                text-white flex items-center justify-center
                shadow-[0_8px_20px_rgba(30,58,138,0.3)]
                border-4 border-white
                hover:scale-105 active:scale-95 transition-all duration-300
              "
            >
              <Image
                src="/cart-icon.png"
                alt="Cart"
                width={32}
                height={32}
                className="w-8 h-8 object-contain brightness-0 invert"
              />
              {cartItems.length > 0 && (
                <span
                  className="
                    absolute -top-1 -right-1
                    flex h-5 w-5 items-center justify-center
                    rounded-full bg-red-600 text-[10px] font-bold text-white
                    border-2 border-white shadow-md
                  "
                >
                  {cartItems.length}
                </span>
              )}
            </button>
          </CartSheet>
        </div>

        {/* Right 2 items */}
        <NavItem href="/shop" icon={ShoppingBag} label="Shop" />
        <NavItem href="/user-account" icon={User} label="Account" />
      </div>
    </div>
  );
}
