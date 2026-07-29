export interface VideoConversion {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string[];
  supported: boolean;
}

export const videoConversions: VideoConversion[] = [
  {
    slug: "mp4-to-gif",
    from: "MP4",
    to: "GIF",
    title: "Convert MP4 to GIF",
    description: "Easily convert your MP4 videos to GIF animations. Fast, secure, and free online MP4 to GIF converter.",
    keywords: ["mp4 to gif", "convert mp4 to gif", "video to gif", "gif maker"],
    supported: false,
  },
  {
    slug: "mp4-to-mp3",
    from: "MP4",
    to: "MP3",
    title: "Convert MP4 to MP3",
    description: "Extract high-quality audio from your MP4 videos by converting them to MP3 format.",
    keywords: ["mp4 to mp3", "extract audio from mp4", "video to mp3", "audio extractor"],
    supported: true,
  },
  {
    slug: "webm-to-mp4",
    from: "WEBM",
    to: "MP4",
    title: "Convert WEBM to MP4",
    description: "Convert WEBM videos to the widely compatible MP4 format instantly in your browser.",
    keywords: ["webm to mp4", "convert webm to mp4", "video converter"],
    supported: true,
  },
  {
    slug: "mov-to-mp4",
    from: "MOV",
    to: "MP4",
    title: "Convert MOV to MP4",
    description: "Convert Apple MOV video files to MP4 for maximum playback compatibility on all devices.",
    keywords: ["mov to mp4", "convert mov to mp4", "video converter"],
    supported: true,
  }
];
