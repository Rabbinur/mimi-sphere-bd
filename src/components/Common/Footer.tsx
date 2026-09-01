import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cmsData } from "@/constants/cms";
import {
  Globe,
  Mail,
  PhoneCall,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const usefulLinks = [
    { name: "Track Your Order", href: "/track-order" },
    { name: "Latest News", href: "/blogs" },
    { name: "Our Collections", href: "/categories" },
    { name: "Trusted Brands", href: "/brands" },
    // { name: "Contact Us", href: "/contact" },
  ];

  const policyLinks = [
    { name: "Shipping & Delivery", href: "/shipping-policy" },
    { name: "Returns & Refunds", href: "/return-policy" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-[#00172e] text-slate-400 border-t border-slate-800/80">

      {/* ── 1. Value Props Bar ─────────────────────────────── */}
      <div className="border-b border-white/5 bg-[#001429]/60">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <ValueProp
              icon={<ShieldCheck size={20} />}
              title="Quality You Can Trust"
              desc="100% Safe & Tested for Kids"
            />
            <ValueProp
              icon={<PhoneCall size={20} />}
              title="Creative Learning"
              desc="Smart Gadgets & Fun Toys"
            />
            <ValueProp
              icon={<Globe size={20} />}
              title="Nationwide Delivery"
              desc="Fast 48-72h Across Bangladesh"
            />
            <ValueProp
              icon={<ShieldCheck size={20} />}
              title="Inspect Before Pay"
              desc="Cash on Delivery Available"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Main Content ────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block p-2.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-md hover:scale-[1.02] transition-transform" aria-label="Mimi Sphere Home">
              <Image
                src="/logo.png"
                alt="Mimi Sphere Logo"
                width={160}
                height={48}
                quality={90}
                className="object-contain"
                style={{ width: "auto", height: "40px" }}
              />
            </Link>

            <p className="text-sm leading-relaxed text-slate-300 max-w-sm">
              <strong className="text-amber-400 font-semibold">Mimi Sphere</strong> — Smart gadgets &amp; creative learning toys for happy, smarter kids. 🧸📱 Quality you can trust, delivered across Bangladesh. 🚚
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  platform: "facebook",
                  url: "https://www.facebook.com/mimispherebd",
                  icon: "/icons/facebook.png",
                },
                {
                  platform: "instagram",
                  url: "https://www.instagram.com/mimispherebd",
                  icon: "/icons/instagram.png",
                },
                {
                  platform: "whatsapp",
                  url: "https://wa.me/8801719713061",
                  icon: "/icons/whatsapp.png",
                },
                {
                  platform: "tiktok",
                  url: "https://www.tiktok.com/@mimispherebd",
                  icon: "/icons/tik-tok.png",
                },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="group w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-amber-400/50 hover:bg-white/5 transition-all duration-300"
                >
                  <div className="relative w-5 h-5  transition-all duration-300">
                    <Image
                      src={link.icon}
                      alt={link.platform}
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column — desktop only */}
          <div className="hidden lg:block lg:col-span-2">
            <h3 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.15em] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column — desktop only */}
          <div className="hidden lg:block lg:col-span-3">
            <h3 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.15em] mb-6">
              Customer Care
            </h3>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.15em] mb-6">
              Get in Touch
            </h3>

            <div className="space-y-3">
              {/* Phone */}
              <ContactRow
                icon={<PhoneCall size={16} />}
                label="Phone Support"
                content={
                  <a
                    href={`tel:${cmsData?.company?.phone || "+8801719713061"}`}
                    className="text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
                  >
                    {cmsData?.company?.phone || "01719713061"}
                  </a>
                }
              />

              {/* Email */}
              <ContactRow
                icon={<Mail size={16} />}
                label="Email"
                content={
                  <a
                    href={`mailto:${cmsData?.company?.email || "support@mimisphere.com"}`}
                    className="text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
                  >
                    {cmsData?.company?.email || "support@mimisphere.com"}
                  </a>
                }
              />

              {/* WhatsApp */}
              <ContactRow
                icon={
                  <div className="relative w-5 h-5">
                    <Image
                      src="/icons/whatsapp.png"
                      alt="whatsapp"
                      fill
                      className="object-contain"
                    />
                  </div>
                }
                label="WhatsApp"
                content={
                  <div>
                    <a
                      href={`https://wa.me/${cmsData?.company?.phone?.replace(/\D/g, '') || "8801719713061"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-black text-amber-400 uppercase tracking-widest hover:text-amber-300 transition-colors"
                    >
                      <div className="relative w-3 h-3">
                        <Image src="/icons/whatsapp.png" alt="" fill className="object-contain" />
                      </div>
                      Chat Now
                    </a>
                  </div>
                }
              />
            </div>
          </div>

          {/* ── Mobile Accordion ── */}
          <div className="lg:hidden md:col-span-2 border border-slate-800 rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="nav" className="border-b border-slate-800 px-4">
                <AccordionTrigger className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.15em] py-4 hover:no-underline">
                  Navigation
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {usefulLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
                      >
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policy" className="border-0 px-4">
                <AccordionTrigger className="text-[11px] font-extrabold text-amber-400 uppercase tracking-[0.15em] py-4 hover:no-underline">
                  Policies
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {policyLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-sm font-medium text-slate-300 hover:text-amber-400 transition-colors"
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

      {/* ── 3. Bottom Bar ─────────────────────────────────── */}
      <div className="border-t border-slate-800/80 bg-[#001224]">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-slate-200 font-semibold">{cmsData?.company?.name || "Mimi Sphere"}</span>. All rights
              reserved.
            </p>

            {/* Payment badge placeholders */}
            <div className="flex items-center gap-2">
              {["VISA", "Mastercard", "bKash", "Nagad", "Cash on Delivery"].map((label) => (
                <div
                  key={label}
                  className="h-7 px-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-amber-300/80 flex items-center"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* ── Helpers ─────────────────────────────────────────────── */

const ValueProp = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex items-center gap-3 group">
    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:border-secondary group-hover:text-white transition-all duration-300 shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[13px] font-bold text-gray-100 leading-none mb-1.5">
        {title}
      </h4>
      <p className="text-[11px] text-gray-400 leading-none font-medium">{desc}</p>
    </div>
  </div>
);

const ContactRow = ({
  icon,
  label,
  content,
  iconBg = "bg-gray-800 border-gray-700 text-gray-400",
}: {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
  iconBg?: string;
}) => (
  <div className="flex gap-3 items-start">
    <div
      className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>
      {content}
    </div>
  </div>
);

export default Footer;