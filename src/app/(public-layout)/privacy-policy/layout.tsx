import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Shopping Cart BD",
  description: "Learn how Shopping Cart BD collects, uses, and protects your personal information. We are committed to ensuring your privacy and data security in compliance with Bangladesh laws.",
  keywords: ["privacy policy BD", "data protection Bangladesh", "shopping cart bd privacy", "e-commerce privacy policy"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
