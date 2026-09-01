"use client"

import { cmsData } from "@/constants/cms";
import {
  Copyright,
  CreditCard,
  FileText,
  Gavel,
  HelpCircle,
  Mail,
  Phone,
  RotateCcw,
  Scale,
  ShieldAlert,
  Truck
} from "lucide-react";
import Image from "next/image";

/* ── Components ── */

const TermSection = ({ icon: Icon, title, content }: { icon: any; title: string; content: string | React.ReactNode }) => (
  <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="text-sm md:text-base text-gray-600 leading-relaxed space-y-4">
      {typeof content === 'string' ? <p>{content}</p> : content}
    </div>
  </div>
);

/* ── page ── */

export default function TermsPage() {
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
                <Gavel className="w-3 h-3 text-secondary" />
                Professional Service Agreement
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                Terms & <span className="text-secondary">Conditions</span>
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 mt-10">
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Agreement Version</p>
                  <p className="text-base md:text-lg font-bold text-white">V 2.1 (2026)</p>
                </div>
                <div className="w-px h-10 bg-white/30 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Governing Jurisdiction</p>
                  <p className="text-base md:text-lg font-bold text-white">Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative w-full max-w-[300px] aspect-square">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-6 scale-95" />
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-100">
                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-900 font-black text-xl mb-1">Legal Notice</p>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Terms of Use</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-2 md:px-4 lg:px-6 mt-8 md:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

          {/* Left Column - Terms Details */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">

            <TermSection
              icon={Scale}
              title="1. Acceptance of Terms"
              content="By accessing and using Shopping Cart BD, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our services."
            />

            <TermSection
              icon={HelpCircle}
              title="2. Product & Pricing"
              content="While we strive for 100% accuracy, product descriptions or prices may contain typographical errors. We reserve the right to correct any errors and to change or update information at any time without prior notice."
            />

            <TermSection
              icon={CreditCard}
              title="3. Payment Methods"
              content={
                <div className="space-y-3">
                  <p>We accept the following payment methods for your convenience:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Cash on Delivery (COD):</strong> Available nationwide across Bangladesh.</li>
                    <li><strong>Online Payments:</strong> bKash, Nagad, Visa, and Mastercard via secure gateways.</li>
                  </ul>
                </div>
              }
            />

            <TermSection
              icon={Truck}
              title="4. Shipping & Delivery"
              content="Orders are processed within 24 hours. Delivery typically takes 48-72 hours nationwide. Please note that delivery times may vary during peak seasons or due to unavoidable circumstances."
            />

            <TermSection
              icon={RotateCcw}
              title="5. Returns & Refunds"
              content="Our Return Policy allows for instant returns during delivery or standard returns within 2 working days for intact products. For full details, please refer to our dedicated Return & Refund Policy page."
            />

            <TermSection
              icon={ShieldAlert}
              title="6. Limitation of Liability"
              content="Shopping Cart BD shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use our services or products purchased through our platform."
            />

            <TermSection
              icon={Copyright}
              title="7. Intellectual Property"
              content="All content on this website, including text, graphics, logos, and images, is the property of Shopping Cart BD and is protected by Bangladesh's copyright and intellectual property laws."
            />

            <TermSection
              icon={Gavel}
              title="8. Governing Law"
              content="These terms are governed by the laws of the People's Republic of Bangladesh. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Bangladesh."
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 md:space-y-6 space-y-2">
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Legal Questions?</h3>

              <div className="md:space-y-3 space-y-2">
                <a href={`tel:${company.phone}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Legal Support</p>
                    <p className="text-sm font-bold text-gray-700">{company.phone}</p>
                  </div>
                </a>

                <a href={`mailto:${company.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-secondary/20 hover:bg-secondary/5 transition-all group">
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Email Inquiry</p>
                    <p className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{company.email}</p>
                  </div>
                </a>
              </div>

              <div className="pt-3 md:pt-6 border-t border-gray-50 mt-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Stay Connected</p>
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
