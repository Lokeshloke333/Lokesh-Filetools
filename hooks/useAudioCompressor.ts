import { useState, useCallback } from "react";
import { toast } from "sonner";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { AudioCompressOptions } from "@/components/tool/AudioCompressOptionsPanel";

export type AudioFileInfo = {
  file: File;
  id: string;
  duration?: number;
};

export type CompressResult = {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  format: string;
};

export function useAudioCompressor() {
  const [fileInfo, setFileInfo] = useState<AudioFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<CompressResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { isLoaded, loadFFmpeg, getFFmpeg } = useFFmpeg();

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    if (file.size > 200 * 1024 * 1024) {
      setUploadError(`${file.name}: File is too large. Maximum size is 200MB.`);
      return;
    }

    if (!file.type.startsWith("audio/") && !['.mp3', '.wav', '.flac', '.aac', '.m4a', '.ogg', '.aiff', '.wma'].some(ext => file.name.toLowerCase().endsWith(ext))) {
       setUploadError(`${file.name}: Unsupported file format. Please upload a valid audio file.`);
       return;
    }

    // Try to get duration for accurate progress/size estimation, but don't block
    const audioUrl = URL.createObjectURL(file);
    const audio = new Audio(audioUrl);
    
    audio.onloadedmetadata = () => {
      setFileInfo({ file, id: crypto.randomUUID(), duration: audio.duration });
      URL.revokeObjectURL(audioUrl);
    };
    audio.onerror = () => {
      setFileInfo({ file, id: crypto.randomUUID() });
      URL.revokeObjectURL(audioUrl);
    };

    setResult(null);
    setUploadError(null);
  }, []);

  const clearUploadError = useCallback(() => setUploadError(null), []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setUploadError(null);
  }, []);

  const processCompression = useCallback(async (options: AudioCompressOptions) => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      if (!isLoaded) {
        setStatusMessage("Loading compressor engine...");
        await loadFFmpeg();
      }

      const ffmpeg = getFFmpeg();
      const file = fileInfo.file;
      const originalExt = file.name.split('.').pop()?.toLowerCase() || 'tmp';
      
      const inputName = `input_${fileInfo.id}.${originalExt}`;
      
      // If lossless, compress to mp3 by default unless user insists? 
      // The instructions say "Keep original format by default."
      // Let's output to the same extension, but if it's wav/flac, FFmpeg might ignore bitrate if we just use -b:a without changing codec.
      // We will map WAV/FLAC to MP3 to ensure actual compression happens, as requested in implementation plan.
      let targetExt = originalExt;
      if (["wav", "flac", "aiff"].includes(originalExt)) {
         targetExt = "mp3";
      }

      const outputName = `output_${fileInfo.id}.${targetExt}`;

      setStatusMessage("Reading audio file...");
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setStatusMessage("Compressing audio (this may take a moment)...");
      
      const commandArgs: string[] = ['-i', inputName];

      let targetBitrate = "128k"; // Default Balanced
      
      if (options.mode === "low") targetBitrate = "256k";
      else if (options.mode === "balanced") targetBitrate = "128k";
      else if (options.mode === "high") targetBitrate = "64k";
      else if (options.mode === "custom") targetBitrate = `${options.customBitrate}k`;

      commandArgs.push('-b:a', targetBitrate);
      
      if (options.mode === "custom") {
        if (options.customSampleRate !== 'auto') {
          commandArgs.push('-ar', options.customSampleRate);
        }
        if (options.customChannels !== 'auto') {
          commandArgs.push('-ac', options.customChannels);
        }
      }

      // Preserve metadata mapping
      commandArgs.push('-map_metadata', '0');
      
      // Output file
      commandArgs.push(outputName);

      await ffmpeg.exec(commandArgs);

      setStatusMessage("Preparing download...");
      const data = await ffmpeg.readFile(outputName);
      
      const blob = new Blob([data as any], { type: `audio/${targetExt}` });
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}-compressed.${targetExt}`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: file.size,
        processedSize,
        format: targetExt.toUpperCase(),
      });

      // Cleanup MEMFS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      toast.success("Audio compressed successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Compression error:", error);
      toast.error("An error occurred during audio compression.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, isLoaded, getFFmpeg, loadFFmpeg]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processCompression
  };
}
