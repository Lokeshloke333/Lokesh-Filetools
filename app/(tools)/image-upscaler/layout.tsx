import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AI Image Upscaler - Upscale Images 2x & 4x Free",
  description: "Enlarge and enhance your images up to 4x resolution using our browser-based AI upscaler. 100% free, private, and secure.",
  keywords: [
    "ai image upscaler",
    "upscale image",
    "enlarge image online",
    "increase image resolution",
    "esrgan web",
    "2x upscaler",
    "4x upscaler"
  ],
  alternates: {
    canonical: "/image-upscaler",
  },
  openGraph: {
    title: "AI Image Upscaler — Fileinator",
    description: "Enlarge and enhance your images up to 4x resolution using our browser-based AI upscaler.",
    url: "/image-upscaler",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function AIImageUpscalerLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "AI Tools", item: "/tools?category=ai" },
    { name: "Image Upscaler", item: "/image-upscaler" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "AI Image Upscaler",
    description: "Enlarge and enhance your images up to 4x resolution using a built-in ESRGAN neural network directly in your browser.",
    url: "/image-upscaler",
    featureList: [
      "2x and 4x AI Upscaling",
      "ESRGAN Neural Network",
      "Before & After Live Slider",
      "Batch Processing",
      "100% Client-Side Privacy (No Uploads)"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
