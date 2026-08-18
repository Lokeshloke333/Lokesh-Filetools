import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Trim Video Online Free | Fileinator",
  description: "Cut and trim video files (MP4, MOV, WEBM) easily in your browser without quality loss. Fast, secure, and 100% free.",
  keywords: ["trim video", "cut video", "video cutter", "crop video duration", "fileinator video trimmer"],
  alternates: {
    canonical: "/trim-video"
  },
  openGraph: {
    title: "Trim Video Online Free | Fileinator",
    description: "Cut and trim video files (MP4, MOV, WEBM) easily in your browser without quality loss. Fast, secure, and 100% free.",
    url: "/trim-video"
  }
};

export default function TrimVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Tools", item: "/alltools" },
    { name: "Video Tools", item: "/tools#video" },
    { name: "Trim Video", item: "/trim-video" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Video Trimmer",
    description: "Cut and trim video files easily in your browser without quality loss.",
    url: "https://fileinator.com/trim-video",
    featureList: [
      "Trim MP4, MOV, WEBM",
      "Interactive timeline slider",
      "No file size limits",
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

