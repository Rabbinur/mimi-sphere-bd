"use client";

import { cmsData } from "@/constants/cms";
import {
    Briefcase,
    CheckCircle2,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Share2
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
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            toast.error("Failed to connect to the server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Brand Aligned Header */}
            <section className="relative bg-primary overflow-hidden shadow-md">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="text-white max-w-2xl text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                </span>
                                Get In Touch
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                                We&apos;re Here to <br className="hidden md:block" />
                                <span className="text-secondary">Help You Shop</span>
                            </h1>
                            <p className="text-blue-50 text-sm md:text-lg font-medium leading-relaxed mb-8 max-w-xl">
                                Have a question about an order, product, or delivery? Reach out to our dedicated support team for assistance.
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 mt-10">
                                <div className="space-y-1">
                                    <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Customer Support</p>
                                    <a href={`tel:${company.phone}`} className="text-xl md:text-2xl font-black text-white hover:text-secondary transition-colors">
                                        {company.phone}
                                    </a>
                                </div>
                                <div className="w-px h-10 bg-white/30 hidden sm:block" />
                                <div className="space-y-1">
                                    <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Email Address</p>
                                    <p className="text-base md:text-lg font-bold text-white">{company.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block relative w-full max-w-[300px] aspect-square">
                            <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-6 scale-95" />
                            <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-100">
                                <div className="w-20 h-20 bg-primary/5 text-primary rounded-3xl flex items-center justify-center">
                                    <MessageCircle className="w-10 h-10" />
                                </div>
                                <div className="text-center px-4">
                                    <p className="text-gray-900 font-black text-xl mb-1">24/7 Support</p>
                                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                        We respond within 4 business hours.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-2 md:px-4 lg:px-6 mt-8 md:mt-12">
                <div className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">

                    {/* Left Column - Contact Info */}
                    <div className="lg:col-span-4 md:space-y-6 space-y-3">
                        {/* Direct Support Card */}
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Direct Support</h3>

                            <div className="md:space-y-3 space-y-2">
                                <ContactInfoItem
                                    icon={Phone}
                                    label="Call Support"
                                    value={company.phone}
                                    href={`tel:${company.phone}`}
                                    color="group-hover:bg-primary group-hover:text-white"
                                />
                                <ContactInfoItem
                                    icon={Mail}
                                    label="Email Inquiry"
                                    value={company.email}
                                    href={`mailto:${company.email}`}
                                    color="group-hover:bg-secondary group-hover:text-white"
                                />
                                <ContactInfoItem
                                    icon={MapPin}
                                    label="Headquarters"
                                    value={company.address || "Dhaka, Bangladesh"}
                                    color="group-hover:bg-gray-800 group-hover:text-white"
                                />
                            </div>
                        </div>

                        {/* Social Connect */}
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Share2 size={18} className="text-secondary" />
                                Connect Socially
                            </h4>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {social.links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 hover:bg-primary/5 transition-all border border-gray-100 group"
                                    >
                                        <div className="relative w-5 h-5 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                            <Image src={link.icon || ""} alt={link.platform} fill className="object-contain" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight group-hover:text-primary transition-colors">
                                            {link.platform}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Why Shop With Us Card */}
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <h4 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Briefcase size={18} className="text-primary" />
                                Why Shop With Us?
                            </h4>
                            <ul className="space-y-4">
                                <FeatureItem text="100% Authentic Products" />
                                <FeatureItem text="Fast Nationwide Delivery" />
                                <FeatureItem text="Hassle-free Returns" />
                            </ul>
                        </div>
                    </div>

                    {/* Right Column - Support Form */}
                    <div className="lg:col-span-8 bg-white rounded-xl md:rounded-2xl p-4 md:p-10 shadow-sm border border-gray-100">
                        <div className="mb-10">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-xs md:text-sm text-gray-500 font-semibold tracking-tight">Support response: Usually within 2-4 hours.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <FormLabel>Full Name</FormLabel>
                                    <FormInput
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormInput
                                        type="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Subject</FormLabel>
                                <FormInput
                                    placeholder="e.g. Bulk Sourcing Inquiry"
                                    value={formData.subject}
                                    onChange={(e: any) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <FormLabel>Detailed Message</FormLabel>
                                <textarea
                                    rows={5}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none text-sm font-medium placeholder:text-gray-300"
                                    placeholder="Describe your requirements in detail..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-12 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/10 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                                >
                                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                                    <Send size={18} />
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
    <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all group">
        <div className={`w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center transition-all ${color}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">{label}</p>
            {href ? (
                <a href={href} className="text-sm font-bold text-gray-700 block truncate hover:text-primary transition-colors tracking-tight">
                    {value}
                </a>
            ) : (
                <span className="text-sm font-bold text-gray-700 block leading-tight tracking-tight">{value}</span>
            )}
        </div>
    </div>
);

const FeatureItem = ({ text }: { text: string }) => (
    <li className="flex items-center gap-3 text-xs md:text-sm text-gray-600 font-semibold">
        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={12} />
        </div>
        {text}
    </li>
);

const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">{children}</label>
);

const FormInput = (props: any) => (
    <input
        required
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-medium placeholder:text-gray-400"
    />
);

export default ContactClient;
