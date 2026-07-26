import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert PowerPoint to PDF Online | PPT to PDF",
  description:
    "Convert your PowerPoint presentations (.ppt, .pptx) to high-quality PDF documents. Preserve slide layouts, text, images, and formatting instantly.",
  alternates: {
    canonical: "/tools/pdf/ppt-to-pdf",
  },
  openGraph: {
    title: "Convert PowerPoint to PDF Online | PPT to PDF",
    description: "Convert your PowerPoint presentations (.ppt, .pptx) to high-quality PDF documents. Preserve slide layouts, text, images, and formatting instantly.",
    url: "/tools/pdf/ppt-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerPoint to PDF Converter",
    description: "Convert your PowerPoint presentations (.ppt, .pptx) to high-quality PDF documents.",
  },
};

export default function PptToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PowerPoint to PDF Converter",
    description: "Convert your PowerPoint presentations (.ppt, .pptx) to high-quality PDF documents. Preserve slide layouts, text, images, and formatting instantly.",
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
          name: "Does it preserve fonts and layouts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our conversion engine locks your exact slide layouts, charts, SmartArt, and custom fonts into a static PDF document that looks exactly like your original presentation.",
          },
        },
        {
          "@type": "Question",
          name: "Can I print multiple slides per page?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can choose to convert your presentation into handouts containing 2, 4, or 6 slides per page.",
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
        name: "PowerPoint to PDF",
        item: "https://fileinator.com/tools/pdf/ppt-to-pdf",
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
