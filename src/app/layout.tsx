import type { Metadata } from "next";
<<<<<<< HEAD
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import LeadPopup from "./components/LeadPopup";
import SmoothMotion from "./components/SmoothMotion";
import "./globals.css";
import ChatBot from "./components/ChatBot";
=======
import type { ReactNode } from "react";
import Script from "next/script";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import SmoothMotion from "./components/SmoothMotion";
import ChatBot from "./components/ChatBot";
import { ConsultationModalProvider } from "./components/ConsultationModalProvider";
import GlobalConsultationModal from "./components/GlobalConsultationModal";
import ContextMenuGuard from "./components/ContextMenuGuard";
import "./globals.css";
>>>>>>> origin/main

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

<<<<<<< HEAD
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com"),
=======
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://orchidinteriors.com",
  ),
>>>>>>> origin/main
  title: {
    default: "Orchid Interiors | Premium Interior Design in Coimbatore",
    template: "%s | Orchid Interiors",
  },
  description:
    "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
<<<<<<< HEAD
  alternates: { canonical: "/" },
=======
  alternates: { canonical: siteUrl },
  icons: { icon: "/images/logo.png" },
>>>>>>> origin/main
  openGraph: {
    type: "website",
    siteName: "Orchid Interiors",
    title: "Orchid Interiors | Premium Interior Design in Coimbatore",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
<<<<<<< HEAD
    images: [{ url: "/images/hero-1.png", alt: "Orchid Interiors interior design" }],
=======
    images: [
      { url: "/images/hero-1.png", alt: "Orchid Interiors interior design" },
    ],
>>>>>>> origin/main
  },
  twitter: {
    card: "summary_large_image",
    title: "Orchid Interiors | Premium Interior Design in Coimbatore",
    description:
      "Premium residential, commercial and turnkey interior design solutions by Orchid Interiors in Coimbatore and Tamil Nadu.",
    images: ["/images/hero-1.png"],
  },
};

<<<<<<< HEAD
export default function RootLayout({ children }: LayoutProps<"/">) {
=======
export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "InteriorDesignBusiness",
    name: "Orchid Interiors",
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    image: `${siteUrl}/images/hero-1.png`,
    email: "hello@orchidinteriors.com",
    telephone: "+91 97903 52563",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "48PF+GG9, Avinashi Main Rd, Periyar Colony, Gandhinagar, Velampalayam",
      addressLocality: "Tiruppur",
      addressRegion: "Tamil Nadu",
      postalCode: "641603",
      addressCountry: "IN",
    },
    areaServed: ["Coimbatore", "Tiruppur", "Tamil Nadu"],
  };

>>>>>>> origin/main
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
<<<<<<< HEAD
        {children}
        <SmoothMotion />
        <LeadPopup />
        <ChatBot />
=======
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; window.gtag = function(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${gaId}', { anonymize_ip: true });`,
              }}
            />
          </>
        ) : null}
        <ConsultationModalProvider>
          {children}
          <ContextMenuGuard />
          <SmoothMotion />
          <ChatBot />
          <GlobalConsultationModal />
        </ConsultationModalProvider>
>>>>>>> origin/main
      </body>
    </html>
  );
}
