import type { Metadata } from "next";
import type React from "react"; // Import React

import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import { MobileNav } from "@/components/ui/mobile-nav";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard and account management.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.shoppingcart.bd/user-account",
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

