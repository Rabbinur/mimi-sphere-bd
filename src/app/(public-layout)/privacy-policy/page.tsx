"use client"

import {
  ShieldCheck,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Smartphone,
  Mail,
  MessageCircle,
  Phone,
  Database
} from "lucide-react";
import Image from "next/image";
import { cmsData } from "@/constants/cms";

/* ── Components ── */

const PolicySection = ({ icon: Icon, title, content }: { icon: any; title: string; content: string | React.ReactNode }) => (
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

export default function PrivacyPolicyPage() {
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
                <ShieldCheck className="w-3 h-3 text-secondary" />
                Your Privacy is Our Priority
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                Privacy <span className="text-secondary">Policy</span>
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 mt-10">
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Last Updated</p>
                  <p className="text-base md:text-lg font-bold text-white">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="w-px h-10 bg-white/30 hidden sm:block" />
                <div className="space-y-1">
                  <p className="text-blue-200 text-[10px] uppercase font-bold tracking-widest">Compliance</p>
                  <p className="text-base md:text-lg font-bold text-white">GDPR & BD E-commerce Rules</p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative w-full max-w-[300px] aspect-square">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2.5rem] rotate-6 scale-95" />
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center gap-6 border border-gray-100">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center">
                  <Lock className="w-10 h-10" />
                </div>
                <div className="text-center px-4">
                  <p className="text-gray-900 font-black text-xl mb-1">100% Secure</p>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Data Protection</p>
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
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            
            <PolicySection 
              icon={Eye}
              title="Information We Collect"
              content={
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal Identification:</strong> Name, email address, phone number, and delivery address.</li>
                  <li><strong>Order History:</strong> Details of products you have purchased and your shopping preferences.</li>
                  <li><strong>Device Information:</strong> IP address, browser type, and operating system used to access our site.</li>
                </ul>
              }
            />

            <PolicySection 
              icon={Database}
              title="How We Use Your Data"
              content="We use the collected information to process your orders, provide customer support, and keep you updated on your delivery status. Additionally, we may use your data for internal analytics to improve our website experience and occasionally send promotional offers with your consent."
            />

            <PolicySection 
              icon={UserCheck}
              title="Third-Party Disclosure"
              content="We do not sell, trade, or otherwise transfer your personal information to outside parties. This excludes trusted third parties who assist us in operating our website and conducting our business (e.g., delivery partners like Pathao or Steadfast, and payment gateways), as long as those parties agree to keep this information confidential."
            />

            <PolicySection 
              icon={Lock}
              title="Data Security"
              content="We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. Our website uses SSL encryption to ensure all data remains private and secure."
            />

            <PolicySection 
              icon={FileText}
              title="Cookies Usage"
              content="Our site uses 'cookies' to enhance your experience. These are small files that a site or its service provider transfers to your computer's hard drive through your Web browser that enables the site's systems to recognize your browser and capture certain information (like items in your cart)."
            />

            <PolicySection 
              icon={ShieldCheck}
              title="Compliance with BD Laws"
              content="This Privacy Policy is governed by and construed in accordance with the laws of the People's Republic of Bangladesh, specifically the Digital Security Act and the E-commerce Guidelines issued by the Ministry of Commerce."
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 md:space-y-6 space-y-2">
            <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Privacy Inquiries?</h3>
              
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

                <a href={`mailto:${company.email}`} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-secondary/20 hover:bg-secondary/5 transition-all group">
                    <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                        <Mail className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5 tracking-widest">Privacy Officer</p>
                        <p className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{company.email}</p>
                    </div>
                </a>
              </div>

              <div className="pt-3 md:pt-6 border-t border-gray-50 mt-6">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 text-center">Join Our Community</p>
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
