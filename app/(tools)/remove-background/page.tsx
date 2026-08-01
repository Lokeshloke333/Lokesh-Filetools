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
    <BackgroundRemoverClient />
  );
}
