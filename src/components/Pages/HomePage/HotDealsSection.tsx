"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { ArrowRight, Flame, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HotDealsSection = ({ products }: { products: any[] | null }) => {
  if (!products || products.length === 0) return null;

  return (
    <section
      className="container mx-auto px-2 sm:px-4"
      id="daily-best-sells-header"
    >
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">

        {/* ── Header Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100">

          {/* Left: label + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 shrink-0">
              <Flame className="w-5 h-5 text-red-500" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  Hot Deals
                </h2>
                <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase tracking-wide leading-none">
                  Limited
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Exclusive prices, today only
              </p>
            </div>
          </div>

          {/* Right: countdown + view all */}
          <div className="flex items-center gap-4">
            <CountdownTimer expiryDays={1} title="Ends in" />
            <Link
              href="/shop?sort=featured"
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* ── Products Carousel ── */}
        <div className="relative group/carousel bg-white">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="m-0">
              {products.map((product, idx) => {
                const discount = product.discount_percentage || 0;
                const qty = product.quantity || 0;
                const soldPct = Math.min(88, 28 + (idx * 17) % 52);
                const isLow = qty <= 10;

                return (
                  <CarouselItem
                    key={product._id}
                    className="p-0 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <Link
                      href={`/products/${product.url_handle}`}
                      className="group/card flex flex-col h-full border-r border-b border-slate-100 transition-all duration-200 hover:bg-slate-50/60"
                    >
                      {/* ── Image ── */}
                      <div className="relative aspect-square overflow-hidden bg-slate-50">
                        <Image
                          src={product.thumbnail || "/assets/kids.webp"}
                          alt={product.product_title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                          className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          {discount > 0 && (
                            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded leading-none tracking-tight">
                              -{discount}%
                            </span>
                          )}
                          {isLow && (
                            <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded leading-none">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ── Info ── */}
                      <div className="flex flex-col flex-1 p-2.5 sm:p-3.5">

                        {/* Title */}
                        <h3 className="text-[11px] sm:text-[13px] font-semibold leading-snug line-clamp-2 text-slate-700 group-hover/card:text-slate-900 transition-colors mb-2">
                          {product.product_title}
                        </h3>

                        {/* Price */}
                        <div className="flex items-baseline gap-1.5 mb-3">
                          <span className="text-sm sm:text-[15px] font-black text-slate-900">
                            ৳{product.product_price?.toLocaleString()}
                          </span>
                          {product.compare_at_price > product.product_price && (
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              ৳{product.compare_at_price?.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Sold progress */}
                        <div className="mt-auto space-y-1.5">
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all"
                              style={{ width: `${soldPct}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-400 font-medium">
                              <span className="text-red-500 font-bold">{soldPct}%</span> sold
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {qty} left
                            </span>
                          </div>
                        </div>

                        {/* CTA */}
                        <button
                          aria-label={`Buy ${product.product_title} now`}
                          className="mt-2.5 w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-red-500 text-white text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 rounded-lg transition-all duration-200 active:scale-95"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          Buy Now
                        </button>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Arrows */}
            <CarouselPrevious className="absolute left-2 top-[40%] -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 w-8 h-8 bg-white hover:bg-slate-900 hover:text-white border-slate-200 shadow-md z-10" />
            <CarouselNext className="absolute right-2 top-[40%] -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 w-8 h-8 bg-white hover:bg-slate-900 hover:text-white border-slate-200 shadow-md z-10" />
          </Carousel>
        </div>

        {/* Mobile View All */}
        <div className="sm:hidden flex justify-center py-3 border-t border-slate-100">
          <Link
            href="/shop?sort=featured"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            View All Deals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotDealsSection;
