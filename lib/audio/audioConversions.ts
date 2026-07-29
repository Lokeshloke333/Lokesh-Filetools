export interface AudioConversion {
  slug: string;
  from: string;
  to: string;
  title: string;
  description: string;
  keywords: string[];
  supported: boolean;
}

export const audioConversions: AudioConversion[] = [
  {
    slug: "mp3-to-wav",
    from: "MP3",
    to: "WAV",
    title: "Convert MP3 to WAV",
    description: "Convert compressed MP3 audio into uncompressed high-quality WAV format.",
    keywords: ["mp3 to wav", "convert mp3 to wav", "audio converter", "wav converter"],
    supported: true,
  },
  {
    slug: "wav-to-mp3",
    from: "WAV",
    to: "MP3",
    title: "Convert WAV to MP3",
    description: "Compress your large WAV audio files into widely compatible MP3 format.",
    keywords: ["wav to mp3", "convert wav to mp3", "audio converter", "mp3 converter"],
    supported: true,
  },
  {
    slug: "flac-to-mp3",
    from: "FLAC",
    to: "MP3",
    title: "Convert FLAC to MP3",
    description: "Convert high-fidelity FLAC audio files to MP3 format for maximum playback compatibility.",
    keywords: ["flac to mp3", "convert flac to mp3", "audio converter", "flac converter"],
    supported: true,
  },
  {
    slug: "ogg-to-mp3",
    from: "OGG",
    to: "MP3",
    title: "Convert OGG to MP3",
    description: "Easily convert OGG Vorbis audio files to standard MP3 format.",
    keywords: ["ogg to mp3", "convert ogg to mp3", "audio converter"],
    supported: true,
  }
];
