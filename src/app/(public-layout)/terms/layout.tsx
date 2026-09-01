import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mimi Sphere",
  description: "Read the Terms & Conditions of Mimi Sphere. Product pricing, delivery, and customer care policies.",
  keywords: ["terms and conditions", "mimi sphere terms", "legal agreement"],
  alternates: {
    canonical: "https://www.mimisphere.com/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
