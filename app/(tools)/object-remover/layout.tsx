import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AI Object Remover - Erase Unwanted Objects from Photos",
  description: "Remove unwanted objects, text, blemishes, or photobombers from your images instantly. 100% free, private, browser-based AI object removal tool.",
  keywords: [
    "ai object remover",
    "remove object from photo",
    "erase unwanted objects",
    "blemish remover",
    "text remover from image",
    "inpaint online",
    "magic eraser free"
  ],
  alternates: {
    canonical: "/object-remover",
  },
  openGraph: {
    title: "AI Object Remover | Fileinator",
    description: "Remove unwanted objects, text, blemishes, or photobombers from your images instantly. 100% private.",
    url: "/object-remover",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function AIObjectRemoverLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "AI Tools", item: "/tools?category=ai" },
    { name: "Object Remover", item: "/object-remover" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "AI Object Remover",
    description: "Remove unwanted objects, text, and blemishes from photos using algorithmic inpainting directly in your browser.",
    url: "/object-remover",
    featureList: [
      "Algorithmic Inpainting",
      "Interactive Brush & Eraser Masking",
      "Unlimited Undo/Redo History",
      "Before & After Comparison",
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
