import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Crop Image Online",
  description: "Crop photos and images online to custom dimensions or preset aspect ratios like 16:9, 4:3, and 1:1. Simple, fast, and free browser image cropper.",
  keywords: [
    "crop image",
    "online photo cropper",
    "crop picture",
    "image cropper online",
    "aspect ratio cropper",
    "free image editor"
  ],
  alternates: {
    canonical: "/crop-image",
  },
  openGraph: {
    title: "Crop Image Online | Fileinator",
    description: "Crop photos and images online to custom dimensions or preset aspect ratios like 16:9, 4:3, and 1:1. Simple, fast, and free browser image cropper.",
    url: "/crop-image",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Image Online | Fileinator",
    description: "Crop photos and images online to custom dimensions or preset aspect ratios like 16:9, 4:3, and 1:1. Simple, fast, and free browser image cropper.",
    images: ["/og-image.png"],
  },
};

export default function CropImageLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Image Tools", item: "/alltools" },
    { name: "Crop Image", item: "/crop-image" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Crop Image",
    description: "Crop photos and images online to custom dimensions or preset aspect ratios like 16:9, 4:3, and 1:1.",
    url: "/crop-image",
    featureList: [
      "Custom Dimensions",
      "Preset Aspect Ratios (16:9, 4:3, 1:1)",
      "Instant Visual Preview",
      "Browser Based Processing",
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

