import { audioConversions } from "@/lib/audio/audioConversions";
import { notFound } from "next/navigation";
import ConvertAudioClient from "../convert-audio/ConvertAudioClient";

export function generateStaticParams() {
  return audioConversions.map((conversion) => ({
    conversion: conversion.slug,
  }));
}

export default async function ConversionPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const conversionConfig = audioConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    notFound();
  }

  return (
    <ConvertAudioClient
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
            By utilizing native server-side processing algorithms (WASM), your audio files are converted directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
          </p>
        </>
      }
    />
  );
}
