import { HelpCircle, RotateCw, Tag, User } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full bg-[#001f3f] text-slate-200 py-1.5 border-b border-white/10 text-xs font-medium">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <Link href="/contact" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <HelpCircle size={13} className="text-amber-400" />
            <span>Help Center</span>
          </Link>
          <Link href="/user-account" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <User size={13} className="text-amber-400" />
            <span>My Account</span>
          </Link>
          <span className="hidden md:inline text-white/20">|</span>
          <span className="hidden md:inline text-amber-300/90 text-[11px] font-normal tracking-wide">
            ✨ Everything You Need, All in One Place
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <Link href="/offers" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Tag size={13} className="text-amber-400" />
            <span>Offers & Deals</span>
          </Link>
          <span className="text-white/20">|</span>
          <Link
            href="/track-order"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <RotateCw size={13} className="text-amber-400" />
            <span>Track Order</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
