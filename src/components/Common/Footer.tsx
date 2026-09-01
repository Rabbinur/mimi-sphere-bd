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
    <footer className="bg-[#0b1222] text-slate-400 border-t border-slate-800 ">

      {/* ── 1. Value Props Bar ─────────────────────────────── */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <ValueProp
              icon={<ShieldCheck size={20} />}
              title="Secure Checkout"
              desc="SSL Encrypted Payments"
            />
            <ValueProp
              icon={<PhoneCall size={20} />}
              title="24/7 Support"
              desc="Always here to help"
            />
            <ValueProp
              icon={<Globe size={20} />}
              title="Islandwide Shipping"
              desc="Fast & Reliable Delivery"
            />
            <ValueProp
              icon={<ShieldCheck size={20} />}
              title="100% Genuine"
              desc="Quality Guaranteed"
            />
          </div>
        </div>
      </div>

      {/* ── 2. Main Content ────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity" aria-label="Go to home page">
              <Image
                src="/logo.png"
                alt="Shopping Cart BD Logo"
                width={160}
                height={40}
                quality={85}
                className="object-contain brightness-0 invert"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>

            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Shopping Cart BD — delivering premium curated items to your
              doorstep. Quality, speed, and exceptional customer service at
              every step.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              {[
                {
                  platform: "facebook",
                  url: "https://www.facebook.com/shoppingcartbd.official",
                  icon: "/icons/facebook.png",
                },
                {
                  platform: "instagram",
                  url: "https://www.instagram.com/shoppingcart.bd/",
                  icon: "/icons/instagram.png",
                },
                {
                  platform: "whatsapp",
                  url: "https://wa.link/fabxoj",
                  icon: "/icons/whatsapp.png",
                },
                {
                  platform: "tiktok",
                  url: "https://www.tiktok.com/@shoppingcartbd",
                  icon: "/icons/tik-tok.png",
                },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="group w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-white/30 hover:bg-white/5 transition-all duration-300"
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
            <h3 className="text-[11px] font-extrabold text-gray-200 uppercase tracking-[0.15em] mb-6">
              Useful Links
            </h3>
            <ul className="space-y-3">
              {usefulLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column — desktop only */}
          <div className="hidden lg:block lg:col-span-2">
            <h3 className="text-[11px] font-extrabold text-gray-200 uppercase tracking-[0.15em] mb-6">
              Policies
            </h3>
            <ul className="space-y-3">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[13px] font-medium text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4">
            <h3 className="text-[11px] font-extrabold text-gray-200 uppercase tracking-[0.15em] mb-6">
              Contact Us
            </h3>

            <div className="space-y-5">
              {/* Contact Page Link */}
              <ContactRow
                icon={<Globe size={16} />}
                label="Full Support"
                content={
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-gray-200 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Contact Us Page →
                  </Link>
                }
              />

              {/* Email */}
              <ContactRow
                icon={<Mail size={16} />}
                label="Support Email"
                content={
                  <a
                    href={`mailto:${cmsData?.company?.email}`}
                    className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
                  >
                    {cmsData?.company?.email || "info@shoppingcart.bd"}
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
                    {/* <p className="text-sm font-medium text-gray-200">
                      {cmsData?.company?.phone || "+880 1722-597565"}
                    </p> */}
                    <a
                      href={`https://wa.me/${cmsData?.company?.phone?.replace(/\D/g, '') || "8801722597565"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-black text-secondary uppercase tracking-widest hover:text-secondary/80 transition-colors"
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
          <div className="lg:hidden md:col-span-2 border border-gray-800 rounded-xl overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="nav" className="border-b border-gray-800 px-4">
                <AccordionTrigger className="text-[11px] font-extrabold text-gray-300 uppercase tracking-[0.15em] py-4 hover:no-underline">
                  Navigation
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {usefulLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                        {l.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policy" className="border-0 px-4">
                <AccordionTrigger className="text-[11px] font-extrabold text-gray-300 uppercase tracking-[0.15em] py-4 hover:no-underline">
                  Policies
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {policyLinks.map((l) => (
                      <Link
                        key={l.name}
                        href={l.href}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
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
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-medium text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()}{" "}
              {cmsData?.company?.name || "Shopping Cart BD"}. All rights
              reserved.
            </p>

            {/* Payment badge placeholders */}
            <div className="flex items-center gap-2">
              {["VISA", "MC", "bKash", "Nagad"].map((label) => (
                <div
                  key={label}
                  className="h-7 px-2.5 bg-gray-800 border border-gray-700 rounded text-[10px] font-bold text-gray-400 flex items-center"
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