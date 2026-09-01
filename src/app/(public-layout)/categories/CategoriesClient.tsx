"use client"

import { cn } from "@/lib/utils"
import { TProduct } from "@/types"
import {
    Layers,
    Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

export default function CategoriesClient({
    initialCategories,
    initialProducts,
    initialSlug
}: {
    initialCategories: any[],
    initialProducts: TProduct[],
    initialSlug: string | undefined
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const currentSlug = searchParams.get('cat') || initialSlug;

    const categories = initialCategories || [];
    const selectedCategory = categories.find(c => c.slug === currentSlug) || categories[0];

    const products = initialProducts || [];

    const handleCategoryClick = (cat: any) => {
        if (cat.slug === currentSlug) return;
        startTransition(() => {
            router.push(`/categories?cat=${cat.slug}`, { scroll: false });
        });
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-0 md:px-4 md:py-4">
                <div className="flex bg-white shadow-sm md:rounded-none  overflow-hidden h-[calc(100vh-60px)]  border-t md:border-none border-gray-100">

                    {/* LEFT SIDEBAR - Fixed Width for both Mobile & Desktop */}
                    <aside className="w-[120px] sm:w-[130px] md:w-[240px] border-r border-gray-100 flex flex-col bg-gray-50/20">
                        <div className="p-2 md:p-4 border-b border-gray-50 bg-white">
                            <h2 className="text-[12px] md:text-lg font-black text-black uppercase tracking-tight">For You</h2>
                        </div>

                        <nav className="flex-1 overflow-y-auto no-scrollbar py-1">
                            {categories?.map((cat: any) => {
                                const isActive = selectedCategory?._id === cat._id;
                                return (
                                    <button
                                        key={cat._id}
                                        onClick={() => handleCategoryClick(cat)}
                                        className={cn(
                                            "w-full text-left  py-1 md:py-2 px-2 md:px-4 text-xs md:text-sm transition-all relative outline-none",
                                            isActive
                                                ? "bg-white text-black font-bold shadow-[inset_4px_0_0_0_#000]"
                                                : "text-gray-500 hover:text-black hover:bg-white/50"
                                        )}
                                    >
                                        <span className="text-[12px] md:text-[14px] leading-tight block break-words">
                                            {cat.name}
                                        </span>
                                    </button>
                                )
                            })}
                        </nav>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-1 flex flex-col bg-white overflow-hidden">
                        {/* Compact Header */}
                        <header className="px-4 py-3 md:px-8 md:py-5 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-10">
                            <h1 className="text-sm md:text-xl font-bold text-gray-900 truncate">
                                {selectedCategory?.name}
                            </h1>
                            {isPending && (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            )}
                        </header>

                        {/* Product Grid */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-0 md:p-6">
                            <div
                                key={selectedCategory?._id}
                                className={cn(
                                    "transition-all duration-300 ease-in-out",
                                    isPending ? "opacity-50" : "opacity-100"
                                )}
                            >
                                {products.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  gap-1 md:gap-2 xl:gap-4">
                                        {products.map((product: TProduct) => (
                                            <Link
                                                key={product._id}
                                                href={`/products/${product.url_handle}`}
                                                className="group flex flex-col items-center text-center outline-none"
                                            >
                                                {/* Image Container */}
                                                <div className="relative aspect-square w-full mb-2 md:mb-3 overflow-hidden rounded-lg md:rounded-xl bg-gray-50">
                                                    <Image
                                                        src={product.thumbnail || "/placeholder.svg"}
                                                        alt={product.product_title}
                                                        fill
                                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                        className="object-contain p-1 md:p-2 group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>

                                                {/* Title & Price */}
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
                                ) : !isPending && (
                                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                                        <Layers className="h-12 w-12 text-gray-100 mb-2" />
                                        <p className="text-xs text-gray-400 font-medium">No Products Found</p>
                                    </div>
                                )}
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
