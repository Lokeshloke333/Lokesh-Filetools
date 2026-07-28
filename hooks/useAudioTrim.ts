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

    let ffmpegInstance: any = null;
    let inputName = "";
    let outputName = "";
    let ffmpegLogs = "";

    const logHandler = ({ message }: { message: string }) => {
      ffmpegLogs += message + "\n";
    };

    try {
      console.log(`Validating trim range: start=${startTime}, end=${endTime}, duration=${fileInfo.duration}`);
      
      if (typeof startTime !== 'number' || typeof endTime !== 'number') {
         throw new Error("Start and end time must be valid numbers (seconds).");
      }

      if (startTime < 0) {
         throw new Error("Start time cannot be less than zero.");
      }

      if (endTime <= startTime) {
         throw new Error("End time must be greater than start time.");
      }

      if (fileInfo.duration && endTime > fileInfo.duration) {
         throw new Error("End time cannot exceed the total duration of the audio.");
      }

      if (!isLoaded) {
        setStatusMessage("Loading trimmer engine...");
        await loadFFmpeg();
      }

      ffmpegInstance = getFFmpeg();
      ffmpegInstance.on("log", logHandler);

      const file = fileInfo.file;
      const originalExt = file.name.split('.').pop()?.toLowerCase() || 'tmp';
      
      inputName = `input_${fileInfo.id}.${originalExt}`;
      const targetExt = outputFormat || originalExt;
      outputName = `output_${fileInfo.id}.${targetExt}`;

      setStatusMessage("Reading audio file...");
      await ffmpegInstance.writeFile(inputName, await fetchFile(file));

      setStatusMessage("Trimming audio (this may take a moment)...");
      
      const commandArgs: string[] = [];
      commandArgs.push('-i', inputName);
      commandArgs.push('-ss', startTime.toString());
      commandArgs.push('-to', endTime.toString());

      if (targetExt === originalExt) {
        commandArgs.push('-c', 'copy');
      }

      commandArgs.push('-map_metadata', '0');
      commandArgs.push(outputName);

      let execResult = await ffmpegInstance.exec(commandArgs);

      if (execResult !== 0 && targetExt === originalExt) {
         setStatusMessage("Stream copy failed, retrying with re-encoding...");
         console.warn("Stream copy failed. FFmpeg logs:\n", ffmpegLogs);
         ffmpegLogs = ""; // reset logs
         
         try { await ffmpegInstance.deleteFile(outputName); } catch (e) {}

         const fallbackArgs = [
           '-i', inputName,
           '-ss', startTime.toString(),
           '-to', endTime.toString(),
           '-map_metadata', '0',
           outputName
         ];
         execResult = await ffmpegInstance.exec(fallbackArgs);
      }

      if (execResult !== 0) {
         throw new Error(`FFmpeg process failed. Details:\n${ffmpegLogs}`);
      }

      setStatusMessage("Preparing download...");
      const data = await ffmpegInstance.readFile(outputName);
      
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

      toast.success("Audio trimmed successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Trimming error:", error);
      toast.error(error.message || "An error occurred during audio trimming.");
    } finally {
      if (ffmpegInstance) {
         ffmpegInstance.off("log", logHandler);
         if (inputName) {
            try { await ffmpegInstance.deleteFile(inputName); } catch (e) {}
         }
         if (outputName) {
            try { await ffmpegInstance.deleteFile(outputName); } catch (e) {}
         }
      }
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
