"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { QRCodeGenerator } from "@/components/tool/qr/QRCodeGenerator";
import { QrCode } from "lucide-react";
import Head from "next/head";

export default function QRCodeGeneratorPage() {
  const faqs = [
    {
      question: "Are the generated QR codes free for commercial use?",
      answer: "Yes, all QR codes generated with our tool are 100% free for both personal and commercial use with no hidden fees or expiration dates."
    },
    {
      question: "Will these QR codes ever expire?",
      answer: "No. The QR codes you create here are static, meaning the data is encoded directly into the image. As long as the destination URL or text remains valid, the QR code will never expire."
    },
    {
      question: "How can I add a logo to my QR code?",
      answer: "Open the 'Design & Settings' panel and click the 'Upload logo image' section. You can upload a PNG, JPG, or SVG to be placed in the center of your QR code. The tool will automatically increase the error correction level to ensure the code remains scannable."
    },
    {
      question: "What is the best format to download my QR code?",
      answer: "PNG is great for general use on websites and social media. SVG is a vector format that can be scaled infinitely without losing quality, making it perfect for printing on business cards, banners, or merchandise."
    },
    {
      question: "Are you storing my QR code data?",
      answer: "No. Our QR Code Generator is completely client-side. The QR code is generated directly in your browser, meaning your data never touches our servers."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator QR Code Generator",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Create customizable QR codes instantly. Generate QR codes for URLs, text, Wi-Fi, email, and vCards. Download in PNG, SVG, or PDF completely free."
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ToolLayout>
        
        <ToolHeader 
          title="QR Code Generator"
          subtitle="Create, customize, and download high-quality QR codes in seconds"
          icon={<QrCode className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <QRCodeGenerator />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the QR Code Generator"
          content={
            <>
              <p>
                The Fileinator QR Code Generator is a powerful, privacy-first tool that runs entirely in your browser. Unlike other services, we never store the data you input. 
              </p>
              <p>
                Whether you need a quick link for a marketing campaign, a vCard for networking, or a Wi-Fi connection QR code for your cafe, our tool gives you full control. You can customize colors, margins, error correction levels, and even embed your own logo directly into the center of the code.
              </p>
              <p>
                Once generated, you can export your QR code as a high-resolution PNG, a scalable vector SVG, or a standard PDF document, ensuring you have the perfect format for both web and print.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
