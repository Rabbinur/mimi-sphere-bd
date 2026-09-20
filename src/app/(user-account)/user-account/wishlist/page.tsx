"use client";

import { useAppDispatch, useAppSelector } from "@/components/Redux/hook";
import {
  selectWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from "@/components/Redux/Slice/wishlistSlice";
import { addToCart } from "@/components/Redux/Slice/cartSlice";
import { getProxiedUrl } from "@/lib/imageHelper";
import { Heart, ShoppingCart, Trash2, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import UserHeader from "@/components/custom/UserHeader";
import { TProduct } from "@/types";

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);

  const handleRemove = (product: TProduct) => {
    dispatch(removeFromWishlist(product._id));
    toast.info(`Removed ${product.product_title} from wishlist`);
  };

  const handleAddToCart = (product: TProduct) => {
    const price = Number(product.price || 0);
    dispatch(
      addToCart({
        product_id: product._id,
        title: product.product_title,
        thumbnail: getProxiedUrl(product.thumbnail),
        price,
        quantity: 1,
        is_free_delivery: product.is_free_delivery,
        delivery_charge: product.delivery_charge,
        sku: product.sku,
      })
    );
    toast.success("Added to cart!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      {/* Mobile Header */}
      <UserHeader
        title={`My Wishlist (${wishlistItems.length})`}
        isFilterOpen={false}
        setIsFilterOpen={() => {}}
        showSearch={false}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 container mx-auto md:py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              My Wishlist
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5">
              {wishlistItems.length > 0
                ? `You have saved ${wishlistItems.length} items to your wishlist`
                : "Your saved items will show up here"}
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(clearWishlist());
                toast.info("Wishlist cleared");
              }}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
            >
              Clear All
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-[#ff3366] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Your wishlist is empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Explore products and click the heart icon on any card to save your favorite items here!
            </p>
            <div className="mt-6">
              <Link href="/shop">
                <Button className="bg-[#18181b] hover:bg-black text-white px-6 font-semibold shadow-md">
                  Explore Products
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {wishlistItems.map((product) => {
              const currentPrice = Number(product.price || 0);
              const originalPrice = Number(product.compare_at_price || 0);
              const savingsAmount =
                originalPrice > currentPrice
                  ? Math.round(originalPrice - currentPrice)
                  : 0;

              return (
                <div
                  key={product._id}
                  className="group relative bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-3 flex flex-col h-full hover:shadow-md hover:border-slate-200 transition-all duration-300"
                >
                  {/* Top Left Discount Badge */}
                  {product.discount_percentage !== undefined &&
                    product.discount_percentage > 0 && (
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center text-xs font-black bg-[#ff3366] text-white px-2 py-0.5 rounded-md shadow-xs">
                          -{product.discount_percentage}%
                        </span>
                      </div>
                    )}

                  {/* Top Right Remove from Wishlist */}
                  <button
                    onClick={() => handleRemove(product)}
                    className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-rose-50 text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 flex items-center justify-center transition-all duration-200"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Product Image */}
                  <div className="relative aspect-square w-full bg-slate-50/60 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2">
                    <Link
                      href={`/products/${product.url_handle}`}
                      className="w-full h-full relative flex items-center justify-center"
                    >
                      <Image
                        src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
                        alt={product.product_title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <Link href={`/products/${product.url_handle}`}>
                        <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug hover:text-amber-600 transition-colors min-h-[32px]">
                          {product.product_title}
                        </h3>
                      </Link>

                      {/* Savings tag */}
                      {savingsAmount > 0 && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 bg-[#00a651] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md">
                            <Tag className="w-3 h-3 fill-current" />
                            <span>Save ৳{savingsAmount.toLocaleString()}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-baseline flex-wrap gap-1">
                        <span className="text-sm sm:text-base font-black text-slate-900">
                          ৳{currentPrice.toFixed(0)}
                        </span>
                        {originalPrice > currentPrice && (
                          <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                            ৳{originalPrice.toFixed(0)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#18181b] hover:bg-black text-white shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
