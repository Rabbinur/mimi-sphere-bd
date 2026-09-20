"use client";

import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import { Heart, ShoppingCart, Sparkles, X, Zap } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

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
  const discountPct = Number(product.discount_percentage || 0);
  const hasDiscount = discountPct > 0 || originalPrice > currentPrice;
  const computedDiscount =
    discountPct > 0
      ? discountPct
      : originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

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

    trackPixelEvent("AddToCart", {
      content_ids: [product.sku || product._id],
      content_type: "product",
      content_name: product.product_title,
      value: price * quantity,
      currency: "BDT",
      quantity,
    });

    toast.success("Added to cart", { position: "top-center" });
    setIsModalOpen(false);
    setSelectedVariantId(null);
    setQuantity(product.moq || 1);
  };

  const isPreOrder = isProductPreOrder(product);
  const isOutOfStock = !isPreOrder && !product?.quantity;
  const stockCount = product?.quantity ?? 0;

  return (
    <>
      {/* ─────────── PREMIUM PRODUCT CARD ─────────── */}
      <div
        className="group relative bg-white rounded-2xl flex flex-col h-full overflow-hidden"
        style={{
          transition: "box-shadow 0.4s ease, transform 0.4s ease, border-color 0.4s ease",
          boxShadow: isHovered
            ? "0 20px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(67,56,202,0.1)"
            : "0 2px 10px rgba(0,0,0,0.055)",
          transform: isHovered ? "translateY(-5px)" : "translateY(0)",
          border: "1px solid",
          borderColor: isHovered ? "rgba(99,102,241,0.22)" : "rgba(226,232,240,0.9)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Shimmer top border */}
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl pointer-events-none"
          style={{
            background: "linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.35s ease",
          }}
        />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-md"
              style={{ background: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)" }}
            >
              <Sparkles className="w-2.5 h-2.5 fill-white" />
              -{computedDiscount}%
            </span>
          </div>
        )}

        {/* Pre-Order Badge */}
        {isPreOrder && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-black text-white px-2 py-0.5 rounded-full shadow-md"
              style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
            >
              <Zap className="w-2.5 h-2.5 fill-white" />
              Pre-Order
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            transition: "transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
            transform: isWishlisted ? "scale(1.1)" : "scale(1)",
            background: isWishlisted
              ? "linear-gradient(135deg, #fee2e2, #fce7f3)"
              : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            border: isWishlisted ? "1px solid rgba(252,165,165,0.6)" : "1px solid rgba(226,232,240,0.9)",
          }}
        >
          <Heart
            className="w-3.5 h-3.5 transition-all duration-200"
            style={{
              fill: isWishlisted ? "#f43f5e" : "none",
              color: isWishlisted ? "#f43f5e" : "#64748b",
            }}
          />
        </button>

        {/* Image Area */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          <Link href={`/products/${product.url_handle}`} className="block w-full h-full">
            <Image
              src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
              alt={product.product_title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3"
              style={{
                transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)",
                transform: isHovered ? "scale(1.08)" : "scale(1)",
              }}
            />
          </Link>

          {/* Stock Pill */}
          {!isPreOrder && stockCount > 0 && (
            <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.86)",
                  backdropFilter: "blur(10px)",
                  color: stockCount <= 10 ? "#dc2626" : "#16a34a",
                  border: `1px solid ${stockCount <= 10 ? "rgba(220,38,38,0.18)" : "rgba(22,163,74,0.18)"}`,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: stockCount <= 10 ? "#ef4444" : "#22c55e" }}
                />
                {stockCount <= 10 ? `Only ${stockCount} left` : `${stockCount} in stock`}
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(3px)" }}
            >
              <span className="text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-white/25 bg-white/10">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View hover overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: isHovered ? 1 : 0, transition: "opacity 0.3s ease" }}
          >
            <button
              onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
              className="pointer-events-auto bg-white/95 text-slate-800 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-lg border border-slate-200/60 hover:bg-white active:scale-95"
              style={{ transition: "transform 0.2s ease" }}
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow px-3 pt-2.5 pb-3 gap-1.5">
          <Link href={`/products/${product.url_handle}`}>
            <h3
              className="text-[12px] sm:text-[13px] font-semibold leading-snug line-clamp-2 min-h-[32px] sm:min-h-[36px]"
              style={{
                color: isHovered ? "#4338ca" : "#1e293b",
                transition: "color 0.25s ease",
              }}
            >
              {product.product_title}
            </h3>
          </Link>

          <div className="flex-grow" />

          {/* Price + Cart */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex flex-col">
              <span
                className="text-sm sm:text-[15px] font-black"
                style={{ color: "#1e1b4b", letterSpacing: "-0.01em" }}
              >
                ৳{Number(price).toLocaleString("en-BD")}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-[11px] text-slate-400 line-through leading-none">
                  ৳{Number(originalPrice).toLocaleString("en-BD")}
                </span>
              )}
            </div>

            {/* Gradient Cart Button */}
            <button
              onClick={() => variants.length ? setIsModalOpen(true) : handleAddToCart()}
              disabled={isOutOfStock}
              aria-label={
                isPreOrder ? "Pre-order product" : isOutOfStock ? "Out of stock" : "Add to cart"
              }
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                transform: isHovered && !isOutOfStock ? "scale(1.12)" : "scale(1)",
                background: isOutOfStock
                  ? "#e2e8f0"
                  : isPreOrder
                  ? "linear-gradient(135deg, #f59e0b, #f97316)"
                  : "linear-gradient(135deg, #1e1b4b, #4f46e5)",
                boxShadow: isOutOfStock
                  ? "none"
                  : isPreOrder
                  ? "0 4px 16px rgba(245,158,11,0.45)"
                  : isHovered
                  ? "0 6px 20px rgba(79,70,229,0.5)"
                  : "0 4px 14px rgba(79,70,229,0.35)",
              }}
            >
              <ShoppingCart
                className="w-4 h-4 stroke-[2]"
                style={{ color: isOutOfStock ? "#94a3b8" : "white" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* QuickView */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        url_handle={product?.url_handle || ""}
      />

      {/* ─────────── Variant Selection Modal ─────────── */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div
              className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl"
              style={{
                background: "linear-gradient(160deg, #ffffff 0%, #f8faff 100%)",
                border: "1px solid rgba(99,102,241,0.12)",
                animation: "pcSlideUp 0.28s cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              <style>{`@keyframes pcSlideUp { from { transform: translateY(60px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {product.product_title}
                  </h4>
                  <p className="font-black text-sm mt-0.5" style={{ color: "#4338ca" }}>
                    ৳{price.toLocaleString("en-BD")}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close options"
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
                >
                  <X size={15} className="text-slate-600" />
                </button>
              </div>

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Select Option
              </p>

              <div className="grid grid-cols-2 gap-2 mb-5 max-h-48 overflow-y-auto">
                {variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariantId(v._id)}
                    className="text-xs sm:text-sm p-2.5 rounded-xl border-2 transition-all font-medium text-left"
                    style={{
                      borderColor: selectedVariantId === v._id ? "#4338ca" : "#e2e8f0",
                      background: selectedVariantId === v._id
                        ? "linear-gradient(135deg, #eef2ff, #e0e7ff)"
                        : "white",
                      color: selectedVariantId === v._id ? "#3730a3" : "#475569",
                      fontWeight: selectedVariantId === v._id ? 700 : 500,
                    }}
                  >
                    {getVariantLabel(v)}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-11 font-bold rounded-xl text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #1e1b4b, #4338ca)",
                  boxShadow: "0 4px 20px rgba(67,56,202,0.4)",
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart · ৳{(price * quantity).toLocaleString("en-BD")}
              </Button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ProductCard;
