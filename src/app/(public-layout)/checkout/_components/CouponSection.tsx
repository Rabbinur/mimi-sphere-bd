"use client"

import { useState } from "react"
import { toast } from "sonner"
import { ShieldCheck, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApplyCouponMutation } from "@/components/Redux/RTK/couponApi"
import { CheckoutItem } from "../page"

interface CouponSectionProps {
  items: CheckoutItem[]
  onApply: (coupon: { code: string; discountAmount: number } | null) => void
  appliedCoupon: { code: string; discountAmount: number } | null
}

const CouponSection = ({ items, onApply, appliedCoupon }: CouponSectionProps) => {
  const [couponCode, setCouponCode] = useState("")
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation()

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    try {
      const res = await applyCoupon({
        couponCode: couponCode,
        products: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      }).unwrap()

      if (res.success) {
        onApply({
          code: res.couponCode,
          discountAmount: res.discountAmount
        })
        toast.success(res.message)
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid coupon code")
      onApply(null)
    }
  }

  const handleRemoveCoupon = () => {
    onApply(null)
    setCouponCode("")
    toast.info("Coupon removed")
  }

  return (
    <div className="px-4 pb-4">
      <p className="text-xs font-bold text-gray-700 mb-2">Have a Coupon?</p>
      <div className="flex gap-2">
        <Input
          placeholder="Promo / Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          className="h-9 text-sm border-gray-200 rounded-lg"
          disabled={!!appliedCoupon}
        />
        {appliedCoupon ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemoveCoupon}
            className="h-9 px-3 text-xs font-bold border-red-200 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
          >
            Remove
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={isApplying || !couponCode}
            onClick={handleApplyCoupon}
            className="h-9 px-3 text-xs font-bold border-primary text-primary hover:bg-primary/5 rounded-lg shrink-0"
          >
            {isApplying ? "..." : "Apply"}
          </Button>
        )}
      </div>
      {appliedCoupon && (
        <div className="flex items-center justify-between mt-1 ml-1">
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Coupon Applied ({appliedCoupon.code})
          </p>
          <button 
            onClick={handleRemoveCoupon}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export default CouponSection
