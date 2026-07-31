import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Merge PDF Online Free",
  description: "Merge multiple PDF files into one document online for free. Secure browser-based PDF merger with drag-and-drop page reordering.",
  keywords: [
    "merge pdf",
    "combine pdf",
    "join pdf",
    "pdf merger online",
    "combine pdf files",
    "free pdf merger"
  ],
  alternates: {
    canonical: "/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Online Free | Fileinator",
    description: "Merge multiple PDF files into one document online for free. Secure browser-based PDF merger with drag-and-drop page reordering.",
    url: "/merge-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Online Free | Fileinator",
    description: "Merge multiple PDF files into one document online for free. Secure browser-based PDF merger with drag-and-drop page reordering.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/tools" },
    { name: "Merge PDF", item: "/merge-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Merge PDF",
    description: "Merge multiple PDF files into one document online for free.",
    url: "/merge-pdf",
    featureList: [
      "Combine Multiple PDFs",
      "Drag & Drop Page Reordering",
      "Fast & Secure",
      "Browser Based",
      "No File Retention"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
