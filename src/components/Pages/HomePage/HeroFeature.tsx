"use client";

import { THeroFeature } from "@/types";
import {
    ArrowRight,
    Glasses,
    Heart,
    Shirt,
    Sparkles,
    Star,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const defaultFeatures: THeroFeature[] = [
    {
        title: "Baby Smart Gadgets & Sunglasses",
        subtitle: "UV400 Sunglasses, Smartwatches & Gear 🕶️",
        image: "/hero/kids-sunglasses.png",
        link: "/shop?category=baby-gadgets",
    },
    {
        title: "Baby Cute Caps & Hats",
        subtitle: "Soft Bear Ear Cotton Caps & Headwear 🧢",
        image: "/hero/baby-caps.png",
        link: "/shop?category=baby-caps",
    }
];

export const HeroFeature = ({ features }: { features?: THeroFeature[] }) => {
    const isLegacy = features?.some(
        (f) =>
            f.title?.toLowerCase().includes("summer") ||
            f.title?.toLowerCase().includes("avocado") ||
            f.title?.toLowerCase().includes("handbag")
    );
    const displayFeatures = (!features?.length || isLegacy) ? defaultFeatures : features;
    const babyGadgetCard = displayFeatures[0] || defaultFeatures[0];
    const babyCapCard = displayFeatures[1] || defaultFeatures[1];

    return (
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3 md:gap-3.5 h-full">
            
            {/* 🌟 1. CARD 1: BABY SMART GADGETS & SUNGLASSES */}
            <Link
                href={babyGadgetCard.link || "/shop"}
                className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-[#00172e] via-[#002447] to-[#07192f] text-white border border-amber-500/25 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all duration-300 group flex items-center justify-between min-h-[125px] sm:min-h-[145px] lg:h-full"
            >
                {/* Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/30 transition-colors" />

                {/* Left Info */}
                <div className="flex-1 pr-2.5 z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
                                <Glasses className="w-2.5 h-2.5" />
                                Baby Gadgets
                            </span>
                            <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-300" />
                                4.9
                            </span>
                        </div>

                        <h3 className="text-xs sm:text-sm md:text-base font-black text-white leading-tight group-hover:text-amber-300 transition-colors line-clamp-1">
                            {babyGadgetCard.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-300 mt-0.5 line-clamp-1">
                            {babyGadgetCard.subtitle}
                        </p>
                    </div>

                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                        <span>Shop Sunglasses</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Right Floating Visual */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-26 md:h-26 shrink-0 z-10">
                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md border border-white/20 rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 bg-white flex items-center justify-center">
                        <Image
                            src={babyGadgetCard.image}
                            alt={babyGadgetCard.title}
                            fill
                            sizes="(max-width: 768px) 90px, 110px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Link>

            {/* 🌟 2. CARD 2: BABY CUTE CAPS & HATS */}
            <Link
                href={babyCapCard.link || "/shop"}
                className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-br from-white to-slate-50 text-slate-900 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-400/60 transition-all duration-300 group flex items-center justify-between min-h-[125px] sm:min-h-[145px] lg:h-full"
            >
                {/* Ambient Glow */}
                <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/20 transition-colors" />

                {/* Left Info */}
                <div className="flex-1 pr-2.5 z-10 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                                <Heart className="w-2.5 h-2.5 fill-white" />
                                Baby Wear & Caps
                            </span>
                        </div>

                        <h3 className="text-xs sm:text-sm md:text-base font-black text-slate-900 leading-tight group-hover:text-[#002447] transition-colors line-clamp-1">
                            {babyCapCard.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                            {babyCapCard.subtitle}
                        </p>
                    </div>

                    <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#002447] group-hover:text-amber-600 transition-colors">
                        <span>Explore Baby Caps</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Right Floating Cap Visual */}
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-26 md:h-26 shrink-0 z-10">
                    <div className="relative w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100 rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 bg-white flex items-center justify-center">
                        <Image
                            src={babyCapCard.image}
                            alt={babyCapCard.title}
                            fill
                            sizes="(max-width: 768px) 90px, 110px"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Link>

        </div>
    );
};

export default HeroFeature;
