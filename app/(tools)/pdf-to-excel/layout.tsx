import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert PDF to Excel Online | Extract PDF Tables to XLSX",
  description:
    "Extract tables and structured data from PDF files and convert them into editable Excel spreadsheets. Free, secure, and fast PDF to Excel converter.",
  alternates: {
    canonical: "/pdf-to-excel",
  },
  openGraph: {
    title: "Convert PDF to Excel Online | Extract PDF Tables to XLSX",
    description: "Extract tables and structured data from PDF files and convert them into editable Excel spreadsheets.",
    url: "/pdf-to-excel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF to Excel Converter",
    description: "Extract tables and structured data from PDF files and convert them into editable Excel spreadsheets.",
  },
};

export default function PdfToExcelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PDF to Excel Converter",
    description: "Extract tables and structured data from PDF files and convert them into editable Excel spreadsheets.",
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
          name: "Does it extract tables perfectly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our engine uses spatial heuristic analysis to rebuild tables from PDFs. It works best on cleanly formatted documents like digital invoices or financial reports.",
          },
        },
        {
          "@type": "Question",
          name: "Can it extract data from scanned PDFs?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Currently, we only support extracting tables from true digital PDFs. OCR (Optical Character Recognition) support for scanned images is coming soon.",
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
        name: "PDF to Excel",
        item: "https://fileinator.com/tools/pdf/pdf-to-excel",
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
