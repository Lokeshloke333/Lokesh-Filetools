"use client";

import React from "react";
import ExtractAudioClient from "./ExtractAudioClient";
import { ToolContent } from "@/components/seo/ToolContent";

export default function ExtractAudioPage() {
  return (
    <>
      <ExtractAudioClient />
      <ToolContent 
        toolId="extract-audio" 
        title="Extract Audio from Video" 
        description="Extract high-quality audio from MP4, MOV, AVI, MKV, WEBM and other video formats directly in your browser. Private, secure and completely free." 
        howToSteps={[
          "Select or drag & drop your video file.",
          "Choose your desired output audio format.",
          "Click extract and download the audio track instantly."
        ]}
        features={[
          "Browser-based local processing",
          "No data uploaded to servers",
          "Retains original audio quality",
          "No sign-up required"
        ]}
        faqs={[
          {
            question: "Is this tool free?",
            answer: "Yes, our audio extraction tool is 100% free to use."
          },
          {
            question: "Are my videos uploaded?",
            answer: "No, all processing happens entirely in your browser. Your videos are never uploaded to any server, ensuring complete privacy."
          },
          {
            question: "Can I convert directly to MP3?",
            answer: "Yes, you can extract the audio directly into MP3, WAV, AAC, FLAC, or OGG format."
          },
          {
            question: "What video formats are supported?",
            answer: "We support a wide range of video formats including MP4, MOV, AVI, MKV, WEBM, M4V, and FLV."
          }
        ]}
      />
    </>
  );
}
