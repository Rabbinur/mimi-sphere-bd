"use client"

import { cmsData } from "@/constants/cms";
import {
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Scale,
  ShieldCheck,
  Smartphone,
  Truck
} from "lucide-react";
import Image from "next/image";

/* ── Components ── */

const InfoCard = ({ icon: Icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) => (
  <div className="bg-white rounded-xl p-2 md:p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-gray-900 font-bold text-base mb-2">{title}</h3>
    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const RateRow = ({ label, price, info }: { label: string; price: string; info?: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <div>
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      {info && <p className="text-[10px] text-gray-400 font-medium">{info}</p>}
    </div>
    <p className="text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-lg">৳{price}</p>
  </div>
);

/* ── page ── */

export default function ShippingPolicyPage() {
  const { company, social } = cmsData;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Brand Aligned Header */}
      <section className="relative bg-primary overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="text-white max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
                <Truck className="w-3 h-3 text-secondary" />
                Fast Nationwide Delivery
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                Shipping & <span className="text-secondary">Delivery</span> Information
              </h1>


              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Support (10 AM - 8 PM)</p>
                  <a href={`tel:${company.phone}`} className="text-xl md:text-2xl font-black text-white hover:text-secondary transition-colors">
                    {company.phone}
                  </a>
                </div>
                <div className="w-px h-10 bg-white/30 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Global Reach</p>
                  <p className="text-base md:text-lg font-bold text-white">64 Districts Covered</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative w-full max-w-[320px] aspect-square">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-6 scale-95" />
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-100">
                <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center text-primary">
                  <Truck className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-black text-xl mb-1">Express Ship</p>
                  <p className="text-gray-500 text-xs font-medium px-4 leading-relaxed">
                    Reliable delivery partner for nationwide shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-2 md:px-4 lg:px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">

            {/* Delivery Overview */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-secondary rounded-full" />
                Delivery Options Overview
              </h2>

              <div className="space-y-6">
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Our customer care team will call to confirm your order within 24 hours of placement (excluding Fridays). Once confirmed, you will receive your parcel within 24-48 hours.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-gray-900 text-sm">No Advance Charge</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">We do not accept any advance payments for orders or courier charges. Pay only when you receive.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-secondary" />
                      <span className="font-bold text-gray-900 text-sm">Open-Box Inspection</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">Verify your product in front of the delivery professional. If satisfied, accept the parcel.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Process */}
            <div className="grid grid-cols-2 md:grid-cols-4 md:gap-4 gap-2">
              <InfoCard
                icon={Package}
                title="1. Order"
                desc="Specify your preferred delivery method during checkout."
                color="bg-blue-50 text-blue-600"
              />
              <InfoCard
                icon={MessageCircle}
                title="2. Confirm"
                desc="Receive an order confirmation call from our team."
                color="bg-purple-50 text-purple-600"
              />
              <InfoCard
                icon={Clock}
                title="3. Transit"
                desc="Wait 24-48 hours for your parcel to arrive."
                color="bg-amber-50 text-amber-600"
              />
              <InfoCard
                icon={CheckCircle2}
                title="4. Receive"
                desc="Check and pick up your order at the delivery area."
                color="bg-emerald-50 text-emerald-600"
              />
            </div>

            {/* Shipping Rates */}
            <div className="grid md:grid-cols-2 gap-2 md:gap-6">
              {/* Small Items */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">Small Parcels (&lt;1kg)</h3>
                </div>
                <div className="space-y-1">
                  <RateRow label="Inside Dhaka" price="80" />
                  <RateRow label="Outside Dhaka" price="130" />

                </div>
              </div>

              {/* Large Items */}
              <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">Large Parcels</h3>
                </div>
                <div className="space-y-1">
                  <RateRow label="Inside Dhaka" price="80+" info="৳20 per extra kg" />
                  <RateRow label="Outside Dhaka" price="130+" info="৳30 per extra kg" />
                </div>
              </div>
            </div>

            {/* Return Policy Reminder */}
            <div className="bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
                Quick Return Guide
              </h2>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p><strong>Option 1:</strong> If you find any issues while checking in front of the delivery professional, you can return it instantly with zero extra charges.</p>
                <p><strong>Option 2:</strong> To return an intact product after delivery, please contact us within 2 days. Customer bears return shipping and packaging fees.</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 md:space-y-6 space-y-2">
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Need Support?</h3>

              <div className="md:space-y-3 space-y-2">
                <a href={`tel:${company.phone}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Call Support</p>
                        <p className="text-sm font-bold text-gray-700">{company.phone}</p>
                    </div>
                </a>

                <a href={social.links.find(l => l.platform === 'facebook')?.url} target="_blank" className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-[#0084FF]/20 hover:bg-[#0084FF]/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-[#0084FF] group-hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Messenger</p>
                        <p className="text-sm font-bold text-gray-700">Chat on Facebook</p>
                    </div>
                </a>

                <a href={social.links.find(l => l.platform === 'whatsapp')?.url} target="_blank" className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-[#25D366]/20 hover:bg-[#25D366]/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">WhatsApp</p>
                        <p className="text-sm font-bold text-gray-700">Message us on WA</p>
                    </div>
                </a>

                <a href={`mailto:${company.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-secondary/20 hover:bg-secondary/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Email us at</p>
                        <p className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{company.email}</p>
                    </div>
                </a>
              </div>

              <div className="pt-3 md:pt-6 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Follow Our Journey</p>
                <div className="flex items-center justify-center gap-4">
                  {social.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 relative hover:scale-110 active:scale-95 transition-all grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                    >
                      <Image
                        src={link.icon || ""}
                        alt={link.platform}
                        fill
                        className="object-contain p-1.5"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
