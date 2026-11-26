import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter, Space_Grotesk, Syne } from "next/font/google";
import Navbar from "@/src/components/layout/Navbar";
import SmoothScrollProvider from "@/src/components/providers/SmoothScrollProvider";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: siteConfig.brandName,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "An independent creative studio building websites, brands and digital campaigns for ambitious businesses.",
  applicationName: siteConfig.brandName,
  keywords: [
    "creative studio",
    "website design",
    "website development",
    "digital marketing",
    "brand identity",
    "Meta Ads",
    "Google Ads",
  ],
  alternates: siteConfig.siteUrl
    ? { canonical: siteConfig.siteUrl }
    : undefined,
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: siteConfig.brandName,
    description:
      "An independent creative studio building websites, brands and digital campaigns for ambitious businesses.",
    url: siteConfig.siteUrl,
    locale: "en_US",
    images: siteConfig.siteUrl
      ? [
          {
            url: `${siteConfig.siteUrl}/images/logo.png`,
            width: 840,
            height: 768,
            alt: `${siteConfig.brandName} lightning shield logo`,
          },
        ]
      : undefined,
  },
  twitter: {
    card: "summary",
    title: siteConfig.brandName,
    description:
      "An independent creative studio building websites, brands and digital campaigns for ambitious businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    description: siteConfig.tagline,
    ...(siteConfig.siteUrl
      ? {
          url: siteConfig.siteUrl,
          logo: `${siteConfig.siteUrl}/images/logo.png`,
        }
      : {}),
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    ...(siteConfig.whatsappNumber
      ? { telephone: `+${siteConfig.whatsappNumber}` }
      : {}),
    ...(siteConfig.socialLinks.length > 0
      ? { sameAs: siteConfig.socialLinks.map((item) => item.href) }
      : {}),
  };
  const structuredData = JSON.stringify(organizationSchema).replace(
    /</g,
    "\\u003c",
  );

  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
