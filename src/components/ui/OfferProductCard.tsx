"use client";

import { useAppDispatch } from "@/components/Redux/hooks";
import { addToCart } from "@/components/Redux/Slice/cartSlice";
import { trackPixelEvent } from "@/lib/pixel";
import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import {
  Eye,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

const QuickViewModal = dynamic(
  () => import("./quick-view-modal").then((mod) => mod.QuickViewModal),
  { ssr: false },
);

type TVariant = {
  _id: string;
  variant_option_values: Record<string, string> | Map<string, string>;
  variant_price: number;
};

interface OfferProductCardProps {
  product: TProduct | any;
  badgeType?: "hot" | "flash" | "pick" | "trending";
  badgeText?: string;
  showProgress?: boolean;
  progressPercent?: number;
}

export default function OfferProductCard({
  product,
  badgeType,
  badgeText,
  showProgress = false,
  progressPercent,
}: OfferProductCardProps) {
  const dispatch = useAppDispatch();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(product.moq || 1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const variants: TVariant[] =
    (product.product_variants as unknown as TVariant[]) || [];

  const normalizeVariantValues = (val: any): Record<string, string> =>
    val instanceof Map ? Object.fromEntries(val) : val || {};

  const getVariantLabel = (v: TVariant) =>
    Object.values(normalizeVariantValues(v.variant_option_values)).join(" / ");

  const selectedVariant = useMemo(
    () => variants.find((v) => v._id === selectedVariantId),
    [variants, selectedVariantId],
  );

  const price = selectedVariant
    ? selectedVariant.variant_price
    : product.product_price;

  const comparePrice = product.compare_at_price || 0;
  const hasDiscount = comparePrice > price;
  const discountPercent =
    product.discount_percentage ||
    (hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0);
  const savedAmount = hasDiscount ? Math.round(comparePrice - price) : 0;

  // Calculate simulated or real claimed progress
  const claimedPercent =
    progressPercent ??
    Math.min(92, Math.max(35, 45 + ((product._id ? product._id.charCodeAt(0) : 10) % 45)));

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (variants.length && !selectedVariantId) {
      setIsModalOpen(true);
      return;
    }

    dispatch(
      addToCart({
        product_id: product._id,
        variant_id: selectedVariantId,
        title: product.product_title,
        thumbnail: getProxiedUrl(product.thumbnail),
        price,
        quantity,
        is_free_delivery: product.is_free_delivery,
        delivery_charge: product.delivery_charge,
        selected_variant_values: selectedVariant
          ? normalizeVariantValues(selectedVariant.variant_option_values)
          : undefined,
        sku: product.sku,
      }),
    );

    trackPixelEvent("AddToCart", {
      content_ids: [product.sku || product._id],
      content_type: "product",
      content_name: product.product_title,
      value: price * quantity,
      currency: "BDT",
      quantity,
    });

    toast.success("Added to cart!");
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
    setIsModalOpen(false);
    setSelectedVariantId(null);
    setQuantity(product.moq || 1);
  };

  const isPreOrder = isProductPreOrder(product);
  const isOutOfStock = !isPreOrder && product?.quantity === 0;

  return (
    <>
      <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden">
        {/* ── Top Image Container ── */}
        <div className="relative aspect-square overflow-hidden bg-slate-50/70">
          <Link
            href={`/products/${product.url_handle || product._id}`}
            className="block w-full h-full relative"
          >
            <Image
              src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
              alt={product.product_title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
            />
          </Link>

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 pointer-events-none">
            {discountPercent > 0 && (
              <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full shadow-md leading-none tracking-tight flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" />
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Right Badge */}
          {(badgeText || badgeType) && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
              {badgeType === "hot" && (
                <span className="bg-amber-500/90 backdrop-blur-sm text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 fill-white" />
                  {badgeText || "HOT DEAL"}
                </span>
              )}
              {badgeType === "flash" && (
                <span className="bg-purple-600/90 backdrop-blur-sm text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 fill-white" />
                  {badgeText || "FLASH"}
                </span>
              )}
              {badgeType === "pick" && (
                <span className="bg-blue-600/90 backdrop-blur-sm text-white font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-white" />
                  {badgeText || "POPULAR"}
                </span>
              )}
            </div>
          )}

          {/* Desktop Quick View Overlay Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsQuickViewOpen(true);
            }}
            aria-label="Quick view"
            className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-900 hover:text-white shadow-md flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden md:flex"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* ── Content Section ── */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.round(product.average_rating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-slate-100 text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-medium ml-1">
              ({product.total_reviews || 8})
            </span>
          </div>

          {/* Product Title */}
          <Link
            href={`/products/${product.url_handle || product._id}`}
            className="block group/title"
          >
            <h3 className="text-xs sm:text-[13px] md:text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover/title:text-primary transition-colors min-h-[34px] sm:min-h-[38px]">
              {product.product_title}
            </h3>
          </Link>

          {/* Price & Savings */}
          <div className="mt-2 mb-2.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              ৳{Number(price).toLocaleString()}
            </span>
            {hasDiscount && (
              <del className="text-xs sm:text-[13px] text-slate-400 font-medium">
                ৳{Number(comparePrice).toLocaleString()}
              </del>
            )}
            {savedAmount > 0 && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded leading-none">
                Save ৳{savedAmount}
              </span>
            )}
          </div>

          {/* Limited Progress Bar (Flash & Hot deals) */}
          {showProgress && (
            <div className="mb-3 space-y-1">
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${claimedPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-0.5 text-red-600 font-semibold">
                  <Flame className="w-2.5 h-2.5" />
                  {claimedPercent}% claimed
                </span>
                <span>Fast selling</span>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            {/* Quantity stepper for desktop */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg h-9 bg-slate-50/70 shrink-0 px-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => Math.max(product.moq || 1, q - 1));
                }}
                aria-label="Decrease quantity"
                className="w-6 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-5 text-center text-xs font-bold text-slate-700 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity((q) => q + 1);
                }}
                aria-label="Increase quantity"
                className="w-6 h-full flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Main Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-9 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>
                {isOutOfStock
                  ? "Out of Stock"
                  : isPreOrder
                  ? "Pre-Order"
                  : isAdded
                  ? "Added!"
                  : "Add to Cart"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Variant Selection Modal ── */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 z-10">
              <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                <div className="pr-4">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {product.product_title}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-primary font-black text-base">
                      ৳{Number(price).toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <del className="text-xs text-slate-400">
                        ৳{Number(comparePrice).toLocaleString()}
                      </del>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-600 mb-2">Select Variant:</p>
              <div className="grid grid-cols-2 gap-2 mb-5 max-h-48 overflow-y-auto">
                {variants.map((v) => (
                  <button
                    key={v._id}
                    type="button"
                    onClick={() => setSelectedVariantId(v._id)}
                    className={`text-xs p-2.5 rounded-xl border text-left transition-all ${
                      selectedVariantId === v._id
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm ring-1 ring-primary"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="truncate">{getVariantLabel(v)}</div>
                    <div className="text-[11px] font-bold mt-0.5 text-slate-900">
                      ৳{Number(v.variant_price).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium text-slate-500">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg h-9 bg-slate-50 px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(product.moq || 1, q - 1))}
                    className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-full flex items-center justify-center text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleAddToCart(e)}
                className="w-full h-11 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Confirm & Add • ৳{Number(price * quantity).toLocaleString()}
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* ── Quick View Modal ── */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        url_handle={product?.url_handle || ""}
      />
    </>
  );
}
