"use client";

import { useGetCmsQuery } from "@/components/Redux/RTK/cmsApi";
import { TCMS, THeroSlide } from "@/types";
import {
  ArrowRight,
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
    tag: "Learning & Fun",
    title: "Creative Learning Toys",
    subtitle: "STEM & Montessori Kits for Kids",
    image: "/hero/banner-kids-2.jpg",
    link: "/shop",
    badgeColor: "bg-amber-400 text-slate-950",
    icon: ToyBrick,
  },
  {
    tag: "Smart Tech",
    title: "Child-Safe Smart Gadgets",
    subtitle: "Educational & Interactive Devices",
    image: "/hero/kids-gadget-tablet.jpg",
    link: "/shop",
    badgeColor: "bg-blue-500 text-white",
    icon: Smartphone,
  },
  {
    tag: "Special Deal",
    title: "Hot Offers & Bundles",
    subtitle: "Best Discounts Delivered Across BD",
    image: "/hero/banner-kids-1.jpg",
    link: "/offers",
    badgeColor: "bg-rose-500 text-white",
    icon: Flame,
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
      <div className="container mx-auto px-2 sm:px-4 py-3 md:py-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
          <div className="lg:col-span-8 bg-slate-200 animate-pulse rounded-2xl md:rounded-3xl h-[180px] sm:h-[260px] lg:h-[460px]" />
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
            <div className="bg-slate-200 animate-pulse rounded-2xl h-[120px] sm:h-[150px] lg:h-full" />
            <div className="bg-slate-200 animate-pulse rounded-2xl h-[120px] sm:h-[150px] lg:h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-3 md:py-6 space-y-4 md:space-y-6">
      
      {/* 🌟 1. HERO MAIN GRID: CINEMATIC SLIDER (8 Cols) + HERO FEATURE CARDS (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-stretch">
        
        {/* LEFT: Cinematic Slider (8 cols) */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-2xl md:rounded-3xl h-[180px] sm:h-[260px] md:h-[350px] lg:h-[460px] w-full group shadow-md border border-slate-100 bg-slate-900 flex flex-col justify-end">
          
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-[#002447] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl hover:scale-105"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    nextDesktop();
                  }}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/50 hover:bg-[#002447] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl hover:scale-105"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Bottom Glass Counter Bar */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15">
                  <span className="text-[11px] font-black text-amber-400 tracking-wider">
                    0{currentDesktop + 1} / 0{desktopSlides.length}
                  </span>
                  <div className="w-px h-3.5 bg-white/20" />
                  <div className="flex items-center gap-1.5">
                    {desktopSlides.map((_, i) => (
                      <button
                        key={i}
                        aria-label={`Go to slide ${i + 1}`}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentDesktop(i);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === currentDesktop ? "w-5 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
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
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 px-3 py-1 rounded-full bg-slate-950/50 backdrop-blur-md">
                {mobileSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentMobile(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentMobile ? "w-5 bg-amber-400" : "w-1.5 bg-white/50"
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

      {/* 🌟 2. 🎁 ৩-কলামের ইন্টারেক্টিভ প্রোমো বেন্টো গ্রিড (3-Card Bento Grid with Rotated Product Images) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {defaultPromoCards.map((card, idx) => {
          const Icon = card.icon || ToyBrick;
          return (
            <Link
              key={idx}
              href={card.link}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-5 md:p-6 bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between min-h-[160px] md:min-h-[175px]"
            >
              {/* Background ambient accent */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-colors" />

              {/* Left Content (Text & CTA) */}
              <div className="flex-1 pr-3 flex flex-col justify-between h-full z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${card.badgeColor}`}>
                      <Sparkles className="w-2.5 h-2.5" />
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight group-hover:text-[#002447] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-1 leading-snug line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#002447] group-hover:text-amber-600 transition-colors">
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Right Side: Slightly Rotated Floating Product Image */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 z-10 flex items-center justify-center">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md border border-slate-100/80 rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 ease-out bg-slate-50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 120px, 140px"
                    className="object-cover"
                  />
                </div>

                {/* Micro floating icon badge */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 group-hover:bg-[#002447] group-hover:text-amber-400 transition-colors z-20">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🌟 3. 🛡️ ৪টি ট্রাস্ট পিলার (4 Trust Pillars Bar) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 pt-1">
        <PerkBadge
          icon={<ToyBrick className="w-4 h-4 text-amber-500" />}
          title="Creative Learning"
          desc="STEM & Montessori Toys"
        />
        <PerkBadge
          icon={<Smartphone className="w-4 h-4 text-blue-500" />}
          title="Child-Safe Tech"
          desc="100% Tested Smart Gadgets"
        />
        <PerkBadge
          icon={<Truck className="w-4 h-4 text-emerald-500" />}
          title="Fast Delivery"
          desc="48-72h in All 64 Districts"
        />
        <PerkBadge
          icon={<CheckCircle2 className="w-4 h-4 text-amber-600" />}
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
  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <h3 className="text-xs font-bold text-slate-800 truncate leading-tight">{title}</h3>
      <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate leading-tight mt-0.5">{desc}</p>
    </div>
  </div>
);

export default HeroSlider;
