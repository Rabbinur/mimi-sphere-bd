"use client"

import { ShoppingBag } from "lucide-react"

interface CheckoutHeaderProps {
  itemCount: number
}

const CheckoutHeader = ({ itemCount }: CheckoutHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-100 py-1.5 md:py-3 px-3 md:px-8">
      <div className="container mx-auto flex items-center gap-1.5 md:gap-2">
        <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
        <h1 className="text-sm md:text-base font-bold text-gray-800">Checkout</h1>
        <span className="text-gray-300 text-xs md:text-sm mx-0.5 md:mx-1">›</span>
        <span className="text-xs md:text-sm text-gray-500">
          {itemCount} item{itemCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  )
}

export default CheckoutHeader
