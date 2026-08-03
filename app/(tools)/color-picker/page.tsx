"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ColorPickerTool } from "@/components/tool/color-picker/ColorPickerTool";
import { Palette } from "lucide-react";
import Head from "next/head";

export default function ColorPickerPage() {
  const faqs = [
    {
      question: "How do I extract a color from my image?",
      answer: "Simply upload your image, then click the 'Pick a Color' button. If your browser supports it, an eyedropper tool will appear allowing you to select any pixel on your screen. Otherwise, you can just click anywhere on the uploaded image to sample that pixel's color."
    },
    {
      question: "Are my images uploaded to your servers?",
      answer: "No. The Color Picker tool runs 100% locally in your browser. Your images are never uploaded, stored, or analyzed by our servers, ensuring complete privacy."
    },
    {
      question: "How does the palette generator work?",
      answer: "When you upload an image, we use an algorithm to analyze all the pixels and identify the dominant color clusters. It extracts the 6 most prominent colors to create a cohesive palette."
    },
    {
      question: "What color formats are supported?",
      answer: "Once you pick a color, we automatically calculate and display it in HEX, RGB, RGBA, HSL, HSV, and CMYK formats. You can copy any of these to your clipboard with one click."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator Image Color Picker",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Extract exact colors from any image and automatically generate color palettes. Supports HEX, RGB, HSL, and CMYK."
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
          title="Image Color Picker"
          subtitle="Extract exact colors, generate palettes, and convert between HEX, RGB, HSL, and CMYK instantly."
          icon={<Palette className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <ColorPickerTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the Image Color Picker"
          content={
            <>
              <p>
                The Fileinator Image Color Picker is a fast, privacy-first utility for designers, developers, and artists. Built to run entirely in your web browser, it allows you to instantly extract the exact colors used in any photograph, screenshot, or graphic without ever uploading your files to a server.
              </p>
              <p>
                Take advantage of native browser technologies like the EyeDropper API to sample colors with pixel-perfect accuracy. Once selected, your color is automatically converted into every format you might need for web development or print design, including HEX, RGB, HSL, HSV, and CMYK.
              </p>
              <p>
                Additionally, the tool automatically scans your uploaded image to generate a beautiful, cohesive color palette containing the most dominant colors present in the photo. You can even export this palette as a PNG for use in your mood boards or design systems.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
