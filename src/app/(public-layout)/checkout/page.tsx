"use client"

import { getOrCreateFbc, getOrCreateFbp, getOrCreateGuestId, trackPixelEvent, trackGAEvent } from "@/lib/pixel"
import { useEffect, useMemo, useRef, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useOrderNowMutation } from "@/components/Redux/RTK/orderApi"
import { useUpsertCheckoutLeadMutation } from "@/components/Redux/RTK/checkoutLeadApi"
import { useAppDispatch, useAppSelector } from "@/components/Redux/hooks"
import type { RootState } from "@/components/Redux/store"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CheckoutAbandonmentModal from "./_components/CheckoutAbandonmentModal"
import CheckoutHeader from "./_components/CheckoutHeader"
import CouponSection from "./_components/CouponSection"
import CustomerInfoSection from "./_components/CustomerInfoSection"
import OrderSummaryTable from "./_components/OrderSummaryTable"
import PaymentMethodSection from "./_components/PaymentMethodSection"
import PriceBreakdown from "./_components/PriceBreakdown"

/* ---------------- Types ---------------- */

export type CheckoutItem = {
  cart_item_id: string
  product_id: string
  variant_id?: string | null
  title: string
  thumbnail?: string
  price: number
  quantity: number
  is_free_delivery?: boolean
  delivery_charge?: {
    inside_dhaka?: number
    outside_dhaka?: number
  }
  selected_variant_values?: Record<string, string>
  sku?: string
  slug?: string
  discount_amount?: number
  store_id?: string | null
}

type CheckoutFormValues = {
  customer_name: string
  phone: string
  email?: string
  village_or_area: string
  upazila: string
  district: string
  payment_method: "COD" | "ONLINE"
  delivery_zone: "inside" | "outside"
  notes?: string
  online_payment_details?: {
    provider: string
    trx_id: string
    proof: string
  }
}

const formatBDT = (n: number) => `৳${Math.round(n).toLocaleString("en-BD")}`

const CheckoutPage = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const cartItems = useAppSelector((s: RootState) => s.cart.cartItems) || []
  const userInfo = useAppSelector((s: RootState) => s.auth.userInfo)

  const [orderNow, { isLoading }] = useOrderNowMutation()

  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null)
  const [agreed, setAgreed] = useState(true)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  /* ---------- Normalize Cart ---------- */
  const checkoutItems: CheckoutItem[] = useMemo(() => {
    return cartItems.map((item: any) => ({
      cart_item_id: String(item?.id ?? ""),
      product_id: String(item?.product_id ?? item?.id ?? ""),
      variant_id: item?.variant_id ?? null,
      title: item?.title || "Unnamed product",
      thumbnail: item?.thumbnail,
      price: Number(item?.price ?? 0),
      quantity: Math.max(1, Number(item?.quantity ?? 1)),
      is_free_delivery: !!item?.is_free_delivery,
      delivery_charge: item?.delivery_charge,
      selected_variant_values: item?.selected_variant_values,
      sku: item?.sku,
      slug: item?.slug || item?.url_handle || String(item?.product_id ?? item?.id ?? ""),
      discount_amount: item?.discount_amount || 0,
      store_id: item?.store_id || null,
    }))
  }, [cartItems])

  const subtotal = checkoutItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0
  )

  /* ---------- Form ---------- */
  const form = useForm<CheckoutFormValues>({
    mode: "onTouched",
    shouldFocusError: true,
    defaultValues: {
      customer_name: userInfo?.name || "",
      phone: userInfo?.phone || "",
      email: userInfo?.email || "",
      village_or_area: "",
      upazila: "",
      district: "",
      payment_method: "COD",
      delivery_zone: "inside",
      notes: "",
    },
  })

  const { watch } = form
  const deliveryZone = watch("delivery_zone")
  const customerName = watch("customer_name")
  const phone = watch("phone")
  const email = watch("email")
  const district = watch("district")
  const upazila = watch("upazila")
  const villageOrArea = watch("village_or_area")

  const [upsertCheckoutLead] = useUpsertCheckoutLeadMutation()

  const getOrInitializeCheckoutSession = () => {
    if (typeof window === "undefined") return "";
    let sessionId = localStorage.getItem("checkout_session_id");
    if (!sessionId) {
      sessionId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `crs_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("checkout_session_id", sessionId);
    }
    return sessionId;
  };

  // Generate a persistent eventId for this checkout session to allow deduplication & merging
  const checkoutEventId = useRef<string>("")
  useEffect(() => {
    checkoutEventId.current = `chk_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`
  }, [])

  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsMobileNavVisible(false)
      } else {
        setIsMobileNavVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Debounced CAPI Tracking for InitiateCheckout to capture guest user data as they type
  const lastTrackedData = useRef<string>("")
  useEffect(() => {
    if (!isMounted || checkoutItems.length === 0 || !checkoutEventId.current) return;

    const delayDebounceFn = setTimeout(() => {
      const nameParts = (customerName || "").trim().split(/\s+/);
      const fn = nameParts[0] || "";
      const ln = nameParts.slice(1).join(" ") || "";
      const currentDistrict = district || "";
      const currentUpazila = upazila || "";

      const payloadString = JSON.stringify({
        customerName,
        phone,
        email,
        currentDistrict,
        currentUpazila,
      });

      if (lastTrackedData.current === payloadString) return;
      lastTrackedData.current = payloadString;

      const contentIds = checkoutItems.map(item => item.sku || item.product_id)
      trackPixelEvent(
        "InitiateCheckout",
        {
          content_ids: contentIds,
          content_type: "product",
          value: subtotal,
          currency: "BDT",
          num_items: checkoutItems.reduce((acc, item) => acc + item.quantity, 0),
        },
        {
          fn,
          ln,
          ph: phone || "",
          em: email || "",
          ct: currentDistrict,
          st: currentUpazila,
          country: "bd",
        },
        checkoutEventId.current
      )
    }, 2000) // 2 seconds debounce

    return () => clearTimeout(delayDebounceFn)
  }, [
    isMounted,
    checkoutItems,
    subtotal,
    customerName,
    phone,
    email,
    district,
    upazila,
  ])

  const hasFreeShipping = checkoutItems.some(item => item.is_free_delivery)

  const shippingCost = useMemo(() => {
    if (hasFreeShipping) return 0
    const charges = checkoutItems.map(item => {
      const inside = item.delivery_charge?.inside_dhaka ?? 60
      const outside = item.delivery_charge?.outside_dhaka ?? 120
      return deliveryZone === "inside" ? inside : outside
    })
    return charges.length > 0 ? Math.max(...charges) : (deliveryZone === "inside" ? 60 : 120)
  }, [checkoutItems, hasFreeShipping, deliveryZone])

  const discountAmount = appliedCoupon?.discountAmount || 0
  const total = Math.max(0, subtotal + shippingCost - discountAmount)

  useEffect(() => {
    if (!isMounted || checkoutItems.length === 0) return;

    const isPhoneValid = phone && phone.replace(/\D/g, "").length >= 11;
    const isPartialComplete = customerName && phone;

    if (isPhoneValid || isPartialComplete) {
      const delayDebounceFn = setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);

        const getDeviceType = () => {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
          if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
          return "desktop";
        };

        const getBrowserName = () => {
          const ua = navigator.userAgent;
          if (ua.includes("Firefox")) return "Firefox";
          if (ua.includes("SamsungBrowser")) return "Samsung Browser";
          if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
          if (ua.includes("Trident")) return "Internet Explorer";
          if (ua.includes("Edge")) return "Edge";
          if (ua.includes("Chrome")) return "Chrome";
          if (ua.includes("Safari")) return "Safari";
          return "Unknown";
        };

        const cartItemsSnapshot = checkoutItems.map(item => ({
          productId: item.product_id,
          productName: item.title,
          sku: item.sku || "",
          image: item.thumbnail || "",
          slug: item.slug || "",
          price: item.price,
          discount: item.discount_amount || 0,
          quantity: item.quantity,
          variant: item.selected_variant_values || null,
          storeId: item.store_id || null
        }));

        upsertCheckoutLead({
          checkoutSessionId: getOrInitializeCheckoutSession(),
          userId: userInfo?._id || null,
          customerName,
          phone,
          email: email || "",
          district: district || "",
          upazila: upazila || "",
          villageOrArea: villageOrArea || "",
          cartItems: cartItemsSnapshot,
          totalPrice: total,
          utmSource: urlParams.get("utm_source") || "",
          utmMedium: urlParams.get("utm_medium") || "",
          utmCampaign: urlParams.get("utm_campaign") || "",
          fbclid: urlParams.get("fbclid") || "",
          gclid: urlParams.get("gclid") || "",
          referer: document.referrer || "",
          device: getDeviceType(),
          browser: getBrowserName(),
        }).unwrap().catch(err => console.error("Checkout lead save failure:", err));
      }, 3000); // 3 seconds debounce

      return () => clearTimeout(delayDebounceFn);
    }
  }, [customerName, phone, email, district, upazila, villageOrArea, checkoutItems, total, isMounted, userInfo])

  const onSubmit = async (values: CheckoutFormValues) => {
    if (!checkoutItems.length) {
      toast.error("Your cart is empty")
      return
    }
    if (!agreed) {
      toast.error("Please agree to the terms & conditions")
      return
    }

    setIsSubmitting(true)

    // Track GA4 add_shipping_info
    trackGAEvent("add_shipping_info", {
      shipping_tier: values.delivery_zone === "inside" ? "Inside Dhaka" : "Outside Dhaka",
      currency: "BDT",
      value: total,
      items: checkoutItems.map((item) => ({
        item_id: item.sku || item.product_id,
        item_name: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    });

    // Track GA4 add_payment_info
    trackGAEvent("add_payment_info", {
      payment_type: values.payment_method === "ONLINE" ? "Online Payment (bKash)" : "Cash on Delivery",
      currency: "BDT",
      value: total,
      items: checkoutItems.map((item) => ({
        item_id: item.sku || item.product_id,
        item_name: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    });

    const payload = {
      checkoutSessionId: getOrInitializeCheckoutSession(),
      customer_name: values.customer_name,
      phone: values.phone,
      email: values.email || userInfo?.email || "",
      village_or_area: values.village_or_area,
      upazila: values.upazila,
      district: values.district,
      payment_method: values.payment_method,
      payment_status: "pending",
      order_status: "pending",
      notes: values.notes,
      delivery_zone:
        values.delivery_zone === "inside" ? "inside_dhaka" : "outside_dhaka",
      delivery_charge: shippingCost,
      coupon: appliedCoupon?.code || null,
      discount_amount: discountAmount,
      ...(values.payment_method === "ONLINE" && {
        online_payment_details: values.online_payment_details,
      }),
      products: checkoutItems.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
      })),
      total_price: total,
      tracking_data: {
        fbc: getOrCreateFbc(),
        fbp: getOrCreateFbp(),
        external_id: userInfo?._id || getOrCreateGuestId(),
      },
    }

    try {
      const res = await orderNow(payload).unwrap()
      if (res.success) {
        if (typeof window !== "undefined") {
          const nameParts = (values.customer_name || "").trim().split(/\s+/);
          const fn = nameParts[0] || "";
          const ln = nameParts.slice(1).join(" ") || "";
          const userDataToStore = {
            em: values.email || userInfo?.email || "",
            ph: values.phone || "",
            fn,
            ln,
            ct: values.district || "",
            st: values.upazila || "",
            country: "bd",
            external_id: userInfo?._id || "",
          };
          sessionStorage.setItem("last_order_user_data", JSON.stringify(userDataToStore));
        }

        // If payment method is Online, redirect to bKash URL returned from the server
        if (values.payment_method === "ONLINE" && res.bkashURL) {
          localStorage.removeItem("checkout_session_id");
          window.location.href = res.bkashURL;
          return;
        }

        localStorage.removeItem("checkout_session_id");
        toast.success("Order placed successfully 🎉")
        router.push(`/payment/success?orderId=${res?.data?.order_id}`)
      } else {
        setIsSubmitting(false)
      }
    } catch (error: any) {
      setIsSubmitting(false)
      toast.error(error?.data?.message || "Something went wrong")
    }
  }

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <FormProvider {...form}>
      <div className="bg-gray-50 min-h-screen pb-48 lg:pb-10">
        <CheckoutHeader itemCount={checkoutItems.length} />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="container mx-auto px-2 md:px-4 lg:px-6 py-2 md:py-5 grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-5">

            {/* ===== LEFT COLUMN ===== */}
            <div className="lg:col-span-8 space-y-4">
              <CustomerInfoSection />
              <OrderSummaryTable items={checkoutItems} />
            </div>

            {/* ===== RIGHT SIDEBAR ===== */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-20 space-y-0 overflow-hidden">
                <div className="px-2 py-2 md:px-3 md:py-3 border-b border-gray-100">
                  <h2 className="font-bold text-sm text-gray-800">Order Summary</h2>
                </div>

                <PriceBreakdown
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  discountAmount={discountAmount}
                  couponCode={appliedCoupon?.code}
                  total={total}
                />

                <CouponSection
                  items={checkoutItems}
                  appliedCoupon={appliedCoupon}
                  onApply={setAppliedCoupon}
                />

                {/* Desktop-only Payment, Terms and CTA */}
                <div className="hidden lg:block">
                  <PaymentMethodSection />

                  {/* Terms */}
                  <div className="px-4 pb-4">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 accent-primary"
                      />
                      <span className="text-[11px] text-gray-600 leading-snug">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary font-medium hover:underline">Terms & Conditions</Link>,{" "}
                        <Link href="/privacy-policy" className="text-primary font-medium hover:underline">Privacy Policy</Link> and{" "}
                        <Link href="/return-policy" className="text-primary font-medium hover:underline">Return & Refund Policy</Link>.
                      </span>
                    </label>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <Button
                      type="submit"
                      disabled={isLoading || checkoutItems.length === 0 || !agreed}
                      className="w-full h-11 text-sm font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      {isLoading
                        ? "Processing..."
                        : `Order & Pay • ${formatBDT(total)}`}
                    </Button>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="px-4 pb-4 border-t border-gray-50 pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-bold">Your information is protected</p>
                  </div>
                  {[
                    "End-to-end encrypted checkout",
                    "Your payment details are never stored",
                    "All data is encrypted & secure",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <p className="text-[11px] text-gray-600">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar for Mobile (Cash on Delivery & bKash Selection + CTA) */}
          <div className={`fixed left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-3 z-40 lg:hidden transition-all duration-300 ease-in-out ${
            isMobileNavVisible ? "bottom-16" : "bottom-0"
          }`}>
            <div className="max-w-md mx-auto space-y-2.5">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Cash on Delivery", value: "COD" },
                  { label: "bKash Payment", value: "ONLINE" }
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-center py-2.5 px-3 rounded-lg border text-xs font-bold cursor-pointer transition-all duration-200 text-center
                      ${watch("payment_method") === opt.value
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-gray-200 bg-white text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      {...form.register("payment_method")}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              {/* Terms and Button row */}
              <div className="flex items-center justify-between gap-4 pt-1.5 border-t border-gray-50">
                <div className="flex-1">
                  <label className="flex items-start gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 accent-primary h-3.5 w-3.5 shrink-0"
                    />
                    <span className="text-[9px] text-gray-500 leading-tight">
                      I agree to the <Link href="/terms" className="text-primary hover:underline font-medium">Terms</Link> & <Link href="/privacy-policy" className="text-primary hover:underline font-medium">Privacy</Link>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || checkoutItems.length === 0 || !agreed}
                  className="h-10 px-4 text-xs font-bold rounded-xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 shrink-0"
                >
                  {isLoading ? "Processing..." : `Order & Pay • ${formatBDT(total)}`}
                </Button>
              </div>
            </div>
          </div>
        </form>
        <CheckoutAbandonmentModal isSubmitting={isSubmitting || isLoading} />
      </div>
    </FormProvider>
  )
}

export default CheckoutPage
