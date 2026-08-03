"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { UpscalerTool } from "@/components/tool/image-upscaler/UpscalerTool";
import { Image as ImageIcon } from "lucide-react";
import Head from "next/head";

export default function AIImageUpscalerPage() {
  const faqs = [
    {
      question: "How does the AI Image Upscaler work?",
      answer: "The upscaler uses an ESRGAN (Enhanced Super-Resolution Generative Adversarial Network) neural network running directly inside your browser. It intelligently guesses and generates new pixels to enlarge your image up to 4x without losing clarity, unlike standard bilinear scaling which just makes images blurry."
    },
    {
      question: "Is this safe and private?",
      answer: "Yes, 100%. We use WebGL and TensorFlow.js to run the AI model directly on your device. Your images are never uploaded to any server or cloud API, guaranteeing complete privacy."
    },
    {
      question: "Why does it take so long or freeze?",
      answer: "AI upscaling requires billions of mathematical operations. If you are upscaling a large image (e.g., 2000px) by 4x, it generates an 8000px image, which is extremely intensive for standard computers and mobile devices. Our tool breaks the image into smaller 'patches' to prevent your browser from crashing, but it may still take several seconds or minutes depending on your GPU."
    },
    {
      question: "Why isn't there an 8x option?",
      answer: "While 8x models exist, they require massive amounts of Video RAM (VRAM). Running an 8x scale natively inside a web browser often exceeds the memory limits of WebGL, causing the browser tab to crash. We limit to 4x to ensure a stable experience across all devices."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator AI Image Upscaler",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Enlarge and enhance your images up to 4x resolution using our browser-based AI upscaler."
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
          title="AI Image Upscaler"
          subtitle="Magically increase image resolution up to 4x using built-in Neural Networks. 100% free and private."
          icon={<ImageIcon className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <UpscalerTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the AI Upscaler"
          content={
            <>
              <p>
                The Fileinator AI Image Upscaler represents a breakthrough in browser-based processing. By leveraging TensorFlow.js and WebGL, we bring the power of <strong>ESRGAN</strong> (Enhanced Super-Resolution Generative Adversarial Networks) directly to your device.
              </p>
              <p>
                <strong>Key Advantages:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
                <li><strong>Privacy First:</strong> Because the AI model runs locally in your browser, your sensitive photos are never sent to a cloud server.</li>
                <li><strong>No Wait Times or Queues:</strong> You don't have to wait in line for a server to free up. The processing utilizes your own device's GPU.</li>
                <li><strong>True AI Enhancement:</strong> This isn't a basic CSS filter. The Neural Network actually hallucinates and reconstructs missing textures and details as it enlarges the photo.</li>
                <li><strong>Memory Optimized:</strong> Our engine splits your image into tiny chunks (patches) and processes them sequentially to prevent your browser from running out of memory.</li>
              </ul>
              <p>
                Whether you need to restore old family photos, enlarge midjourney generations, or enhance product images, our Upscaler delivers professional results entirely for free.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
