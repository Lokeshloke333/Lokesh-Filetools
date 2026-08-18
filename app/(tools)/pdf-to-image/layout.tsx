import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "PDF to Image Converter Online",
  description: "Extract and convert pages from your PDF documents into high-quality JPG or PNG images. Customize resolution and quality online with Fileinator.",
  keywords: [
    "pdf to image",
    "pdf to jpg",
    "pdf to png",
    "extract images from pdf",
    "convert pdf to picture",
    "pdf image extractor"
  ],
  alternates: {
    canonical: "/pdf-to-image",
  },
  openGraph: {
    title: "PDF to Image Converter Online — Fileinator",
    description: "Extract and convert pages from your PDF documents into high-quality JPG or PNG images. Customize resolution and quality online with Fileinator.",
    url: "/pdf-to-image",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Image Converter Online — Fileinator",
    description: "Extract and convert pages from your PDF documents into high-quality JPG or PNG images. Customize resolution and quality online with Fileinator.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "PDF to Image", item: "/pdf-to-image" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "PDF to Image Converter",
    description: "Extract and convert pages from your PDF documents into high-quality JPG or PNG images.",
    url: "/pdf-to-image",
    featureList: [
      "Extract Pages to JPG/PNG",
      "Customize Resolution & Quality",
      "Fast Processing",
      "Browser Based",
      "High Resolution Output"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

