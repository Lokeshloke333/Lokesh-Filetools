import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trim Audio Online | Cut MP3, WAV, M4A",
  description:
    "Trim and cut your audio files online. Easily remove unwanted parts from MP3, WAV, AAC and other audio formats directly in your browser. Max 200MB.",
  alternates: {
    canonical: "/trim-audio",
  },
  openGraph: {
    title: "Trim Audio Online",
    description: "Trim and cut audio files directly in your browser without uploading to a server.",
    url: "/trim-audio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trim Audio Online",
    description: "Remove unwanted parts from audio files.",
  },
};

export default function TrimAudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Audio Trimmer",
    description: "Trim and cut audio files up to 200MB locally in your browser.",
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
          name: "Is there a file size limit for trimming audio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can trim audio files up to 200MB. Processing happens locally in your browser for maximum speed and privacy.",
          },
        },
        {
          "@type": "Question",
          name: "Are my audio files uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No! All trimming is done securely on your device using WebAssembly technology. Your files never leave your computer.",
          },
        },
        {
          "@type": "Question",
          name: "Will I lose audio quality when trimming?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. By default, the audio is exported using the exact same codec and quality as the original file, meaning the trim is completely lossless.",
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
        name: "Trim Audio",
        item: "https://fileinator.com/tools/audio/trim-audio",
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
