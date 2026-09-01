import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Mimi Sphere",
  description: "Get in touch with Mimi Sphere support team. We're here to help you 24/7.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
