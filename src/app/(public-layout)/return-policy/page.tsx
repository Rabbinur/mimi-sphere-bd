"use client"

import {
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Package,
  HelpCircle
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cmsData } from "@/constants/cms";

/* ── Components ── */

const AccordionItem = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-3 md:px-5 flex items-center justify-between text-left hover:text-primary transition-colors group"
      >
        <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-primary transition-colors">
          {title}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-3 md:px-5 pb-5 pt-1">
          <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-3 md:p-4 rounded-lg border border-slate-100">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── page ── */

export default function ReturnPolicyPage() {
  const { company, social } = cmsData;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Brand Aligned Header */}
      <section className="relative bg-primary overflow-hidden shadow-md">
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* Header Content */}
            <div className="text-white max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
                <RotateCcw className="w-3 h-3 text-secondary" />
                Easy Returns & Refunds
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                Hassle-Free <span className="text-secondary">Return & Refund</span> Policy
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
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

            {/* Header Visual */}
            <div className="hidden lg:block relative w-full max-w-[320px] aspect-square">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-6 scale-95" />
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-100">
                <div className="w-24 h-24 bg-primary/5 rounded-3xl flex items-center justify-center text-primary">
                  <Package className="w-12 h-12" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-black text-xl mb-1">Secure Return</p>
                  <p className="text-gray-500 text-xs font-medium px-4 leading-relaxed">
                    Checked and verified by our professional team.
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
          
          {/* Left Column - Policy Details */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            
            {/* Core Policy Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-900">
                  Product Return and Refund Rules
                </h2>
              </div>
              
              <div className="p-4 md:p-8 space-y-8">
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  We are committed to your satisfaction. We accept product returns under the following two primary conditions:
                </p>
                
                <div className="grid md:grid-cols-2 md:gap-8 gap-4">
                  {/* Option 1 */}
                  <div className="space-y-3 p-3 md:p-5 rounded-xl border border-gray-50 bg-slate-50/50">
                    <div className="w-10 h-10 bg-white text-secondary rounded-lg flex items-center justify-center font-black shadow-sm border border-gray-100">
                      01
                    </div>
                    <h3 className="text-gray-900 font-bold text-sm md:text-base">Instant Returns</h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      Please inspect the product in front of the delivery professional. If any issues are found, you can return it instantly without any extra charges.
                    </p>
                  </div>

                  {/* Option 2 */}
                  <div className="space-y-3 p-3 md:p-5 rounded-xl border border-gray-50 bg-slate-50/50">
                    <div className="w-10 h-10 bg-white text-primary rounded-lg flex items-center justify-center font-black shadow-sm border border-gray-100">
                      02
                    </div>
                    <h3 className="text-gray-900 font-bold text-sm md:text-base">Post-Delivery Returns</h3>
                    <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      You can return intact products within 2 working days. Return courier costs and specific packaging fees will be borne by the customer.
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="flex items-start gap-4 p-3 md:p-5 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-orange-900 font-bold text-sm mb-1">Missing Product Policy</h4>
                    <p className="text-xs md:text-sm text-orange-800 leading-relaxed">
                      If an item is missing from your parcel, you can choose to return the entire parcel or receive it after deducting the price of the missing product.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Card */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-base md:text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <AccordionItem 
                    title="Do I have to pay extra charges for returns?"
                    content="No, there are no extra charges if the product is returned directly to the delivery person upon inspection during delivery."
                />
                <AccordionItem 
                    title="How long does the refund process take?"
                    content="If you have already paid, your refund will be processed and settled within 7-10 business days after the return is confirmed and received."
                />
                <AccordionItem 
                    title="What happens if my parcel is damaged?"
                    content="If you notice damage at the time of delivery, please return it to the delivery professional immediately. We will arrange a replacement or refund."
                />
              </div>
            </div>
          </div>

          {/* Right Column - Help & Support Sidebar */}
          <div className="lg:col-span-4 md:space-y-6 space-y-2">
            
            {/* Help Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Need Support?</h3>
              
              <div className="md:space-y-3 space-y-2">
                {/* Phone */}
                <a href={`tel:${company.phone}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Call Support</p>
                        <p className="text-sm font-bold text-gray-700">{company.phone}</p>
                    </div>
                </a>

                {/* Messenger */}
                <a 
                  href={social.links.find(l => l.platform === 'facebook')?.url} 
                  target="_blank" 
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-[#0084FF]/20 hover:bg-[#0084FF]/5 transition-all group"
                >
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-[#0084FF] group-hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Messenger</p>
                        <p className="text-sm font-bold text-gray-700">Chat on Facebook</p>
                    </div>
                </a>

                {/* WhatsApp */}
                <a 
                  href={social.links.find(l => l.platform === 'whatsapp')?.url} 
                  target="_blank" 
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-[#25D366]/20 hover:bg-[#25D366]/5 transition-all group"
                >
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-all">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">WhatsApp</p>
                        <p className="text-sm font-bold text-gray-700">Message us on WA</p>
                    </div>
                </a>

                {/* Email */}
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

              {/* Social Links Section */}
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
