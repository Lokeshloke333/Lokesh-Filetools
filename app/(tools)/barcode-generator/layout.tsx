import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Free Barcode Generator - Create Code128, UPC, EAN",
  description: "Generate professional barcodes instantly. Supports Code128, Code39, EAN-13, UPC, and more. Download as high-quality PNG, SVG, or PDF. 100% free and secure.",
  keywords: [
    "barcode generator",
    "create barcode",
    "code128 generator",
    "ean generator",
    "upc generator",
    "download barcode svg",
    "barcode maker"
  ],
  alternates: {
    canonical: "/barcode-generator",
  },
  openGraph: {
    title: "Barcode Generator | Fileinator",
    description: "Generate professional barcodes instantly. Supports Code128, Code39, EAN-13, UPC, and more.",
    url: "/barcode-generator",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Utilities", item: "/alltools" },
    { name: "Barcode Generator", item: "/barcode-generator" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Barcode Generator",
    description: "Generate Code128, EAN, UPC, and other barcodes instantly. Export as PNG, SVG, or PDF.",
    url: "/barcode-generator",
    featureList: [
      "10+ Barcode Formats (Code128, EAN, UPC, ITF, etc.)",
      "Live Instant Preview",
      "Custom Margins, Colors, and Dimensions",
      "Export as Vector SVG or High-Quality PNG",
      "Export directly to PDF"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

