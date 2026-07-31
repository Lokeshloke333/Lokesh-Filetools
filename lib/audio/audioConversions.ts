export interface AudioConversion {
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

export const audioConversions: AudioConversion[] = [
  {
    slug: "mp3-to-wav",
    from: "MP3",
    to: "WAV",
    title: "Convert MP3 to WAV",
    description: "Convert compressed MP3 audio into uncompressed high-quality WAV format. Ideal for audio editing, production, and CD burning without quality loss.",
    keywords: ["mp3 to wav", "convert mp3 to wav", "audio converter", "wav converter", "uncompressed audio"],
    supported: true,
    features: [
      "Lossless WAV expansion from MP3 source",
      "Maintains original sample rate and bit depth",
      "No data uploaded (100% browser-based)",
      "Instant conversion powered by WebAssembly"
    ],
    howToSteps: [
      "Upload or drag & drop your MP3 file.",
      "Click the convert button to begin the WebAssembly process.",
      "Download your uncompressed WAV file instantly."
    ],
    faqs: [
      {
        question: "Does converting MP3 to WAV improve audio quality?",
        answer: "No. MP3 is a lossy format, meaning data was permanently discarded when the MP3 was originally created. Converting to WAV will uncompress the file so it's easier for editing software to process, but it cannot restore the audio quality that was lost during the original MP3 encoding."
      },
      {
        question: "Why should I convert MP3 to WAV?",
        answer: "WAV files are standard for audio editing software (DAWs), CD burning, and professional production. They are uncompressed, meaning they require less CPU power to decode during playback and editing compared to MP3."
      }
    ]
  },
  {
    slug: "wav-to-mp3",
    from: "WAV",
    to: "MP3",
    title: "Convert WAV to MP3",
    description: "Compress large uncompressed WAV files into standard MP3 format. Drastically reduce file sizes while preserving excellent audio quality for easy sharing.",
    keywords: ["wav to mp3", "convert wav to mp3", "audio converter", "mp3 converter", "compress audio"],
    supported: true,
    features: [
      "High-quality VBR/CBR MP3 encoding",
      "Reduces file size by up to 90%",
      "Private and secure local processing",
      "No file size limitations"
    ],
    howToSteps: [
      "Select the large WAV file you want to compress.",
      "Initiate the conversion to MP3.",
      "Download the highly compressed, universally compatible MP3 file."
    ],
    faqs: [
      {
        question: "How much smaller will the MP3 file be compared to the WAV?",
        answer: "MP3 compression typically reduces the file size of a WAV by 80% to 90%, depending on the complexity of the audio and the bitrate used."
      },
      {
        question: "Will I lose quality when converting WAV to MP3?",
        answer: "Yes, MP3 is a 'lossy' format. However, at high bitrates (like 256kbps or 320kbps), the quality difference is virtually indistinguishable to the human ear for casual listening."
      }
    ]
  },
  {
    slug: "flac-to-mp3",
    from: "FLAC",
    to: "MP3",
    title: "Convert FLAC to MP3",
    description: "Convert high-fidelity FLAC audio files to MP3 format for maximum playback compatibility on smartphones, car stereos, and older devices.",
    keywords: ["flac to mp3", "convert flac to mp3", "audio converter", "flac converter", "lossless to lossy"],
    supported: true,
    features: [
      "Converts lossless FLAC to portable MP3",
      "Retains ID3 tags and metadata (when possible)",
      "Zero server uploads required",
      "Fast processing directly on your device"
    ],
    howToSteps: [
      "Drop your high-fidelity FLAC file into the tool.",
      "Start the compression to MP3.",
      "Save the lightweight MP3 file to your device."
    ],
    faqs: [
      {
        question: "Why convert FLAC to MP3?",
        answer: "FLAC files offer perfect lossless quality but have large file sizes and aren't supported by all mobile devices or car stereos. MP3 provides universal compatibility and much smaller file sizes."
      },
      {
        question: "Is FLAC better than MP3?",
        answer: "In terms of audio data, yes. FLAC is mathematically identical to the original CD recording (lossless). MP3 discards inaudible data to save space (lossy)."
      }
    ]
  },
  {
    slug: "ogg-to-mp3",
    from: "OGG",
    to: "MP3",
    title: "Convert OGG to MP3",
    description: "Easily convert OGG Vorbis audio files to standard MP3 format to ensure playback support across all modern and legacy media players.",
    keywords: ["ogg to mp3", "convert ogg to mp3", "audio converter", "ogg vorbis"],
    supported: true,
    features: [
      "High-speed OGG to MP3 decoding/encoding",
      "Optimal balance of quality and size",
      "Secure browser-only conversion execution",
      "Free with no hidden limits"
    ],
    howToSteps: [
      "Import your OGG Vorbis audio file.",
      "Click convert to process the file locally.",
      "Download your universally supported MP3 file."
    ],
    faqs: [
      {
        question: "What is an OGG file?",
        answer: "OGG is a free, open container format commonly used for streaming and game audio. It typically contains audio encoded with the Vorbis codec, which offers excellent quality."
      },
      {
        question: "Why can't I play OGG files on my phone?",
        answer: "While many modern Android devices support OGG natively, iOS devices (iPhones/iPads) do not support OGG playback out of the box. Converting OGG to MP3 guarantees it will play on any device."
      }
    ]
  }
];
