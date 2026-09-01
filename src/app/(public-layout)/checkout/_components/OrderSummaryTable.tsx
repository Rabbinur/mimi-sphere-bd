"use client"

import { useAppDispatch } from "@/components/Redux/hooks"
import { removeFromCart, updateQuantity } from "@/components/Redux/Slice/cartSlice"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { CheckoutItem } from "../page"

interface OrderSummaryTableProps {
  items: CheckoutItem[]
}

const formatBDT = (n: number) => `৳${Math.round(n).toLocaleString("en-BD")}`

import { trackGAEvent } from "@/lib/pixel"

const OrderSummaryTable = ({ items }: OrderSummaryTableProps) => {
  const dispatch = useAppDispatch()

  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.cart_item_id === id)
    if (item) {
      trackGAEvent("remove_from_cart", {
        currency: "BDT",
        value: Number(item.price) * Number(item.quantity),
        items: [
          {
            item_id: item.sku || item.product_id,
            item_name: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity),
          },
        ],
      })
    }
    dispatch(removeFromCart(id))
    toast.success("Item removed")
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-2 py-2 md:px-3 md:py-3 border-b border-gray-100">
        <h2 className="font-bold text-sm text-gray-800">
          Order Summary — {items.length} item{items.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs font-bold text-amber-700 uppercase tracking-wider">
        <div className="col-span-6">Product Details</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">QTY</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-50">
        {items.length === 0 && (
          <div className="py-12 text-center text-gray-400">
            <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Your cart is empty</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.cart_item_id}
            className="grid grid-cols-12 items-center px-2 py-2 md:px-4 md:py-3 hover:bg-gray-50/60 transition-colors"
          >
            {/* Product Details */}
            <div className="col-span-12 md:col-span-6 flex gap-3 items-start">
              <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                <Image
                  src={item.thumbnail ?? "/placeholder.svg"}
                  alt={item.title}
                  width={56}
                  height={56}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 line-clamp-1 md:line-clamp-2 leading-snug ">
                  {item.title}
                </p>
                {item.selected_variant_values && (
                  <p className="text-[11px] text-primary mt-0.5">
                    {Object.entries(item.selected_variant_values)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(" • ")}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.cart_item_id)}
                  className="text-[11px] text-red-400 hover:text-red-600 mt-1 flex items-center gap-0.5 transition-colors"
                >
                  <X className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-4 md:col-span-2 text-center mt-2 md:mt-0">
              <span className="text-sm font-semibold text-gray-800">
                {formatBDT(item.price)}
              </span>
            </div>

            {/* QTY */}
            <div className="col-span-4 md:col-span-2 flex justify-center mt-2 md:mt-0">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  type="button"
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.cart_item_id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-xs font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        id: item.cart_item_id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="col-span-4 md:col-span-2 text-right mt-2 md:mt-0">
              <span className="text-sm font-bold text-primary">
                {formatBDT(item.price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal Footer */}
      {items.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50/60 flex justify-end">
          <span className="text-xs text-gray-500">
            {items.length} Item(s). Subtotal:{" "}
            <span className="font-bold text-gray-800">
              {formatBDT(items.reduce((sum, it) => sum + it.price * it.quantity, 0))}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

export default OrderSummaryTable
