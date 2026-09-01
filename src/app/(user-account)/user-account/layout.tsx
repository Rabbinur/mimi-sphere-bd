import type { Metadata } from "next";
import type React from "react"; // Import React

import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { MobileNav } from "@/components/ui/mobile-nav";

export const metadata: Metadata = {
  title: "User Account | Mimi Sphere",
  description: "User dashboard and account management at Mimi Sphere.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.mimisphere.com/user-account",
  },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <MobileNav />
      <Footer />
    </div>
  );
}

