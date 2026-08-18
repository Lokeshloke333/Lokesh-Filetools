import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Compress Video Online Free — Fileinator",
  description: "Reduce video file sizes (MP4, MOV, WEBM) instantly in your browser without quality loss. Secure, fast, and 100% free.",
  keywords: ["compress video", "reduce video size", "shrink video", "mp4 compressor", "fileinator video"],
  alternates: {
    canonical: "/compress-video"
  },
  openGraph: {
    title: "Compress Video Online Free — Fileinator",
    description: "Reduce video file sizes (MP4, MOV, WEBM) instantly in your browser without quality loss. Secure, fast, and 100% free.",
    url: "/compress-video"
  }
};

export default function CompressVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Tools", item: "/alltools" },
    { name: "Video Tools", item: "/tools#video" },
    { name: "Compress Video", item: "/compress-video" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Video Compressor",
    description: "Reduce video file sizes instantly in your browser without quality loss.",
    url: "https://fileinator.com/compress-video",
    featureList: [
      "Compress MP4, MOV, WEBM",
      "No file size limits",
      "Multiple compression presets",
      "Local browser processing",
      "No data upload required"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

