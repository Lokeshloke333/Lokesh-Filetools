import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { fetchFile } from "@ffmpeg/util";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { MediaResult, ProcessingState } from "./useMediaProcessor";

export type MultiMediaFileInfo = {
  file: File;
  id: string;
};

export function useMultiMediaProcessor() {
  const [files, setFiles] = useState<MultiMediaFileInfo[]>([]);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: "",
  });
  const [result, setResult] = useState<MediaResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const { isLoaded, loadFFmpeg, getFFmpeg } = useFFmpeg();
  
  const startTimeRef = useRef<number | null>(null);

  const handleFilesSelect = useCallback((newFiles: File[], validationOpts?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    maxFiles?: number;
  }) => {
    setUploadError(null);

    const maxFiles = validationOpts?.maxFiles || 20;
    if (files.length + newFiles.length > maxFiles) {
       setUploadError(`You can only upload up to ${maxFiles} files at a time.`);
       return false;
    }

    const maxSize = (validationOpts?.maxSizeMB || 500) * 1024 * 1024;
    const validFiles: MultiMediaFileInfo[] = [];

    for (const file of newFiles) {
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} is too large. Maximum size is ${validationOpts?.maxSizeMB || 500}MB.`);
        return false;
      }

      if (validationOpts?.allowedTypes && !validationOpts.allowedTypes.some(ext => 
        file.name.toLowerCase().endsWith(ext.toLowerCase()) || file.type.startsWith(ext.toLowerCase())
      )) {
        setUploadError(`Unsupported file format for ${file.name}.`);
        return false;
      }

      validFiles.push({ file, id: crypto.randomUUID() });
    }

    setFiles(prev => [...prev, ...validFiles]);
    setResult(null);
    return true;
  }, [files]);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const reorderFiles = useCallback((startIndex: number, endIndex: number) => {
    setFiles(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearUploadError = useCallback(() => setUploadError(null), []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setUploadError(null);
    setProcessingState({ isProcessing: false, progress: 0, stage: "" });
  }, []);

  const processMultipleMedia = useCallback(async (
    commandArgs: string[],
    outputExt: string,
    outputMimeType: string,
    outputFilenamePrefix: string = "output",
    extraFiles?: {name: string, data: string | Uint8Array}[]
  ) => {
    if (files.length === 0) return;
    
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
    const writtenFiles: string[] = [];
    
    const onProgress = ({ progress }: { progress: number; time: number }) => {
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
      ffmpegInstance.on("progress", onProgress);

      setProcessingState(prev => ({ ...prev, stage: "Writing files to memory..." }));
      
      for (let i = 0; i < files.length; i++) {
         const fileInfo = files[i];
         const ext = fileInfo.file.name.split('.').pop() || 'tmp';
         const inputName = `input_${i}.${ext}`;
         await ffmpegInstance.writeFile(inputName, await fetchFile(fileInfo.file));
         writtenFiles.push(inputName);
      }

      if (extraFiles) {
         for (const extra of extraFiles) {
            await ffmpegInstance.writeFile(extra.name, extra.data);
            writtenFiles.push(extra.name);
         }
      }

      const outputName = `${outputFilenamePrefix}_merged.${outputExt}`;

      setProcessingState(prev => ({ ...prev, stage: "Starting processing...", progress: 0 }));
      startTimeRef.current = Date.now();
      
      const finalCommand = [...commandArgs, outputName];

      await ffmpegInstance.exec(finalCommand);

      setProcessingState(prev => ({ ...prev, stage: "Preparing download...", progress: 100 }));
      const data = await ffmpegInstance.readFile(outputName);
      
      const blob = new Blob([data as BlobPart], { type: outputMimeType });
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalSize = files.reduce((acc, f) => acc + f.file.size, 0);

      setResult({
        url,
        filename: `${outputFilenamePrefix}_merged.${outputExt}`,
        originalSize: originalSize,
        processedSize,
        originalFormat: "MULTIPLE",
        newFormat: outputExt.toUpperCase(),
      });

      // Cleanup MEMFS
      for (const f of writtenFiles) {
         try {
            await ffmpegInstance.deleteFile(f);
         } catch(e) {}
      }
      try {
         await ffmpegInstance.deleteFile(outputName);
      } catch(e) {}

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
  }, [files, isLoaded, getFFmpeg, loadFFmpeg]);

  return {
    files,
    handleFilesSelect,
    removeFile,
    reorderFiles,
    clearAll,
    processingState,
    result,
    uploadError,
    clearUploadError,
    processMultipleMedia
  };
}
