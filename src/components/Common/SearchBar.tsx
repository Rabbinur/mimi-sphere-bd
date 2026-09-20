"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { TProduct } from "@/types";
import { useAllProductsQuery } from "../Redux/RTK/productApi";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
    onResultClick?: () => void;
}

export const SearchBar = ({ onResultClick }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const debouncedSearch = useDebounce(searchQuery.trim(), 250);

    const { data, isFetching } = useAllProductsQuery(
        { searchTerm: debouncedSearch, limit: 10 },
        { skip: !debouncedSearch }
    );

    const products = data?.data || [];

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCloseSearch = () => {
        setIsOpen(false);
        if (onResultClick) onResultClick();
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsOpen(false);
            router.push(`/shop?searchTerm=${encodeURIComponent(searchQuery.trim())}`);
            if (onResultClick) onResultClick();
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
                <div className="relative w-full flex items-center bg-slate-50/90 hover:bg-white focus-within:bg-white rounded-full border border-slate-200/90 hover:border-amber-400/80 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-400/15 shadow-2xs transition-all duration-200 h-10 md:h-11 px-3.5">
                    <Search className="w-4 h-4 text-amber-500/90 shrink-0 mr-2 transition-colors" />

                    <Input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        placeholder="Search for jewellery, bangles, bags, accessories..."
                        className="flex-1 rounded-none border-none focus-visible:ring-0 bg-transparent h-full text-xs sm:text-sm font-medium p-0 text-slate-900 placeholder:text-slate-400"
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 mr-1.5 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}

                    <Button
                        type="submit"
                        aria-label="Search"
                        className="rounded-full bg-[#002447] hover:bg-[#071f3a] active:scale-95 text-white h-7 md:h-8 px-3.5 text-xs font-bold transition-all shadow-2xs shrink-0 flex items-center gap-1.5"
                    >
                        {isFetching ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        ) : (
                            <Search className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        <span className="hidden sm:inline">Search</span>
                    </Button>
                </div>
            </form>

            {/* Search Results Dropdown */}
            {isOpen && debouncedSearch && (
                <div className="absolute z-[100] mt-2 left-0 right-0 bg-white border border-slate-200/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                    {isFetching ? (
                        <div className="p-8 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                            <p className="text-xs text-slate-500 font-medium">Searching for "{debouncedSearch}"...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Search className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">No products found for "{debouncedSearch}"</p>
                            <p className="text-xs text-slate-400 mt-1">Try checking your spelling or search for categories like "bangles", "bags", or "watch".</p>
                        </div>
                    ) : (
                        <div>
                            <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    Found {products.length} {products.length === 1 ? "Product" : "Products"}
                                </span>
                                <span className="text-[11px] text-amber-700 font-semibold">
                                    Instant Results
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
                                {products.map((product: TProduct) => {
                                    const hasDiscount = Boolean(
                                        product.compare_at_price &&
                                        product.compare_at_price > product.product_price
                                    );

                                    return (
                                        <Link
                                            key={product._id}
                                            href={`/products/${product.url_handle}`}
                                            className="flex items-center gap-3.5 px-4 py-3 hover:bg-amber-50/40 transition-colors group cursor-pointer"
                                            onClick={handleCloseSearch}
                                        >
                                            <div className="relative h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 group-hover:border-amber-400 transition-colors shadow-2xs">
                                                <Image
                                                    src={product?.thumbnail || "/logo.png"}
                                                    alt={product.product_title}
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate group-hover:text-[#002447] transition-colors">
                                                    {product.product_title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs font-bold text-amber-600">
                                                        ৳{product.product_price}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-[11px] text-slate-400 line-through">
                                                            ৳{product.compare_at_price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="p-2.5 bg-slate-50 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleFormSubmit}
                                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-50 text-[#002447] hover:text-amber-700 text-xs font-bold border border-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>View all results for &ldquo;{debouncedSearch}&rdquo;</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};