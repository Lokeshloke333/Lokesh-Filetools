import { imageConversions } from "@/lib/image/imageConversions";
import { notFound } from "next/navigation";
import { ConvertImageClient } from "../convert/ConvertImageClient";

export function generateStaticParams() {
  return imageConversions.map((conversion) => ({
    conversion: conversion.slug,
  }));
}

export default async function ConversionPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const conversionConfig = imageConversions.find((c) => c.slug === resolvedParams.conversion);
  
  if (!conversionConfig) {
    notFound();
  }

  return (
    <ConvertImageClient
      initialFromFormat={conversionConfig.from}
      initialToFormat={conversionConfig.to}
      title={conversionConfig.title}
      subtitle={conversionConfig.description}
      aboutTitle={`About ${conversionConfig.title}`}
      aboutContent={
        <>
          <p>
            {conversionConfig.description}
          </p>
          <p>
            By utilizing native server-side image processing algorithms, your photos are converted at lightning speed directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
          </p>
        </>
      }
    />
  );
}
