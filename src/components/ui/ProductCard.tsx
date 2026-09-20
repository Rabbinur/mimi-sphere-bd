"use client";

import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import { Eye, Plus, ShoppingBag, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { trackPixelEvent } from "../../lib/pixel";
import { useAppDispatch } from "../Redux/hooks";
import { addToCart } from "../Redux/Slice/cartSlice";
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
      <div className="group relative bg-white border border-slate-100 rounded-2xl p-2.5 sm:p-3 flex flex-col h-full hover:shadow-md hover:border-slate-200/80 transition-all duration-300">
        {/* Top-Left: Discount Badge (matching reference green pill) */}
        {product.discount_percentage !== undefined && product.discount_percentage > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full shadow-2xs">
              {product.discount_percentage}%
            </span>
          </div>
        )}

        {/* Top-Right: Professional Quick View (Eye) Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setIsQuickViewOpen(true)}
            aria-label={`Quick view ${product.product_title}`}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-2xs text-slate-600 hover:text-white hover:bg-[#002447] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 group-hover:opacity-100"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8]" />
          </button>
        </div>

        {/* Product Image Area */}
        <Link
          href={`/products/${product.url_handle}`}
          className="relative aspect-square w-full bg-slate-50/60 rounded-xl overflow-hidden p-2 flex items-center justify-center mb-2.5"
        >
          <Image
            src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
            alt={product.product_title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Content Area */}
        <div className="flex flex-col flex-grow justify-between">
          <div>
            <Link href={`/products/${product.url_handle}`}>
              <h3 className="text-xs sm:text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug hover:text-amber-600 transition-colors min-h-[32px] sm:min-h-[36px]">
                {product.product_title}
              </h3>
            </Link>

            {/* Subtitle / Vendor or Unit (like 50 gm in reference) */}
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {product.product_vendor || "Mimi Sphere"}
            </p>
          </div>

          {/* Bottom Row: Price on left, Circular '+' button on right */}
          <div className="flex items-center justify-between mt-2.5 pt-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ৳{Number(price).toFixed(0)}
              </span>
              {product.compare_at_price && product.compare_at_price > price && (
                <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                  ৳{Number(product.compare_at_price).toFixed(0)}
                </span>
              )}
            </div>

            {/* Circular Action Button (Shopping Bag icon for clear eCommerce affordance) */}
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
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xs shrink-0 ${
                isOutOfStock
                  ? "bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed"
                  : isPreOrder
                  ? "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 active:scale-90"
                  : "bg-[#002447] hover:bg-amber-600 text-white hover:scale-105 active:scale-90"
              }`}
              title={
                isOutOfStock
                  ? "Out of Stock"
                  : isPreOrder
                  ? "Pre-Order"
                  : "Add to Cart"
              }
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
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
