"use client";

import useIsMobile from "@/components/hooks/useIsMobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import TitleBadge from "@/components/ui/TitleBadge";
import { TProduct } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

interface TrendySectionProps {
  products?: TProduct[];
}

const TrendySection = ({ products = [] }: TrendySectionProps) => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const hasProducts = products && products.length > 0;

  return (
    <section className="container mx-auto px-2 sm:px-4 py-3 md:py-6">
      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
        
        {/* ── Header with TitleBadge, Live Pill & Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-3 md:px-6 md:py-4 bg-white border-b border-slate-100 gap-3">
          {/* Left: Icon, Title & Live Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-orange-500/10 text-rose-600 border border-rose-100/70 shrink-0 shadow-xs">
              <Flame className="w-5 h-5 text-rose-500 fill-rose-500/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <TitleBadge title="Trending Now" />
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  Viral Picks
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                Top-rated and most loved picks by our shoppers this week
              </p>
            </div>
          </div>

          {/* Right: Slider Navigation Controls + Explore All */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Slider Arrows */}
            {hasProducts && products.length > 2 && (
              <div className="flex items-center gap-1.5 mr-1">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Previous trending products"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:border-slate-900 hover:text-white flex items-center justify-center text-slate-600 shadow-xs transition-all duration-200 active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Next trending products"
                  className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-900 hover:border-slate-900 hover:text-white flex items-center justify-center text-slate-600 shadow-xs transition-all duration-200 active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <Link
              href="/shop?sort=trending"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-all duration-200 group px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-primary" />
            </Link>
          </div>
        </div>

        {/* ── Main Content: Promotional Banner + Products Slider ── */}
        <div className="flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Side: Clickable Promotion Banner */}
          <Link
            href="/shop?sort=trending"
            aria-label="View trending collection"
            className="w-full lg:w-[260px] xl:w-[290px] shrink-0 relative min-h-[160px] sm:min-h-[220px] lg:min-h-[380px] overflow-hidden group block bg-slate-900"
          >
            <Image
              src={isMobile ? "/assets/hot-deals-sm.png" : "/assets/treandings.png"}
              alt="Trending Promotion Banner"
              fill
              sizes="(max-width: 1024px) 100vw, 290px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            
            {/* Subtle Gradient Shadow for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none" />

            {/* Bottom floating micro-badge on desktop */}
            <div className="absolute bottom-3.5 left-3.5 right-3.5 hidden sm:flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300/30" />
                Featured Picks
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>

          {/* Right Side: Product Carousel Slider */}
          <div className="flex-1 min-w-0 p-2.5 sm:p-3.5 md:p-4 bg-slate-50/50 flex flex-col justify-center relative group/carousel">
            {!hasProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <ProductCardLoading key={idx} />
                ))}
              </div>
            ) : (
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: products.length > 3,
                }}
                plugins={[autoplayPlugin.current]}
                onMouseEnter={autoplayPlugin.current.stop}
                onMouseLeave={autoplayPlugin.current.reset}
                className="w-full"
              >
                <CarouselContent className="-ml-2.5 sm:-ml-3 md:-ml-3.5">
                  {products.map((product: TProduct) => (
                    <CarouselItem
                      key={product._id}
                      className="pl-2.5 sm:pl-3 md:pl-3.5 basis-1/2 sm:basis-1/2 md:basis-1/3 xl:basis-1/4"
                    >
                      <div className="h-full transition-transform duration-200 hover:-translate-y-1">
                        <ItemCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Floating On-Hover Side Arrows for desktop */}
                {products.length > 4 && (
                  <>
                    <button
                      type="button"
                      onClick={scrollPrev}
                      aria-label="Previous slide"
                      className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-slate-900 hover:text-white items-center justify-center text-slate-700 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={scrollNext}
                      aria-label="Next slide"
                      className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-slate-900 hover:text-white items-center justify-center text-slate-700 opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </Carousel>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default TrendySection;