import { videoConversions } from "@/lib/video/videoConversions";
import { notFound } from "next/navigation";
import ConvertVideoClient from "../convert-video/ConvertVideoClient";

export function generateStaticParams() {
  return videoConversions.map((conversion) => ({
    conversion: conversion.slug,
  }));
}

export default async function ConversionPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const conversionConfig = videoConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    notFound();
  }

  return (
    <ConvertVideoClient
      initialFromFormat={conversionConfig.from}
      initialToFormat={conversionConfig.to}
      title={conversionConfig.title}
      subtitle={conversionConfig.description}
      supported={conversionConfig.supported}
      aboutTitle={`About ${conversionConfig.title}`}
      aboutContent={
        <>
          <p>
            {conversionConfig.description}
          </p>
          <p>
            By utilizing native server-side processing algorithms (WASM), your videos are converted directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
          </p>
        </>
      }
    />
  );
}
