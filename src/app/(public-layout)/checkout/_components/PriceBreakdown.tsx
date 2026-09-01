"use client"

import { Separator } from "@/components/ui/separator"

interface PriceBreakdownProps {
  subtotal: number
  shippingCost: number
  discountAmount: number
  couponCode?: string
  total: number
}

const formatBDT = (n: number) => `৳${Math.round(n).toLocaleString("en-BD")}`

const PriceBreakdown = ({
  subtotal,
  shippingCost,
  discountAmount,
  couponCode,
  total,
}: PriceBreakdownProps) => {
  return (
    <div className="px-2 py-2 md:px-4 md:py-4 md:space-y-3 space-y-2">
      <div className="flex justify-between text-xs md:text-sm text-gray-600">
        <span>Product Price</span>
        <span className="font-semibold text-gray-800">{formatBDT(subtotal)}</span>
      </div>
      <div className="flex justify-between text-xs md:text-sm text-gray-600">
        <span>Delivery Charge</span>
        <span className="font-semibold text-gray-800">{formatBDT(shippingCost)}</span>
      </div>
      {discountAmount > 0 && (
        <div className="flex justify-between text-sm text-emerald-600 animate-in fade-in slide-in-from-right-2">
          <span>Discount ({couponCode})</span>
          <span className="font-semibold">-{formatBDT(discountAmount)}</span>
        </div>
      )}
      <Separator />
      <div className="flex justify-between text-base font-bold text-gray-900">
        <span>Total Payment</span>
        <span className="text-primary">{formatBDT(total)}</span>
      </div>
    </div>
  )
}

export default PriceBreakdown
