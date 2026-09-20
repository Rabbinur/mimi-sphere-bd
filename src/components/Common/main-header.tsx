"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Project Specific Imports
import { useAppSelector } from "../Redux/hooks";
import { AccountActions } from "./AccountActions";
import { MobileMenu } from "./MobileMenu";
import { MobileSearch } from "./MobileSearch";
import { SearchBar } from "./SearchBar";

// --- Main Header Component ---
export const MainHeader = ({ children }: { children?: React.ReactNode }) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between min-h-[50px] md:min-h-[56px] gap-3 md:gap-6">

          {/* Left: Hamburger (Mobile) & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

            <Link href="/" className="shrink-0 transition-transform hover:scale-[1.02] flex items-center">
              <Image
                src={"/logo.png"}
                alt="Mimi Sphere Logo"
                width={175}
                height={55}
                quality={95}
                className="object-contain h-9 sm:h-11 md:h-12 w-auto"
                priority
                fetchPriority="high"
              />
            </Link>
          </div>

          {/* Center: Prominent, Sleek Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Right: Modern Actions Group */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <MobileSearch isOpen={isMobileSearchOpen} setIsOpen={setIsMobileSearchOpen} />
            <AccountActions cartItems={cartItems} />
          </div>
        </div>
      </div>

      {children && (
        <div className="hidden md:block">
          {children}
        </div>
      )}
    </header>
  );
};

export default MainHeader;