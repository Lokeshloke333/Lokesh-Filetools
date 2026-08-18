import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site.config";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo/schema";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
import { Analytics } from "@vercel/analytics/next";
import { FileinatorAssistant } from "@/components/assistant/FileinatorAssistant";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Fileinator",
    template: "%s — Fileinator",
  },
  description: "Fileinator is a comprehensive collection of free online file tools. Compress, convert, edit, and optimize files securely in your browser using our PDF tools, image tools, video tools, and audio tools.",
  keywords: [
    "online file tools",
    "online image tools",
    "online pdf tools",
    "online video tools",
    "online audio tools",
    "compress image",
    "convert video",
    "edit audio",
    "merge pdf",
    "free file tools",
    "browser file tools",
    "file utilities"
  ],
  authors: [{ name: "Fileinator", url: siteConfig.url }],
  applicationName: "Fileinator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "Fileinator",
    title: "Fileinator — All-in-One File Toolkit",
    description: "Fileinator is a comprehensive collection of free online file tools. Compress, convert, edit, and optimize files securely in your browser using our PDF tools, image tools, video tools, and audio tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fileinator - All-in-One File Toolkit",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fileinator — All-in-One File Toolkit",
    description: "Fileinator is a comprehensive collection of free online file tools. Compress, convert, edit, and optimize files securely in your browser using our PDF tools, image tools, video tools, and audio tools.",
    images: ["/og-image.png"],
    creator: "@Fileinator",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" }
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Fileinator",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_BING_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = getOrganizationSchema();
  const webSiteSchema = getWebSiteSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd data={[organizationSchema, webSiteSchema]} />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster position="bottom-right" />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <Analytics />
        <FileinatorAssistant />
      </body>
    </html>
  );
}
