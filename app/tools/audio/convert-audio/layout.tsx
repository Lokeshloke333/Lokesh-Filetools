import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universal Audio Converter | MP3, WAV, FLAC & More",
  description:
    "Convert audio files between MP3, WAV, AAC, FLAC, OGG, and AIFF. Preserve quality and metadata instantly in your browser.",
  alternates: {
    canonical: "/tools/audio/convert-audio",
  },
  openGraph: {
    title: "Universal Audio Converter",
    description: "Convert audio files between MP3, WAV, AAC, FLAC, OGG, and AIFF.",
    url: "/tools/audio/convert-audio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Audio Converter",
    description: "Convert audio files between MP3, WAV, AAC, FLAC, OGG, and AIFF.",
  },
};

export default function ConvertAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Universal Audio Converter",
    description: "Convert audio files between popular formats directly in your browser without uploading to a server.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is there a file size limit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can convert audio files up to 200MB. Processing happens locally in your browser for maximum speed and privacy.",
          },
        },
        {
          "@type": "Question",
          name: "Are my audio files uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No! All conversion is done securely on your device using WebAssembly technology. Your files never leave your computer.",
          },
        },
        {
          "@type": "Question",
          name: "Will I lose audio quality?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If you select lossless formats like WAV or FLAC, quality is perfectly preserved. If compressing to MP3 or AAC, you can choose the bitrate up to 320kbps for maximum quality.",
          },
        }
      ],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://fileinator.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: "https://fileinator.com/tools",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Convert Audio",
        item: "https://fileinator.com/tools/audio/convert-audio",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {children}
    </>
  );
}
