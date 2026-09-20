import { HelpCircle, MessageCircle, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="w-full bg-gradient-to-r from-[#00172e] via-[#002447] to-[#00172e] text-slate-300 py-1.5 border-b border-white/10 text-xs overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Mobile View (< sm): Clean, single-line announcement with WhatsApp */}
        <div className="flex sm:hidden items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold truncate">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Cash on Delivery Across BD</span>
          </div>

          <a
            href="https://wa.me/8801719713061"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-200 hover:text-amber-300 shrink-0 ml-2 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>01719713061</span>
          </a>
        </div>

        {/* Desktop View (>= sm): Full Detailed Top Bar */}
        <div className="hidden sm:flex justify-between items-center gap-2">
          {/* Left: Customer Benefits & Information */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold tracking-wide">
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Cash on Delivery All Over Bangladesh</span>
            </div>

            <span className="text-white/20">|</span>

            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>100% Authentic Quality</span>
            </div>

            <span className="text-white/20 hidden md:inline">|</span>

            <div className="hidden md:flex items-center gap-1.5 text-slate-300 font-medium">
              <RotateCcw className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Easy 7-Day Exchange</span>
            </div>
          </div>

          {/* Right: Quick Customer Utilities */}
          <div className="flex items-center gap-4 text-xs font-medium ml-auto">
            <a
              href="https://wa.me/8801719713061"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline text-slate-400">WhatsApp:</span>
              <span className="font-semibold text-slate-200 hover:text-amber-300">01719713061</span>
            </a>

            <span className="text-white/20">|</span>

            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-amber-300 text-slate-200 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Track Order</span>
            </Link>

            <span className="text-white/20 hidden sm:inline">|</span>

            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-1.5 hover:text-amber-300 text-slate-200 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Help</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
