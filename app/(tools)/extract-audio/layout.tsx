import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Extract Audio from Video Online Free",
  description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
  keywords: [
    "Extract Audio",
    "Video to MP3",
    "Video to WAV",
    "MP4 to MP3",
    "Extract Audio from Video",
    "Audio Extractor",
    "Browser Audio Extractor",
    "Free Audio Extractor",
    "Fileinator"
  ],
  alternates: {
    canonical: "/extract-audio",
  },
  openGraph: {
    title: "Extract Audio from Video Online Free | Fileinator",
    description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
    url: "/extract-audio",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Audio from Video Online Free | Fileinator",
    description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
    images: ["/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Audio Tools", item: "/alltools" },
    { name: "Extract Audio", item: "/extract-audio" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Extract Audio from Video - Fileinator",
    description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser.",
    url: "/extract-audio",
    category: "MultimediaApplication",
    featureList: [
      "Extract Audio to MP3, WAV, AAC, FLAC",
      "Process Video Locally in Browser",
      "Zero Upload Times",
      "100% Secure & Private",
      "No File Size Limits"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}

