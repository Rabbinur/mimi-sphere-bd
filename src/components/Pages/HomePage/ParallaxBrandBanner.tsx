"use client";

import { ArrowRight, ShieldCheck, HeartHandshake, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ParallaxBrandBanner() {
  return (
    <section className="relative w-full my-6 sm:my-8 md:my-12 overflow-hidden">
      {/* ── Background Image with Parallax Depth ── */}
      <div
        className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] bg-fixed bg-center bg-cover flex items-center justify-center px-4 py-12 sm:py-16 md:py-20"
        style={{
          backgroundImage: "url('/assets/modest-banner.jpg')",
          backgroundColor: "#1e1e24",
        }}
      >
        {/* Dark Vignette Overlay for Depth & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 pointer-events-none" />

        {/* ── Floating Glassmorphic Mission Card ── */}
        <div className="relative z-10 w-full max-w-2xl mx-auto backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border border-white/60 dark:border-slate-700/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center transition-all duration-300">
          
          {/* Brand Logo / Header */}
          <div className="flex flex-col items-center justify-center mb-4 sm:mb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="h-[1px] w-6 sm:w-10 bg-slate-400" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black tracking-[0.25em] text-slate-900 uppercase">
                Mimi Sphere
              </h2>
              <span className="h-[1px] w-6 sm:w-10 bg-slate-400" />
            </div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
              Glamour of Modesty & Lifestyle
            </p>
          </div>

          {/* Brand Mission Statement */}
          <div className="space-y-2.5 sm:space-y-3.5 text-slate-700 text-xs sm:text-[13px] md:text-sm leading-relaxed max-w-xl mx-auto font-normal">
            <p>
              <strong className="font-bold text-slate-900">&ldquo;Mimi Sphere&rdquo;</strong> is a prominent lifestyle and modest fashion destination serving nationally across Bangladesh.
            </p>
            <p>
              Our mission is to bring curated modest fashion, authentic skincare, and trendsetting lifestyle products with utmost nobility and excellence.
            </p>
            <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed hidden sm:block">
              We are reputed for genuine products, priority customer service, and ensuring trustworthiness. We firmly believe that our clients&apos; happiness is timeless, continuously working to make every shopping experience confident, delightful, and inspiring.
            </p>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-3 gap-2 pt-4 sm:pt-6 my-4 sm:my-5 border-t border-slate-200/80 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-800">100% Authentic</span>
            </div>
            <div className="flex flex-col items-center border-x border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-800">Verified Quality</span>
            </div>
            <div className="flex flex-col items-center">
              <HeartHandshake className="w-4 h-4 text-rose-600 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-slate-800">Nationwide Care</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <div className="pt-1">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
