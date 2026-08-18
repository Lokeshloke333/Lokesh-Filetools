import { Metadata } from "next";
import { TOOLS } from "@/lib/tools";

const tool = TOOLS.find((t) => t.id === "remove-watermark");

export const metadata: Metadata = {
  title: "Remove Watermark from Video Online — Fileinator",
  description: tool?.description || "Remove unwanted logos and watermarks from videos by selecting the area directly.",
  keywords: tool?.keywords || ["remove watermark", "remove logo", "video watermark remover", "delogo"],
  alternates: {
    canonical: "/remove-watermark"
  },
  openGraph: {
    title: "Remove Watermark from Video Online",
    description: tool?.description || "Remove unwanted logos and watermarks from videos by selecting the area directly.",
    url: "https://fileinator.com/remove-watermark",
    siteName: "Fileinator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Watermark from Video Online",
    description: tool?.description || "Remove unwanted logos and watermarks from videos by selecting the area directly.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
        "name": "Remove Watermark",
        "item": "https://fileinator.com/remove-watermark"
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
