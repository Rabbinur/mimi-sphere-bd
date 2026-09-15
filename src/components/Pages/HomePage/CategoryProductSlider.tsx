"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import { TProduct } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface CategoryProductSliderProps {
  products: TProduct[];
}

export default function CategoryProductSlider({
  products,
}: CategoryProductSliderProps) {
  const [api, setApi] = useState<CarouselApi>();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3800, stopOnInteraction: true })
  );

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (!products || products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <ProductCardLoading key={idx} />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full relative group/slider flex flex-col justify-center">
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

        {/* Hover Arrow Controls */}
        {products.length > 3 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-slate-900 hover:text-white items-center justify-center text-slate-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-200 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next slide"
              className="hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 shadow-md hover:bg-slate-900 hover:text-white items-center justify-center text-slate-700 opacity-0 group-hover/slider:opacity-100 transition-all duration-200 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </Carousel>
    </div>
  );
}
