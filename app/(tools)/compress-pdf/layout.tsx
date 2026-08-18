import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Compress PDF Online Free",
  description: "Compress PDF files online for free. Reduce file size of your PDF documents quickly while maintaining optimal visual quality for sharing.",
  keywords: [
    "compress pdf",
    "reduce pdf size",
    "make pdf smaller",
    "optimize pdf",
    "pdf compressor online",
    "free pdf tool"
  ],
  alternates: {
    canonical: "/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online Free — Fileinator",
    description: "Compress PDF files online for free. Reduce file size of your PDF documents quickly while maintaining optimal visual quality for sharing.",
    url: "/compress-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online Free — Fileinator",
    description: "Compress PDF files online for free. Reduce file size of your PDF documents quickly while maintaining optimal visual quality for sharing.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "Compress PDF", item: "/compress-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Compress PDF",
    description: "Compress PDF files online for free while maintaining visual clarity.",
    url: "/compress-pdf",
    featureList: [
      "Reduce PDF File Size",
      "Maintain Visual Quality",
      "Fast & Secure",
      "No Upload Storage",
      "Browser Based Processing"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

