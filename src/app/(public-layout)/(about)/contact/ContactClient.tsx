"use client";

import { cmsData } from "@/constants/cms";
import {
    CheckCircle2,
    Clock,
    Headphones,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Share2,
    Sparkles
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const ContactClient = () => {
    const { company, social } = cmsData;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
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
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("Message sent successfully! Our team will contact you shortly.");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to connect to the server. Please call or WhatsApp us.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* 🌟 Brand Aligned Luxury Hero Header */}
            <section className="relative bg-gradient-to-r from-[#00172e] via-[#002447] to-[#0a2540] overflow-hidden shadow-lg border-b border-amber-500/20">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 md:px-6 py-14 md:py-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="text-white max-w-2xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider mb-6 text-amber-300">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                                </span>
                                24/7 Dedicated Assistance
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                                Contact <span className="text-amber-400">Mimi Sphere</span>
                            </h1>

                            <p className="text-slate-200 text-sm md:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                                Have questions about products, delivery, or custom orders? Reach out to us via call, WhatsApp, or message below.
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10 mt-6">
                                <div className="space-y-1">
                                    <p className="text-amber-300/80 text-[10px] uppercase font-bold tracking-widest">Call or WhatsApp</p>
                                    <a href={`tel:${company.phone || "01719713061"}`} className="text-2xl md:text-3xl font-black text-white hover:text-amber-400 transition-colors">
                                        {company.phone || "01719713061"}
                                    </a>
                                </div>
                                <div className="w-px h-12 bg-white/20 hidden sm:block" />
                                <div className="space-y-1">
                                    <p className="text-amber-300/80 text-[10px] uppercase font-bold tracking-widest">Support Email</p>
                                    <a href={`mailto:${company.email || "support@mimisphere.com"}`} className="text-base md:text-xl font-bold text-white hover:text-amber-400 transition-colors">
                                        {company.email || "support@mimisphere.com"}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Floating 24/7 Card */}
                        <div className="hidden lg:block relative w-full max-w-[320px] aspect-square">
                            <div className="absolute inset-0 bg-amber-500/20 rounded-[2.5rem] rotate-6 scale-95 blur-sm" />
                            <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-5 border border-slate-100 text-center">
                                <div className="w-20 h-20 bg-[#002447]/10 text-[#002447] rounded-3xl flex items-center justify-center shadow-inner">
                                    <Headphones className="w-10 h-10 text-[#002447]" />
                                </div>
                                <div>
                                    <p className="text-[#002447] font-black text-xl mb-1">Fast Response</p>
                                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                                        Instant replies on WhatsApp & response within 2-4 hours via email.
                                    </p>
                                </div>
                                <a
                                    href="https://wa.me/8801719713061"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all shadow-md"
                                >
                                    <div className="relative w-4 h-4">
                                        <Image src="/icons/whatsapp.png" alt="WhatsApp" fill className="object-contain brightness-0 invert" />
                                    </div>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📋 Main Grid */}
            <div className="container mx-auto px-4 md:px-6 mt-10 md:mt-14">
                <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">

                    {/* Left Column - Contact Info & Socials */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Direct Channels */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                            <h3 className="text-base md:text-lg font-bold text-[#002447] mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-amber-500" />
                                Direct Channels
                            </h3>

                            <div className="space-y-3">
                                <ContactInfoItem
                                    icon={Phone}
                                    label="Direct Call"
                                    value={company.phone || "01719713061"}
                                    href={`tel:${company.phone || "01719713061"}`}
                                    color="bg-[#002447] text-white"
                                />
                                <ContactInfoItem
                                    icon={MessageCircle}
                                    label="WhatsApp Chat"
                                    value="01719713061 (Instant Reply)"
                                    href="https://wa.me/8801719713061"
                                    color="bg-[#25D366] text-white"
                                />
                                <ContactInfoItem
                                    icon={Mail}
                                    label="Support Email"
                                    value={company.email || "support@mimisphere.com"}
                                    href={`mailto:${company.email || "support@mimisphere.com"}`}
                                    color="bg-amber-500 text-white"
                                />
                                <ContactInfoItem
                                    icon={MapPin}
                                    label="Office Address"
                                    value={company.address || "Dhaka, Bangladesh"}
                                    color="bg-slate-800 text-white"
                                />
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                            <h4 className="text-base md:text-lg font-bold text-[#002447] mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-amber-500" />
                                Connect with Mimi Sphere
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        platform: "Facebook",
                                        url: "https://www.facebook.com/mimispherebd",
                                        icon: "/icons/facebook.png",
                                        handle: "@mimispherebd",
                                    },
                                    {
                                        platform: "Instagram",
                                        url: "https://www.instagram.com/mimispherebd",
                                        icon: "/icons/instagram.png",
                                        handle: "@mimispherebd",
                                    },
                                    {
                                        platform: "WhatsApp",
                                        url: "https://wa.me/8801719713061",
                                        icon: "/icons/whatsapp.png",
                                        handle: "01719713061",
                                    },
                                    {
                                        platform: "TikTok",
                                        url: "https://www.tiktok.com/@mimispherebd",
                                        icon: "/icons/tik-tok.png",
                                        handle: "@mimispherebd",
                                    },
                                ].map((item, idx) => (
                                    <a
                                        key={idx}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-[#002447]/5 transition-all border border-slate-100 group hover:border-amber-400/40"
                                    >
                                        <div className="relative w-6 h-6 shrink-0 transition-transform group-hover:scale-110">
                                            <Image src={item.icon} alt={item.platform} fill className="object-contain" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#002447] truncate">
                                                {item.platform}
                                            </p>
                                            <p className="text-[10px] text-slate-400 truncate font-medium">{item.handle}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Customer Promise */}
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/80">
                            <h4 className="text-base md:text-lg font-bold text-[#002447] mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                                <Sparkles size={18} className="text-amber-500" />
                                Our Customer Promise
                            </h4>
                            <ul className="space-y-3.5">
                                <FeatureItem text="100% Authentic & Original Products" />
                                <FeatureItem text="Nationwide Express Home Delivery" />
                                <FeatureItem text="Secure Payments & Cash on Delivery" />
                                <FeatureItem text="Hassle-free 2-Day Return Policy" />
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200/80">
                        <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-black text-[#002447] mb-2">Send Us a Message</h3>
                            <div className="flex items-center gap-2 text-slate-500">
                                <Clock className="w-4 h-4 text-emerald-500" />
                                <p className="text-xs md:text-sm font-semibold">Average response time: within 2 to 4 hours.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FormLabel>Your Full Name</FormLabel>
                                    <FormInput
                                        placeholder="e.g. Nusrat Jahan"
                                        value={formData.name}
                                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormInput
                                        type="email"
                                        placeholder="yourname@gmail.com"
                                        value={formData.email}
                                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Subject</FormLabel>
                                <FormInput
                                    placeholder="e.g. Order Delivery Status or Product Inquiry"
                                    value={formData.subject}
                                    onChange={(e: any) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Your Message</FormLabel>
                                <textarea
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-400/15 focus:border-[#002447] outline-none transition-all resize-none text-sm font-medium placeholder:text-slate-400"
                                    placeholder="Please describe how we can assist you..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-2xl shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100 text-sm tracking-wide"
                                >
                                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- Helpers ---

const ContactInfoItem = ({ icon: Icon, label, value, href, color }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-amber-400/40 hover:bg-white transition-all group">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${color}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 tracking-wider">{label}</p>
            {href ? (
                <a href={href} className="text-sm font-bold text-slate-800 block truncate hover:text-amber-600 transition-colors">
                    {value}
                </a>
            ) : (
                <span className="text-sm font-bold text-slate-800 block leading-tight">{value}</span>
            )}
        </div>
    </div>
);

const FeatureItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3 text-xs md:text-sm text-slate-700 font-semibold">
        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={13} />
        </div>
        {text}
    </li>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">{children}</label>
);

const FormInput = (props: any) => (
    <input
        required
        {...props}
        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-amber-400/15 focus:border-[#002447] outline-none transition-all text-sm font-medium placeholder:text-slate-400"
    />
);

export default ContactClient;

