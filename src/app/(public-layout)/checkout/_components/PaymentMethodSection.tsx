"use client"

import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

const PaymentMethodSection = () => {
  const { register, watch } = useFormContext()
  const paymentMethod = watch("payment_method")

  return (
    <div className="my-2 md:my-4">
      <div className="px-2 py-2 border-b border-gray-100">
        <h2 className="font-bold text-sm text-gray-800">Payment Method</h2>
      </div>

      <div className="p-2 grid grid-cols-2 gap-1 md:gap-2 mb-1">
        {[
          {
            label: "Cash on Delivery",
            value: "COD",
            img: "/assets/cod.svg",
          },
          {
            label: "Bkash Payment",
            value: "ONLINE",
            img: "/assets/bkash.png",
          },
        ].map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md md:rounded-lg border cursor-pointer transition-all duration-200
              ${paymentMethod === opt.value
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white"
              }`}
          >
            <input
              type="radio"
              value={opt.value}
              {...register("payment_method")}
              className="sr-only"
            />

            {/* Image Icon */}
            <div className="w-7 h-7 flex items-center justify-center shrink-0">
              <Image
                width={28}
                height={28}
                src={opt.img}
                alt={opt.label}
                className="w-6 h-6 object-contain"
              />
            </div>

            <p
              className={`text-xs font-semibold truncate ${paymentMethod === opt.value ? "text-primary" : "text-gray-700"
                }`}
            >
              {opt.label}
            </p>

            {paymentMethod === opt.value && (
              <CheckCircle2 className="w-3 h-3 text-primary ml-auto shrink-0" />
            )}
          </label>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodSection
