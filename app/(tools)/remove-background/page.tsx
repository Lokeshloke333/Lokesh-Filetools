"use client";
import React from "react";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";
import { ToolContent } from "@/components/seo/ToolContent";

const BackgroundRemoverClient = dynamic(
  () => import('./BackgroundRemoverClient'),
  { 
    ssr: false, 
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading AI Engine...</p>
      </div>
    )
  }
);

export default function BackgroundRemoverPage() {
  return (
    <>
      <BackgroundRemoverClient />
      <ToolContent 
        toolId="background-remover" 
        title="AI Background Remover" 
        description="Remove image backgrounds instantly using AI directly in your browser. No uploads, secure, private and completely free." 
        howToSteps={[
          "Select or drag & drop your image file.",
          "Wait for the AI model to process the image.",
          "Download the high-quality transparent PNG file."
        ]}
        features={[
          "Browser-based local AI processing",
          "Powered by ONNX WebAssembly & WebGPU",
          "No data uploaded to servers",
          "No sign-up required"
        ]}
        faqs={[
          {
            question: "Is Background Remover free?",
            answer: "Yes, our AI Background Remover is completely free to use without any hidden limits."
          },
          {
            question: "Are my images uploaded?",
            answer: "No, all AI processing happens entirely in your browser using ONNX WebAssembly and WebGPU. Your images never leave your device."
          },
          {
            question: "Does this work offline?",
            answer: "Once the AI model is downloaded to your browser cache on your first visit, the tool works completely offline."
          },
          {
            question: "Which image formats are supported?",
            answer: "We support standard web image formats including JPG/JPEG, PNG, and WebP."
          },
          {
            question: "Can I download transparent PNG?",
            answer: "Yes, the tool outputs a high-quality transparent PNG file by default."
          }
        ]}
      />
    </>
  );
}
