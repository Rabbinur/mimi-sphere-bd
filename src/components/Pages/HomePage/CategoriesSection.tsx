"use client";

import { useAllCategoryQuery } from "@/components/Redux/RTK/categoryApi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { TCategory } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

export interface TCategoryItem {
    _id: string;
    name: string;
    slug: string;
    img?: string;
    imageUrl?: string;
    parent_category_id?: string | null;
    isActive?: boolean;
    order?: number;
    sortOrder?: number;
}

interface CategoriesSectionProps {
    categories?: (TCategory | TCategoryItem)[];
}

const DEFAULT_CATEGORY_FALLBACK = "/hero/intelligence-book.jpg";

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
    // Dynamic data from RTK Query if server categories are not provided
    const { data: clientCategoriesResponse, isLoading } = useAllCategoryQuery(undefined, {
        skip: Boolean(categories && categories.length > 0),
    });

    const [api, setApi] = useState<CarouselApi>();

    const plugin = useRef(
        Autoplay({ delay: 3500, stopOnInteraction: true })
    );

    const displayCategories = useMemo(() => {
        let rawList: (TCategory | TCategoryItem)[] = [];

        if (categories && categories.length > 0) {
            rawList = categories;
        } else if (clientCategoriesResponse?.data && Array.isArray(clientCategoriesResponse.data)) {
            rawList = clientCategoriesResponse.data;
        } else if (Array.isArray(clientCategoriesResponse)) {
            rawList = clientCategoriesResponse;
        }

        // Filter active categories and main parent categories
        const filtered = rawList.filter((cat) => {
            if (cat.isActive === false) return false;
            // Only keep top-level categories if parent_category_id exists
            if (cat.parent_category_id) return false;
            return true;
        });

        // Sort by order if available
        return filtered.sort((a, b) => {
            const orderA = a.order ?? a.sortOrder ?? 0;
            const orderB = b.order ?? b.sortOrder ?? 0;
            return orderA - orderB;
        });
    }, [categories, clientCategoriesResponse]);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    if (!isLoading && displayCategories.length === 0) {
        return null;
    }

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
                        I am Looking for...
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
                        type="button"
                        onClick={scrollPrev}
                        aria-label="Previous categories"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={scrollNext}
                        aria-label="Next categories"
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 🌟 Dynamic Carousel */}
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
                        loop: displayCategories.length > 5,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2.5 sm:-ml-3 md:-ml-4">
                        {displayCategories.map((category, idx) => (
                            <CarouselItem
                                key={category._id || idx}
                                className="pl-2.5 sm:pl-3 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[14.28%] xl:basis-[12.5%]"
                            >
                                <DynamicCategoryCard category={category} index={idx} />
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

const DynamicCategoryCard = ({
    category,
    index,
}: {
    category: TCategory | TCategoryItem;
    index: number;
}) => {
    const rawImage = category.imageUrl || (category as TCategoryItem).img || "";
    const [imgSrc, setImgSrc] = useState<string>(rawImage || DEFAULT_CATEGORY_FALLBACK);
    const [imgError, setImgError] = useState<boolean>(false);

    const accentBorder = pastelAccents[index % pastelAccents.length];

    return (
        <Link
            href={`/shop?category=${encodeURIComponent(category.slug)}`}
            className={`group cursor-pointer flex flex-col items-center justify-between p-3 sm:p-3.5 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-h-[135px] sm:min-h-[155px] ${accentBorder}`}
            aria-label={`Browse category ${category.name}`}
        >
            {/* Floating Bubble Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80 p-1 flex items-center justify-center shadow-inner group-hover:bg-amber-50/40 transition-colors">
                <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-slate-100">
                    {imgSrc && !imgError ? (
                        <Image
                            src={imgSrc}
                            alt={category.name || "Category"}
                            fill
                            sizes="(max-width: 768px) 70px, 90px"
                            className="object-cover group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500"
                            onError={() => {
                                if (imgSrc !== DEFAULT_CATEGORY_FALLBACK) {
                                    setImgSrc(DEFAULT_CATEGORY_FALLBACK);
                                } else {
                                    setImgError(true);
                                }
                            }}
                        />
                    ) : (
                        <Layers className="w-8 h-8 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    )}
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