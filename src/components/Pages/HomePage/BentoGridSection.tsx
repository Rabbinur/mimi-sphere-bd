"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TBentoGrid, TBentoItem } from "@/types";

interface BentoGridSectionProps {
  bentoGrid?: TBentoGrid;
}

const DEFAULT_TAG = "Handpicked For You";
const DEFAULT_TITLE = "Signature Collections";

const DEFAULT_BENTO_ITEMS: TBentoItem[] = [
  {
    badge: "Premium Beauty",
    badgeColor: "rose",
    title: "Korean Cosmetics",
    subtitle: "100% Authentic Korean Skincare & Daily Glow Routine 🌸",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=700",
    link: "/shop?category=cosmetics",
    categorySlug: "cosmetics",
    colSpan: 2,
    rowSpan: 2,
  },
  {
    badge: "Hot Trend",
    badgeColor: "violet",
    title: "Trendy Bags",
    subtitle: "Everyday Luxury Handbags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500",
    link: "/shop/bag-shoes",
    categorySlug: "bag-shoes",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    badge: "Handcrafted",
    badgeColor: "amber",
    title: "Aesthetic Jewelry",
    subtitle: "Cute accessories & bridal wear",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500",
    link: "/shop?category=accessories",
    categorySlug: "accessories",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    badge: "Special Deals",
    badgeColor: "emerald",
    title: "Trending Gadgets & Essentials",
    subtitle: "Discover high-tech gadgets and daily lifestyle essentials",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=700",
    link: "/shop?sort=discount",
    colSpan: 2,
    rowSpan: 1,
  },
];

const getBadgeClasses = (color?: string, idx = 0) => {
  switch (color) {
    case "rose":
      return "bg-rose-500/90 text-white shadow-rose-500/30";
    case "violet":
      return "bg-violet-600/90 text-white shadow-violet-600/30";
    case "amber":
      return "bg-amber-400 text-slate-950 font-black shadow-amber-400/30";
    case "emerald":
      return "bg-emerald-500/90 text-white shadow-emerald-500/30";
    case "blue":
      return "bg-blue-600/90 text-white shadow-blue-600/30";
    case "red":
      return "bg-red-600/90 text-white shadow-red-600/30";
    default: {
      const fallbacks = [
        "bg-rose-500/90 text-white shadow-rose-500/30",
        "bg-violet-600/90 text-white shadow-violet-600/30",
        "bg-amber-400 text-slate-950 shadow-amber-400/30",
        "bg-emerald-500/90 text-white shadow-emerald-500/30",
      ];
      return fallbacks[idx % fallbacks.length];
    }
  }
};

export default function BentoGridSection({ bentoGrid }: BentoGridSectionProps) {
  // If explicitly disabled in CMS, do not render
  if (bentoGrid && bentoGrid.isEnabled === false) {
    return null;
  }

  const items =
    bentoGrid?.items && bentoGrid.items.length > 0
      ? bentoGrid.items
      : bentoGrid?.isEnabled === false
      ? []
      : DEFAULT_BENTO_ITEMS;

  if (!items || items.length === 0) {
    return null;
  }

  const tag = bentoGrid?.tag || DEFAULT_TAG;
  const title = bentoGrid?.title || DEFAULT_TITLE;

  return (
    <section className="container mx-auto px-2 sm:px-4 py-4 md:py-6">
      {/* Sleek Header with Subtitle and Link */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4 md:mb-6">
        <div>
          {tag && (
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] md:text-xs font-extrabold uppercase tracking-widest text-primary">
                {tag}
              </span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-primary hover:text-primary/80 transition-colors group self-start sm:self-auto"
        >
          Explore All
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Optimized Modern Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 auto-rows-[150px] sm:auto-rows-[180px] md:auto-rows-[210px]">
        {items.map((item, index) => {
          // Dynamic responsive spans:
          // Card 0: Full width on mobile (2 cols), 2 cols x 2 rows on desktop
          // Card 1: 1 col on mobile, 1 col x 1 row on desktop
          // Card 2: 1 col on mobile, 1 col x 1 row on desktop
          // Card 3: Full width on mobile (2 cols), 2 cols x 1 row on desktop
          let colClass = "col-span-1 md:col-span-1";
          let rowClass = "row-span-1 md:row-span-1";

          if (index === 0) {
            colClass = "col-span-2 md:col-span-2";
            rowClass = "row-span-2 md:row-span-2";
          } else if (index === 3) {
            colClass = "col-span-2 md:col-span-2";
            rowClass = "row-span-1 md:row-span-1";
          } else if (item.colSpan === 2) {
            colClass = "col-span-2 md:col-span-2";
          }

          if (item.rowSpan === 2 && index !== 0) {
            rowClass = "row-span-2 md:row-span-2";
          }

          const isLarge = index === 0;
          const isWide = index === 3 || item.colSpan === 2;

          const destinationUrl =
            item.link ||
            (item.categorySlug ? `/shop/${item.categorySlug}` : "/shop");

          return (
            <Link
              key={index}
              href={destinationUrl}
              className={`group relative ${colClass} ${rowClass} rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-end p-4 sm:p-5 md:p-6 hover:-translate-y-1`}
            >
              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5 group-hover:from-black/95 transition-all duration-500 z-10" />

              {/* Background Image with Zoom */}
              {item.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
              ) : (
                <div className="absolute inset-0 bg-slate-800 z-0" />
              )}

              {/* Glassmorphic Ambient Glow on Hover */}
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-white/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700 z-0 pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-20 space-y-1.5 md:space-y-2">
                {item.badge && (
                  <div>
                    <span
                      className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase px-2.5 py-0.5 md:py-1 rounded-full tracking-wider shadow-sm backdrop-blur-md ${getBadgeClasses(
                        item.badgeColor,
                        index,
                      )}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}

                <h3
                  className={`font-black text-white group-hover:text-pink-100 transition-colors leading-tight ${
                    isLarge
                      ? "text-base sm:text-xl md:text-2xl lg:text-3xl"
                      : isWide
                      ? "text-sm sm:text-base md:text-xl"
                      : "text-xs sm:text-sm md:text-base"
                  }`}
                >
                  {item.title}
                </h3>

                {item.subtitle && (
                  <p
                    className={`text-slate-200/90 font-medium line-clamp-2 ${
                      isLarge
                        ? "text-[10px] sm:text-xs md:text-sm max-w-sm"
                        : "text-[9px] sm:text-[10px] md:text-xs max-w-xs"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                )}

                {/* Bottom CTA Action Button */}
                <div className="pt-1.5 sm:pt-2">
                  {isLarge ? (
                    <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                        Shop Now
                      </span>
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-slate-900 flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-sm">
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
