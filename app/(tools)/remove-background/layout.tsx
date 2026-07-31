import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AI Background Remover Online Free",
  description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
  keywords: [
    "AI Background Remover",
    "Remove Background",
    "Transparent PNG",
    "Image Background Removal",
    "Free Background Remover",
    "Browser AI",
    "Image Cutout",
    "Background Eraser",
    "Fileinator"
  ],
  alternates: {
    canonical: "/remove-background",
  },
  openGraph: {
    title: "AI Background Remover Online Free | Fileinator",
    description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
    url: "/remove-background",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Background Remover Online Free | Fileinator",
    description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "AI Tools", item: "/tools" },
    { name: "Remove Background", item: "/remove-background" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "AI Background Remover - Fileinator",
    description: "Remove image backgrounds instantly using private AI processing directly inside your browser.",
    url: "/remove-background",
    category: "MultimediaApplication",
    featureList: [
      "AI Background Removal",
      "Local Browser Execution",
      "ONNX WebAssembly & WebGPU",
      "Transparent PNG Output",
      "100% Secure & Private"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
