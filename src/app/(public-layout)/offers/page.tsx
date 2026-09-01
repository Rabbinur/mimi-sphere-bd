import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/ui/ProductCard";
import { fetchData } from "@/lib/server-api";
import {
  Flame,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Offers & Hot Deals | Mimi Sphere",
  description: "Explore ongoing campaigns, hot sales, and exclusive discounts on curated lifestyle essentials and cosmetics at Mimi Sphere.",
  alternates: {
    canonical: "/offers",
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const getFeaturedProducts = (limit = 10) =>
  fetchData(`${API_BASE}/products/featured?limit=${limit}`, 60);
const getTrendyProducts = (limit = 10) =>
  fetchData(`${API_BASE}/products/trendy?limit=${limit}`, 60);

const OffersPage = async () => {
  const featuredProducts = await getFeaturedProducts(10);
  const trendingProducts = await getTrendyProducts(10);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 🚀 Designed Banner Section */}
      <section className="relative h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] flex items-end overflow-hidden">
        <Image
          src="/hero/eid-campaign.png"
          alt="Campaign Banner"
          fill
          className=" object-cover"
          priority
        />

        {/* Overlay for CTA visibility if needed, or keeping it clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </section>

      {/* 🏆 Trust Indicators (One Row on Mobile) */}
      <div className="container mx-auto px-2 md:px-4 -mt-6 md:-mt-10 relative z-20">
        <div className="grid grid-cols-3 gap-1.5 md:gap-4">
          <div className="bg-white p-2 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-1 md:gap-4 group">
            <div className="w-8 h-8 md:w-14 md:h-14 bg-blue-50 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 md:w-7 md:h-7 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-[9px] md:text-base text-slate-900 leading-tight">Free Shipping</h4>
              <p className="hidden md:block text-[10px] md:text-sm text-slate-500 uppercase font-medium">Over ৳1000</p>
            </div>
          </div>
          <div className="bg-white p-2 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-1 md:gap-4 group">
            <div className="w-8 h-8 md:w-14 md:h-14 bg-green-50 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 md:w-7 md:h-7 text-green-600" />
            </div>
            <div>
              <h4 className="font-bold text-[9px] md:text-base text-slate-900 leading-tight">Secure Pay</h4>
              <p className="hidden md:block text-[10px] md:text-sm text-slate-500 uppercase font-medium">100% Safe</p>
            </div>
          </div>
          <div className="bg-white p-2 md:p-6 rounded-xl md:rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center md:items-center text-center md:text-left gap-1 md:gap-4 group">
            <div className="w-8 h-8 md:w-14 md:h-14 bg-orange-50 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 md:w-7 md:h-7 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-[9px] md:text-base text-slate-900 leading-tight">24/7 Support</h4>
              <p className="hidden md:block text-[10px] md:text-sm text-slate-500 uppercase font-medium">Help Center</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 Trending Now (5 columns on large screen) */}
      <section className="py-12 md:py-20 container mx-auto px-2 md:px-4">
        <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1 md:mb-2">
              <Flame className="w-3 h-3 md:w-4 md:h-4 fill-primary" /> Most
              Popular
            </div>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-900">
              Trending Now
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs md:text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center"
          >
            View All <ArrowRight className="ml-1 w-3 h-3 md:w-4 md:h-4" />
          </Link>
        </div>

        {trendingProducts && trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
            {trendingProducts.map((product: any) => (
              <div
                key={product._id}
                className="animate-in fade-in zoom-in duration-500"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 md:py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm md:text-base">
              Trending products are arriving soon.
            </p>
          </div>
        )}
      </section>

      {/* ✨ Featured Offers (5 columns on large screen) */}
      <section
        id="featured"
        className="py-12 md:py-20 bg-white border-y border-slate-100"
      >
        <div className="container mx-auto px-2 md:px-4">
          <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1 md:mb-2">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 fill-blue-600" />{" "}
                Handpicked For You
              </div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-900">
                Featured Offers
              </h2>
            </div>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
              {featuredProducts.map((product: any) => (
                <div
                  key={product._id}
                  className="animate-in fade-in zoom-in duration-500"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 md:py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm md:text-base">
                Check back shortly for featured offers!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OffersPage;
