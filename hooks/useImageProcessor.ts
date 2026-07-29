/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface ProcessorResult {
  preview: string;
  originalSize: number;
  processedSize: number;
  savedPercentage: number;
  filename: string;
  width: number;
  height: number;
  outputFormat: string;
  message?: string;
}

export function useImageProcessor(toolEndpoint: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessorResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processImage = useCallback(async (file: File, settings: Record<string, any>) => {
    try {
      setIsProcessing(true);
      setResult(null);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);
      
      // Append all settings dynamically
      Object.entries(settings).forEach(([key, value]) => {
        formData.append(key, typeof value === "string" ? value : String(value));
      });

      const response = await fetch(`/api/image/${toolEndpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Processing failed");
      }

      const blob = await response.blob();
      
      const originalSize = Number(response.headers.get("x-original-size") || 0);
      const processedSize = Number(response.headers.get("x-processed-size") || Number(response.headers.get("x-compressed-size")) || 0);
      const savedPercentage = Number(response.headers.get("x-saved-percentage") || 0);
      const filename = response.headers.get("x-filename") || `processed-${file.name}`;
      const width = Number(response.headers.get("x-width") || 0);
      const height = Number(response.headers.get("x-height") || 0);

      const preview = URL.createObjectURL(blob);

      const outputFormat = filename.split('.').pop()?.toUpperCase() || "";
      const messageHeader = response.headers.get("x-compression-message");
      const message = messageHeader ? decodeURIComponent(messageHeader) : undefined;

      setResult({
        preview,
        originalSize,
        processedSize,
        savedPercentage,
        filename,
        width,
        height,
        outputFormat,
        message,
      });
      
      toast.success("Image processed successfully!");
    } catch (error: any) {
      console.error("Processing error:", error);
      setUploadError(error.message || "An error occurred during processing.");
    } finally {
      setIsProcessing(false);
    }
  }, [toolEndpoint]);

  const clearResult = useCallback(() => {
    setResult((prev) => {
      if (prev?.preview) {
        URL.revokeObjectURL(prev.preview);
      }
      return null;
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    isProcessing,
    result,
    uploadError,
    processImage,
    clearResult,
    clearUploadError
  };
}
