import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convert Excel to PDF Online | Keep Formatting Intact",
  description:
    "Convert your Excel spreadsheets (.xlsx, .xls) to PDF documents instantly. Preserve tables, colors, cell formatting, and borders. Free, fast, and secure.",
  alternates: {
    canonical: "/excel-to-pdf",
  },
  openGraph: {
    title: "Convert Excel to PDF Online | Keep Formatting Intact",
    description: "Convert your Excel spreadsheets (.xlsx, .xls) to PDF documents instantly. Preserve tables, colors, cell formatting, and borders.",
    url: "/excel-to-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel to PDF Converter",
    description: "Convert your Excel spreadsheets (.xlsx, .xls) to PDF documents instantly.",
  },
};

export default function ExcelToPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Excel to PDF Converter",
    description: "Convert your Excel spreadsheets (.xlsx, .xls) to PDF documents instantly. Preserve tables, colors, cell formatting, and borders.",
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
          name: "Does it preserve cell colors and fonts?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, our advanced conversion engine retains cell background colors, text colors, bold, and italic formatting from your original Excel spreadsheet.",
          },
        },
        {
          "@type": "Question",
          name: "What happens to multiple worksheets?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All worksheets in your Excel file are converted. Each worksheet begins on a new page in the resulting PDF.",
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
        name: "Excel to PDF",
        item: "https://fileinator.com/excel-to-pdf",
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
