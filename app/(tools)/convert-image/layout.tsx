import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Convert Image Online",
  description: "Convert images between JPG, PNG, WEBP, GIF, and AVIF formats instantly in your browser. Free, secure, and preserves high image quality.",
  keywords: [
    "convert image",
    "image converter",
    "jpg to png",
    "png to webp",
    "convert picture format",
    "free online converter"
  ],
  alternates: {
    canonical: "/convert-image",
  },
  openGraph: {
    title: "Convert Image Online | Fileinator",
    description: "Convert images between JPG, PNG, WEBP, GIF, and AVIF formats instantly in your browser. Free, secure, and preserves high image quality.",
    url: "/convert-image",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image Online | Fileinator",
    description: "Convert images between JPG, PNG, WEBP, GIF, and AVIF formats instantly in your browser. Free, secure, and preserves high image quality.",
    images: ["/og-image.png"],
  },
};

export default function ConvertImageLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Image Tools", item: "/tools" },
    { name: "Convert Image", item: "/convert-image" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Convert Image",
    description: "Convert images between JPG, PNG, WEBP, GIF, and AVIF formats instantly in your browser.",
    url: "/convert-image",
    featureList: [
      "Supports JPG, PNG, WEBP, GIF, AVIF",
      "Fast Conversion",
      "Browser Based",
      "No File Retention",
      "High Fidelity Quality"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
