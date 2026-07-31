import { imageConversions } from "@/lib/image/imageConversions";
import { audioConversions } from "@/lib/audio/audioConversions";
import { videoConversions } from "@/lib/video/videoConversions";
import { notFound } from "next/navigation";
import { ConvertImageClient } from "../convert-image/ConvertImageClient";
import ConvertAudioClient from "../convert-audio/ConvertAudioClient";
import ConvertVideoClient from "../convert-video/ConvertVideoClient";
import { ToolContent } from "@/components/seo/ToolContent";

export function generateStaticParams() {
  const imageParams = imageConversions.map((c) => ({ conversion: c.slug }));
  const audioParams = audioConversions.map((c) => ({ conversion: c.slug }));
  const videoParams = videoConversions.map((c) => ({ conversion: c.slug }));
  
  return [...imageParams, ...audioParams, ...videoParams];
}

export default async function ConversionPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.conversion;

  const imageConfig = imageConversions.find((c) => c.slug === slug);
  if (imageConfig) {
    return (
      <>
        <ConvertImageClient
          initialFromFormat={imageConfig.from}
          initialToFormat={imageConfig.to}
          title={imageConfig.title}
          subtitle={imageConfig.description}
        />
        <ToolContent 
          toolId={imageConfig.slug} 
          title={imageConfig.title} 
          description={imageConfig.description} 
          features={[
            "Browser-based local conversion",
            "No data uploaded to servers",
            "Fast " + imageConfig.from + " processing algorithm",
            "No sign-up required"
          ]}
        />
      </>
    );
  }

  const audioConfig = audioConversions.find((c) => c.slug === slug);
  if (audioConfig) {
    return (
      <>
        <ConvertAudioClient
          initialFromFormat={audioConfig.from}
          initialToFormat={audioConfig.to}
          title={audioConfig.title}
          subtitle={audioConfig.description}
          supported={audioConfig.supported}
        />
        <ToolContent 
          toolId={audioConfig.slug} 
          title={audioConfig.title} 
          description={audioConfig.description} 
          features={[
            "WebAssembly audio processing",
            "Maximum privacy via local execution",
            "High quality audio bitrate retention",
            "No sign-up required"
          ]}
        />
      </>
    );
  }

  const videoConfig = videoConversions.find((c) => c.slug === slug);
  if (videoConfig) {
    return (
      <>
        <ConvertVideoClient
          initialFromFormat={videoConfig.from}
          initialToFormat={videoConfig.to}
          title={videoConfig.title}
          subtitle={videoConfig.description}
          supported={videoConfig.supported}
        />
        <ToolContent 
          toolId={videoConfig.slug} 
          title={videoConfig.title} 
          description={videoConfig.description} 
          features={[
            "WebAssembly video processing",
            "Zero upload times",
            "No file size limits on processing",
            "100% free with no sign-up"
          ]}
        />
      </>
    );
  }

  notFound();
}
