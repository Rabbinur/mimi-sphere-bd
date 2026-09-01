"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HotDealsSection = ({ products }: { products: any[] | null }) => {
  if (!products || products.length === 0) return null;

  return (
    <section
      className="container mx-auto px-2 md:px-4"
      id="daily-best-sells-header"
    >
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100 ">
        {/* Header with Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-2 md:p-4 bg-white border-b border-gray-100 gap-2 md:gap-4">
          <div className="flex items-center gap-2 text-primary text-sm md:text-base font-bold uppercase tracking-tight">
            <Timer size={20} className="animate-pulse" />
            <h2 className="text-sm md:text-base font-bold uppercase tracking-tight">
              Hot Deals! Get Our Best Prices
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <CountdownTimer expiryDays={1} title="Hurry up! Offer ends In" />
          </div>
        </div>

        {/* Main Content Area (Full Width) */}
        <div className="grid grid-cols-1 overflow-hidden">
          {/* Products Carousel */}
          <div className="col-span-1 relative group/carousel">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-0">
                {products.map((product) => (
                  <CarouselItem
                    key={product._id}
                    className="pl-0 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <Link
                      href={`/products/${product.url_handle}`}
                      className="h-full p-2 md:p-4 border-l border-b border-gray-100 flex flex-col group hover:bg-slate-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={product.thumbnail || "/assets/kids.webp"}
                          alt={product.product_title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow space-y-2">
                        <h3 className="text-[12px] sm:text-sm font-semibold line-clamp-2 text-gray-800 leading-tight hover:text-primary mb-1">
                          {product.product_title}
                        </h3>
                        <p className="text-primary font-extrabold text-lg">
                          ৳{product.product_price?.toLocaleString()}
                        </p>

                        {/* Simulated Inventory Progress */}
                        <div className="space-y-1.5 pt-2">
                          <Progress
                            aria-label="Stock availability level"
                            value={Math.min(
                              100,
                              ((product.quantity || 0) /
                                ((product.quantity || 0) + 20)) *
                                100,
                            )}
                            className="h-1.5 bg-gray-100"
                          />
                          <p className="text-[11px] text-gray-500 font-medium uppercase">
                            Stock Level:{" "}
                            <span className="text-gray-800 font-bold">
                              {(product.quantity || 0) > 10 ? "High" : "Low"}
                            </span>{" "}
                            ({product.quantity || 0} items)
                          </p>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4">
                        <Button
                          aria-label={`Buy ${product.product_title} now`}
                          className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold py-5 shadow-sm"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation Arrows */}
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-md z-10" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-white/90 hover:bg-white shadow-md z-10" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotDealsSection;
