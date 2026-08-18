import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merge Audio Files Online | Join MP3, WAV, M4A — Fileinator",
  description: "Merge multiple audio files into a single track online for free. Secure, fast, and works directly in your browser. Join MP3, WAV, FLAC, M4A, OGG, and more.",
  keywords: [
    "merge audio",
    "join audio files",
    "combine mp3",
    "audio joiner",
    "merge wav",
    "audio combiner online",
    "free audio merge",
  ],
  alternates: {
    canonical: "/merge-audio",
  },
  openGraph: {
    title: "Merge Audio Files Online | Join MP3, WAV, M4A",
    description: "Combine multiple audio files into a single track online for free. Secure, fast browser processing. No uploads required.",
    url: "/merge-audio",
    siteName: "Fileinator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge Audio Files Online | Join MP3, WAV, M4A",
    description: "Combine multiple audio files into a single track online for free. Secure, fast browser processing. No uploads required.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Fileinator Audio Merger",
        "description": "Combine multiple audio files into a single track online for free. Secure, fast browser processing without uploads.",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does fast audio merge work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "If all your uploaded audio files share the exact same format (e.g., all MP3s or all WAVs) and you select 'Keep Original', Fileinator simply stitches them together continuously without re-encoding, preserving 100% of the original quality."
            }
          },
          {
            "@type": "Question",
            "name": "Are my audio files uploaded to a server?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No! Our audio merger operates entirely inside your web browser using FFmpeg WebAssembly. Your files are never uploaded to any remote server, ensuring total privacy."
            }
          },
          {
            "@type": "Question",
            "name": "Is this tool completely free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Fileinator's Audio Merger is 100% free with no hidden fees or watermarks."
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
      {children}
    </>
  );
}
