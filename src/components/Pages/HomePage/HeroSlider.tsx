"use client";

import { useGetCmsQuery } from "@/components/Redux/RTK/cmsApi";
import { TCMS, THeroSlide } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HeroFeature } from "./HeroFeature";

const defaultDesktopSlides: THeroSlide[] = [
  { image: "/hero/shopping-cart-bd-banner-1.webp", link: "/shop", alt: "Slide 1" },
  { image: "/hero/korean.png", link: "/shop", alt: "Slide 2" },
  { image: "/hero/multi-items.png", link: "/shop", alt: "Slide 3" },
  { image: "/hero/shopping-cart-bd-banner-2.webp", link: "/shop", alt: "Slide 4" },
];

const defaultMobileSlides = [
  { image: "/hero/slider-s-1.png", link: "/shop", alt: "Slide 1" },
  { image: "/hero/slider-s-2.png", link: "/shop", alt: "Slide 2" },
  { image: "/hero/slider-s-3.png", link: "/shop", alt: "Slide 3" },
  { image: "/hero/slider-s-4.png", link: "/shop", alt: "Slide 4" },
];

const MIN_SWIPE_DISTANCE = 50;

interface HeroSliderProps {
  initialCmsData?: TCMS;
}

const HeroSlider = ({ initialCmsData }: HeroSliderProps) => {
  const { data: cmsResponse, isLoading: isQueryLoading } = useGetCmsQuery(undefined, {
    skip: !!initialCmsData,
  });
  const [currentDesktop, setCurrentDesktop] = useState(0);
  const [currentMobile, setCurrentMobile] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const cmsData = initialCmsData || cmsResponse?.data;
  const isLoading = !initialCmsData && isQueryLoading;

  const desktopSlides = cmsData?.heroSliderDesktop?.length ? cmsData.heroSliderDesktop : defaultDesktopSlides;
  const mobileSlides = cmsData?.heroSliderMobile?.length ? cmsData.heroSliderMobile : defaultMobileSlides;

  const nextDesktop = useCallback(() => {
    if (desktopSlides.length === 0) return;
    setCurrentDesktop((prev) => (prev + 1) % desktopSlides.length);
  }, [desktopSlides.length]);

  const prevDesktop = useCallback(() => {
    if (desktopSlides.length === 0) return;
    setCurrentDesktop((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length);
  }, [desktopSlides.length]);

  const nextMobile = useCallback(() => {
    if (mobileSlides.length === 0) return;
    setCurrentMobile((prev) => (prev + 1) % mobileSlides.length);
  }, [mobileSlides.length]);

  const prevMobile = useCallback(() => {
    if (mobileSlides.length === 0) return;
    setCurrentMobile((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
  }, [mobileSlides.length]);

  useEffect(() => {
    if (desktopSlides.length <= 1) return;
    const timer = window.setInterval(nextDesktop, 5000);
    return () => window.clearInterval(timer);
  }, [nextDesktop, desktopSlides.length]);

  useEffect(() => {
    if (mobileSlides.length <= 1) return;
    const timer = window.setInterval(nextMobile, 5000);
    return () => window.clearInterval(timer);
  }, [nextMobile, mobileSlides.length]);

  useEffect(() => {
    if (touchStartX === null || touchEndX === null) return;
    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > MIN_SWIPE_DISTANCE) {
      nextMobile();
    } else if (swipeDistance < -MIN_SWIPE_DISTANCE) {
      prevMobile();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  }, [nextMobile, prevMobile, touchEndX, touchStartX]);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(null);
    setTouchStartX(event.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchEndX(event.targetTouches[0]?.clientX ?? null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-2 md:py-6 xl:py-7 xl:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          <div className="lg:col-span-8 bg-gray-200 animate-pulse rounded-lg h-[160px] sm:h-[230px] lg:h-[450px]" />
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            <div className="bg-gray-200 animate-pulse rounded-lg h-[100px] sm:h-[140px] lg:h-full" />
            <div className="bg-gray-200 animate-pulse rounded-lg h-[100px] sm:h-[140px] lg:h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 md:py-6 xl:py-7 xl:pt-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
        <div className="lg:col-span-8 relative overflow-hidden rounded-lg h-[160px] sm:h-[230px] lg:h-[450px] w-full group">

          {/* Desktop Slider */}
          <div className="hidden md:block absolute inset-0">
            {desktopSlides.map((slide: THeroSlide, idx: number) => (
              <Link
                key={idx}
                href={slide.link || "#"}
                aria-label={`Slide ${idx + 1}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentDesktop ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || `Desktop Slide ${idx + 1}`}
                  fill
                  sizes="(min-width: 1280px) 850px, (min-width: 1024px) 66vw, 100vw"
                  className="w-full h-full object-cover"
                  priority={idx === 0}
                />
              </Link>
            ))}

            {desktopSlides.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.preventDefault(); prevDesktop(); }}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-primary/20 hover:bg-primary/80 text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); nextDesktop(); }}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-primary/20 hover:bg-primary/80 text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {desktopSlides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={(e) => { e.preventDefault(); setCurrentDesktop(i); }}
                      className={`h-2 w-2 rounded-full transition-all flex items-center justify-center group/dot ${i === currentDesktop ? "w-4 bg-secondary" : "w-2 bg-secondary/50 hover:bg-secondary/80"}`}
                    >
                      <span className="sr-only">Slide {i + 1}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile Slider */}
          <div
            className="block md:hidden absolute inset-0"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {mobileSlides.map((slide: THeroSlide, idx: number) => (
              <Link
                key={idx}
                href={slide.link || "#"}
                aria-label={`Slide ${idx + 1}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentMobile ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || `Mobile Slide ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 450px"
                  className="w-full h-full object-cover bg-white"
                  priority={idx === 0}
                />
              </Link>
            ))}

            {mobileSlides.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {mobileSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={(e) => { e.preventDefault(); setCurrentMobile(i); }}
                    className={`h-2 w-2 rounded-full transition-all flex items-center justify-center ${i === currentMobile ? "w-4 bg-secondary" : "w-2 bg-secondary/50"}`}
                  >
                    <span className="sr-only">Slide {i + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <HeroFeature features={cmsData?.heroFeatures} />
      </div>
    </div>
  );
};

export default HeroSlider;
