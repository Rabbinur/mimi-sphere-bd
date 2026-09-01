"use client";

import { ArrowRight, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BentoGridSection() {
  return (
    <div className="container mx-auto px-2 md:px-4 py-4">
      <div className="flex flex-col gap-1 mb-6 text-center sm:text-left">
        <span className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> Curated Collections
        </span>
        <h2 className="text-xl md:text-2xl font-black text-slate-900">
          Our Best Collections
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-4 auto-rows-[135px] md:auto-rows-[195px]">
        {/* Card 1: Korean Cosmetics */}
        <Link
          href="/shop?category=cosmetics"
          className="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-end p-4 md:p-6 transition-all duration-500 hover:-translate-y-1"
        >
          {/* Glassmorphic info overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10" />

          {/* Floating decorative light shapes */}
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-rose-300/20 blur-2xl group-hover:bg-rose-400/30 transition-colors duration-500 z-0" />

          {/* Dynamic BG Image */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          />

          <div className="relative z-20 space-y-1">
            <span className="inline-flex items-center gap-1 bg-rose-500/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shadow-sm">
              Premium Beauty
            </span>
            <h3 className="text-lg md:text-2xl font-black text-white group-hover:text-pink-200 transition-colors leading-tight">
              Korean Cosmetics
            </h3>
            <p className="text-[10px] md:text-xs text-slate-200 max-w-sm font-medium">
              100% Authentic Korean Skincare & Makeup 🌸
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] md:text-[11px] font-bold text-rose-300 group-hover:text-white pt-1 md:pt-2 transition-all">
              Explore Collection <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Card 2: Trendy Bags /shop/bag-shoes*/}
        <Link
          href="/shop/bag-shoes"
          className="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-end p-3.5 md:p-5 transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent z-10" />

          {/* Dynamic BG Image */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          />

          <div className="relative z-20 space-y-0.5 md:space-y-1">
            <span className="inline-flex items-center gap-1 bg-violet-600/90 text-white text-[8px] md:text-[9px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-full tracking-wider">
              Aesthetic Style
            </span>
            <h3 className="text-xs md:text-lg font-black text-white leading-tight">
              Trendy Bags
            </h3>
            <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-violet-300 group-hover:text-white transition-all">
              Shop Bags <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Card 3: Aesthetic Accessories */}
        <Link
          href="/shop?category=accessories"
          className="group relative col-span-1 row-span-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-end p-3.5 md:p-5 transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent z-10" />

          {/* Dynamic BG Image */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          />

          <div className="relative z-20 space-y-1">
            <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[8px] md:text-[9px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-full tracking-wider">
              Girls Favorites
            </span>
            <h3 className="text-xs md:text-lg font-black text-white leading-tight">
              Aesthetic Accessories
            </h3>
            <p className="text-[9px] md:text-[11px] text-slate-300 font-medium line-clamp-2 md:line-clamp-none">
              Premium hair clips, jewelry & cute accessories 💖
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-amber-300 group-hover:text-white pt-1 md:pt-2 transition-all">
              View All <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>

        {/* Card 4: Hot Deals */}
        <Link
          href="/shop?sort=discount"
          className="group relative col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 flex flex-col justify-end p-3.5 md:p-5 transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent z-10" />

          {/* Dynamic BG Image */}
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
          />

          <div className="relative z-20 space-y-0.5 md:space-y-1">
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[8px] md:text-[9px] font-black uppercase px-1.5 md:px-2 py-0.5 rounded-full tracking-wider">
              <Flame className="h-2.5 w-2.5 fill-white animate-bounce" /> Hot Deals
            </span>
            <h3 className="text-xs md:text-lg font-black text-white leading-tight">
              Exclusive Offers
            </h3>
            <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-red-300 group-hover:text-white transition-all">
              Grab Deal <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
