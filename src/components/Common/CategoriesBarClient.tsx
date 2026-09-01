"use client";

import { cn } from "@/lib/utils";

import {
    ChevronRight,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
    const { data: categoriesData } = useAllCategoryQuery(undefined, {
        skip: hasInitialData
    });

    const categories = hasInitialData ? initialCategories : (categoriesData || []);
    const isLoading = !hasInitialData && !categoriesData;

    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category");
    const [hoveredCategory, setHoveredCategory] = useState<any>(null);
    const [pendingCategory, setPendingCategory] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    // Initial hover category
    useEffect(() => {
        if (categories && categories.length > 0 && !hoveredCategory) {
            setHoveredCategory(categories[0]);
        }
    }, [categories, hoveredCategory]);

    // Debounce hoveredCategory changes
    useEffect(() => {
        if (!isOpen) return;
        if (!pendingCategory) return;

        const timer = setTimeout(() => {
            setHoveredCategory(pendingCategory);
        }, 150); // 150ms debounce delay

        return () => clearTimeout(timer);
    }, [pendingCategory, isOpen]);

    // Determine if we should skip the client-side product query
    const isInitialCategory = hoveredCategory?.slug === initialCategorySlug;
    const hasInitialProducts = isInitialCategory && initialProducts.length > 0;

    const { data: productData, isFetching: isProductsLoading } = useAllProductsQuery(
        { category: hoveredCategory?.slug, limit: 30 },
        { skip: !isOpen || !hoveredCategory || hasInitialProducts }
    );

    const recommendedProducts = hasInitialProducts ? initialProducts : (productData?.data || []);

    return (
        <div className="w-full border-b border-t border-primary/10 bg-white">
            <div className="container mx-auto px-4 relative">
                <div className="flex h-12 items-center gap-4">
                    {/* All Categories Trigger */}
                    <div
                        className="h-full"
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        <button className={cn(
                            "flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-bold transition-all focus:outline-none mt-1.5",
                            isOpen ? "bg-gray-100 text-black shadow-inner" : "bg-[#f5f5f5] text-gray-800"
                        )}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 6H21"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M3 12H17"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                <path
                                    d="M3 18H21"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span>All Categories</span>
                        </button>

                        {/* Mega Menu Overlay */}
                        <div
                            className={cn(
                                "absolute left-4 right-4 top-full pt-2 flex transition-all duration-200 ease-in-out",
                                isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible pointer-events-none"
                            )}
                        >
                            <div className="flex bg-white border border-gray-100 overflow-hidden min-h-[500px] w-full shadow-xl">
                                {/* Sidebar */}
                                <div className="w-[240px] border-r border-gray-50 py-2 bg-white flex flex-col">
                                    {isLoading ? (
                                        Array(12).fill(0).map((_, i) => (
                                            <div key={i} className="mx-4 my-3 h-4 w-3/4 animate-pulse rounded bg-gray-50" />
                                        ))
                                    ) : (
                                        categories?.map((cat: any) => {
                                            const Icon = cat.icon || ChevronRight;
                                            const isPreOrder = cat.slug === "pre-order";
                                            return (
                                                <div
                                                    key={cat._id}
                                                    onMouseEnter={() => setPendingCategory(cat)}
                                                    className={cn(
                                                        "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors",
                                                        (pendingCategory?._id === cat._id || hoveredCategory?._id === cat._id)
                                                            ? "bg-gray-50 text-black font-semibold"
                                                            : "text-gray-600 hover:bg-gray-50",
                                                        isPreOrder && "text-orange-600"
                                                    )}
                                                >
                                                    <Icon className={cn("h-4 w-4", (pendingCategory?._id === cat._id || hoveredCategory?._id === cat._id) ? (isPreOrder ? "text-orange-600" : "text-black") : (isPreOrder ? "text-orange-500" : "text-gray-400"))} />
                                                    <span className={cn("flex-1 truncate", isPreOrder && "font-bold text-orange-600")}>{cat.name}</span>
                                                    <ChevronRight className="h-3 w-3 opacity-30" />
                                                </div>
                                            )
                                        })
                                    )}
                                </div>

                                {/* Category Content */}
                                <div className="flex-1 p-6 overflow-y-auto no-scrollbar max-h-[600px]">
                                    <div className="mb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-[15px] font-bold text-black uppercase tracking-tight">Recommended in {hoveredCategory?.name}</h3>
                                            {isProductsLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                                        </div>

                                        {recommendedProducts.length > 0 ? (
                                            <div className="grid grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8  gap-2 md:gap-4">
                                                {recommendedProducts.map((product: TProduct) => (
                                                    <Link
                                                        key={product._id}
                                                        href={`/products/${product.url_handle}`}
                                                        className="flex flex-col items-center gap-3 group cursor-pointer"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="relative h-28 w-28 overflow-hidden rounded-xl bg-gray-50 group-hover:scale-105 transition-all duration-300 border border-gray-100 group-hover:border-black/5 group-hover:shadow-lg">
                                                            <Image
                                                                src={product.thumbnail || "/logo.png"}
                                                                alt={product.product_title}
                                                                fill
                                                                sizes="112px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center gap-1">
                                                            <span className="text-[11px] font-medium text-center text-gray-600 leading-tight group-hover:text-black line-clamp-2 px-1 transition-colors">
                                                                {product.product_title}
                                                            </span>
                                                            <span className="text-[13px] font-bold text-black">৳{product.product_price}</span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : !isProductsLoading ? (
                                            <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic border-2 border-dashed border-gray-50 rounded-xl">
                                                No products found in this category
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                                                {Array(18).fill(0).map((_, i) => (
                                                    <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                                        <div className="h-28 w-28 rounded-xl bg-gray-50" />
                                                        <div className="h-3 w-20 bg-gray-50 rounded" />
                                                        <div className="h-4 w-12 bg-gray-50 rounded" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Horizontal Nav Items */}
                    <nav className="no-scrollbar flex flex-1 items-center gap-x-6 overflow-x-auto">
                        {categories?.slice(0, 10).map((cat: any) => {
                            const isPreOrder = cat.slug === "pre-order";
                            return (
                                <Link
                                    key={cat._id}
                                    href={`/shop/${cat.slug}`}
                                    className={cn(
                                        "whitespace-nowrap text-[13px] md:text-[14px] font-medium transition-all hover:text-primary",
                                        isPreOrder
                                            ? "bg-orange-50 text-orange-600 px-3 py-1 rounded-full border border-orange-100 font-bold hover:bg-orange-100"
                                            : "text-gray-800",
                                        activeCategory === cat.slug ? "text-primary font-bold" : ""
                                    )}
                                >
                                    {cat.name}
                                </Link>
                            )
                        })}
                    </nav>



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