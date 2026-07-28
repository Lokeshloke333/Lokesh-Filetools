import React from "react";
import { Metadata } from "next";
import BackgroundRemoverClient from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  title: "AI Background Remover Online Free | Fileinator",
  description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
  keywords: "AI Background Remover, Remove Background, Transparent PNG, Image Background Removal, Free Background Remover, Browser AI, Image Cutout, Background Eraser, Fileinator",
  alternates: {
    canonical: "https://fileinator.com/tools/ai/background-remover",
  },
  openGraph: {
    title: "AI Background Remover Online Free | Fileinator",
    description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
    type: "website",
    url: "https://fileinator.com/tools/ai/background-remover",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Background Remover Online Free | Fileinator",
    description: "Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free.",
  },
};

export default function BackgroundRemoverPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "AI Background Remover - Fileinator",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Remove image backgrounds instantly using private AI processing directly inside your browser."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Is Background Remover free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, our AI Background Remover is completely free to use without any hidden limits."
            }
          },
          {
            "@type": "Question",
            "name": "Are my images uploaded?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, all AI processing happens entirely in your browser using ONNX WebAssembly and WebGPU. Your images never leave your device."
            }
          },
          {
            "@type": "Question",
            "name": "Does this work offline?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Once the AI model is downloaded to your browser cache on your first visit, the tool works completely offline."
            }
          },
          {
            "@type": "Question",
            "name": "Which image formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We support standard web image formats including JPG, PNG, and WebP."
            }
          },
          {
            "@type": "Question",
            "name": "Can I download transparent PNG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, the tool outputs a high-quality transparent PNG file by default."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use state-of-the-art AI models that are highly accurate at distinguishing foreground subjects (people, products, animals) from complex backgrounds."
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
      <BackgroundRemoverClient />
    </>
  );
}
