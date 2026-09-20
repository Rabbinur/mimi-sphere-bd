"use client";

import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import { Heart, Search, ShoppingCart, Tag, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { trackPixelEvent } from "../../lib/pixel";
import { useAppDispatch, useAppSelector } from "../Redux/hooks";
import { addToCart } from "../Redux/Slice/cartSlice";
import { selectWishlistItems, toggleWishlist } from "../Redux/Slice/wishlistSlice";
import { Button } from "./button";

const QuickViewModal = dynamic(
  () => import("./quick-view-modal").then((mod) => mod.QuickViewModal),
  { ssr: false }
);

type TVariant = {
  _id: string;
  variant_option_values: Record<string, string> | Map<string, string>;
  variant_price: number;
};

const ProductCard = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(product.moq || 1);

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
    [variants, selectedVariantId]
  );

  const price = selectedVariant
    ? selectedVariant.variant_price
    : product.product_price;

  const originalPrice = Number(product.compare_at_price || 0);
  const currentPrice = Number(price);
  const savingsAmount = originalPrice > currentPrice ? Math.round(originalPrice - currentPrice) : 0;

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    if (!isWishlisted) {
      toast.success("Added to wishlist ❤️", { position: "top-center" });
    } else {
      toast.info("Removed from wishlist", { position: "top-center" });
    }
  };

  const handleAddToCart = () => {
    if (variants.length && !selectedVariantId) {
      toast.error("Please select an option");
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
      })
    );

    // Track AddToCart event
    trackPixelEvent("AddToCart", {
      content_ids: [product.sku || product._id],
      content_type: "product",
      content_name: product.product_title,
      value: price * quantity,
      currency: "BDT",
      quantity,
    });

    toast.success("Added to cart", {
      position: "top-center",
    });
    setIsModalOpen(false);
    setSelectedVariantId(null);
    setQuantity(product.moq || 1);
  };

  const isPreOrder = isProductPreOrder(product);
  const isOutOfStock = !isPreOrder && !product?.quantity;

  return (
    <>
      {/* ================= MODERN PRODUCT CARD ================= */}
      <div className="group relative bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-3 flex flex-col h-full hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300">
        {/* Top-Left: Discount Badge (matching reference pink tag) */}
        {Number(product.discount_percentage || 0) > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center text-[11px] font-bold bg-[#ff3366] text-white px-2 py-0.5 rounded shadow-2xs">
              -{product.discount_percentage}%
            </span>
          </div>
        ) : null}

        {/* Top-Right: Quick View / Zoom Button (matching reference dark circle) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            onClick={() => setIsQuickViewOpen(true)}
            aria-label={`Quick view ${product.product_title}`}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-xs shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            title="Quick View"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
          </button>
        </div>

        {/* Product Image Area with Bottom-Right Wishlist Heart Button */}
        <div className="relative aspect-square w-full bg-[#f6f7f9] rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2">
          <Link
            href={`/products/${product.url_handle}`}
            className="w-full h-full relative flex items-center justify-center"
          >
            <Image
              src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
              alt={product.product_title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Wishlist Heart Button (matching reference bottom-right of image) */}
          <button
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute bottom-2.5 right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 border border-slate-100"
            title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                isWishlisted
                  ? "fill-[#ff3366] text-[#ff3366]"
                  : "text-slate-600 hover:text-[#ff3366]"
              }`}
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-col flex-grow justify-between">
          <div>
            <Link href={`/products/${product.url_handle}`}>
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug hover:text-amber-600 transition-colors min-h-[32px] sm:min-h-[36px]">
                {product.product_title}
              </h3>
            </Link>

            {/* Savings Badge Container (Fixed min-height for uniform grid alignment) */}
            <div className="min-h-[22px] flex items-center mt-1">
              {savingsAmount > 0 ? (
                <span className="inline-flex items-center gap-1 bg-[#00a651] text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs">
                  <Tag className="w-3 h-3 fill-current" />
                  <span>Save ৳{savingsAmount.toLocaleString()}</span>
                </span>
              ) : null}
            </div>
          </div>

          {/* Bottom Row: Price on left, Black circular Cart button on right */}
          <div className="flex items-center justify-between mt-2 pt-1">
            <div className="flex items-baseline flex-wrap gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ৳{Number(price).toFixed(0)}
              </span>
              {Number(product.compare_at_price || 0) > price ? (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                  ৳{Number(product.compare_at_price).toFixed(0)}
                </span>
              ) : null}
              {Number(product.discount_percentage || 0) > 0 ? (
                <span className="text-[11px] sm:text-xs font-bold text-[#ff3366]">
                  -{product.discount_percentage}%
                </span>
              ) : null}
            </div>

            {/* Circular Black Cart Action Button (matching reference) */}
            <button
              onClick={() =>
                variants.length ? setIsModalOpen(true) : handleAddToCart()
              }
              disabled={isOutOfStock}
              aria-label={
                isPreOrder
                  ? "Pre-order product"
                  : isOutOfStock
                  ? "Out of stock"
                  : "Add to cart"
              }
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-xs shrink-0 ${
                isOutOfStock
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : isPreOrder
                  ? "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 active:scale-95"
                  : "bg-[#18181b] hover:bg-black text-white hover:scale-105 active:scale-95"
              }`}
              title={
                isOutOfStock
                  ? "Out of Stock"
                  : isPreOrder
                  ? "Pre-Order"
                  : "Add to Cart"
              }
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* QuickView Modal Component */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        url_handle={product?.url_handle || ""}
      />

      {/* ================= COMPACT BOTTOM MODAL FOR VARIANTS ================= */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {product.product_title}
                  </h4>
                  <p className="text-[#002447] font-black text-sm mt-0.5">৳{price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close options"
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6 max-h-48 overflow-y-auto">
                {variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariantId(v._id)}
                    className={`text-xs sm:text-sm p-2 rounded-xl border-2 transition-all font-medium ${
                      selectedVariantId === v._id
                        ? "border-[#002447] bg-[#002447]/5 text-[#002447] font-bold"
                        : "border-gray-100 text-gray-600 hover:border-slate-200"
                    }`}
                  >
                    {getVariantLabel(v)}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-11 font-bold rounded-xl bg-[#002447] hover:bg-amber-600 text-white shadow-sm transition-all"
              >
                Confirm • ৳{(price * quantity).toFixed(2)}
              </Button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProductCard;
