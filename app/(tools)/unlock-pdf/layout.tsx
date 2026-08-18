import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Unlock PDF Online",
  description: "Remove password protection from PDF files using the correct password. Safe, private, browser-based PDF password remover with Fileinator.",
  keywords: [
    "unlock pdf",
    "remove pdf password",
    "pdf password remover",
    "decrypt pdf",
    "unprotect pdf",
    "online pdf unlocker"
  ],
  alternates: {
    canonical: "/unlock-pdf",
  },
  openGraph: {
    title: "Unlock PDF Online — Fileinator",
    description: "Remove password protection from PDF files using the correct password. Safe, private, browser-based PDF password remover with Fileinator.",
    url: "/unlock-pdf",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF Online — Fileinator",
    description: "Remove password protection from PDF files using the correct password. Safe, private, browser-based PDF password remover with Fileinator.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "PDF Tools", item: "/alltools" },
    { name: "Unlock PDF", item: "/unlock-pdf" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Unlock PDF",
    description: "Remove password protection from PDF files using the correct password.",
    url: "/unlock-pdf",
    featureList: [
      "Remove PDF Password Protection",
      "Browser Based Decryption",
      "Safe & Private",
      "No Password Stored",
      "Instant Unlocked PDF Download"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

