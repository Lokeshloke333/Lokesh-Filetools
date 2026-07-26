import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "PDF to Word Converter Online | Free & Fast",
  description: "Convert PDF files to editable Word documents (DOCX) online for free. Extract text and formatting securely with our browser-based PDF to Word converter.",
  keywords: [
    "pdf to word",
    "pdf to docx",
    "convert pdf to word",
    "online pdf converter",
    "pdf to editable word",
    "free pdf to docx"
  ],
  alternates: {
    canonical: "/tools/pdf/pdf-to-word",
  },
  openGraph: {
    title: "PDF to Word Converter Online | Fileinator",
    description: "Convert PDF files to editable Word documents (DOCX) online for free. Extract text and formatting securely with our browser-based PDF to Word converter.",
    url: "/tools/pdf/pdf-to-word",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Word Converter Online | Fileinator",
    description: "Convert PDF files to editable Word documents (DOCX) online for free. Extract text and formatting securely with our browser-based PDF to Word converter.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/tools" },
    { name: "PDF to Word", item: "/tools/pdf/pdf-to-word" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "PDF to Word Converter",
    description: "Convert PDF files to editable Word documents (DOCX) online for free.",
    url: "/tools/pdf/pdf-to-word",
    featureList: [
      "Convert PDF to DOCX",
      "Extract Text & Basic Formatting",
      "Drag & Drop File Upload",
      "Browser Based Security",
      "Free & Fast"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
