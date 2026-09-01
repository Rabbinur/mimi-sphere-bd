import Provider from "@/components/Provider/MainProvider";
import type { Metadata } from "next";
import { Bai_Jamjuree, Hind_Siliguri } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const baiJamjuree = Bai_Jamjuree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-bai-jamjuree",
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
  variable: "--font-hind-siliguri",
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shoppingcart.bd"),

  title: {
    default: "Shopping Cart BD | Your One-Stop E-commerce Destination in Bangladesh",
    template: "%s",
  },

  description:
    "E- commerce Bangladesh, Online Shopping BD, Shopping Cart BD, Electronics BD, Lifestyle Products Bangladesh",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Shopping Cart BD | Premium Online Shopping in Bangladesh",
    description: "Shop the best products at Shopping Cart BD...",
    url: "https://www.shoppingcart.bd",
    siteName: "Shopping Cart BD",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Shopping Cart BD",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Shopping Cart BD",
    description: "Your favorite online shopping destination in Bangladesh.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
  },
};

import ThirdPartyScripts from "@/components/Common/ThirdPartyScripts";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${baiJamjuree.variable} ${hindSiliguri.variable} ${baiJamjuree.className} antialiased`}>
        <Provider>
          {children}
          <ThirdPartyScripts />
        </Provider>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=944264131793566&ev=PageView&noscript=1"
            alt="facebook-pixel"
          />
        </noscript>
      </body>
    </html>
  );
}
