"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

/* ---------------- Types ---------------- */
interface TCategory {
    _id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    productCount?: number;
}

interface CategoriesSectionProps {
    categories?: TCategory[];
}

/* ---------------- Component ---------------- */
export default function CategoriesSection({ categories }: CategoriesSectionProps) {
    const router = useRouter();
    const plugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    return (

        <div className="container mx-auto px-2 md:px-4 relative my-4 md:my-6">
            <h2 className="sr-only">Product Categories</h2>
            {!categories ? (
                <div className="flex justify-center gap-6 overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : (
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[plugin.current]}
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {categories.map((category) => (
                            <CarouselItem
                                key={category._id}
                                className="pl-2 md:pl-4 basis-1/4 sm:basis-1/5 lg:basis-[14.28%] xl:basis-[11.11%]"
                            >
                                <CategoryCard
                                    category={category}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>


                </Carousel>
            )}
        </div>

    );
}

/* ---------------- Sub Components ---------------- */

const CategoryCard = ({ category }: { category: TCategory }) => (
    <Link
        href={`/shop/${category.slug}`}
        className="group cursor-pointer flex flex-col items-center gap-2 py-2 transition-all duration-300"
        aria-label={`Browse category ${category.name}`}
    >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md">
            <Image
                src={category.imageUrl || "https://via.placeholder.com/150"}
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

const SkeletonCard = () => (
    <div className="flex flex-col items-center gap-3 animate-pulse min-w-[100px]">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gray-100" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
);