import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online | Free Document Rotator",
  description:
    "Rotate PDF pages online for free. Turn PDF pages 90, 180, or 270 degrees. Rotate specific pages or all pages permanently. Fast, secure, and easy to use.",
  alternates: {
    canonical: "/rotate-pdf",
  },
  openGraph: {
    title: "Rotate PDF Pages Online | Free Document Rotator",
    description: "Rotate PDF pages 90, 180, or 270 degrees. Rotate specific pages or all pages permanently.",
    url: "/rotate-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Pages Online",
    description: "Rotate PDF pages 90, 180, or 270 degrees online for free.",
  },
};

export default function RotatePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rotate PDF",
    description: "Rotate PDF pages 90, 180, or 270 degrees online.",
    applicationCategory: "BusinessApplication",
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
          name: "Are the rotations permanent?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, when you rotate and download the PDF, the pages are permanently rotated.",
          },
        },
        {
          "@type": "Question",
          name: "Can I rotate just one page?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! You can choose 'Selected Pages' and input the exact page numbers you wish to rotate.",
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
        name: "Rotate PDF",
        item: "https://fileinator.com/rotate-pdf",
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
