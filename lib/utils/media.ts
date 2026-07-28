export interface MediaMetadata {
  duration?: number;
  width?: number;
  height?: number;
  videoCodec?: string;
  audioCodec?: string;
  fps?: number;
  bitrate?: number;
  sampleRate?: number;
  channels?: number;
}

export const formatDuration = (seconds?: number): string => {
  if (seconds === undefined || isNaN(seconds)) return "Unknown";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const formatBitrate = (bitrateStr?: string | number): string => {
  if (!bitrateStr) return "Unknown";
  const num = typeof bitrateStr === "string" ? parseInt(bitrateStr, 10) : bitrateStr;
  if (isNaN(num)) return typeof bitrateStr === "string" ? bitrateStr : "Unknown";
  return `${Math.round(num / 1000)} kbps`;
};

export const formatSampleRate = (rate?: string | number): string => {
  if (!rate) return "Unknown";
  const num = typeof rate === "string" ? parseInt(rate, 10) : rate;
  if (isNaN(num)) return typeof rate === "string" ? rate : "Unknown";
  return `${(num / 1000).toFixed(1)} kHz`;
};

export const getBasicMediaMetadata = async (file: File): Promise<MediaMetadata> => {
  return new Promise((resolve) => {
    const isVideo = file.type.startsWith("video/");
    const element = isVideo ? document.createElement("video") : document.createElement("audio");
    
    const objectUrl = URL.createObjectURL(file);
    
    element.onloadedmetadata = () => {
      const metadata: MediaMetadata = {
        duration: element.duration,
      };
      
      if (isVideo) {
        const videoElement = element as HTMLVideoElement;
        metadata.width = videoElement.videoWidth;
        metadata.height = videoElement.videoHeight;
      }
      
      URL.revokeObjectURL(objectUrl);
      resolve(metadata);
    };
    
    element.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({});
    };
    
    element.src = objectUrl;
  });
};
