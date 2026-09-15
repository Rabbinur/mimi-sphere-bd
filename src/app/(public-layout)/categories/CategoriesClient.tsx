"use client"

import { cn } from "@/lib/utils"
import { TProduct } from "@/types"
import {
    ArrowRight,
    ChevronRight,
    FolderOpen,
    Layers,
    Loader2,
    ShoppingBag,
    Tag,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useTransition } from "react"

interface TCategory {
    _id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    parent_category_id?: string | null;
    sub_categories?: TCategory[];
}

export default function CategoriesClient({
    initialCategories,
    initialProducts,
    initialSlug
}: {
    initialCategories: TCategory[],
    initialProducts: TProduct[],
    initialSlug: string | undefined
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const currentSlug = searchParams.get('cat') || initialSlug;

    // Only show root (parent) categories in sidebar
    const rootCategories = useMemo(() =>
        (initialCategories || []).filter(c => !c.parent_category_id),
        [initialCategories]
    );

    const selectedCategory = useMemo(() =>
        rootCategories.find(c => c.slug === currentSlug) || rootCategories[0],
        [rootCategories, currentSlug]
    );

    const hasSubcategories = Array.isArray(selectedCategory?.sub_categories) &&
        selectedCategory!.sub_categories!.length > 0;

    const products = initialProducts || [];

    const handleCategoryClick = (cat: TCategory) => {
        if (cat.slug === currentSlug) return;
        startTransition(() => {
            router.push(`/categories?cat=${cat.slug}`, { scroll: false });
        });
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-0 md:px-4 md:py-4">
                <div className="flex bg-white shadow-sm md:rounded-xl overflow-hidden h-[calc(100vh-60px)] border-t md:border border-gray-100">

                    {/* LEFT SIDEBAR */}
                    <aside className="w-[110px] sm:w-[130px] md:w-[220px] border-r border-gray-100 flex flex-col bg-slate-50/40 flex-shrink-0">
                        <div className="p-2 md:p-4 border-b border-gray-100 bg-white">
                            <h2 className="text-[11px] md:text-sm font-black text-slate-900 uppercase tracking-tight">Categories</h2>
                        </div>

                        <nav className="flex-1 overflow-y-auto no-scrollbar py-1">
                            {rootCategories.map((cat) => {
                                const isActive = selectedCategory?._id === cat._id;
                                const hasSubs = Array.isArray(cat.sub_categories) && cat.sub_categories.length > 0;
                                return (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={cn(
                                            "w-full text-left flex flex-col items-center md:flex-row md:items-center gap-1 md:gap-2.5 py-2.5 md:py-3 px-2 md:px-4 transition-all relative outline-none",
                                            isActive
                                                ? "bg-white text-[#002447] font-bold shadow-[inset_3px_0_0_0_#002447]"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-white/70"
                                        )}
                                    >
                                        {cat.imageUrl ? (
                                            <div className={cn(
                                                "w-10 h-10 md:w-8 md:h-8 rounded-lg overflow-hidden flex-shrink-0 border transition-all",
                                                isActive ? "border-[#002447]/20" : "border-slate-200"
                                            )}>
                                                <Image
                                                    src={cat.imageUrl}
                                                    alt={cat.name}
                                                    width={40}
                                                    height={40}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                "w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                                isActive ? "bg-[#002447]/10" : "bg-slate-100"
                                            )}>
                                                <FolderOpen className={cn("w-4 h-4", isActive ? "text-[#002447]" : "text-slate-400")} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0 flex flex-col">
                                            <span className="text-[10px] md:text-[13px] leading-tight break-words text-center md:text-left">
                                                {cat.name}
                                            </span>
                                            {hasSubs && (
                                                <span className="hidden md:block text-[10px] text-slate-400 font-normal mt-0.5">
                                                    {cat.sub_categories!.length} subcategories
                                                </span>
                                            )}
                                        </div>
                                        {hasSubs && (
                                            <ChevronRight className={cn(
                                                "hidden md:block w-3.5 h-3.5 flex-shrink-0",
                                                isActive ? "text-[#002447]" : "text-slate-300"
                                            )} />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-white overflow-hidden">
                        {/* Header */}
                        <header className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                            <div>
                                <h1 className="text-sm md:text-lg font-bold text-gray-900">
                                    {selectedCategory?.name}
                                </h1>
                                {hasSubcategories && (
                                    <p className="text-[11px] text-slate-400 hidden md:block mt-0.5">
                                        Select a subcategory or{" "}
                                        <Link href={`/shop?category=${selectedCategory?.slug}`} className="text-amber-600 font-semibold hover:underline">
                                            view all products →
                                        </Link>
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                                {hasSubcategories && (
                                    <Link
                                        href={`/shop?category=${selectedCategory?.slug}`}
                                        className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#002447] hover:text-amber-600 transition-colors bg-slate-50 hover:bg-amber-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-200"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        View All
                                    </Link>
                                )}
                            </div>
                        </header>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-3 md:p-6">
                            <div
                                key={selectedCategory?._id}
                                className={cn(
                                    "transition-all duration-300 ease-in-out",
                                    isPending ? "opacity-50 pointer-events-none" : "opacity-100"
                                )}
                            >
                                {hasSubcategories ? (
                                    /* ── Subcategory Cards ── */
                                    <div>
                                        {/* Mobile: "View All" banner */}
                                        <Link
                                            href={`/shop?category=${selectedCategory?.slug}`}
                                            className="md:hidden flex items-center justify-between w-full mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#002447]"
                                        >
                                            <span>All {selectedCategory?.name}</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                            {selectedCategory!.sub_categories!.map((sub) => (
                                                <Link
                                                    key={sub._id}
                                                    href={`/shop?category=${sub.slug}`}
                                                    className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                                                >
                                                    {/* Image / icon */}
                                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white border border-slate-100 group-hover:border-amber-300 group-hover:shadow-sm transition-all flex items-center justify-center">
                                                        {sub.imageUrl ? (
                                                            <Image
                                                                src={sub.imageUrl}
                                                                alt={sub.name}
                                                                width={80}
                                                                height={80}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <Tag className="w-7 h-7 text-amber-400 group-hover:text-amber-500 transition-colors" />
                                                        )}
                                                    </div>

                                                    <div className="text-center">
                                                        <h3 className="text-xs md:text-sm font-bold text-slate-800 group-hover:text-[#002447] leading-tight transition-colors">
                                                            {sub.name}
                                                        </h3>
                                                        {sub.description && (
                                                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 hidden md:block">
                                                                {sub.description}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Hover arrow */}
                                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* "View All" card */}
                                            <Link
                                                href={`/shop?category=${selectedCategory?.slug}`}
                                                className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#002447]/5 hover:bg-[#002447] border border-[#002447]/20 hover:border-[#002447] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 min-h-[130px]"
                                            >
                                                <ShoppingBag className="w-7 h-7 text-[#002447] group-hover:text-amber-400 transition-colors" />
                                                <span className="text-xs font-bold text-[#002447] group-hover:text-white transition-colors text-center leading-tight">
                                                    All {selectedCategory?.name}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                ) : products.length > 0 ? (
                                    /* ── Product Grid (no subcategories) ── */
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                                        {products.map((product: TProduct) => (
                                            <Link
                                                key={product._id}
                                                href={`/products/${product.url_handle}`}
                                                className="group flex flex-col items-center text-center outline-none"
                                            >
                                                <div className="relative aspect-square w-full mb-2 md:mb-3 overflow-hidden rounded-lg md:rounded-xl bg-gray-50 border border-slate-100 group-hover:border-amber-300 group-hover:shadow-md transition-all">
                                                    <Image
                                                        src={product.thumbnail || "/placeholder.svg"}
                                                        alt={product.product_title}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, 25vw"
                                                        className="object-contain p-1 md:p-2 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="space-y-1 w-full">
                                                    <h3 className="text-[10px] md:text-[13px] text-gray-700 font-medium line-clamp-2 leading-[1.3] px-1">
                                                        {product.product_title}
                                                    </h3>
                                                    <p className="text-[11px] md:text-[15px] font-bold text-black italic">
                                                        ৳{product.product_price}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : !isPending ? (
                                    /* ── Empty State ── */
                                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Layers className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-slate-500">No Products Found</p>
                                            <p className="text-xs text-slate-400 mt-1">Check back later for new arrivals!</p>
                                        </div>
                                        <Link href="/shop" className="text-xs font-semibold text-[#002447] hover:text-amber-600 underline underline-offset-2 transition-colors">
                                            Browse all products →
                                        </Link>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}
