export interface VideoConversion {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string[];
  supported: boolean;
  features?: string[];
  howToSteps?: string[];
  faqs?: { question: string, answer: string }[];
}

export const videoConversions: VideoConversion[] = [
  {
    slug: "mp4-to-gif",
    from: "MP4",
    to: "GIF",
    title: "Convert MP4 to GIF",
    description: "Easily convert your MP4 videos into looping GIF animations. Perfect for creating social media memes, tutorials, and short shareable clips.",
    keywords: ["mp4 to gif", "convert mp4 to gif", "video to gif", "gif maker", "create gif from video"],
    supported: false,
    features: [
      "Custom framerate optimization for GIFs",
      "Seamless looping support",
      "Fast local processing",
      "No watermarks added"
    ],
    howToSteps: [
      "Select the MP4 video you want to convert.",
      "Click the convert button to begin rendering.",
      "Save your new looping GIF animation."
    ],
    faqs: [
      {
        question: "Why should I convert an MP4 to a GIF?",
        answer: "GIFs are universally supported across the web, making them perfect for forums, emails, and social media platforms where video playback might be restricted or require user interaction to start."
      },
      {
        question: "Will the GIF have sound?",
        answer: "No, the GIF image format does not support audio tracks. The resulting animation will be completely silent."
      }
    ]
  },
  {
    slug: "mp4-to-mp3",
    from: "MP4",
    to: "MP3",
    title: "Convert MP4 to MP3",
    description: "Extract high-quality audio tracks directly from your MP4 videos. Convert podcasts, music videos, and speeches into portable MP3 audio files.",
    keywords: ["mp4 to mp3", "extract audio from mp4", "video to mp3", "audio extractor", "mp4 converter"],
    supported: true,
    features: [
      "High-speed video-to-audio extraction",
      "Retains original audio bitrate",
      "Zero server uploads required",
      "Uncapped file size limit"
    ],
    howToSteps: [
      "Import your MP4 video file.",
      "Initiate the audio extraction process.",
      "Download the extracted MP3 audio track."
    ],
    faqs: [
      {
        question: "Does extracting the audio reduce its quality?",
        answer: "No. Our tool extracts the existing audio track from the video container and saves it as an MP3. The audio quality remains exactly the same as it was in the original video."
      },
      {
        question: "Is there a file size limit for the video?",
        answer: "Because Fileinator processes the video locally inside your browser using WebAssembly, there are no artificial file size limits. You can extract audio from large movies or long podcasts."
      }
    ]
  },
  {
    slug: "webm-to-mp4",
    from: "WEBM",
    to: "MP4",
    title: "Convert WEBM to MP4",
    description: "Convert HTML5 WEBM videos to the universally compatible MP4 format. Ensure your web videos play seamlessly on iPhones, iPads, and older software.",
    keywords: ["webm to mp4", "convert webm to mp4", "video converter", "html5 video"],
    supported: true,
    features: [
      "Lightning fast WebAssembly conversion",
      "Resolves iOS playback issues",
      "Maintains video resolution and quality",
      "100% private local execution"
    ],
    howToSteps: [
      "Select or drop your WEBM file into the tool.",
      "Convert the video container to MP4.",
      "Download the highly compatible video file."
    ],
    faqs: [
      {
        question: "What is a WEBM file?",
        answer: "WEBM is an open-source video format created by Google, optimized for use on the web (HTML5). It offers great compression but lacks native playback support on Apple devices (iOS/macOS)."
      },
      {
        question: "Will I lose quality when converting WEBM to MP4?",
        answer: "The conversion simply remuxes or lightly encodes the video into the MP4 container format, maintaining near-identical visual fidelity to the original."
      }
    ]
  },
  {
    slug: "mov-to-mp4",
    from: "MOV",
    to: "MP4",
    title: "Convert MOV to MP4",
    description: "Convert Apple MOV video files to standard MP4 format for maximum playback compatibility across Android, Windows, and Smart TVs.",
    keywords: ["mov to mp4", "convert mov to mp4", "video converter", "apple video converter"],
    supported: true,
    features: [
      "Fixes playback errors on Android/Windows",
      "Fast container remuxing",
      "Zero data sent to cloud servers",
      "No registration required"
    ],
    howToSteps: [
      "Upload your MOV video (e.g., recorded on an iPhone).",
      "Convert the format to MP4.",
      "Download your universally playable video."
    ],
    faqs: [
      {
        question: "Why can't I play MOV files on my TV or Android phone?",
        answer: "MOV is a proprietary Apple format designed for QuickTime. While many modern devices support it, older Smart TVs, Windows PCs, and Android phones often require the video to be in the universally recognized MP4 format."
      },
      {
        question: "Does this conversion reduce the file size?",
        answer: "MOV and MP4 are both container formats that often use the exact same H.264 video codec. The file size will remain largely the same, but compatibility will vastly improve."
      }
    ]
  }
];
