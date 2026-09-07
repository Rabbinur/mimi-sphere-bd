"use client";

import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useAppDispatch } from "../Redux/hooks";
import { addToCart } from "../Redux/Slice/cartSlice";
import { Button } from "./button";
import { trackPixelEvent } from "../../lib/pixel";

type TVariant = {
  _id: string;
  variant_option_values: Record<string, string> | Map<string, string>;
  variant_price: number;
};

const ProductCard = ({ product }: { product: TProduct }) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
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
    [variants, selectedVariantId],
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
      }),
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

    toast.success("Added to cart");
    setIsModalOpen(false);
    setSelectedVariantId(null);
    setQuantity(product.moq || 1);
  };

  return (
    <>
      {/* ================= TIGHT PRODUCT CARD ================= */}
      <div className="group relative bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
        {product.discount_percentage !== undefined && product.discount_percentage > 0 && (
          <span className="absolute top-2 left-2 z-10 text-[9px] font-black bg-primary text-white px-1.5 py-0.5 rounded shadow-sm">
            {product.discount_percentage}% OFF
          </span>
        )}

        {/* Thumbnail: Aspect 4/5 often looks better for products */}
        <Link
          href={`/products/${product.url_handle}`}
          className="relative aspect-square bg-slate-50 overflow-hidden"
        >
          <Image
            src={getProxiedUrl(product.thumbnail) || "/placeholder.svg"}
            alt={product.product_title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Content Area */}
        <div className="p-2 md:p-3 flex flex-col flex-grow">
          <Link href={`/products/${product.url_handle}`}>
            <h3 className="text-[12px] md:text-sm font-bold line-clamp-2 min-h-[32px] md:min-h-[40px] text-slate-800 leading-tight hover:text-primary transition-colors">
              {product.product_title}
            </h3>
          </Link>

          {/* Price: Tighter Spacing */}
          <div className="mt-1 mb-3 flex items-baseline gap-1.5">
            <span className="text-sm md:text-base font-black text-primary">
              ৳{Number(price).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <del className="text-[10px] text-gray-600 font-medium">
                ৳{Number(product.compare_at_price).toFixed(2)}
              </del>
            )}
          </div>

          {/* Combined CTA Action Bar */}
          <div className="flex items-center gap-1 mt-auto">
            {/* Ultra-compact quantity */}
            <div className="flex items-center border border-slate-200 rounded-md h-8 bg-slate-50/60 shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(product.moq || 1, q - 1))}
                aria-label="Decrease quantity"
                className="w-4 sm:w-5 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <Minus size={10} />
              </button>
              <span className="w-3.5 sm:w-4 text-center text-[11px] font-bold text-slate-700 select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-4 sm:w-5 h-full flex items-center justify-center text-slate-500 hover:text-primary transition-colors"
              >
                <Plus size={10} />
              </button>
            </div>

            <Button
              onClick={() =>
                variants.length ? setIsModalOpen(true) : handleAddToCart()
              }
              disabled={!isProductPreOrder(product) && !product?.quantity}
              size="sm"
              aria-label={isProductPreOrder(product) ? "Pre-order product" : "Add to cart"}
              className="flex-1 h-8 px-1 sm:px-2 bg-[#002447] hover:bg-[#071426] text-white font-medium border-none rounded-md shadow-sm transition-all duration-200 min-w-0"
            >
              {isProductPreOrder(product) ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-medium whitespace-nowrap">
                    Pre-order
                  </span>
                  <ShoppingCart className="w-3 h-3 shrink-0 hidden xl:inline" />
                </div>
              ) : product?.quantity ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-medium whitespace-nowrap">
                    Add to Cart
                  </span>
                  <ShoppingCart className="w-3 h-3 shrink-0 hidden xl:inline" />
                </div>
              ) : (
                <span className="text-[10px] font-bold uppercase opacity-60 whitespace-nowrap">
                  Out of Stock
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ================= COMPACT BOTTOM MODAL ================= */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-xl p-4 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {product.product_title}
                  </h4>
                  <p className="text-[#002447] font-black">৳{price.toFixed(2)}</p>
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
                    className={`text-[13px] p-1.5 md:text-[15px] rounded-md border-2 transition-all font-[400] ${selectedVariantId === v._id
                      ? "border-[#002447] bg-[#002447]/5 text-[#002447] font-semibold"
                      : "border-gray-100 text-gray-600"
                      }`}
                  >
                    {getVariantLabel(v)}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full h-11 font-bold tracking-wider bg-[#002447] hover:bg-[#071426] text-white shadow-sm"
              >
                Confirm • ৳{(price * quantity).toFixed(2)}
              </Button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ProductCard;
