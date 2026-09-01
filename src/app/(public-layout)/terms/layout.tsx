import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Shopping Cart BD",
  description: "Read the Terms & Conditions of Shopping Cart BD. By using our services, you agree to these professional guidelines, including product pricing, delivery, and refund policies in accordance with Bangladesh laws.",
  keywords: ["terms and conditions BD", "e-commerce terms Bangladesh", "shopping cart bd terms", "legal agreement"],
  alternates: {
    canonical: "https://www.shoppingcart.bd/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
