import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Mimi Sphere",
  description: "Experience hassle-free returns and exchanges at Mimi Sphere. Easy return process for all our customers in Bangladesh.",
  keywords: ["return policy BD", "exchange policy Mimi Sphere", "easy returns Bangladesh"],
  alternates: {
    canonical: "https://www.mimisphere.com/return-policy",
  },
};

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
