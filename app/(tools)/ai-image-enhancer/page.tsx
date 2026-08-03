"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { EnhancerTool } from "@/components/tool/ai-image-enhancer/EnhancerTool";
import { Sparkles } from "lucide-react";
import Head from "next/head";

export default function AIImageEnhancerPage() {
  const faqs = [
    {
      question: "How does the Auto Enhance work?",
      answer: "Auto Enhance programmatically analyzes the luminance (brightness) histogram of your image. It detects whether the image is underexposed or overexposed, checks the dynamic contrast range, and calculates the mathematically optimal settings to balance the exposure and boost vibrance."
    },
    {
      question: "Is this actually AI?",
      answer: "Rather than using a heavy, slow neural network that balloons page size and takes seconds per edit, we built a highly-optimized algorithmic engine. It uses pure mathematics (Convolution Matrices and Histogram Equalization) directly in your browser. This gives you instant, buttery-smooth sliders with professional results, without the latency or file size limits of traditional AI models."
    },
    {
      question: "Does it shrink my image dimensions?",
      answer: "No! Unlike many free tools that restrict your resolution to 1080p, our engine processes the image at its exact original dimensions, guaranteeing zero loss in scale."
    },
    {
      question: "Is my data safe?",
      answer: "Absolutely. All processing happens entirely inside your own browser using your device's memory. Your photos are never uploaded to our servers, ensuring 100% privacy."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator AI Image Enhancer",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Instantly enhance your images. Use Auto Enhance or manually adjust brightness, contrast, saturation, vibrance, sharpen, and denoise directly in your browser."
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
          title="AI Image Enhancer"
          subtitle="Instantly boost colors, fix lighting, and sharpen details with our algorithmic enhancement engine."
          icon={<Sparkles className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <EnhancerTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the Image Enhancer"
          content={
            <>
              <p>
                The Fileinator Image Enhancer is a professional-grade, privacy-first tool designed to instantly rescue dull, underexposed, or blurry photos. We've bypassed heavy server-side AI models in favor of blazing-fast, client-side convolution matrices and histogram analysis.
              </p>
              <p>
                <strong>Key Features:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
                <li><strong>Auto Enhance:</strong> One click instantly balances exposure and boosts dynamic range based on mathematical histogram analysis.</li>
                <li><strong>Advanced Vibrance:</strong> Unlike simple saturation which can ruin skin tones, our vibrance algorithm intelligently boosts only muted colors.</li>
                <li><strong>Sharpen & Denoise:</strong> Apply professional-grade convolution kernels to crisp up edges or smooth out grainy low-light noise.</li>
                <li><strong>Batch Support:</strong> Edit one image until it looks perfect, click "Apply to All", and instantly download a ZIP file of your entire gallery.</li>
              </ul>
              <p>
                Because everything executes natively inside your browser using the HTML5 Canvas API, there are no upload limits, no wait times, and zero privacy concerns. Your original image dimensions are completely preserved during export.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
