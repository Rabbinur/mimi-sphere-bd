"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Project Specific Imports
import { useAppSelector } from "../Redux/hooks";
import { AccountActions } from "./AccountActions";
import { MobileMenu } from "./MobileMenu";
import { MobileSearch } from "./MobileSearch";
import { SearchBar } from "./SearchBar";

// --- Desktop Nav Links ---
const NavLinks = () => {
  const pathname = usePathname();

  const links = [
    { href: "/shop", label: "Shop", isNew: false },
    { href: "/categories", label: "Categories", isNew: false },
    { href: "/brands", label: "Brands", isNew: false },
    { href: "/contact", label: "Contact", isNew: false },
    { href: "/shop/pre-order", label: "Pre Order", isNew: true },
  ];

  return (
    <div className="hidden lg:flex items-center space-x-6">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-semibold transition-all hover:text-amber-600 flex items-center gap-1.5 py-1 ${pathname === link.href
            ? "text-[#002447] font-bold border-b-2 border-[#f59e0b]"
            : "text-slate-700"
            }`}
        >
          {link.label}
          {link.isNew && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider shadow-sm">
              New
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};

// --- Main Header Component ---
export const MainHeader = ({ children }: { children?: React.ReactNode }) => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-2 sm:px-4 md:py-2.5 py-1.5">
        <div className="flex items-center justify-between min-h-[50px] md:min-h-[56px] gap-2 md:gap-6">

          {/* Left: Hamburger (Mobile) / Logo+Links (Desktop) */}
          <div className="flex items-center flex-1 md:flex-none gap-2 lg:gap-8">
            <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

            {/* Desktop Logo */}
            <Link href="/" className="hidden md:block shrink-0 transition-transform hover:scale-[1.02]">
              <Image
                src={"/logo.png"}
                alt="Mimi Sphere Logo"
                width={170}
                height={60}
                quality={90}
                className="object-contain"
                style={{ width: 'auto', height: '48px' }}
                priority
                fetchPriority="high"
              />
            </Link>

            <div className="hidden lg:block">
              <NavLinks />
            </div>
          </div>

          {/* Center: Mobile Logo */}
          <div className="flex md:hidden flex-1 justify-center">
            <Link href="/" className="shrink-0">
              <Image
                src={"/logo.png"}
                alt="Mimi Sphere Logo"
                width={140}
                height={48}
                quality={90}
                className="object-contain"
                style={{ width: 'auto', height: '40px' }}
                priority
              />
            </Link>
          </div>

          {/* Center: Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center flex-1 md:flex-none justify-end gap-1 md:gap-2">
            {/* Mobile Search Toggle & Bar */}
            <MobileSearch isOpen={isMobileSearchOpen} setIsOpen={setIsMobileSearchOpen} />

            {/* Account Actions with Vertical Labels */}
            <AccountActions cartItems={cartItems} />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        {children}
      </div>
    </header>
  );
};

export default MainHeader;