import React from "react";
import { Metadata } from "next";
import ExtractAudioClient from "./ExtractAudioClient";

export const metadata: Metadata = {
  title: "Extract Audio from Video Online Free | Fileinator",
  description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
  keywords: "Extract Audio, Video to MP3, Video to WAV, MP4 to MP3, Extract Audio from Video, Audio Extractor, Browser Audio Extractor, Free Audio Extractor, Fileinator",
  alternates: {
    canonical: "https://fileinator.com/tools/audio/extract-audio",
  },
  openGraph: {
    title: "Extract Audio from Video Online Free | Fileinator",
    description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
    type: "website",
    url: "https://fileinator.com/tools/audio/extract-audio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Audio from Video Online Free | Fileinator",
    description: "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free.",
  },
};

export default function ExtractAudioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Extract Audio from Video - Fileinator",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is this tool free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our audio extraction tool is 100% free to use."
            }
          },
          {
            "@type": "Question",
            "name": "Are my videos uploaded?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, all processing happens entirely in your browser. Your videos are never uploaded to any server, ensuring complete privacy."
            }
          },
          {
            "@type": "Question",
            "name": "Can I convert directly to MP3?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, you can extract the audio directly into MP3, WAV, AAC, FLAC, or OGG format."
            }
          },
          {
            "@type": "Question",
            "name": "What video formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support a wide range of video formats including MP4, MOV, AVI, MKV, WEBM, M4V, and FLV."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ExtractAudioClient />
    </>
  );
}
