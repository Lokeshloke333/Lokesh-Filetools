import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete PDF Pages Online | Remove PDF Pages Free",
  description:
    "Remove unwanted pages from a PDF document online for free. Delete single or multiple pages from your PDF file securely. Fast, secure, and easy to use.",
  alternates: {
    canonical: "/delete-pages",
  },
  openGraph: {
    title: "Delete PDF Pages Online | Remove PDF Pages Free",
    description: "Remove unwanted pages from a PDF document securely in your browser.",
    url: "/delete-pages",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete PDF Pages Online",
    description: "Remove unwanted pages from a PDF document securely in your browser.",
  },
};

export default function DeletePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Delete PDF Pages",
    description: "Remove unwanted pages from a PDF document online for free.",
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
          name: "Is it safe to delete pages from my PDF here?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Your files are processed securely and deleted immediately after you download the result.",
          },
        },
        {
          "@type": "Question",
          name: "Can I delete multiple pages at once?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can click on multiple thumbnails to select them for deletion, or use our quick select tools.",
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
        name: "Delete PDF Pages",
        item: "https://fileinator.com/tools/pdf/delete-pages",
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
