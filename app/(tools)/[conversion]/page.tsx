import { imageConversions } from "@/lib/image/imageConversions";
import { audioConversions } from "@/lib/audio/audioConversions";
import { videoConversions } from "@/lib/video/videoConversions";
import { notFound } from "next/navigation";
import { ConvertImageClient } from "../convert-image/ConvertImageClient";
import ConvertAudioClient from "../convert-audio/ConvertAudioClient";
import ConvertVideoClient from "../convert-video/ConvertVideoClient";

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
      <ConvertImageClient
        initialFromFormat={imageConfig.from}
        initialToFormat={imageConfig.to}
        title={imageConfig.title}
        subtitle={imageConfig.description}
        aboutTitle={`About ${imageConfig.title}`}
        aboutContent={
          <>
            <p>{imageConfig.description}</p>
            <p>
              By utilizing native server-side image processing algorithms, your photos are converted at lightning speed directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
            </p>
          </>
        }
      />
    );
  }

  const audioConfig = audioConversions.find((c) => c.slug === slug);
  if (audioConfig) {
    return (
      <ConvertAudioClient
        initialFromFormat={audioConfig.from}
        initialToFormat={audioConfig.to}
        title={audioConfig.title}
        subtitle={audioConfig.description}
        supported={audioConfig.supported}
        aboutTitle={`About ${audioConfig.title}`}
        aboutContent={
          <>
            <p>{audioConfig.description}</p>
            <p>
              By utilizing native server-side processing algorithms (WASM), your audio files are converted directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
            </p>
          </>
        }
      />
    );
  }

  const videoConfig = videoConversions.find((c) => c.slug === slug);
  if (videoConfig) {
    return (
      <ConvertVideoClient
        initialFromFormat={videoConfig.from}
        initialToFormat={videoConfig.to}
        title={videoConfig.title}
        subtitle={videoConfig.description}
        supported={videoConfig.supported}
        aboutTitle={`About ${videoConfig.title}`}
        aboutContent={
          <>
            <p>{videoConfig.description}</p>
            <p>
              By utilizing native server-side processing algorithms (WASM), your videos are converted directly in your browser without uploading them to external servers. This ensures maximum privacy and speed.
            </p>
          </>
        }
      />
    );
  }

  notFound();
}
