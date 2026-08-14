import { imageConversions } from "@/lib/image/imageConversions";
import { audioConversions } from "@/lib/audio/audioConversions";
import { videoConversions } from "@/lib/video/videoConversions";
import { formatterConversions } from "@/lib/formatters/formatterConversions";
import { notFound } from "next/navigation";
import { ConvertImageClient } from "../convert-image/ConvertImageClient";
import ConvertAudioClient from "../convert-audio/ConvertAudioClient";
import ConvertVideoClient from "../convert-video/ConvertVideoClient";
import VideoToGifClient from "@/components/tool/video-to-gif/VideoToGifClient";
import { CodeFormatterClient } from "@/components/tool/code-formatter/CodeFormatterClient";
import { ToolContent } from "@/components/seo/ToolContent";

export function generateStaticParams() {
  const imageParams = imageConversions.map((c) => ({ conversion: c.slug }));
  const audioParams = audioConversions.map((c) => ({ conversion: c.slug }));
  const videoParams = videoConversions.map((c) => ({ conversion: c.slug }));
  const formatterParams = formatterConversions.map((c) => ({ conversion: c.slug }));
  
  return [...imageParams, ...audioParams, ...videoParams, ...formatterParams];
}

export default async function ConversionPage({ params }: { params: Promise<{ conversion: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.conversion;

  const imageConfig = imageConversions.find((c) => c.slug === slug);
  if (imageConfig) {
    return (
      <ConvertImageClient
        initialFromFormat={imageConfig.from}
        initialToFormat={imageConfig.to}
        title={imageConfig.title.split(' – ')[0].split(' | ')[0]}
        subtitle={imageConfig.description}
        faqs={imageConfig.faqs}
      />
    );
  }

  const audioConfig = audioConversions.find((c) => c.slug === slug);
  if (audioConfig) {
    return (
      <ConvertAudioClient
        initialFromFormat={audioConfig.from}
        initialToFormat={audioConfig.to}
        title={audioConfig.title.split(' – ')[0].split(' | ')[0]}
        subtitle={audioConfig.description}
        supported={audioConfig.supported}
        faqs={audioConfig.faqs}
      />
    );
  }

  const videoConfig = videoConversions.find((c) => c.slug === slug);
  if (videoConfig) {
    if (slug === "video-to-gif") {
      return (
        <VideoToGifClient
          initialFromFormat={videoConfig.from}
          title={videoConfig.title.split(' – ')[0].split(' | ')[0]}
          subtitle={videoConfig.description}
          faqs={videoConfig.faqs}
        />
      );
    }
    return (
      <ConvertVideoClient
        initialFromFormat={videoConfig.from}
        initialToFormat={videoConfig.to}
        title={videoConfig.title.split(' – ')[0].split(' | ')[0]}
        subtitle={videoConfig.description}
        supported={videoConfig.supported}
        faqs={videoConfig.faqs}
      />
    );
  }

  const formatterConfig = formatterConversions.find((c) => c.slug === slug);
  if (formatterConfig) {
    return <CodeFormatterClient config={formatterConfig} />;
  }

  notFound();
}
