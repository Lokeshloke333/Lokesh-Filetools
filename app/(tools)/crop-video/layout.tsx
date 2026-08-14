import { Metadata } from "next";
import { TOOLS } from "@/lib/tools";

const tool = TOOLS.find((t) => t.id === "crop-video");

export const metadata: Metadata = {
  title: "Crop Video Online - Resize & Change Aspect Ratio | Fileinator",
  description: tool?.description || "Crop videos to any aspect ratio or custom dimensions.",
  keywords: tool?.keywords || ["crop", "video", "resize", "aspect ratio"],
  alternates: {
    canonical: "/crop-video"
  },
  openGraph: {
    title: "Crop Video Online - Resize & Change Aspect Ratio",
    description: tool?.description || "Crop videos to any aspect ratio or custom dimensions.",
    url: "https://fileinator.com/crop-video",
    siteName: "Fileinator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Video Online",
    description: tool?.description || "Crop videos to any aspect ratio or custom dimensions.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  // We can include standard Breadcrumb JSON-LD here if needed
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://fileinator.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tools",
        "item": "https://fileinator.com/tools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Crop Video",
        "item": "https://fileinator.com/crop-video"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
