"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cmsData } from "@/constants/cms";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ToyBrick,
  Truck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success("Thank you for joining the Mimi Sphere family! 🧸✨");
    setNewsletterEmail("");
  };

  const usefulLinks = [
    { name: "Track Your Order", href: "/track-order" },
    { name: "Latest News", href: "/blogs" },
    { name: "Our Collections", href: "/categories" },
    { name: "Trusted Brands", href: "/brands" },
  ];

  const policyLinks = [
    { name: "Shipping & Delivery", href: "/shipping-policy" },
    { name: "Returns & Refunds", href: "/return-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-[#001429] text-slate-400 border-t border-slate-800 relative overflow-hidden">
      
      {/* ── 1. Top Newsletter & Family Club Banner ─────────────────────────────── */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#00172e] via-[#002447] to-[#07192f] py-10 md:py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Join the Mimi Sphere Family 🧸
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Smart Gadgets &amp; Learning Toys for Kids
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Subscribe for exclusive discount vouchers, smart parenting toy tips, and early-bird access to new arrivals.
              </p>
            </div>

            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto max-w-md flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm outline-none focus:border-amber-400 focus:bg-white/15 transition-all w-full sm:w-72"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── 2. Value Props (4 Pillars of Trust) ─────────────────────────────── */}
      <div className="border-b border-white/5 bg-[#001021]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <FeaturePillar
              icon={<ToyBrick className="w-5 h-5 text-amber-400" />}
              title="Creative Learning Toys"
              desc="Interactive STEM & Montessori Play"
            />
            <FeaturePillar
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              title="Quality You Can Trust"
              desc="100% Child-Safe & Tested"
            />
            <FeaturePillar
              icon={<Truck className="w-5 h-5 text-amber-400" />}
              title="Nationwide Delivery"
              desc="Fast 48-72h All 64 Districts"
            />
            <FeaturePillar
              icon={<CheckCircle2 className="w-5 h-5 text-blue-400" />}
              title="Inspect Before Payment"
              desc="Peace of Mind Cash on Delivery"
            />
          </div>
        </div>
      </div>

      {/* ── 3. Main Footer Content (4 Columns) ────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block p-2.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:scale-[1.02] transition-transform" aria-label="Mimi Sphere Home">
              <Image
                src="/logo.png"
                alt="Mimi Sphere Logo"
                width={150}
                height={42}
                quality={90}
                className="object-contain"
                style={{ width: "auto", height: "38px" }}
              />
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 max-w-sm">
              <strong className="text-amber-400 font-bold">Mimi Sphere</strong> — Smart gadgets &amp; creative learning toys for happy, smarter kids. 🧸📱 Quality you can trust, delivered across Bangladesh. 🚚
            </p>

            {/* Social Media Channels */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Connect With Us</p>
              <div className="flex items-center gap-2.5">
                {[
                  { platform: "Facebook", url: "https://www.facebook.com/mimispherebd", icon: "/icons/facebook.png" },
                  { platform: "Instagram", url: "https://www.instagram.com/mimispherebd", icon: "/icons/instagram.png" },
                  { platform: "WhatsApp", url: "https://wa.me/8801719713061", icon: "/icons/whatsapp.png" },
                  { platform: "TikTok", url: "https://www.tiktok.com/@mimispherebd", icon: "/icons/tik-tok.png" },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-white/10 flex items-center justify-center transition-all group"
                  >
                    <div className="relative w-4 h-4">
                      <Image src={social.icon} alt={social.platform} fill className="object-contain" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Useful Links (3 cols) — Desktop */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {usefulLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-400 hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies (2 cols) — Desktop */}
          <div className="hidden lg:block lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/10 pb-2">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              {policyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-slate-300 hover:text-amber-400 hover:translate-x-1 inline-block transition-all"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Helpline & Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-white/10 pb-2">
              Customer Helpline
            </h3>

            <div className="space-y-3 text-xs">
              {/* Phone */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-lg bg-[#002447] text-amber-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Direct Helpline</p>
                  <a href="tel:01719713061" className="text-sm font-bold text-white hover:text-amber-400 transition-colors">
                    01719713061
                  </a>
                </div>
              </div>

              {/* WhatsApp Live */}
              <a
                href="https://wa.me/8801719713061"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 uppercase font-bold">WhatsApp Live Support</p>
                    <p className="text-xs font-bold text-white">01719713061</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Chat →
                </span>
              </a>

              {/* Email & Location */}
              <div className="space-y-1.5 pt-1 text-slate-300">
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <a href="mailto:support@mimisphere.com" className="hover:text-amber-400 transition-colors">
                    support@mimisphere.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Mobile Accordion for Navigation & Policies ── */}
          <div className="lg:hidden md:col-span-2 border border-slate-800 rounded-2xl overflow-hidden bg-white/5">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="nav" className="border-b border-slate-800 px-4">
                <AccordionTrigger className="text-xs font-bold text-amber-400 uppercase tracking-wider py-4 hover:no-underline">
                  Quick Links
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {usefulLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policy" className="border-0 px-4">
                <AccordionTrigger className="text-xs font-bold text-amber-400 uppercase tracking-wider py-4 hover:no-underline">
                  Customer Care &amp; Policies
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-2.5">
                    {policyLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>
      </div>

      {/* ── 4. Bottom Bar (Copyright & Payments) ─────────────────────────────────── */}
      <div className="border-t border-white/5 bg-[#000d1a] py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-white font-bold">Mimi Sphere</span>. All rights reserved.
            </p>

            <p className="text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for happy kids &amp; families in Bangladesh
            </p>

            {/* Payment & COD Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {["Cash on Delivery", "bKash", "Nagad", "VISA", "Mastercard"].map((label) => (
                <span
                  key={label}
                  className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-amber-300/80"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

/* ── Helper Component: Feature Pillar ─────────────────────────────── */

const FeaturePillar = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex items-center gap-3 group">
    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 group-hover:border-amber-400/50 transition-all duration-300">
      {icon}
    </div>
    <div>
      <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5">
        {title}
      </h4>
      <p className="text-[11px] text-slate-400 font-medium leading-tight">{desc}</p>
    </div>
  </div>
);

export default Footer;