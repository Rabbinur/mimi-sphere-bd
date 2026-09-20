"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog"
import { useGetCmsQuery } from "@/components/Redux/RTK/cmsApi"
import { Check, ChevronRight, Clock, Copy, Gift, ShieldCheck, Sparkles, X, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface CheckoutAbandonmentModalProps {
  isSubmitting?: boolean
}

const CheckoutAbandonmentModal = ({ isSubmitting = false }: CheckoutAbandonmentModalProps) => {
  const { data: cmsResponse } = useGetCmsQuery()
  const popup = cmsResponse?.data?.exitIntentPopup

  const isEnabled = popup?.isEnabled !== false
  const title = popup?.title || "WAIT! GET 5% OFF NOW"
  const subtitle = popup?.subtitle || "Complete your order now and save instantly!"
  const voucherCode = popup?.voucherCode || "SAVE05"
  const discountText = popup?.discountText || "5% OFF"
  const expiryMinutes = popup?.expiryMinutes || 5
  const ctaText = popup?.ctaText || "CLAIM DISCOUNT"
  const declineText = popup?.declineText || "I'll pay full price"

  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60)
  const [isCopied, setIsCopied] = useState(false)

  const isSubmittingRef = useRef(isSubmitting)

  useEffect(() => {
    isSubmittingRef.current = isSubmitting
  }, [isSubmitting])

  useEffect(() => {
    if (popup?.expiryMinutes) {
      setTimeLeft(popup.expiryMinutes * 60)
    }
  }, [popup?.expiryMinutes])

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode)
    setIsCopied(true)
    toast.success(`Coupon code ${voucherCode} copied!`)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleClaim = () => {
    navigator.clipboard.writeText(voucherCode)
    toast.success(`Voucher ${voucherCode} copied! Apply it to your order.`, {
      icon: "🎉",
    })
    setIsOpen(false)
  }

  useEffect(() => {
    setIsMounted(true)

    // If disabled in admin settings, do not register exit listeners
    if (!isEnabled) return

    // 1. Tab/Window close warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmittingRef.current || !isEnabled) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    // 2. Back Button Interception
    const handlePopState = () => {
      if (isSubmittingRef.current || !isEnabled) return
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
        window.history.pushState(null, "", window.location.href)
      }
    }

    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    // 3. Exit Intent logic (Desktop mouse leaving toward address bar)
    const handleMouseLeave = (e: MouseEvent) => {
      if (isSubmittingRef.current || !isEnabled) return
      if (e.clientY <= 10 && !hasShown) {
        setIsOpen(true)
        setHasShown(true)
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [hasShown, isEnabled])

  // Countdown timer logic
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isMounted || !isEnabled) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[92%] max-w-[460px] p-0 overflow-hidden border border-amber-500/30 rounded-[2rem] bg-gradient-to-b from-[#00172e] via-[#002447] to-[#001124] text-white shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_60px_rgba(245,158,11,0.18)]">
        <div className="relative p-6 sm:p-8">
          {/* Ambient Lighting Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Sparkles */}
          <div className="absolute top-6 left-6 text-amber-400/40 animate-pulse pointer-events-none">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute top-10 right-12 text-amber-300/30 animate-pulse delay-500 pointer-events-none">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all z-20 cursor-pointer"
            aria-label="Close discount popup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 text-center space-y-5 pt-2">
            {/* 3D Gift Box Badge */}
            <div className="relative inline-block">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.45)] ring-4 ring-amber-400/20 transition-transform">
                <Gift className="w-8 h-8 stroke-[2.2]" />
              </div>
              {discountText && (
                <span className="absolute -top-2 -right-3 px-2.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-black tracking-wider text-white shadow-md uppercase ring-2 ring-[#00172e]">
                  {discountText}
                </span>
              )}
            </div>

            {/* Headline & Description */}
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {title}
              </DialogTitle>
              <DialogDescription className="text-slate-300 text-xs sm:text-sm font-normal max-w-[320px] mx-auto leading-relaxed">
                {subtitle}
              </DialogDescription>
            </div>

            {/* Golden Ticket Voucher Card */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-dashed border-amber-400/40 rounded-2xl p-4 sm:p-4.5 relative overflow-hidden shadow-inner">
              {/* Notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00172e] border border-amber-400/40" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#00172e] border border-amber-400/40" />

              <div className="flex items-center justify-between px-2 sm:px-3 gap-3">
                {/* Coupon Code Area */}
                <div className="text-left">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400 block mb-0.5">
                    Voucher Code
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-xl sm:text-2xl text-white tracking-wider uppercase select-all">
                      {voucherCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-amber-300 hover:text-white transition-all active:scale-90 cursor-pointer"
                      title="Copy Coupon"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expiry Countdown Timer */}
                <div className="bg-[#001222]/90 border border-amber-400/25 rounded-xl px-3 py-1.5 text-center min-w-[78px] shrink-0">
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-[9px] font-black uppercase tracking-widest mb-0.5">
                    <Clock className="w-2.5 h-2.5 animate-pulse" />
                    Expires
                  </div>
                  <span className="text-sm sm:text-base font-black text-white tabular-nums tracking-wider">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2 text-center pt-1">
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] font-medium text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] font-medium text-slate-300">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Instant Savings</span>
              </div>
            </div>

            {/* CTA & Dismiss Buttons */}
            <div className="space-y-3 pt-2">
              <Button
                type="button"
                onClick={handleClaim}
                className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-[0_8px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_10px_35px_rgba(245,158,11,0.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer border-0"
              >
                <span>{ctaText}</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-1 text-slate-400 hover:text-slate-200 text-[11px] font-semibold tracking-wider transition-colors uppercase cursor-pointer"
              >
                {declineText}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutAbandonmentModal
