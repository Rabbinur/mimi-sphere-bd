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
  metadataBase: new URL("https://www.mimisphere.com"),

  title: {
    default: "Mimi Sphere | Everything You Need, All in One Place",
    template: "%s | Mimi Sphere",
  },

  description:
    "Mimi Sphere — Premium lifestyle, Korean cosmetics, trendy fashion, and global curated collections. Everything you need, all in one place in Bangladesh.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Mimi Sphere | Everything You Need, All in One Place",
    description: "Discover authentic Korean cosmetics, trendy bags, and curated lifestyle essentials at Mimi Sphere.",
    url: "https://www.mimisphere.com",
    siteName: "Mimi Sphere",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Mimi Sphere Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mimi Sphere",
    description: "Everything You Need, All in One Place — Mimi Sphere",
    images: ["/logo.png"],
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
