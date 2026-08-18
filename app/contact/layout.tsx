import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Fileinator",
  description: "Get in touch with the Fileinator team. Send us your feedback, questions, or support inquiries about our free online image and PDF editing tools.",
  keywords: [
    "contact fileinator",
    "fileinator support",
    "file tools help",
    "customer support",
    "feedback"
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Fileinator — Fileinator",
    description: "Get in touch with the Fileinator team. Send us your feedback, questions, or support inquiries about our free online image and PDF editing tools.",
    url: "/contact",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Fileinator — Fileinator",
    description: "Get in touch with the Fileinator team. Send us your feedback, questions, or support inquiries about our free online image and PDF editing tools.",
    images: ["/og-image.png"],
  },
};

import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Contact", item: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      {children}
    </>
  );
}
