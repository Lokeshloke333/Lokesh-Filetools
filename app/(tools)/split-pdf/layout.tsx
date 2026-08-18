import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Split PDF Online",
  description: "Easily split your PDF document into multiple files, extract specific pages, or divide by page ranges. Fast, secure, and free online PDF splitter.",
  keywords: [
    "split pdf",
    "extract pdf pages",
    "divide pdf",
    "cut pdf",
    "separate pdf pages",
    "online pdf splitter"
  ],
  alternates: {
    canonical: "/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online — Fileinator",
    description: "Easily split your PDF document into multiple files, extract specific pages, or divide by page ranges. Fast, secure, and free online PDF splitter.",
    url: "/split-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online — Fileinator",
    description: "Easily split your PDF document into multiple files, extract specific pages, or divide by page ranges. Fast, secure, and free online PDF splitter.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "Split PDF", item: "/split-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Split PDF",
    description: "Easily split your PDF document into multiple files or extract specific pages.",
    url: "/split-pdf",
    featureList: [
      "Extract Specific Pages",
      "Divide by Page Ranges",
      "Fast & Secure",
      "Browser Based Processing",
      "Free to Use"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

