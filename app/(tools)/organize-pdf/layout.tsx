import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize PDF Pages | Reorder, Delete, and Rotate PDF Pages Online",
  description:
    "Organize your PDF files by sorting, rearranging, deleting, and rotating pages in an intuitive, visual workspace. Fast, secure, and free online tool.",
  alternates: {
    canonical: "/organize-pdf",
  },
  openGraph: {
    title: "Organize PDF Pages | Reorder, Delete, and Rotate PDF Pages Online",
    description: "Organize your PDF files by sorting, rearranging, deleting, and rotating pages in an intuitive, visual workspace.",
    url: "/organize-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Organize PDF Pages Online",
    description: "Organize your PDF files by sorting, rearranging, deleting, and rotating pages in an intuitive, visual workspace.",
  },
};

export default function OrganizePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Organize PDF Pages",
    description: "Organize your PDF files by sorting, rearranging, deleting, and rotating pages in an intuitive, visual workspace.",
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
          name: "How do I reorder pages in a PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Simply upload your PDF, and then click and drag the page thumbnails to rearrange them into your desired order. Click 'Generate PDF' when you are done.",
          },
        },
        {
          "@type": "Question",
          name: "Can I delete or rotate pages while organizing?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can hover over any page to rotate it individually, or select multiple pages and use the top toolbar to delete or rotate them all at once.",
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
        name: "Organize PDF",
        item: "https://fileinator.com/tools/pdf/organize-pdf",
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
