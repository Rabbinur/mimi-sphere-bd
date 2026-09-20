"use client";

import { cn } from "@/lib/utils";

import {
    ChevronDown,
    ChevronRight,
    LayoutGrid,
    Loader2,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { TProduct } from "@/types";
import { useAllCategoryQuery } from "../Redux/RTK/categoryApi";
import { useAllProductsQuery } from "../Redux/RTK/productApi";

const CategoriesBarClient = ({
    categories: initialCategories,
    initialProducts = [],
    initialCategorySlug
}: {
    categories: any[],
    initialProducts?: TProduct[],
    initialCategorySlug?: string
}) => {
    const hasInitialData = initialCategories && initialCategories.length > 0;

    // Fallback query if server side fetch failed or is empty
    const { data: categoriesData } = useAllCategoryQuery(
        { sub_categories: true, isActive: true, showInNavbar: true },
        { skip: hasInitialData }
    );

    const rawCategories = hasInitialData ? initialCategories : (categoriesData || []);

    // Filter categories and subcategories so hidden or inactive categories are excluded from All Categories mega-menu & navbar
    const categories = useMemo(() => {
        if (!Array.isArray(rawCategories)) return [];
        return rawCategories
            .filter((cat: any) => cat && cat.isActive !== false && cat.showInNavbar !== false)
            .map((cat: any) => ({
                ...cat,
                sub_categories: Array.isArray(cat.sub_categories)
                    ? cat.sub_categories.filter((sub: any) => sub && sub.isActive !== false && sub.showInNavbar !== false)
                    : []
            }));
    }, [rawCategories]);

    const isLoading = !hasInitialData && !categoriesData;

    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");
    const [hoveredCategory, setHoveredCategory] = useState<any>(null);
    const [pendingCategory, setPendingCategory] = useState<any>(null);
    const [hoveredSubCategory, setHoveredSubCategory] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Initial hover category
    useEffect(() => {
        if (categories && categories.length > 0) {
            if (!hoveredCategory || !categories.some((c: any) => c._id === hoveredCategory._id)) {
                setHoveredCategory(categories[0]);
            }
        }
    }, [categories, hoveredCategory]);

    // Debounce hoveredCategory changes; reset subcategory when parent changes
    useEffect(() => {
        if (!isOpen) return;
        if (!pendingCategory) return;

        const timer = setTimeout(() => {
            setHoveredCategory(pendingCategory);
            setHoveredSubCategory(null); // reset sub when parent changes
        }, 150);

        return () => clearTimeout(timer);
    }, [pendingCategory, isOpen]);

    // Active slug: subcategory takes priority over parent category
    const activeSlug = hoveredSubCategory?.slug || hoveredCategory?.slug;

    // Determine if we should skip the client-side product query
    const isInitialCategory = activeSlug === initialCategorySlug;
    const hasInitialProducts = isInitialCategory && initialProducts.length > 0;

    const { data: productData, isFetching: isProductsLoading } = useAllProductsQuery(
        { category: activeSlug, limit: 30 },
        { skip: !isOpen || !activeSlug || hasInitialProducts }
    );

    const recommendedProducts = hasInitialProducts ? initialProducts : (productData?.data || []);

    return (
        <div className="w-full border-b border-slate-100 bg-white shadow-2xs">
            <div className="container mx-auto px-3 sm:px-4 relative">
                <div className="flex h-11 items-center gap-3 md:gap-4">
                    {/* All Categories Trigger */}
                    <div
                        className="h-full flex items-center"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={cn(
                                "flex h-8 md:h-9 items-center gap-2 rounded-xl px-3 sm:px-3.5 text-xs md:text-[13px] font-bold transition-all focus:outline-none shrink-0 shadow-2xs",
                                isOpen
                                    ? "bg-[#002447] text-white shadow-md ring-2 ring-amber-400/40"
                                    : "bg-[#002447] text-white hover:bg-[#071f3a]"
                            )}
                        >
                            <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                            <span>All Categories</span>
                            <ChevronDown className={cn("w-3 h-3 text-slate-300 transition-transform duration-200", isOpen ? "rotate-180 text-amber-400" : "")} />
                        </button>

                        {/* Mega Menu Overlay */}
                        <div
                            className={cn(
                                "absolute left-4 right-4 top-full pt-2 flex transition-all duration-200 ease-in-out z-50",
                                isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible pointer-events-none"
                            )}
                        >
                            <div className="flex bg-white border border-slate-100 rounded-2xl overflow-hidden min-h-[500px] w-full shadow-2xl">
                                {/* Sidebar */}
                                <div className="w-[240px] border-r border-slate-100 py-2 bg-slate-50/50 flex flex-col">
                                    {isLoading ? (
                                        Array(12).fill(0).map((_, i) => (
                                            <div key={i} className="mx-4 my-3 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                                        ))
                                    ) : (
                                        categories?.map((cat: any) => {
                                            const Icon = cat.icon || ChevronRight;
                                            const isPreOrder = cat.slug === "pre-order";
                                            const isSelected = pendingCategory?._id === cat._id || hoveredCategory?._id === cat._id;
                                            return (
                                                <div
                                                    key={cat._id}
                                                    onMouseEnter={() => setPendingCategory(cat)}
                                                    className={cn(
                                                        "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors",
                                                        isSelected
                                                            ? "bg-white text-[#002447] font-bold border-l-4 border-amber-500 shadow-sm"
                                                            : "text-slate-600 hover:bg-white hover:text-slate-900",
                                                        isPreOrder && "text-amber-600"
                                                    )}
                                                >
                                                    <Icon className={cn("h-4 w-4", isSelected ? (isPreOrder ? "text-amber-600" : "text-[#002447]") : (isPreOrder ? "text-amber-500" : "text-slate-400"))} />
                                                    <span className={cn("flex-1 truncate", isPreOrder && "font-bold text-amber-600")}>{cat.name}</span>
                                                    <ChevronRight className="h-3 w-3 opacity-30" />
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                                {/* Category Content */}
                                <div className="flex-1 p-6 overflow-y-auto no-scrollbar max-h-[600px]">
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h3 className="text-[15px] font-bold text-[#002447] uppercase tracking-tight">
                                                    {hoveredSubCategory
                                                        ? `${hoveredSubCategory.name}`
                                                        : `Recommended in ${hoveredCategory?.name}`
                                                    }
                                                </h3>
                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                    {hoveredSubCategory
                                                        ? `in ${hoveredCategory?.name} · hover a pill to explore more`
                                                        : hoveredCategory?.sub_categories?.length > 0
                                                            ? "Hover a subcategory to explore"
                                                            : "Top products"
                                                    }
                                                </p>
                                            </div>
                                            {isProductsLoading && <Loader2 className="h-4 w-4 animate-spin text-amber-500" />}
                                        </div>

                                        {/* Subcategories Pills inside Mega Menu */}
                                        {hoveredCategory?.sub_categories && hoveredCategory.sub_categories.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-1.5 mb-5 pb-3 border-b border-slate-100">
                                                {/* "All" pill */}
                                                <button
                                                    onMouseEnter={() => setHoveredSubCategory(null)}
                                                    onClick={() => { setIsOpen(false); window.location.href = `/shop?category=${hoveredCategory.slug}`; }}
                                                    className={cn(
                                                        "px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
                                                        !hoveredSubCategory
                                                            ? "bg-[#002447] text-white"
                                                            : "bg-slate-100 text-slate-700 hover:bg-[#002447]/10 hover:text-[#002447]"
                                                    )}
                                                >
                                                    All {hoveredCategory.name}
                                                </button>
                                                {hoveredCategory.sub_categories.map((sub: any) => (
                                                    <button
                                                        key={sub._id}
                                                        onMouseEnter={() => setHoveredSubCategory(sub)}
                                                        onClick={() => { setIsOpen(false); window.location.href = `/shop?category=${sub.slug}`; }}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                                                            hoveredSubCategory?._id === sub._id
                                                                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                                                                : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border-slate-200/60"
                                                        )}
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {recommendedProducts.length > 0 ? (
                                            <div className="grid grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-4">
                                                {recommendedProducts.map((product: TProduct) => (
                                                    <Link
                                                        key={product._id}
                                                        href={`/products/${product.url_handle}`}
                                                        className="flex flex-col items-center gap-3 group cursor-pointer"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-slate-50 group-hover:scale-105 transition-all duration-300 border border-slate-100 group-hover:border-amber-400/40 group-hover:shadow-lg">
                                                            <Image
                                                                src={product.thumbnail || "/logo.png"}
                                                                alt={product.product_title}
                                                                fill
                                                                sizes="112px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[11px] font-medium text-center text-slate-700 leading-tight group-hover:text-[#002447] line-clamp-2 px-1 transition-colors">
                                                                {product.product_title}
                                                            </span>
                                                            <span className="text-[13px] font-bold text-amber-600">৳{product.product_price}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : !isProductsLoading ? (
                                            <div className="h-40 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-100 rounded-2xl">
                                                No products found in this category
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                                                {Array(18).fill(0).map((_, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                                        <div className="h-28 w-28 rounded-2xl bg-slate-100" />
                                                        <div className="h-3 w-20 bg-slate-100 rounded" />
                                                        <div className="h-4 w-12 bg-slate-100 rounded" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Nav Items — dynamic categories controlled by admin */}
                    <nav className="no-scrollbar flex flex-1 items-center gap-1 sm:gap-1.5 overflow-x-auto overflow-y-visible py-1">
                        {categories?.map((cat: any) => {
                            const isSelected = activeCategory === cat.slug;
                                const isPreOrder = cat.slug === "pre-order";

                                return (
                                    <Link
                                        key={cat._id}
                                        href={`/shop?category=${cat.slug}`}
                                        className={cn(
                                            "whitespace-nowrap text-xs md:text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 flex items-center gap-1.5",
                                            isSelected
                                                ? "bg-[#002447] text-white font-bold shadow-xs"
                                                : isPreOrder
                                                ? "bg-amber-50 text-amber-800 border border-amber-200/80 font-bold hover:bg-amber-100"
                                                : "text-slate-700 hover:text-[#002447] hover:bg-slate-100/90"
                                        )}
                                    >
                                        {isPreOrder && <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />}
                                        <span>{cat.name}</span>
                                    </Link>
                                );
                            })}
                    </nav>

                    {/* Right Side Quick Highlights */}
                    <div className="hidden lg:flex items-center gap-2 shrink-0 border-l border-slate-200/70 pl-3">
                        <Link
                            href="/shop"
                            className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#002447] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-all"
                        >
                            <span>Shop All</span>
                        </Link>
                        <Link
                            href="/shop/pre-order"
                            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs hover:shadow-xs hover:scale-105 transition-all"
                        >
                            <Sparkles className="w-3 h-3 text-white" />
                            <span>Pre-Order</span>
                        </Link>
                    </div>

                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default CategoriesBarClient;