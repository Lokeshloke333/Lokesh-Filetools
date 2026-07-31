import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watermark PDF | Add Text or Image Watermarks to PDF",
  description:
    "Add a custom text or image watermark to your PDF files online. Protect your documents with customizable stamps, logos, and overlays. Free, fast, and secure.",
  alternates: {
    canonical: "/watermark-pdf",
  },
  openGraph: {
    title: "Watermark PDF | Add Text or Image Watermarks to PDF",
    description: "Add a custom text or image watermark to your PDF files online. Protect your documents with customizable stamps, logos, and overlays.",
    url: "/watermark-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Watermark PDF Online",
    description: "Add a custom text or image watermark to your PDF files online.",
  },
};

export default function WatermarkPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Watermark PDF",
    description: "Add a custom text or image watermark to your PDF files online. Protect your documents with customizable stamps, logos, and overlays.",
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
          name: "Can I add an image as a watermark?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can upload PNG, JPG, or SVG images to use as a watermark. You can scale, rotate, and adjust the opacity of the image.",
          },
        },
        {
          "@type": "Question",
          name: "How do I watermark only specific pages?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "In the watermark options, change 'Pages to Apply' to 'Selected Pages' and enter the page numbers or ranges you want to watermark (e.g. 1-5, 8).",
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
        name: "Watermark PDF",
        item: "https://fileinator.com/watermark-pdf",
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
