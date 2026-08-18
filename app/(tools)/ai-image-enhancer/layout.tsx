import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AI Image Enhancer - Free Auto Color & Detail Boost",
  description: "Instantly enhance your images. Use Auto Enhance or manually adjust brightness, contrast, saturation, vibrance, sharpen, and denoise directly in your browser. 100% free.",
  keywords: [
    "ai image enhancer",
    "auto enhance image",
    "sharpen image online",
    "image denoise",
    "brightness contrast editor",
    "vibrance editor",
    "batch image enhancer"
  ],
  alternates: {
    canonical: "/ai-image-enhancer",
  },
  openGraph: {
    title: "AI Image Enhancer — Fileinator",
    description: "Instantly enhance your images. Use Auto Enhance or manually adjust brightness, contrast, saturation, vibrance, sharpen, and denoise.",
    url: "/ai-image-enhancer",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function AIImageEnhancerLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "AI Tools", item: "/tools?category=ai" },
    { name: "AI Image Enhancer", item: "/ai-image-enhancer" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "AI Image Enhancer",
    description: "Instantly enhance your images using advanced algorithmic processing right in your browser. Features auto-enhance, sharpening, denoising, and batch processing.",
    url: "/ai-image-enhancer",
    featureList: [
      "Auto Enhance (Smart Histogram Analysis)",
      "Sharpen & Denoise",
      "Vibrance & Saturation Booster",
      "Before & After Live Slider",
      "Batch Image Processing",
      "100% Client-Side Privacy"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
