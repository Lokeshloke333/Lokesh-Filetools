import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Custom QR Codes Free",
  description: "Create customizable QR codes instantly. Generate QR codes for URLs, text, Wi-Fi, email, and vCards. Download in PNG, SVG, or PDF completely free.",
  keywords: [
    "qr code generator",
    "create qr code",
    "free qr code",
    "wifi qr code",
    "custom qr code"
  ],
  alternates: {
    canonical: "/qr-generator",
  },
  openGraph: {
    title: "QR Code Generator — Fileinator",
    description: "Create customizable QR codes instantly. Generate QR codes for URLs, text, Wi-Fi, email, and vCards.",
    url: "/qr-generator",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function QRCodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Utilities", item: "/alltools" },
    { name: "QR Code Generator", item: "/qr-generator" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "QR Code Generator",
    description: "Create customizable QR codes instantly for URLs, text, Wi-Fi, email, and vCards.",
    url: "/qr-generator",
    featureList: [
      "Customizable Colors and Logos",
      "Export as PNG, SVG, PDF",
      "Client-side processing",
      "No Data Collection",
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

