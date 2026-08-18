import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Image to PDF Converter Online",
  description: "Convert JPG, PNG, WEBP, and AVIF images into a single PDF document. Customize page size, orientation, and margins free with Fileinator.",
  keywords: [
    "image to pdf",
    "jpg to pdf",
    "png to pdf",
    "convert image to pdf",
    "photo to pdf converter",
    "online pdf creator"
  ],
  alternates: {
    canonical: "/image-to-pdf",
  },
  openGraph: {
    title: "Image to PDF Converter Online — Fileinator",
    description: "Convert JPG, PNG, WEBP, and AVIF images into a single PDF document. Customize page size, orientation, and margins free with Fileinator.",
    url: "/image-to-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Image to PDF Converter Online — Fileinator",
    description: "Convert JPG, PNG, WEBP, and AVIF images into a single PDF document. Customize page size, orientation, and margins free with Fileinator.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "Image to PDF", item: "/image-to-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Image to PDF Converter",
    description: "Convert JPG, PNG, WEBP, and AVIF images into a single PDF document.",
    url: "/image-to-pdf",
    featureList: [
      "Convert JPG, PNG, WEBP to PDF",
      "Custom Page Size & Margins",
      "Drag & Drop Image Reordering",
      "Browser Based",
      "Free & Secure"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

