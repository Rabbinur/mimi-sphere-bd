"use client";

import { useGetCmsQuery } from "@/components/Redux/RTK/cmsApi";
import { TCMS, THeroSlide } from "@/types";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Smartphone,
  Sparkles,
  ToyBrick,
  Truck
} from "lucide-react";
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

const defaultPromoCards = [
  {
    tag: "Top Priority",
    title: "Baby Intelligence Books",
    subtitle: "Phonetic Bangla, English & Arabic Audio Books 📚",
    image: "/hero/intelligence-book.jpg",
    link: "/shop",
    badgeColor: "bg-amber-400 text-slate-950",
    icon: BookOpen,
  },
  {
    tag: "Creative Toys",
    title: "STEM Toys & Gear Cars",
    subtitle: "Glowing LED Cars, Pop-up Tents & Puzzles 🧸",
    image: "/hero/gear-car.jpg",
    link: "/shop",
    badgeColor: "bg-blue-600 text-white",
    icon: ToyBrick,
  },
  {
    tag: "Arts & Drawing",
    title: "Creative Arts & Drawing Tech",
    subtitle: "Eye-Safe LCD Writing Pads & Art Kits 🎨",
    image: "/hero/kids-gadget-tablet.jpg",
    link: "/shop",
    badgeColor: "bg-emerald-600 text-white",
    icon: Smartphone,
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
  // If backend returns legacy shopping-cart-bd banners, replace with our official high-res kids toys & gadgets banners
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

      {/* 🌟 2. 🎁 ৩-কলামের কমপ্যাক্ট প্রোমো বেন্টো গ্রিড (3-Card Bento Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 md:gap-3.5">
        {defaultPromoCards.map((card, idx) => {
          const Icon = card.icon || ToyBrick;
          return (
            <Link
              key={idx}
              href={card.link}
              className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 md:p-4.5 bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-400/50 hover:-translate-y-0.5 transition-all duration-300 group flex items-center justify-between min-h-[125px] sm:min-h-[135px]"
            >
              {/* Left Content */}
              <div className="flex-1 pr-2 flex flex-col justify-between h-full z-10">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${card.badgeColor}`}>
                      <Sparkles className="w-2 h-2" />
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight group-hover:text-[#002447] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug line-clamp-1">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-[#002447] group-hover:text-amber-600 transition-colors">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {/* Right Side: Slightly Rotated Product Image */}
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100 rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 ease-out bg-slate-50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 80px, 100px"
                    className="object-cover"
                  />
                </div>

                {/* Floating micro icon */}
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 group-hover:bg-[#002447] group-hover:text-amber-400 transition-colors z-20">
                  <Icon className="w-2.5 h-2.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🌟 3. 🛡️ ৪টি ট্রাস্ট পিলার (4 Trust Pillars Bar) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
        <PerkBadge
          icon={<ToyBrick className="w-3.5 h-3.5 text-amber-500" />}
          title="Creative Learning"
          desc="STEM & Montessori Toys"
        />
        <PerkBadge
          icon={<Smartphone className="w-3.5 h-3.5 text-blue-500" />}
          title="Child-Safe Tech"
          desc="100% Tested Smart Gadgets"
        />
        <PerkBadge
          icon={<Truck className="w-3.5 h-3.5 text-emerald-500" />}
          title="Fast Delivery"
          desc="48-72h in All 64 Districts"
        />
        <PerkBadge
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
          title="Inspect Before Pay"
          desc="Cash on Delivery Available"
        />
      </div>

    </div>
  );
};

const PerkBadge = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm">
    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h3 className="text-[11px] sm:text-xs font-bold text-slate-800 truncate leading-tight">{title}</h3>
      <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate leading-tight">{desc}</p>
    </div>
  </div>
);

export default HeroSlider;
