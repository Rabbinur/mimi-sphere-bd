"use client";

import ProductCard from "@/components/ui/ProductCard";
import { TProduct } from "@/types";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
    products: TProduct[];
    category: string | null;
    brand: string | null;
    variantFilters: Record<string, string[]>;
    sort: string;
    pagination?: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
        limit: number;
    };
}

export default function ProductGrid({
    products: initialProducts,
    category,
    brand,
    variantFilters,
    sort,
    pagination: initialPagination,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();

    // State for infinite scroll
    const [products, setProducts] = useState<TProduct[]>(initialProducts);
    const [page, setPage] = useState(initialPagination?.currentPage || 1);
    const [hasMore, setHasMore] = useState(
        initialPagination ? initialPagination.currentPage < initialPagination.totalPages : false
    );
    const [isLoading, setIsLoading] = useState(false);
    const [gridLayout, setGridLayout] = useState(4);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset state when initial products or filters change
    useEffect(() => {
        setProducts(initialProducts);
        setPage(initialPagination?.currentPage || 1);
        setHasMore(initialPagination ? initialPagination.currentPage < initialPagination.totalPages : false);
    }, [initialProducts, initialPagination]);

    // Intersection Observer logic
    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && hasMore && !isLoading) {
                loadMoreProducts();
            }
        },
        [hasMore, isLoading, page, category, brand, variantFilters, sort]
    );

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: "200px",
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [handleObserver]);

    const loadMoreProducts = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        const nextPage = page + 1;
        const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
        const baseUrl = apiBase?.endsWith("/") ? apiBase.slice(0, -1) : apiBase;

        const params = new URLSearchParams({
            page: nextPage.toString(),
            limit: "12",
            sort,
        });

        if (category) params.set("category", category);
        if (brand) params.set("brand", brand);
        Object.entries(variantFilters).forEach(([name, values]) => {
            values.forEach((val) => {
                if (val) params.append(`variant_${name.toLowerCase()}`, val);
            });
        });

        try {
            const res = await fetch(`${baseUrl}/products?${params}`);
            if (res.ok) {
                const json = await res.json();
                const newProducts = json.data || [];
                setProducts((prev) => [...prev, ...newProducts]);
                setPage(nextPage);
                setHasMore(json.pagination ? json.pagination.currentPage < json.pagination.totalPages : false);
            }
        } catch (error) {
            console.error("Error loading more products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const handler = (e: Event) => {
            const newLayout = (e as CustomEvent<number>).detail;
            if (newLayout > 1) setGridLayout(newLayout);
        };
        window.addEventListener("grid-layout-change", handler);
        return () => window.removeEventListener("grid-layout-change", handler);
    }, []);

    const getGridClass = () => {
        switch (gridLayout) {
            case 2: return "md:grid-cols-2";
            case 3: return "md:grid-cols-3";
            case 5: return "md:grid-cols-5";
            default: return "md:grid-cols-4";
        }
    };

    const handleResetFilters = () => router.push(pathname);

    if (products.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl mb-5">
                    📦
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">No products found</h2>
                <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
                    We couldn't find anything matching your filters. Try adjusting them.
                </p>
                <button
                    onClick={handleResetFilters}
                    className="px-5 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                    Reset Filters
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            <p className="hidden md:block text-xs text-slate-400 mb-2 md:mb-4 font-medium uppercase tracking-wider">
                Showing <span className="text-slate-700 font-bold">{products.length}</span>{" "}
                product{products.length !== 1 ? "s" : ""}
            </p>

            <div className={clsx("grid grid-cols-2 gap-2 md:gap-3 lg:gap-4", getGridClass())}>
                {products.map((product, index) => (
                    <ProductCard key={`${product._id}-${index}`} product={product} />
                ))}
            </div>

            {/* Sentinel for Infinite Scroll */}
            <div ref={observerTarget} className="w-full h-20 flex items-center justify-center mt-8">
                {isLoading && (
                    <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium">Loading more products...</span>
                    </div>
                )}

            </div>
        </div>
    );
}