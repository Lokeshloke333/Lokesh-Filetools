import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Resize Image Online",
  description: "Resize image dimensions by pixels or percentage online for free. Maintain aspect ratio and optimize image size without quality loss with Fileinator.",
  keywords: [
    "resize image",
    "image resizer",
    "resize photo online",
    "change picture size",
    "pixel resizer",
    "free image tool"
  ],
  alternates: {
    canonical: "/resize-image",
  },
  openGraph: {
    title: "Resize Image Online — Fileinator",
    description: "Resize image dimensions by pixels or percentage online for free. Maintain aspect ratio and optimize image size without quality loss with Fileinator.",
    url: "/resize-image",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resize Image Online — Fileinator",
    description: "Resize image dimensions by pixels or percentage online for free. Maintain aspect ratio and optimize image size without quality loss with Fileinator.",
    images: ["/og-image.png"],
  },
};

export default function ResizeImageLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Image Tools", item: "/alltools" },
    { name: "Resize Image", item: "/resize-image" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Resize Image",
    description: "Resize image dimensions by pixels or percentage online for free. Maintain aspect ratio and optimize image size.",
    url: "/resize-image",
    featureList: [
      "Resize by Pixels or Percentage",
      "Aspect Ratio Lock Option",
      "Instant Processing",
      "Browser Based",
      "No Quality Loss"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

