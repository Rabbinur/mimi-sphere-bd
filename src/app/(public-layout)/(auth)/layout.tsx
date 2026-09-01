import GoogleAuthProvider from "@/components/Provider/GoogleAuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Mimi Sphere",
  description: "Sign in or create an account with Mimi Sphere to manage your orders and wishlist.",
  keywords: ["account", "mimi sphere login", "sign in mimi sphere"],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.mimisphere.com/login",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
      {children}
    </GoogleAuthProvider>
  );
}
