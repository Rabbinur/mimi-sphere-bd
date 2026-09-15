"use client";

import { useAllProductsQuery } from "@/components/Redux/RTK/productApi";
import { useAllCategoryQuery } from "@/components/Redux/RTK/categoryApi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { ItemCardClient as ItemCard } from "@/components/ui/ItemCardClient";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import { TCategory, TProduct } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

interface NewArrivalsSectionProps {
    initialProducts?: TProduct[];
    categories?: TCategory[];
}

export default function NewArrivalsSection({
    initialProducts = [],
    categories: serverCategories = [],
}: NewArrivalsSectionProps) {
    const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>("all");
    const [selectedSubCategorySlug, setSelectedSubCategorySlug] = useState<string | null>(null);
    const [api, setApi] = useState<CarouselApi>();

    const autoplayPlugin = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true })
    );

    // Dynamic categories if serverCategories is empty
    const { data: clientCategoriesResponse } = useAllCategoryQuery(false, {
        skip: Boolean(serverCategories && serverCategories.length > 0),
    });

    // All categories list
    const allCategoriesList = useMemo(() => {
        let list: TCategory[] = [];
        if (serverCategories && serverCategories.length > 0) {
            list = serverCategories;
        } else if (clientCategoriesResponse?.data && Array.isArray(clientCategoriesResponse.data)) {
            list = clientCategoriesResponse.data;
        } else if (Array.isArray(clientCategoriesResponse)) {
            list = clientCategoriesResponse;
        }
        return list.filter((cat) => cat.isActive !== false);
    }, [serverCategories, clientCategoriesResponse]);

    // Parent categories only
    const parentCategories = useMemo(() => {
        return allCategoriesList
            .filter((cat) => !cat.parent_category_id)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, [allCategoriesList]);

    // Subcategories mapped by parent category ID
    const subCategoriesMap = useMemo(() => {
        const map = new Map<string, TCategory[]>();
        allCategoriesList.forEach((cat) => {
            if (cat.parent_category_id) {
                const pId = typeof cat.parent_category_id === "string"
                    ? cat.parent_category_id
                    : (cat.parent_category_id as any)?._id || String(cat.parent_category_id);
                const list = map.get(pId) || [];
                list.push(cat);
                map.set(pId, list);
            }
        });
        return map;
    }, [allCategoriesList]);

    // Set of category IDs present in initial new arrival products (to hide empty categories)
    const categoryIdsWithProducts = useMemo(() => {
        const set = new Set<string>();
        initialProducts.forEach((prod) => {
            if (Array.isArray(prod.product_categories)) {
                prod.product_categories.forEach((cat) => {
                    const id = typeof cat === "string" ? cat : (cat as any)?._id || String(cat);
                    if (id) set.add(id);
                });
            }
        });
        return set;
    }, [initialProducts]);

    // Filter parent categories that have products (either in themselves or in their subcategories)
    const activeCategoriesWithProducts = useMemo(() => {
        if (initialProducts.length === 0) return parentCategories;

        return parentCategories.filter((parent) => {
            if (categoryIdsWithProducts.has(parent._id)) return true;
            // Check if any subcategory of this parent has products
            const subs = subCategoriesMap.get(parent._id) || [];
            return subs.some((s) => categoryIdsWithProducts.has(s._id));
        });
    }, [parentCategories, subCategoriesMap, categoryIdsWithProducts, initialProducts]);

    // Currently selected parent object
    const currentSelectedParent = useMemo(() => {
        if (selectedCategorySlug === "all") return null;
        return parentCategories.find((c) => c.slug === selectedCategorySlug) || null;
    }, [selectedCategorySlug, parentCategories]);

    // Subcategories of currently selected parent
    const currentSubCategories = useMemo(() => {
        if (!currentSelectedParent) return [];
        return subCategoriesMap.get(currentSelectedParent._id) || [];
    }, [currentSelectedParent, subCategoriesMap]);

    // Effective query slug (subcategory slug if selected, otherwise parent slug)
    const effectiveQuerySlug = selectedSubCategorySlug || selectedCategorySlug;
    const isAll = effectiveQuerySlug === "all";

    // Query for category-specific products if a category or subcategory tab is clicked
    const { data: categoryProductsResponse, isFetching } = useAllProductsQuery(
        {
            category: effectiveQuerySlug,
            sort: "latest",
            limit: 12,
        },
        {
            skip: isAll,
        }
    );

    // Current display products
    const displayProducts: TProduct[] = useMemo(() => {
        if (isAll) {
            return initialProducts;
        }
        return categoryProductsResponse?.data || [];
    }, [isAll, initialProducts, categoryProductsResponse]);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    // Handle Parent Tab Switch
    const handleParentTabChange = (slug: string) => {
        setSelectedCategorySlug(slug);
        setSelectedSubCategorySlug(null);
        if (api) {
            api.scrollTo(0);
        }
    };

    // Handle Subcategory Pill Switch
    const handleSubCategoryChange = (subSlug: string | null) => {
        setSelectedSubCategorySlug(subSlug);
        if (api) {
            api.scrollTo(0);
        }
    };

    return (
        <section className="container mx-auto px-2 md:px-4">
            <div className="bg-white rounded-2xl p-3 sm:p-5 md:p-6 border border-slate-200/80 shadow-sm space-y-3.5 md:space-y-4">
                
                {/* 🌟 Top Header: Title, Controls & View All */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                    <div>
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                                <Sparkles className="w-2.5 h-2.5 fill-slate-950 animate-spin-slow" />
                                Just Landed
                            </span>
                        </div>
                        <h2 className="text-base sm:text-lg md:text-2xl font-black text-slate-900 leading-tight">
                            New Arrivals & Trendsetters
                        </h2>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3">
                        <Link
                            href={isAll ? "/shop?sort=latest" : `/shop?category=${effectiveQuerySlug}&sort=latest`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#002447] hover:text-amber-600 transition-colors"
                        >
                            <span>Explore All New</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={scrollPrev}
                                aria-label="Previous products"
                                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={scrollNext}
                                aria-label="Next products"
                                className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-[#002447] hover:text-white flex items-center justify-center text-slate-700 shadow-sm transition-all active:scale-95"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 🌟 Parent Category Filter Pills / Tabs (Filtered to only show categories with products) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
                    <button
                        type="button"
                        onClick={() => handleParentTabChange("all")}
                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                            selectedCategorySlug === "all"
                                ? "bg-[#002447] text-white shadow-md shadow-navy-950/20 scale-[1.02]"
                                : "bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent"
                        }`}
                    >
                        ✨ All New
                    </button>

                    {activeCategoriesWithProducts.map((cat) => {
                        const isActive = selectedCategorySlug === cat.slug;
                        const subCount = (subCategoriesMap.get(cat._id) || []).length;

                        return (
                            <button
                                key={cat._id}
                                type="button"
                                onClick={() => handleParentTabChange(cat.slug)}
                                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-[#002447] text-white shadow-md shadow-navy-950/20 scale-[1.02]"
                                        : "bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-transparent"
                                }`}
                            >
                                <span>{cat.name}</span>
                                {subCount > 0 && (
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? "bg-amber-400 text-slate-950 font-black" : "bg-slate-200/80 text-slate-600"
                                    }`}>
                                        {subCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* 🌟 Subcategories Sub-Pills (Shown when active parent category has subcategories) */}
                {currentSubCategories.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pl-1 bg-slate-50/80 p-1.5 rounded-xl border border-slate-100 scroll-smooth">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 flex-shrink-0">
                            Subcategories:
                        </span>
                        <button
                            type="button"
                            onClick={() => handleSubCategoryChange(null)}
                            className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                selectedSubCategorySlug === null
                                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                            }`}
                        >
                            All {currentSelectedParent?.name}
                        </button>
                        {currentSubCategories.map((sub) => {
                            const isSubActive = selectedSubCategorySlug === sub.slug;
                            return (
                                <button
                                    key={sub._id}
                                    type="button"
                                    onClick={() => handleSubCategoryChange(sub.slug)}
                                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                        isSubActive
                                            ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                                            : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                                    }`}
                                >
                                    {sub.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 🌟 Products Slider Area */}
                {isFetching ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 py-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <ProductCardLoading key={i} />
                        ))}
                    </div>
                ) : displayProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <PackageOpen className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-600">
                            No new arrivals found in this category yet.
                        </p>
                        <button
                            type="button"
                            onClick={() => handleParentTabChange("all")}
                            className="mt-2 text-xs font-bold text-amber-600 hover:underline"
                        >
                            View All New Arrivals
                        </button>
                    </div>
                ) : (
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: displayProducts.length > 5,
                        }}
                        plugins={[autoplayPlugin.current]}
                        onMouseEnter={autoplayPlugin.current.stop}
                        onMouseLeave={autoplayPlugin.current.reset}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 sm:-ml-3 md:-ml-4">
                            {displayProducts.map((product) => (
                                <CarouselItem
                                    key={product._id}
                                    className="pl-2 sm:pl-3 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                                >
                                    <div className="h-full">
                                        <ItemCard product={product} />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
            </div>
        </section>
    );
}
