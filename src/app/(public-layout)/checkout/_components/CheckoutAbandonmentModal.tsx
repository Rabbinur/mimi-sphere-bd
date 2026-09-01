"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog"
import { Check, ChevronRight, Clock, Copy, Gift, ShieldCheck, Sparkles, X, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

interface CheckoutAbandonmentModalProps {
  isSubmitting?: boolean
}

const CheckoutAbandonmentModal = ({ isSubmitting = false }: CheckoutAbandonmentModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [isCopied, setIsCopied] = useState(false)

  const isSubmittingRef = useRef(isSubmitting)

  useEffect(() => {
    isSubmittingRef.current = isSubmitting
  }, [isSubmitting])

  const handleCopy = () => {
    navigator.clipboard.writeText("SAVE05")
    setIsCopied(true)
    toast.success("Coupon code copied!")
    setTimeout(() => setIsCopied(false), 2000)
  }

  useEffect(() => {
    setIsMounted(true)

    // 1. Tab/Window close warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSubmittingRef.current) return
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handleBeforeUnload)

    // 2. Back Button Interception
    const handlePopState = (e: PopStateEvent) => {
      if (isSubmittingRef.current) return
      if (!hasShown) {
        setIsOpen(true)
        setHasShown(true)
        window.history.pushState(null, "", window.location.href)
      }
    }

    // Push initial state immediately
    window.history.pushState(null, "", window.location.href)
    window.addEventListener("popstate", handlePopState)

    // 3. Exit Intent logic (Desktop)
    const handleMouseLeave = (e: MouseEvent) => {
      if (isSubmittingRef.current) return
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
  }, [hasShown])

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

  if (!isMounted) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90%] max-w-[500px] p-0 overflow-hidden border-none rounded-[1.5rem] md:rounded-[2rem] bg-[#0f172a] shadow-[0_0_50px_-12px_rgba(79,70,229,0.6)]">
        <div className="relative">
          {/* Enhanced Mesh Gradient Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[100px] animate-pulse delay-700" />
          </div>

          <div className="relative z-10">
            {/* Desktop Header Area - Hidden on Mobile */}
            <div className="hidden md:block pt-10 pb-6 px-8 text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-primary blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-primary rounded-3xl flex items-center justify-center shadow-2xl">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-amber-900" />
                </div>
              </div>
              <DialogTitle className="text-4xl font-black text-white mb-3 tracking-tight leading-tight">
                WAIT! <br /> GET 5% OFF NOW
              </DialogTitle>
              <DialogDescription className="text-slate-300 font-medium text-base max-w-[300px] mx-auto leading-relaxed">
                Complete your order now and save instantly!
              </DialogDescription>
            </div>

            {/* Mobile-Only Header - Very Compact */}
            <div className="md:hidden pt-8 pb-2 px-6 text-center">
              <DialogTitle className="text-xl font-black text-white tracking-tight">
                WAIT! <span className="text-cyan-400">GET 5% OFF</span>
              </DialogTitle>
            </div>

            {/* Offer Body */}
            <div className="px-5 md:px-8 pb-6 md:pb-10 space-y-4 md:space-y-6">
              {/* Voucher Card */}
              <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl md:rounded-3xl p-3 md:p-6 relative overflow-hidden">
                <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
                  <div className="text-left flex items-center gap-3">
                    <div>
                      <p className="text-[8px] md:text-[10px] uppercase font-black text-cyan-400 tracking-[0.2em] mb-0.5 md:mb-1">Voucher</p>
                      <span className="text-lg md:text-3xl font-black text-white tracking-wider uppercase">SAVE05</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="mt-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"
                      title="Copy Coupon"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-center bg-slate-900/50 rounded-lg md:rounded-2xl px-3 py-1.5 md:px-5 md:py-3 border border-white/10">
                    <div className="text-center">
                      <div className="hidden md:flex items-center justify-center gap-1.5 text-amber-400 text-[10px] font-black mb-1 uppercase tracking-widest">
                        <Clock className="w-2.5 h-2.5" />
                        Expires
                      </div>
                      <span className="text-sm md:text-xl font-black text-white tabular-nums tracking-widest">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Features - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-bold text-slate-100 uppercase tracking-wide">Secure</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] font-bold text-slate-100 uppercase tracking-wide">Fast</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 md:space-y-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-11 md:h-16 rounded-lg md:rounded-2xl bg-gradient-to-r from-indigo-600 to-primary text-white font-black text-xs md:text-lg shadow-xl shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  CLAIM DISCOUNT
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-1 text-slate-400 text-[8px] md:text-[11px] font-bold hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  I'll pay full price
                </button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-9 md:h-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-all z-20"
          >
            <X className="w-3 h-3 md:w-5 md:h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CheckoutAbandonmentModal
