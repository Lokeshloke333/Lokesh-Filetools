import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Word to PDF Converter Online",
  description: "Convert DOC and DOCX files to PDF online for free while preserving formatting. Fast, secure, browser-based Word to PDF converter.",
  keywords: [
    "word to pdf",
    "docx to pdf",
    "convert word to pdf",
    "doc to pdf",
    "online word converter",
    "word document to pdf"
  ],
  alternates: {
    canonical: "/word-to-pdf",
  },
  openGraph: {
    title: "Word to PDF Converter Online — Fileinator",
    description: "Convert DOC and DOCX files to PDF online for free while preserving formatting. Fast, secure, browser-based Word to PDF converter.",
    url: "/word-to-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Word to PDF Converter Online — Fileinator",
    description: "Convert DOC and DOCX files to PDF online for free while preserving formatting. Fast, secure, browser-based Word to PDF converter.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "Word to PDF", item: "/word-to-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Word to PDF Converter",
    description: "Convert DOC and DOCX files to PDF online for free while preserving formatting.",
    url: "/word-to-pdf",
    featureList: [
      "Convert DOC and DOCX to PDF",
      "Preserve Formatting, Tables & Headers",
      "Drag & Drop File Upload",
      "Browser Based Security",
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

