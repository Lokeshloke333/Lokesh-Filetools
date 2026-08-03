"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { ObjectRemoverTool } from "@/components/tool/object-remover/ObjectRemoverTool";
import { Wand2 } from "lucide-react";
import Head from "next/head";

export default function AIObjectRemoverPage() {
  const faqs = [
    {
      question: "How does the Object Remover work?",
      answer: "We use a mathematical technique called 'Inpainting'. When you draw a mask over an object, our algorithmic engine analyzes the pixels immediately surrounding the masked area. It then calculates the color gradients and iteratively diffuses those colors inward to seamlessly fill the gap, making the object disappear."
    },
    {
      question: "Is this actually AI?",
      answer: "Unlike massive generative neural networks (like Stable Diffusion) which hallucinate entirely new textures, this tool uses a Fast Marching algorithm (often paired with AI in professional software). We chose this specific method because it runs lightning-fast directly in your browser without requiring a supercomputer or a cloud backend."
    },
    {
      question: "Are my photos uploaded to a server?",
      answer: "No. Everything happens entirely on your device using your browser's memory and CPU. Your photos are completely private."
    },
    {
      question: "What does this tool work best for?",
      answer: "It works exceptionally well for removing blemishes from skin, deleting text or watermarks, removing power lines, and erasing small photobombers in the background of images. It does not work as well for generating missing faces or replacing half of an image."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator AI Object Remover",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Remove unwanted objects, text, blemishes, or photobombers from your images instantly."
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
          title="Magic Object Remover"
          subtitle="Simply brush over text, blemishes, or unwanted objects to seamlessly erase them from your photos."
          icon={<Wand2 className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <ObjectRemoverTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the Object Remover"
          content={
            <>
              <p>
                The Fileinator Object Remover is a professional-grade, privacy-first tool designed to clean up your photos. Instead of relying on slow, expensive cloud AI APIs, we’ve engineered a blazing-fast inpainting algorithm that runs natively in your browser.
              </p>
              <p>
                <strong>Key Features:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
                <li><strong>Interactive Masking:</strong> Easily brush over the elements you want to remove. Use the eraser to fine-tune your mask.</li>
                <li><strong>Pan & Zoom:</strong> Use the scroll wheel to zoom deeply into your photo to erase tiny blemishes or power lines with pixel-perfect accuracy.</li>
                <li><strong>Undo History:</strong> Made a mistake? Our unlimited history stack lets you effortlessly undo or redo your brush strokes.</li>
                <li><strong>Seamless Diffusion:</strong> Our algorithm reads the textures from the boundary of your mask and smoothly blends them inwards.</li>
              </ul>
              <p>
                Because everything executes natively inside your browser, there are no upload limits, no wait times, and zero privacy concerns. Your original image dimensions are completely preserved during export.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
