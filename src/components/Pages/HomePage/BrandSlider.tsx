"use client";

import { useAllBrandsQuery } from "@/components/Redux/RTK/brandApi";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BrandSlider = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  const [loadFull, setLoadFull] = React.useState(false);

  // First fetch: only 30 brands
  const { data: initialResponse, isLoading: isInitialLoading } = useAllBrandsQuery({ page: 1, limit: 30 });

  // Second fetch: all brands (skipped initially)
  const { data: fullResponse } = useAllBrandsQuery({}, { skip: !loadFull || !isMounted });

  React.useEffect(() => {
    setIsMounted(true);
    // After 3 seconds, trigger the full load
    const timer = setTimeout(() => {
      setLoadFull(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const brandsData = loadFull && fullResponse ? (fullResponse as any)?.data?.brands : (initialResponse as any)?.data?.brands;
  const brands = (brandsData || []).filter((b: any) => b.logoUrl);

  if (!isMounted || (isInitialLoading && !brands.length)) return null;

  const midPoint = Math.ceil(brands.length / 2);
  const row1 = brands.slice(0, midPoint);
  const row2 = brands.slice(midPoint);

  const BrandCard = ({ brand }: { brand: any }) => {
    const [hasError, setHasError] = React.useState(false);

    if (hasError) return null;

    return (
      <Link
        href={`/shop?brand=${encodeURIComponent(brand.name)}`}
        className="group block"
      >
        <div className="flex items-center justify-center px-3 md:px-8 py-2 md:py-5 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:border-slate-200 hover:shadow-md hover:bg-slate-50/50 min-w-[90px] md:min-w-[180px] h-12 md:h-24">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              width={100}
              height={50}
              src={brand.logoUrl}
              alt={brand.name}
              onError={() => setHasError(true)}
              className="max-h-full w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 transform group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <section className="py-4 md:py-6 xl:py-10 bg-white overflow-hidden">
      <div className="container mx-auto px-2 md:px-4 mb-4 md:mb-6 text-center">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">
          Trusted Partners

        </h2>
        <div className="h-1 w-12 bg-indigo-500 mx-auto rounded-full" />
      </div>

      <div className="relative">
        <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex flex-col gap-2 md:gap-6">
          <Carousel opts={{ loop: true, align: "start" }} plugins={[AutoScroll({ speed: 0.6 })]}>
            <CarouselContent className=" gap-1.5 md:gap-3">
              {row1.map((brand: any) => (
                <CarouselItem key={brand._id} className="basis-auto pl-2 md:pl-4">
                  <BrandCard brand={brand} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <Carousel opts={{ loop: true, align: "start" }} plugins={[AutoScroll({ speed: 0.6, direction: "backward" })]}>
            <CarouselContent className=" gap-1.5 md:gap-3">
              {(row2.length ? row2 : row1).map((brand: any) => (
                <CarouselItem key={brand._id} className="basis-auto pl-2 md:pl-4">
                  <BrandCard brand={brand} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;