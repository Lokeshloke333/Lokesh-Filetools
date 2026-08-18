import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Video Converter Online Free | Fileinator",
  description: "Convert video files between MP4, MOV, AVI, MKV, and WEBM formats online. Fast, secure, and completely free browser-based local video processing.",
  keywords: [
    "video converter",
    "mp4 converter",
    "convert mov to mp4",
    "convert mkv",
    "video to gif",
    "extract audio from video",
    "free video converter",
    "local video processor"
  ],
  alternates: {
    canonical: "/convert-video",
  },
  openGraph: {
    title: "Video Converter Online Free | Fileinator",
    description: "Convert video files between MP4, MOV, AVI, MKV, and WEBM formats online. Fast, secure, and completely free browser-based local video processing.",
    url: "/convert-video",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Converter Online Free | Fileinator",
    description: "Convert video files between MP4, MOV, AVI, MKV, and WEBM formats online. Fast, secure, and completely free browser-based local video processing.",
    images: ["/og-image.png"],
  },
};

export default function ConvertVideoLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Video Tools", item: "/alltools" },
    { name: "Convert Video", item: "/convert-video" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Video Converter",
    description: "Convert video files between MP4, MOV, AVI, MKV, and WEBM formats online.",
    url: "/convert-video",
    featureList: [
      "Supports MP4, MOV, MKV, WEBM",
      "Fast Client-side Conversion",
      "Browser Based",
      "No Upload Required",
      "Secure and Private"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

