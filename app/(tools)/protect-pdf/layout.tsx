import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protect PDF Online Free — Fileinator",
  description: "Encrypt your PDF files with a password online for free. Secure sensitive documents using AES encryption with Fileinator.",
  alternates: {
    canonical: "/protect-pdf",
  },
  openGraph: {
    title: "Protect PDF Online Free — Fileinator",
    description: "Encrypt your PDF files with a password online for free. Secure sensitive documents using AES encryption with Fileinator.",
    url: "/protect-pdf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protect PDF Online Free — Fileinator",
    description: "Encrypt your PDF files with a password online for free. Secure sensitive documents using AES encryption with Fileinator.",
  },
};

export default function ProtectPdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Fileinator Protect PDF",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Encrypt your PDF files with a password online for free. Secure sensitive documents using AES encryption with Fileinator.",
            "url": "https://fileinator.com/protect-pdf",
            "featureList": [
              "Password protect PDF",
              "128-bit RC4 and 256-bit AES encryption",
              "PDF permission management",
              "No registration required"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://fileinator.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Tools",
                "item": "https://fileinator.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Protect PDF",
                "item": "https://fileinator.com/protect-pdf"
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is my password stored?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. We never log or store your passwords. Your password is used purely in memory to encrypt the document and is discarded immediately after processing."
                }
              },
              {
                "@type": "Question",
                "name": "Which encryption method is used?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We support standard 128-bit RC4 encryption as well as military-grade 256-bit AES encryption. AES-256 is the default and provides the highest level of security available for PDF documents."
                }
              },
              {
                "@type": "Question",
                "name": "Can I remove the password later?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can easily remove the password using our free Unlock PDF tool, provided you still know the password."
                }
              },
              {
                "@type": "Question",
                "name": "Are my files deleted after processing?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Your files are encrypted during transfer and processed securely. They are never stored on our servers and are deleted immediately after encryption."
                }
              },
              {
                "@type": "Question",
                "name": "Is this free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Fileinator's Protect PDF tool is completely free to use with no hidden fees, subscriptions, or watermarks."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}
