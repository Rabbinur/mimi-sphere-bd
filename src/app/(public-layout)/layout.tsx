import FloatingCart from "@/components/Common/FloatingCart";
import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import ScrollToTop from "@/components/Common/ScrollToTop";
import { MobileNav } from "@/components/ui/mobile-nav";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (

    <div>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <ScrollToTop />
      <FloatingCart />
      <MobileNav />
      <Footer />
    </div>

  );
};

export default layout;
