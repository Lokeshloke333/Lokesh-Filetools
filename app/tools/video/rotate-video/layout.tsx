import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Rotate Video Online Free | Fileinator",
  description: "Rotate and flip videos (MP4, MOV, WEBM) easily in your browser without quality loss. Change video orientation securely and completely free.",
  keywords: ["rotate video", "flip video", "change video orientation", "video rotator", "fileinator video"],
  alternates: {
    canonical: "/tools/video/rotate-video"
  },
  openGraph: {
    title: "Rotate Video Online Free | Fileinator",
    description: "Rotate and flip videos (MP4, MOV, WEBM) easily in your browser without quality loss. Change video orientation securely and completely free.",
    url: "/tools/video/rotate-video"
  }
};

export default function RotateVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Tools", item: "/tools" },
    { name: "Video Tools", item: "/tools#video" },
    { name: "Rotate Video", item: "/tools/video/rotate-video" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Video Rotator",
    description: "Rotate and flip videos easily in your browser.",
    url: "https://fileinator.com/tools/video/rotate-video",
    featureList: [
      "Rotate 90, 180, 270 degrees",
      "Flip horizontally or vertically",
      "Instant metadata processing",
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
