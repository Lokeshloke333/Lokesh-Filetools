import { useState, useCallback } from "react";
import { toast } from "sonner";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from "@/hooks/useFFmpeg";

export type AudioFileInfo = {
  file: File;
  id: string;
  duration?: number;
};

export type TrimResult = {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  format: string;
};

export function useAudioTrim() {
  const [fileInfo, setFileInfo] = useState<AudioFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<TrimResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    audio.onloadedmetadata = () => {
      setFileInfo({ file, id: crypto.randomUUID(), duration: audio.duration });
      setAudioUrl(url);
    };
    audio.onerror = () => {
      setFileInfo({ file, id: crypto.randomUUID() });
      setAudioUrl(url); // We still need the URL for processing
    };

    setResult(null);
    setUploadError(null);
  }, []);

  const clearUploadError = useCallback(() => setUploadError(null), []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setUploadError(null);
  }, []);

  const processTrim = useCallback(async (startTime: number, endTime: number, outputFormat?: string) => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      if (!isLoaded) {
        setStatusMessage("Loading trimmer engine...");
        await loadFFmpeg();
      }

      const ffmpeg = getFFmpeg();
      const file = fileInfo.file;
      const originalExt = file.name.split('.').pop()?.toLowerCase() || 'tmp';
      
      const inputName = `input_${fileInfo.id}.${originalExt}`;
      const targetExt = outputFormat || originalExt;
      const outputName = `output_${fileInfo.id}.${targetExt}`;

      setStatusMessage("Reading audio file...");
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setStatusMessage("Trimming audio (this may take a moment)...");
      
      const commandArgs: string[] = [];
      
      // Fast seek (put -ss before -i for faster seeking if possible, but for accurate trimming, placing it after -i or using both can be better. 
      // For WASM, keeping it simple: ffmpeg -i input -ss start -to end -c copy output)
      commandArgs.push('-i', inputName);
      commandArgs.push('-ss', startTime.toString());
      commandArgs.push('-to', endTime.toString());

      // If we are keeping the same format, we can stream copy for instant, lossless trimming
      if (targetExt === originalExt) {
        commandArgs.push('-c', 'copy');
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
      const finalFilename = `${originalName}-trimmed.${targetExt}`;

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

      toast.success("Audio trimmed successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Trimming error:", error);
      toast.error("An error occurred during audio trimming.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, isLoaded, getFFmpeg, loadFFmpeg]);

  return {
    fileInfo,
    audioUrl,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processTrim
  };
}
