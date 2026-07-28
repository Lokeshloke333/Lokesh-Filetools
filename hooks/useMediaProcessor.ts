import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from "@/hooks/useFFmpeg";

export type MediaFileInfo = {
  file: File;
  id: string;
};

export type MediaResult = {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  originalFormat: string;
  newFormat: string;
};

export type ProcessingState = {
  isProcessing: boolean;
  progress: number; // 0 to 100
  stage: string;
  estimatedTimeRemaining?: number; // in seconds
};

export function useMediaProcessor() {
  const [fileInfo, setFileInfo] = useState<MediaFileInfo | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const [result, setResult] = useState<MediaResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { isLoaded, loadFFmpeg, getFFmpeg } = useFFmpeg();
  
  // Track start time for ETA calculation
  const startTimeRef = useRef<number | null>(null);

  const handleFileSelect = useCallback((file: File, validationOpts?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  }) => {
    if (!file) return false;

    const maxSize = (validationOpts?.maxSizeMB || 500) * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File is too large. Maximum size is ${validationOpts?.maxSizeMB || 500}MB.`);
      return false;
    }

    if (validationOpts?.allowedTypes && !validationOpts.allowedTypes.some(ext => 
      file.name.toLowerCase().endsWith(ext.toLowerCase()) || file.type.startsWith(ext.toLowerCase())
    )) {
      setUploadError(`Unsupported file format.`);
      return false;
    }

    setFileInfo({ file, id: crypto.randomUUID() });
    setResult(null);
    setUploadError(null);
    return true;
  }, []);

  const clearUploadError = useCallback(() => setUploadError(null), []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setUploadError(null);
    setProcessingState({ isProcessing: false, progress: 0, stage: "" });
  }, []);

  const processMedia = useCallback(async (
    commandArgs: string[],
    outputExt: string,
    outputMimeType: string,
    outputFilenamePrefix: string = "output"
  ) => {
    if (!fileInfo) return;
    
    setProcessingState({
      isProcessing: true,
      progress: 0,
      stage: "Loading engine...",
    });
    
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    let ffmpegInstance = null;
    
    // Setup progress listener
    const onProgress = ({ progress }: { progress: number; time: number }) => {
      // Calculate ETA
      let eta: number | undefined;
      if (startTimeRef.current && progress > 0.05) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const totalEstimated = elapsed / progress;
        eta = Math.max(0, totalEstimated - elapsed);
      }
      
      setProcessingState(prev => ({
        ...prev,
        progress: Math.min(Math.round(progress * 100), 100),
        stage: "Processing media...",
        estimatedTimeRemaining: eta
      }));
    };

    try {
      if (!isLoaded) {
        await loadFFmpeg();
      }

      ffmpegInstance = getFFmpeg();
      
      // We must attach listener to the singleton
      ffmpegInstance.on("progress", onProgress);

      const file = fileInfo.file;
      const inputName = `input_${fileInfo.id}.${file.name.split('.').pop() || 'tmp'}`;
      const outputName = `${outputFilenamePrefix}_${fileInfo.id}.${outputExt}`;

      setProcessingState(prev => ({ ...prev, stage: "Reading file..." }));
      await ffmpegInstance.writeFile(inputName, await fetchFile(file));

      setProcessingState(prev => ({ ...prev, stage: "Starting conversion...", progress: 0 }));
      startTimeRef.current = Date.now();
      
      // Ensure input name is first argument, and output name is last, assuming caller just provided intermediate args
      const finalCommand = ['-i', inputName, ...commandArgs, outputName];

      await ffmpegInstance.exec(finalCommand);

      setProcessingState(prev => ({ ...prev, stage: "Preparing download...", progress: 100 }));
      const data = await ffmpegInstance.readFile(outputName);
      
      const blob = new Blob([data as BlobPart], { type: outputMimeType });
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}.${outputExt}`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: file.size,
        processedSize,
        originalFormat: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        newFormat: outputExt.toUpperCase(),
      });

      // Cleanup MEMFS
      await ffmpegInstance.deleteFile(inputName);
      await ffmpegInstance.deleteFile(outputName);

      toast.success("Processing completed successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Processing error:", error);
      toast.error("An error occurred during media processing.");
    } finally {
      if (ffmpegInstance) {
        ffmpegInstance.off("progress", onProgress);
      }
      setProcessingState({ isProcessing: false, progress: 0, stage: "" });
      startTimeRef.current = null;
    }
  }, [fileInfo, isLoaded, getFFmpeg, loadFFmpeg]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    processingState,
    result,
    uploadError,
    clearUploadError,
    processMedia
  };
}
