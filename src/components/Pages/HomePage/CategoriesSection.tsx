"use client";

import { useAllCategoryQuery } from "@/components/Redux/RTK/categoryApi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

/* ---------------- Types ---------------- */
export interface TCategoryItem {
    _id: string;
    name: string;
    slug: string;
    img?: string;
    imageUrl?: string;
    banner?: string;
    bannerHome?: string;
    metaTitle?: string;
    metaDesc?: string;
    sortOrder?: number;
}

interface CategoriesSectionProps {
    categories?: TCategoryItem[];
}

/* Category Image Fallback Resolver */
const categoryImageMap: Record<string, string> = {
    "intelligence": "/hero/intelligence-book.jpg",
    "handwriting": "/hero/kids-gadget-tablet.jpg",
    "arts-and-drawing": "/hero/kids-gadget-tablet.jpg",
    "arts & drawing": "/hero/kids-gadget-tablet.jpg",
    "books": "/hero/intelligence-book-front.jpg",
    "toys-and-games": "/hero/gear-car.jpg",
    "toys & games": "/hero/gear-car.jpg",
    "baby-care": "/hero/baby-caps.png",
    "baby care": "/hero/baby-caps.png",
    "baby-gadgets": "/hero/kids-sunglasses.png",
    "baby-sunglasses": "/hero/kids-sunglasses.png",
    "baby-caps": "/hero/baby-caps.png",
    "play-tents": "/hero/play-tent.jpg",
    "stem-toys": "/hero/gear-car.jpg",
    "smart-gadgets": "/hero/kids-gadget-tablet.jpg",
};

/* Full Essential Category Suite for Mimi Sphere */
const defaultCategories: TCategoryItem[] = [
    {
        _id: "68ca57fee4ae9a29b1603081",
        name: "Intelligence",
        slug: "intelligence",
        img: "/hero/intelligence-book.jpg",
        sortOrder: 1,
    },
    {
        _id: "68ca57fee4ae9a29b1603077",
        name: "Handwriting",
        slug: "handwriting",
        img: "/hero/kids-gadget-tablet.jpg",
        sortOrder: 2,
    },
    {
        _id: "691363739b446d4b6f727fad",
        name: "Arts & Drawing",
        slug: "arts-and-drawing",
        img: "/hero/banner-kids-1.jpg",
        sortOrder: 3,
    },
    {
        _id: "68ca57fee4ae9a29b160306f",
        name: "Books",
        slug: "books",
        img: "/hero/intelligence-book-front.jpg",
        sortOrder: 4,
    },
    {
        _id: "68ca57fee4ae9a29b1603075",
        name: "Toys & Games",
        slug: "toys-and-games",
        img: "/hero/gear-car.jpg",
        sortOrder: 5,
    },
    {
        _id: "69d3d4e2e0d6d8c2490892ce",
        name: "Baby Care",
        slug: "baby-care",
        img: "/hero/baby-caps.png",
        sortOrder: 6,
    },
    {
        _id: "cat-extra-sunglasses",
        name: "Baby Sunglasses",
        slug: "baby-sunglasses",
        img: "/hero/kids-sunglasses.png",
        sortOrder: 7,
    },
    {
        _id: "cat-extra-caps",
        name: "Caps & Hats",
        slug: "baby-caps",
        img: "/hero/baby-caps.png",
        sortOrder: 8,
    },
    {
        _id: "cat-extra-tents",
        name: "Play Tents",
        slug: "play-tents",
        img: "/hero/play-tent.jpg",
        sortOrder: 9,
    },
];

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
    // 100% Dynamic data from backend API with automatic missing image resolution
    const { data: clientCategoriesResponse, isLoading } = useAllCategoryQuery(undefined, {
        skip: Boolean(categories && categories.length > 0),
    });

    const [api, setApi] = useState<CarouselApi>();

    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    );

    const displayCategories = useMemo(() => {
        const rawList = (categories && categories.length > 0)
            ? categories
            : (clientCategoriesResponse?.data && clientCategoriesResponse.data.length > 0)
                ? clientCategoriesResponse.data
                : defaultCategories;

        // Ensure missing categories from your catalog (Baby Sunglasses, Caps, Play Tents) are seamlessly included
        const existingSlugs = new Set(rawList.map((c: TCategoryItem) => c.slug?.toLowerCase()));
        const missingAdditions = defaultCategories.filter(d => !existingSlugs.has(d.slug.toLowerCase()));

        return [...rawList, ...missingAdditions];
    }, [categories, clientCategoriesResponse]);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    return (
        <section className="container mx-auto px-2 sm:px-4 py-3 md:py-6">
            
            {/* 🌟 Top Header with Controls */}
            <div className="flex items-end justify-between mb-4 md:mb-6">
                <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
                            Shop By Category
                        </span>
                    </div>
                    <h2 className="text-base sm:text-lg md:text-2xl font-black text-slate-900 leading-tight">
                        Explore Kids & Baby Worlds
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/shop"
                        className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#002447] hover:text-amber-600 transition-colors mr-2"
                    >
                        <span>View All Categories</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Navigation Carousel Buttons */}
                    <button
                        onClick={scrollPrev}
                        aria-label="Previous categories"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={scrollNext}
                        aria-label="Next categories"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 🌟 NEW DESIGN: Modern Soft Capsule Bubble Cards Carousel */}
            {isLoading && !displayCategories.length ? (
                <div className="flex justify-center gap-3 sm:gap-4 overflow-hidden py-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2.5 sm:-ml-3 md:-ml-4">
                        {displayCategories.map((category: TCategoryItem, idx: number) => (
                            <CarouselItem
                                key={category._id || idx}
                                className="pl-2.5 sm:pl-3 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[14.28%] xl:basis-[12.5%]"
                            >
                                <NewModernCategoryCard category={category} index={idx} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            )}
        </section>
    );
}

/* ---------------- 🌟 MODERN CAPSULE CATEGORY CARD ---------------- */

const pastelAccents = [
    "hover:border-amber-400 hover:shadow-amber-500/10",
    "hover:border-blue-400 hover:shadow-blue-500/10",
    "hover:border-emerald-400 hover:shadow-emerald-500/10",
    "hover:border-rose-400 hover:shadow-rose-500/10",
    "hover:border-purple-400 hover:shadow-purple-500/10",
    "hover:border-sky-400 hover:shadow-sky-500/10",
];

const NewModernCategoryCard = ({ category, index }: { category: TCategoryItem; index: number }) => {
    // Resolve Image: Check category.img, category.imageUrl, or match by slug/name
    const slugKey = category.slug?.toLowerCase() || "";
    const nameKey = category.name?.toLowerCase() || "";
    
    let imgSrc = category.img || category.imageUrl || "";

    if (!imgSrc || imgSrc.startsWith("data:") || (!imgSrc.startsWith("http") && !imgSrc.startsWith("/"))) {
        imgSrc = categoryImageMap[slugKey] || categoryImageMap[nameKey] || "/hero/intelligence-book.jpg";
    }

    const accentBorder = pastelAccents[index % pastelAccents.length];

    return (
        <Link
            href={`/shop?category=${category.slug}`}
            className={`group cursor-pointer flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[135px] sm:min-h-[155px] ${accentBorder}`}
            aria-label={`Browse category ${category.name}`}
        >
            {/* Floating Bubble Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 p-1 flex items-center justify-center shadow-inner group-hover:bg-amber-50/40 transition-colors">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 70px, 90px"
                        className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500"
                    />
                </div>
            </div>

            {/* Title & Explore Indicator */}
            <div className="text-center mt-2 w-full">
                <h3 className="text-[11px] sm:text-xs md:text-[13px] font-black text-slate-800 group-hover:text-[#002447] transition-colors line-clamp-1 px-0.5 leading-tight">
                    {category.name}
                </h3>
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-amber-600 transition-colors inline-flex items-center gap-0.5 mt-0.5">
                    <span>Explore</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </span>
            </div>
        </Link>
    );
};

const SkeletonCard = () => (
    <div className="flex flex-col items-center justify-between p-3 rounded-3xl bg-slate-50 border border-slate-100 animate-pulse min-w-[90px] h-[140px]">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200" />
        <div className="h-3 w-14 bg-slate-200 rounded-md mt-2" />
    </div>
);

/* =========================================================================
   ======================= 📜 PREVIOUS DESIGN (SAVED) =======================
   =========================================================================

const PreviousCategoryCard = ({ category }: { category: TCategoryItem }) => (
    <Link
        href={`/shop/${category.slug}`}
        className="group cursor-pointer flex flex-col items-center gap-2 py-2 transition-all duration-300"
        aria-label={`Browse category ${category.name}`}
    >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md">
            <Image
                src={category.imageUrl || category.img || "https://via.placeholder.com/150"}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 80px, 112px"
                className="object-cover p-1.5 rounded-full group-hover:scale-110 transition-transform duration-500"
            />
        </div>

        <div className="text-center">
            <h3 className="text-[11px] sm:text-[13px] md:text-[14px] font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1 px-1">
                {category.name}
            </h3>
        </div>
    </Link>
);

========================================================================= */