"use client";

import { useGetCmsQuery } from "@/components/Redux/RTK/cmsApi";
import { TCMS, THeroSlide } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HeroFeature } from "./HeroFeature";

const defaultDesktopSlides: THeroSlide[] = [
  {
    image: "/hero/banner-kids-1.jpg",
    link: "/shop",
    alt: "Smart gadgets and creative learning toys for happy kids",
  },
  {
    image: "/hero/banner-kids-2.jpg",
    link: "/shop",
    alt: "STEM toys, robotics kits and Montessori play",
  },
  {
    image: "/hero/kids-gadget-tablet.jpg",
    link: "/shop",
    alt: "Child-safe smart gadgets and drawing tablets",
  },
];

const defaultMobileSlides = [
  { image: "/hero/banner-kids-1.jpg", link: "/shop", alt: "Kids Learning Toys" },
  { image: "/hero/banner-kids-2.jpg", link: "/shop", alt: "STEM Toys" },
  { image: "/hero/kids-gadget-tablet.jpg", link: "/shop", alt: "Smart Gadgets" },
];

const TRUST_FEATURES = [
  {
    title: "FASTEST SHIPPING COUNTRYWIDE",
    icon: (
      <svg
        className="w-9 h-9 sm:w-10 sm:h-10 text-slate-500 stroke-[1.15]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14h4" />
        <path d="M2 18h5" />
        <path d="M5 22h3" />
        <path d="M9 10h11v11H9z" />
        <path d="M20 13h5l3 3.5V21h-8" />
        <circle cx="12" cy="22" r="2.5" />
        <circle cx="23" cy="22" r="2.5" />
        <path d="M14.5 13.5c-.8-.8-2-.3-2 .8 0 1.2 2 2.7 2 2.7s2-1.5 2-2.7c0-1.1-1.2-1.6-2-.8z" />
      </svg>
    ),
  },
  {
    title: "EASY RETURN POLICY",
    icon: (
      <svg
        className="w-9 h-9 sm:w-10 sm:h-10 text-slate-500 stroke-[1.15]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 16l6-3.5 6 3.5-6 3.5-6-3.5z" />
        <path d="M9 16v6.5l6 3.5v-6.5" />
        <path d="M21 16v6.5l-6 3.5" />
        <path d="M22 10a5 5 0 0 0-8.5-3.5L14 8" />
        <path d="M14 4.5v3.5h3.5" />
      </svg>
    ),
  },
  {
    title: "PREMIUM QUALITY PRODUCT",
    icon: (
      <svg
        className="w-9 h-9 sm:w-10 sm:h-10 text-slate-500 stroke-[1.15]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="16" cy="14" r="8.5" strokeDasharray="2 2" />
        <path d="M16 9l1.5 3.2 3.5.5-2.5 2.4.6 3.5L16 17l-3.1 1.6.6-3.5-2.5-2.4 3.5-.5z" />
        <path d="M14 22.5l2 4 2-4" />
        <path d="M11 22l1 4.5" />
        <path d="M21 22l-1 4.5" />
      </svg>
    ),
  },
  {
    title: "ONLINE SUPPORT 24/7",
    icon: (
      <svg
        className="w-9 h-9 sm:w-10 sm:h-10 text-slate-500 stroke-[1.15]"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 16v-2a10 10 0 0 1 20 0v2" />
        <rect x="4" y="16" width="3.5" height="7" rx="1.5" />
        <rect x="24.5" y="16" width="3.5" height="7" rx="1.5" />
        <path d="M25 21v1a3 3 0 0 1-3 3h-3" />
        <path d="M11 13h10a1.5 1.5 0 0 1 1.5 1.5v3.5a1.5 1.5 0 0 1-1.5 1.5h-4l-3 2.5V19.5h-1.5A1.5 1.5 0 0 1 9.5 18v-3.5A1.5 1.5 0 0 1 11 13z" />
        <circle cx="13" cy="16" r=".8" fill="currentColor" />
        <circle cx="16" cy="16" r=".8" fill="currentColor" />
        <circle cx="19" cy="16" r=".8" fill="currentColor" />
      </svg>
    ),
  },
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

  const rawDesktop = cmsData?.heroSliderDesktop?.length ? cmsData.heroSliderDesktop : defaultDesktopSlides;
  const desktopSlides = rawDesktop.map((s) => ({
    ...s,
    image: (s.image?.includes("shopping-cart-bd") || s.image?.includes("korean") || s.image?.includes("multi-items"))
      ? "/hero/banner-kids-1.jpg"
      : (s.image || "/hero/banner-kids-1.jpg"),
  }));

  const rawMobile = cmsData?.heroSliderMobile?.length ? cmsData.heroSliderMobile : defaultMobileSlides;
  const mobileSlides = rawMobile.map((s) => ({
    ...s,
    image: (s.image?.includes("slider-s-") || s.image?.includes("shopping-cart-bd"))
      ? "/hero/banner-kids-1.jpg"
      : (s.image || "/hero/banner-kids-1.jpg"),
  }));

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
      <div className="container mx-auto px-2 sm:px-4 py-3 md:py-4 space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-8 bg-slate-200 animate-pulse rounded-2xl h-[160px] sm:h-[220px] lg:h-[360px]" />
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3">
            <div className="bg-slate-200 animate-pulse rounded-2xl h-[100px] lg:h-full" />
            <div className="bg-slate-200 animate-pulse rounded-2xl h-[100px] lg:h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2.5 md:py-4 space-y-3.5 md:space-y-4">
      
      {/* 🌟 1. HERO TOP SPLIT: SLEEK BALANCED SLIDER (8 Cols) + HERO FEATURE CARDS (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 md:gap-3.5 items-stretch">
        
        {/* LEFT: Sleek Cinematic Slider (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl h-[160px] sm:h-[220px] md:h-[290px] lg:h-[360px] w-full group shadow-sm border border-slate-100 bg-slate-900 flex flex-col justify-end">
          
          {/* Desktop Slider */}
          <div className="hidden md:block absolute inset-0">
            {desktopSlides.map((slide: THeroSlide, idx: number) => (
              <Link
                key={idx}
                href={slide.link || "/shop"}
                aria-label={`Slide ${idx + 1}`}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentDesktop ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || `Desktop Slide ${idx + 1}`}
                  fill
                  sizes="(min-width: 1024px) 68vw, 100vw"
                  className="w-full h-full object-cover"
                  priority={idx === 0}
                />
              </Link>
            ))}

            {desktopSlides.length > 1 && (
              <>
                {/* Modern Glass Arrows */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    prevDesktop();
                  }}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/40 hover:bg-[#002447] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-105"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    nextDesktop();
                  }}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-950/40 hover:bg-[#002447] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-105"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Bottom Glass Counter Bar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20 px-3 py-1 rounded-full bg-slate-950/50 backdrop-blur-md border border-white/10 text-[10px]">
                  <span className="font-bold text-amber-400">
                    0{currentDesktop + 1} / 0{desktopSlides.length}
                  </span>
                  <div className="w-px h-3 bg-white/20" />
                  <div className="flex items-center gap-1">
                    {desktopSlides.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentDesktop(i);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === currentDesktop ? "w-4 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
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
                href={slide.link || "/shop"}
                aria-label={`Mobile Slide ${idx + 1}`}
                className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                  idx === currentMobile ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt || `Mobile Slide ${idx + 1}`}
                  fill
                  sizes="100vw"
                  className="w-full h-full object-cover bg-slate-900"
                  priority={idx === 0}
                />
              </Link>
            ))}

            {mobileSlides.length > 1 && (
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-2.5 py-0.5 rounded-full bg-slate-950/50 backdrop-blur-md">
                {mobileSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentMobile(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentMobile ? "w-4 bg-amber-400" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT: HeroFeature Cards (4 cols) */}
        <HeroFeature features={cmsData?.heroFeatures} />

      </div>

      {/* 🌟 2. 🛡️ ৪টি ট্রাস্ট ও সার্ভিস বক্স (Exact Match to Screenshot) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 pt-1">
        {TRUST_FEATURES.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-none sm:rounded-sm py-5 px-3 sm:py-6 sm:px-4 md:py-7 md:px-5 flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="mb-2.5 sm:mb-3 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-[10px] sm:text-[11px] md:text-[11.5px] font-semibold tracking-[0.14em] sm:tracking-[0.18em] text-slate-500 uppercase leading-snug">
              {item.title}
            </h3>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;
