import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert PDF to PowerPoint Online | PDF to PPT",
  description:
    "Convert your PDF documents into editable PowerPoint (.pptx) presentations. Reconstruct slides, extract text, and preserve formatting instantly.",
  alternates: {
    canonical: "/tools/pdf/pdf-to-ppt",
  },
  openGraph: {
    title: "Convert PDF to PowerPoint Online | PDF to PPT",
    description: "Convert your PDF documents into editable PowerPoint (.pptx) presentations.",
    url: "/tools/pdf/pdf-to-ppt",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to PowerPoint Converter",
    description: "Convert your PDF documents into editable PowerPoint (.pptx) presentations.",
  },
};

export default function PdfToPptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PDF to PowerPoint Converter",
    description: "Convert your PDF documents into editable PowerPoint (.pptx) presentations. Reconstruct slides, extract text, and preserve formatting instantly.",
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
          name: "Will the text in my PowerPoint be editable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our engine extracts text layers from the PDF and creates true PowerPoint text boxes, allowing you to edit the text immediately after conversion.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to images and charts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "While text is fully reconstructed, complex vector graphics or custom fonts might not perfectly translate depending on how the original PDF was encoded.",
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
        name: "PDF to PowerPoint",
        item: "https://fileinator.com/tools/pdf/pdf-to-ppt",
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
