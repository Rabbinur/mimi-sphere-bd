"use client";

import {
  ArrowRight,
  Minus,
  Plus,
  Search,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Zap
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/components/Redux/hooks";
import { addToCart } from "@/components/Redux/Slice/cartSlice";
import { trackPixelEvent } from "@/lib/pixel";
import { getProxiedUrl, isProductPreOrder } from "@/lib/utils";
import type { TProduct } from "@/types";
import { toast } from "sonner";

import ProductDetailTabs from "../_components/product-details";
import ProductGallery from "../_components/ProductGallery";
import { VariantSelector } from "./_components/VariantSelector";

type TVariant = {
  _id?: string;
  id?: string;
  variant_option_values: Record<string, string> | Map<string, string>;
  variant_price: number;
  compare_at_price?: number;
  variant_quantity?: number;
  product_weight?: number;
  weight_unit?: string;
  image?: string;
};

const normalizeVariantValues = (val: any): Record<string, string> => {
  if (!val) return {};
  if (val instanceof Map) return Object.fromEntries(val as Map<string, string>);
  if (typeof val === "object") return val as Record<string, string>;
  return {};
};

const getVariantIdSafe = (v: TVariant, fallbackIndex?: number) =>
  v._id ??
  v.id ??
  (typeof fallbackIndex === "number" ? `variant-${fallbackIndex}` : undefined);

const getInitialSelectedOptions = (product: TProduct) => {
  const productVariants = (product.product_variants || []) as TVariant[];
  if (productVariants.length > 0) {
    return normalizeVariantValues(productVariants[0].variant_option_values);
  }
  if (product.product_options && product.product_options.length > 0) {
    const initialOptions: Record<string, string> = {};
    product.product_options.forEach((option: any) => {
      if (option.option_values.length > 0) {
        initialOptions[option.option_name] = option.option_values[0];
      }
    });
    return initialOptions;
  }
  return {};
};

export default function ProductClient({ product }: { product: TProduct }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Track ViewContent on mount
  useEffect(() => {
    if (product) {
      const productId = product.sku || product._id;
      trackPixelEvent("ViewContent", {
        content_ids: [productId],
        content_type: "product",
        content_name: product.product_title,
        value: product.product_price,
        currency: "BDT",
      });
    }
  }, [product]);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => getInitialSelectedOptions(product));
  const [quantity, setQuantity] = useState(product?.moq || 1);

  const [countdown, setCountdown] = useState({ hours: "02", minutes: "35", seconds: "00" });

  useEffect(() => {
    const targetKey = "fomo_target_time";
    let targetStr = typeof window !== "undefined" ? localStorage.getItem(targetKey) : null;
    let targetTime = targetStr ? parseInt(targetStr, 10) : 0;

    if (!targetTime || targetTime < Date.now()) {
      targetTime = Date.now() + (2 * 60 * 60 * 1000) + (35 * 60 * 1000);
      if (typeof window !== "undefined") {
        localStorage.setItem(targetKey, String(targetTime));
      }
    }

    const interval = setInterval(() => {
      const difference = targetTime - Date.now();
      if (difference <= 0) {
        const newTarget = Date.now() + (2 * 60 * 60 * 1000) + (35 * 60 * 1000);
        if (typeof window !== "undefined") {
          localStorage.setItem(targetKey, String(newTarget));
        }
        targetTime = newTarget;
        return;
      }

      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setCountdown({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const variants = (product.product_variants || []) as TVariant[];

  // 🚀 Memoized Variant Selection Logic
  const selectedVariant = useMemo(() => {
    if (!variants || variants.length === 0) return null;
    return variants.find((variant) => {
      const vObj = normalizeVariantValues(variant.variant_option_values);
      const sEntries = Object.entries(selectedOptions);
      if (sEntries.length === 0) return false;
      return sEntries.every(
        ([key, value]) => String(vObj[key]) === String(value),
      );
    });
  }, [variants, selectedOptions]);

  const hasVariants = variants.length > 0;
  const currentAvailableStock = hasVariants
    ? (selectedVariant?.variant_quantity ?? 0)
    : (product?.quantity ?? 0);

  // Cap quantity when selected variant's stock is lower than current quantity
  useEffect(() => {
    if (selectedVariant && !isProductPreOrder(product)) {
      const stock = selectedVariant.variant_quantity ?? 0;
      if (quantity > stock && stock > 0) {
        setQuantity(stock);
      }
    }
  }, [selectedVariant]);

  const currentPrice =
    selectedVariant?.variant_price ?? product?.product_price ?? 0;
  const comparePrice =
    selectedVariant?.compare_at_price ?? product?.compare_at_price ?? 0;
  const discountPercentage =
    product?.discount_percentage ||
    (comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : 0);

  const handleAddToCart = () => {
    const hasVariants = variants.length > 0;
    if (hasVariants && !selectedVariant) {
      toast.error("Please select a valid combination.");
      return;
    }

    const payload = {
      product_id: product._id,
      variant_id: selectedVariant
        ? getVariantIdSafe(selectedVariant, variants.indexOf(selectedVariant))
        : null,
      title: product.product_title,
      thumbnail: getProxiedUrl(product.thumbnail),
      price: Number(currentPrice),
      quantity,
      is_free_delivery: !!product.is_free_delivery,
      delivery_charge: product.delivery_charge,
      selected_variant_values: selectedVariant
        ? normalizeVariantValues(selectedVariant.variant_option_values)
        : undefined,
      sku: product.sku,
    };

    dispatch(addToCart(payload as any));

    // Track AddToCart event
    trackPixelEvent("AddToCart", {
      content_ids: [product.sku || product._id],
      content_type: "product",
      content_name: product.product_title,
      value: Number(currentPrice) * quantity,
      currency: "BDT",
      quantity,
    });

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    const params = new URLSearchParams({
      product_id: product._id,
      quantity: String(quantity),
    });
    if (selectedVariant) {
      params.set(
        "variant_id",
        getVariantIdSafe(
          selectedVariant,
          variants.indexOf(selectedVariant),
        ) as string,
      );
    }
    router.push(`/checkout?${params.toString()}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.product_title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  const specs = [
    {
      label: "Category",
      value: (product?.product_categories as any[])
        ?.map((c) => (typeof c === "string" ? c : c.name))
        .join(", "),
    },
    { label: "SKU", value: product?.sku },
    { label: "Vendor", value: product?.product_vendor },
    { label: "Country of Origin", value: product?.country_of_origin },
    ...(product?.product_attributes || []),
  ];

  return (
    <>
      <div className="lg:hidden space-y-2 mb-2 px-1">
        <h1 className="text-lg sm:text-2xl line-clamp-2 font-medium text-black leading-snug">
          {product?.product_title}
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-primary underline">
            {product?.product_vendor}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full shadow-sm border h-10 w-10"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        <ProductGallery
          product={product}
          selectedImage={selectedVariant?.image}
        />

        <div className=" space-y-2 lg:space-y-3">
          <div className="hidden lg:block pb-3 border-b border-gray-100">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-lg xl:text-xl font-bold text-gray-900 line-clamp-3 lg:line-clamp-2">
                {product?.product_title}
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="h-9 w-9 rounded-full bg-slate-50 border"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-xs text-gray-500">
                Brand:{" "}
                <span className="font-semibold text-gray-900">
                  {product?.product_vendor}
                </span>
              </p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">
                  {product?.average_rating?.toFixed(1) || "0.0"}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">
                  ({product?.total_reviews || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="pb-2 border-b border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-bold text-primary">
                ৳{Math.round(currentPrice).toLocaleString("en-BD")}
              </span>
              {comparePrice > currentPrice && (
                <span className="text-gray-600 text-sm line-through">
                  ৳{Math.round(comparePrice).toLocaleString("en-BD")}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge className="bg-red-50 text-red-600 border-0">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isProductPreOrder(product) || currentAvailableStock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {isProductPreOrder(product)
                  ? "Pre-order Available"
                  : currentAvailableStock > 0
                    ? `In Stock (${currentAvailableStock} units)`
                    : "Out of Stock"}
              </p>
            </div>

            {isProductPreOrder(product) && product?.pre_order_message && (
              <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg mt-2">
                <p className="text-[11px] text-orange-700 font-medium flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {product.pre_order_message}
                </p>
              </div>
            )}
          </div>

          {/* ⚡ Extracted Variant Selector */}
          <VariantSelector
            options={product?.product_options || []}
            selectedOptions={selectedOptions}
            onOptionChange={(name, value) =>
              setSelectedOptions((prev) => ({ ...prev, [name]: value }))
            }
          />

          <div className="space-y-1.5   border-gray-100">
            <Label className="text-[11px] font-semibold text-gray-500 uppercase">
              Quantity
            </Label>
            <div className="flex items-center border rounded-md w-max bg-white">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setQuantity((q) => Math.max(product?.moq || 1, q - 1))
                }
                disabled={quantity <= (product?.moq || 1)}
                className="h-8 w-8"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-9 text-center text-sm font-bold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={
                  !isProductPreOrder(product) &&
                  quantity >= (currentAvailableStock || Infinity)
                }
                className="h-8 w-8"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* FOMO Countdown Timer */}
          <div className="bg-amber-50/60 border border-amber-100/80 rounded-xl p-3 mt-1 flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Special Offer</span>
                <span className="text-[10px] text-slate-500">Prices will increase soon!</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex flex-col items-center bg-white border border-amber-200/60 rounded px-1.5 py-0.5 min-w-[32px]">
                <span className="text-xs font-black text-amber-600">{countdown.hours}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Hr</span>
              </div>
              <span className="text-xs font-black text-amber-500 animate-pulse">:</span>
              <div className="flex flex-col items-center bg-white border border-amber-200/60 rounded px-1.5 py-0.5 min-w-[32px]">
                <span className="text-xs font-black text-amber-600">{countdown.minutes}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Min</span>
              </div>
              <span className="text-xs font-black text-amber-500 animate-pulse">:</span>
              <div className="flex flex-col items-center bg-white border border-amber-200/60 rounded px-1.5 py-0.5 min-w-[32px]">
                <span className="text-xs font-black text-amber-600">{countdown.seconds}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Sec</span>
              </div>
            </div>
          </div>

          <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-2 bg-white border-t z-50 lg:relative lg:p-0 lg:border-none lg:z-auto lg:bg-transparent">
            <div className="grid grid-cols-2 gap-2.5 lg:pt-2">
              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={!isProductPreOrder(product) && !currentAvailableStock}
                className="h-11 lg:h-10 border-primary text-primary"
              >
                <ShoppingCart className="mr-2 h-4 w-4 lg:h-3.5 lg:w-3.5" />
                {isProductPreOrder(product) ? "Pre-order" : "Add to Cart"}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={!isProductPreOrder(product) && !currentAvailableStock}
                className="h-11 lg:h-10 bg-primary"
              >
                {isProductPreOrder(product) ? "Pre-order Now" : "Buy Now"}
                <ArrowRight className="ml-2 h-4 w-4 lg:h-3.5 lg:w-3.5" />
              </Button>
            </div>
          </div>

          {/* Premium Trust Badges */}
          <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50 border border-slate-100 rounded-xl mt-3 text-center">
            <div className="flex flex-col items-center justify-center p-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center mb-1">
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-800">Cash On Delivery</span>
              <span className="text-[10px] text-slate-600 mt-0.5">Nationwide</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 border-x border-slate-200/60">
              <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center mb-1">
                <Search className="h-4 w-4" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-800">Inspect First</span>
              <span className="text-[10px] text-slate-600 mt-0.5">Before Payment</span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5">
              <div className="w-8 h-8 rounded-full bg-purple-100/80 text-purple-600 flex items-center justify-center mb-1">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-[10px] md:text-xs font-bold text-slate-800">
                {isProductPreOrder(product) ? "Pre-Order" : "Fast Delivery"}
              </span>
              <span className="text-[10px] text-slate-600 mt-0.5">
                {isProductPreOrder(product) ? "Secured Booking" : "24 - 72 Hours"}
              </span>
            </div>
          </div>


        </div>
      </div>

      <div className="mt-6 mb-44 md:mb-24 lg:mb-0">
        <ProductDetailTabs product={product} />
      </div>
    </>
  );
}
