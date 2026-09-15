import CountdownTimer from "@/components/ui/CountdownTimer";
import OfferProductCard from "@/components/ui/OfferProductCard";
import { fetchData } from "@/lib/server-api";
import {
  ArrowRight,
  Clock,
  CreditCard,
  Flame,
  Gift,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Special Offers & Hot Deals | Mimi Sphere",
  description:
    "Explore ongoing campaigns, flash sales, and exclusive discounts on curated lifestyle essentials and toys at Mimi Sphere.",
  alternates: { canonical: "/offers" },
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const getFeaturedProducts = (limit = 10) =>
  fetchData(`${API_BASE}/products/featured?limit=${limit}`, 60);

const getTrendyProducts = (limit = 10) =>
  fetchData(`${API_BASE}/products/trendy?limit=${limit}`, 60);

export default async function OffersPage() {
  const [featuredProducts, trendingProducts] = await Promise.all([
    getFeaturedProducts(10),
    getTrendyProducts(10),
  ]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ══════════════════════════════════════════════════════════════════════
          1. HERO CAMPAIGN BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-2 sm:px-4 pt-3 sm:pt-5">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-slate-100 bg-slate-950">
          {/* Main Hero Image */}
          <div className="relative w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
            <Image
              src="/hero/eid-campaign.png"
              alt="Special Offers Campaign"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Floating Deal Banner Bar Inside Bottom of Hero */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 backdrop-blur-md border-t border-white/10 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-white">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <div>
                <p className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 text-amber-400 leading-tight">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  Flash Sale • Limited Time Deals
                </p>
                <p className="text-[10px] sm:text-xs text-slate-300 hidden md:block">
                  Save up to 50% on top trending products today!
                </p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2">
              <CountdownTimer expiryDays={1} title="Ends in" />
              <Link
                href="/shop?sort=featured"
                className="hidden lg:flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-3.5 py-1.5 rounded-lg hover:bg-amber-400 transition-colors shadow-sm"
              >
                Shop All Deals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          2. TRUST INDICATORS (4 Pillared Clean Bar)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-2 sm:px-4 mt-3 sm:mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 sm:gap-3 group hover:border-slate-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Free Delivery
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Orders over ৳1,000
              </p>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 sm:gap-3 group hover:border-slate-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                100% Authentic
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Curated & Tested
              </p>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 sm:gap-3 group hover:border-slate-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Secure Payment
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                bKash, Nagad & Cards
              </p>
            </div>
          </div>

          <div className="bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5 sm:gap-3 group hover:border-slate-200 transition-colors">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                Dedicated Support
              </h4>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Quick WhatsApp & Call
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TRENDING OFFERS SECTION (Hot Deals)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-2 sm:px-4 pt-8 sm:pt-12 pb-6 sm:pb-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-8 border-b border-slate-200/60 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-red-500" />
              High In Demand
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Trending Deals 🔥
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
              Top customer favorites at unbeatable seasonal discount prices.
            </p>
          </div>

          <Link
            href="/shop?sort=trending"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {trendingProducts && trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {trendingProducts.map((product: any, idx: number) => (
              <OfferProductCard
                key={product._id}
                product={product}
                badgeType={idx < 3 ? "hot" : undefined}
                badgeText={idx < 3 ? "HOT" : undefined}
                showProgress={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <p className="text-slate-400 text-sm">
              Trending deals are updating. Check back shortly!
            </p>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MID-PAGE PROMOTIONAL CALLOUT BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-2 sm:px-4 my-6 sm:my-10">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-10 text-white shadow-xl">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-56 h-56 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-3">
                <Gift className="w-3.5 h-3.5" />
                Extra Savings On Every Order
              </span>
              <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                Unlock Huge Discounts with Free Delivery
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                Shop authentic toys, premium clothing, and lifestyle items.
                Enjoy guaranteed fast doorstep delivery all across Bangladesh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/shop"
                className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Catalog
              </Link>
              <Link
                href="/shop?sort=price_low"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all border border-white/10"
              >
                <Tag className="w-4 h-4 text-amber-400" />
                Budget Deals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. FEATURED OFFERS (Handpicked for you)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="container mx-auto px-2 sm:px-4 pb-12 sm:pb-16">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-8 border-b border-slate-200/60 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-blue-600" />
              Handpicked Deals
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Featured Offers ✨
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
              Specially selected products with exclusive prices and premium warranty.
            </p>
          </div>

          <Link
            href="/shop?sort=featured"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-600 hover:text-primary transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Cards Grid */}
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {featuredProducts.map((product: any) => (
              <OfferProductCard
                key={product._id}
                product={product}
                badgeType="pick"
                badgeText="FEATURED"
                showProgress={false}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-white">
            <p className="text-slate-400 text-sm">
              Featured offers will be updated soon.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
