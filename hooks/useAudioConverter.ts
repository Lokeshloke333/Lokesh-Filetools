import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { AudioOptions } from "@/components/tool/AudioOptionsPanel";

export type AudioFileInfo = {
  file: File;
  id: string;
  duration?: number;
};

export type AudioResult = {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  originalFormat: string;
  newFormat: string;
};

export function useAudioConverter() {
  const [fileInfo, setFileInfo] = useState<AudioFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<AudioResult | null>(null);
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

    setFileInfo({ file, id: crypto.randomUUID() });
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

  const processConversion = useCallback(async (options: AudioOptions) => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      if (!isLoaded) {
        setStatusMessage("Loading converter engine...");
        await loadFFmpeg();
      }

      const ffmpeg = getFFmpeg();
      const file = fileInfo.file;
      const inputName = `input_${fileInfo.id}.${file.name.split('.').pop() || 'tmp'}`;
      const outputName = `output_${fileInfo.id}.${options.format}`;

      setStatusMessage("Reading audio file...");
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setStatusMessage("Converting audio (this may take a moment)...");
      
      const commandArgs: string[] = ['-i', inputName];

      // Add options
      if (options.bitrate !== 'auto' && !['wav', 'flac', 'aiff'].includes(options.format)) {
        commandArgs.push('-b:a', options.bitrate);
      }
      
      if (options.sampleRate !== 'auto') {
        commandArgs.push('-ar', options.sampleRate);
      }
      
      if (options.channels !== 'auto') {
        commandArgs.push('-ac', options.channels);
      }

      // Preserve metadata mapping
      commandArgs.push('-map_metadata', '0');
      
      // Output file
      commandArgs.push(outputName);

      await ffmpeg.exec(commandArgs);

      setStatusMessage("Preparing download...");
      const data = await ffmpeg.readFile(outputName);
      
      const blob = new Blob([data as any], { type: `audio/${options.format}` });
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}.${options.format}`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: file.size,
        processedSize,
        originalFormat: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        newFormat: options.format.toUpperCase(),
      });

      // Cleanup MEMFS
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);

      toast.success("Audio converted successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Conversion error:", error);
      toast.error("An error occurred during audio conversion.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, isLoaded]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processConversion
  };
}
