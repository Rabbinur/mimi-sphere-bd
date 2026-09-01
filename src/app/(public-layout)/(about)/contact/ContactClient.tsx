"use client";

import { cmsData } from "@/constants/cms";
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Headphones,
    HelpCircle,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    PhoneCall,
    Send,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const QUICK_TOPICS = [
    "Order Tracking",
    "Product Inquiry",
    "Return & Exchange",
    "Custom / Pre-Order",
    "Other",
];

const ContactClient = () => {
    const { company } = cmsData;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        topic: QUICK_TOPICS[0],
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: `[${formData.topic}] Inquiry from ${formData.phone || formData.name}`,
                    message: `Phone: ${formData.phone}\nTopic: ${formData.topic}\n\nMessage:\n${formData.message}`,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Thank you! Your message has been sent to our customer care team.");
                setFormData({ name: "", phone: "", email: "", topic: QUICK_TOPICS[0], message: "" });
            } else {
                toast.error(data.message || "Something went wrong. Please try WhatsApp.");
            }
        } catch (error) {
            toast.error("Failed to connect. Please reach us directly via WhatsApp or Call.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#f8fafc] min-h-screen pb-16">

            {/* 🌟 1. FULL WIDTH HERO BANNER */}
            <section className="w-full bg-gradient-to-r from-[#00172e] via-[#002447] to-[#071f3a] text-white py-12 md:py-16 shadow-xl border-b border-amber-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        
                        {/* Left Side: Headline & Quick Action Pills */}
                        <div className="lg:col-span-8 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                Mimi Sphere Customer Concierge
                            </div>

                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-snug">
                                How Can We Help You Today?
                            </h1>

                            <p className="text-slate-300 text-sm md:text-base max-w-xl font-normal leading-relaxed">
                                Get instant assistance with your order, product recommendations, or shipping inquiries across Bangladesh.
                            </p>

                            {/* Quick Action One-Click Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="https://wa.me/8801719713061"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp: 01719713061
                                </a>

                                <a
                                    href="tel:01719713061"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition-all"
                                >
                                    <PhoneCall className="w-4 h-4" />
                                    Call: 01719713061
                                </a>

                                <a
                                    href={`mailto:${company.email || "support@mimisphere.com"}`}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
                                >
                                    <Mail className="w-4 h-4 text-amber-400" />
                                    support@mimisphere.com
                                </a>
                            </div>
                        </div>

                        {/* Right Side: Fast Response Card */}
                        <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3.5 text-xs">
                            <div className="flex items-center gap-2.5 text-amber-300 font-bold uppercase tracking-wider text-[11px]">
                                <Headphones className="w-4 h-4" />
                                <span>Support Guarantee</span>
                            </div>

                            <div className="space-y-2.5 text-slate-200">
                                <div className="flex items-start gap-2">
                                    <Clock className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                    <span>Support Hours: <strong>9:00 AM – 11:00 PM</strong> (Everyday)</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                                    <span>Average WhatsApp response: <strong>Under 15 minutes</strong></span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                    <span>100% Authentic Products & Parcel Inspection</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 🌟 2. BODY CONTENT (TILES + FORM/FAQS) */}
            <div className="container mx-auto px-4 md:px-6 max-w-6xl mt-10 md:mt-14 space-y-10">

                {/* 🌟 2. THREE BESPOKE INTERACTIVE CHANNEL TILES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Tile 1: Phone & WhatsApp */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#002447] text-amber-400 flex items-center justify-center shadow-md">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#002447]">Direct Call & WhatsApp</h3>
                                <p className="text-xs text-slate-500 mt-1">Speak directly with our Dhaka customer service desk.</p>
                            </div>
                            <p className="text-lg font-black text-slate-900 tracking-tight">01719713061</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2">
                            <a
                                href="tel:01719713061"
                                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#002447] hover:text-white text-[#002447] text-xs font-bold text-center transition-colors"
                            >
                                Call Now
                            </a>
                            <a
                                href="https://wa.me/8801719713061"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white text-xs font-bold text-center transition-colors"
                            >
                                WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Tile 2: Official Email */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#002447]">Email Inquiries</h3>
                                <p className="text-xs text-slate-500 mt-1">For corporate, product sourcing or feedback.</p>
                            </div>
                            <p className="text-sm font-bold text-slate-900 break-all">{company.email || "support@mimisphere.com"}</p>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <a
                                href={`mailto:${company.email || "support@mimisphere.com"}`}
                                className="w-full block py-2 px-3 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 text-xs font-bold text-center transition-colors"
                            >
                                Send Email
                            </a>
                        </div>
                    </div>

                    {/* Tile 3: Social Communities */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                                <MapPin className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#002447]">Dhaka Hub & Socials</h3>
                                <p className="text-xs text-slate-500 mt-1">Delivery across all 64 districts in Bangladesh.</p>
                            </div>

                            {/* Social Icons Row */}
                            <div className="flex items-center gap-2 pt-1">
                                {[
                                    { name: "Facebook", url: "https://www.facebook.com/mimispherebd", icon: "/icons/facebook.png" },
                                    { name: "Instagram", url: "https://www.instagram.com/mimispherebd", icon: "/icons/instagram.png" },
                                    { name: "TikTok", url: "https://www.tiktok.com/@mimispherebd", icon: "/icons/tik-tok.png" },
                                    { name: "WhatsApp", url: "https://wa.me/8801719713061", icon: "/icons/whatsapp.png" },
                                ].map((item, i) => (
                                    <a
                                        key={i}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 flex items-center justify-center transition-all"
                                        title={item.name}
                                    >
                                        <div className="relative w-4 h-4">
                                            <Image src={item.icon} alt={item.name} fill className="object-contain" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <p className="text-[11px] font-semibold text-slate-400 text-center">Dhaka, Bangladesh</p>
                        </div>
                    </div>

                </div>

                {/* 🌟 3. MAIN FORM & FAQ CARDS (7 : 5 SPLIT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Form (7 cols) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-slate-200/80">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-black text-[#002447] tracking-tight">
                                Send a Direct Message
                            </h2>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Fill out the quick form and we’ll reach out to your phone or email.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Topic Picker */}
                            <div>
                                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    What is your inquiry about?
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {QUICK_TOPICS.map((topic) => (
                                        <button
                                            key={topic}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, topic })}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                formData.topic === topic
                                                    ? "bg-[#002447] text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Full Name & Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Your Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Nusrat Jahan"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#002447] focus:ring-2 focus:ring-[#002447]/10 outline-none text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#002447] focus:ring-2 focus:ring-[#002447]/10 outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Email Address (Optional)
                                </label>
                                <input
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#002447] focus:ring-2 focus:ring-[#002447]/10 outline-none text-sm transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Your Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Describe your inquiry, order number, or requirements..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#002447] focus:ring-2 focus:ring-[#002447]/10 outline-none text-sm transition-all resize-none"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
                                >
                                    <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Quick FAQs & Shopping Assurance (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                            <div className="flex items-center gap-2 text-[#002447]">
                                <HelpCircle className="w-5 h-5 text-amber-500" />
                                <h3 className="font-bold text-base">Quick Help & Answers</h3>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-800 mb-1">🚚 Delivery Time</p>
                                    <p className="text-slate-500 leading-relaxed">24–48 hours inside Dhaka and 48–72 hours anywhere across Bangladesh.</p>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-800 mb-1">📦 Check Before Payment</p>
                                    <p className="text-slate-500 leading-relaxed">You are fully allowed to inspect the parcel before paying the delivery agent.</p>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-800 mb-1">✨ 100% Authenticity</p>
                                    <p className="text-slate-500 leading-relaxed">All products on Mimi Sphere are genuine, authentic, and carefully curated.</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Fast Callout Card */}
                        <div className="rounded-3xl bg-[#25D366]/10 border border-[#25D366]/30 p-5 flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-[#1e964b] uppercase tracking-wider">Fastest Support</p>
                                <p className="text-sm font-black text-slate-900">Need instant answers?</p>
                                <p className="text-xs text-slate-600">Chat with our representative on WhatsApp.</p>
                            </div>
                            <a
                                href="https://wa.me/8801719713061"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shrink-0 shadow-sm flex items-center gap-1.5 transition-all"
                            >
                                <span>WhatsApp</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ContactClient;
