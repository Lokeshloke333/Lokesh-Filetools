import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compress Audio Online | Reduce Audio File Size",
  description:
    "Compress MP3, WAV, M4A, and other audio files online. Reduce audio file size without losing quality directly in your browser. Max 200MB.",
  alternates: {
    canonical: "/tools/audio/compress-audio",
  },
  openGraph: {
    title: "Compress Audio Online",
    description: "Compress audio files directly in your browser without uploading to a server.",
    url: "/tools/audio/compress-audio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Audio Online",
    description: "Reduce audio file size without losing quality.",
  },
};

export default function CompressAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Audio Compressor",
    description: "Compress audio files up to 200MB locally in your browser to save storage space.",
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
          name: "Is there a file size limit for compressing audio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can compress audio files up to 200MB. Processing happens locally in your browser for maximum speed and privacy, so there are no upload wait times.",
          },
        },
        {
          "@type": "Question",
          name: "Are my audio files uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No! All compression is done securely on your device using WebAssembly technology. Your files never leave your computer.",
          },
        },
        {
          "@type": "Question",
          name: "Will I lose audio quality during compression?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on the compression level you choose. 'Balanced' (128 kbps) provides a great mix of small file size with very little noticeable quality loss. 'Low Compression' preserves even more quality.",
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
        name: "Compress Audio",
        item: "https://fileinator.com/tools/audio/compress-audio",
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
