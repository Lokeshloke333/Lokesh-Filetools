import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Merge Video Online Free | Fileinator",
  description: "Combine and merge multiple video files (MP4, MOV, WEBM) together instantly in your browser. Fast, secure, and completely free.",
  keywords: ["merge video", "combine video", "join video", "video merger", "fileinator video"],
  alternates: {
    canonical: "/tools/video/merge-video"
  },
  openGraph: {
    title: "Merge Video Online Free | Fileinator",
    description: "Combine and merge multiple video files (MP4, MOV, WEBM) together instantly in your browser. Fast, secure, and completely free.",
    url: "/tools/video/merge-video"
  }
};

export default function MergeVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Tools", item: "/tools" },
    { name: "Video Tools", item: "/tools#video" },
    { name: "Merge Video", item: "/tools/video/merge-video" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Video Merger",
    description: "Combine multiple video files together instantly in your browser.",
    url: "https://fileinator.com/tools/video/merge-video",
    featureList: [
      "Merge MP4, MOV, WEBM",
      "Drag and drop reordering",
      "Stream copy for fast processing",
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
