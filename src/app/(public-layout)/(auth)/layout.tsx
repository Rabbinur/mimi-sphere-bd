import GoogleAuthProvider from "@/components/Provider/GoogleAuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Shopping Cart BD",
  description: "Sign in or create an account with Shopping Cart BD to manage your orders, wishlist, and sourcing requests.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.shoppingcart.bd/login",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
      {children}
    </GoogleAuthProvider>
  );
}
