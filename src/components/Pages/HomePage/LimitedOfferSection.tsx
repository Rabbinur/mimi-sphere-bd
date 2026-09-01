import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardLoading from "@/components/ui/ProductCardLoading";
import TitleBadge from "@/components/ui/TitleBadge";
import type { TProduct } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface LimitedOfferSectionProps {
  products?: TProduct[];
}

export default function LimitedOfferSection({ products }: LimitedOfferSectionProps) {
  const isLoading = !products;

  return (
    <section className="container mx-auto px-2 md:px-4">
      <div className="bg-white rounded-sm overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between p-2 md:p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <div className="md:hidden">
              <h2 className="text-sm md:text-base font-bold uppercase tracking-tight">
                <TitleBadge title="Flash Sale" />
              </h2>
            </div>
            <div className="hidden md:block">
              <h2 className="text-sm md:text-base font-bold uppercase tracking-tight">
                <TitleBadge title="Limited-Time Offers" />
              </h2>
            </div>

          </div>
          <div className="flex items-center gap-2">
            <CountdownTimer expiryDays={3} title="Ends in" />

          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-[4px] sm:gap-2 auto-rows-fr items-stretch">

          {/* Promo Card */}
          <div className="relative overflow-hidden rounded-lg md:rounded-xl text-white h-full min-h-[200px] md:min-h-[400px] group col-span-2 lg:col-span-1">
            <Image
              src="/assets/limited-time.png"
              alt="Super Sale"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority
              sizes="(max-width: 1024px) 100vw, 20vw"
            />

            <div className="relative z-10 p-2 md:p-4 flex flex-col h-full">
              <Link href="/shop">
                <Button
                  className="w-fit mt-auto mb-2 md:mb-6 text-xs md:text-sm group-hover:bg-white group-hover:text-primary transition-all duration-300"
                  size="sm"
                >
                  Shop Now →
                </Button>
              </Link>
            </div>
          </div>

          {/* Loading */}
          {isLoading &&
            Array.from({ length: 7 }).map((_, index) => (
              <ProductCardLoading key={index} />
            ))}

          {/* Products */}
          {!isLoading &&
            (products.length > 0 ? (
              products.slice(0, 9).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center py-6 text-gray-500 text-sm">
                No products available.
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}
