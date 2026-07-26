/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { validatePdfFile, PdfToWordOptions } from "@/lib/pdf/pdf-to-word.validation";

export interface PdfToWordResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalPageCount: number;
}

export function usePdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<PdfToWordOptions>({
    outputFormat: "DOCX",
    keepImages: true,
    preserveFormatting: true,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfToWordResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const handleFileSelect = useCallback((newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const f = newFiles[0]; // Take only the first file
    
    const { valid, error } = validatePdfFile(f);
    if (!valid) {
      setUploadError(`${f.name}: ${error}`);
      return;
    }

    setUploadError(null);
    setFile(f);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const convertDocument = useCallback(async () => {
    if (!file) {
      toast.error("Please upload a PDF document.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Uploading...");

    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("outputFormat", options.outputFormat || "DOCX");

      const statuses = [
        "Uploading...",
        "Converting PDF...",
        "Extracting text...",
        "Generating DOCX...",
        "Preparing download...",
      ];
      let statusIndex = 0;
      const progressInterval = setInterval(() => {
        statusIndex = Math.min(statusIndex + 1, statuses.length - 1);
        setStatusMessage(statuses[statusIndex]);
      }, 1200);

      const response = await fetch("/api/pdf/pdf-to-word", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to convert PDF to Word document.");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        filename: file.name.replace(/\.[^/.]+$/, ".docx"),
        originalSize: file.size,
        processedSize: blob.size,
        totalPageCount: 1, // PDF to Word doesn't extract page count natively yet
      });

      toast.success("Conversion Complete!");
    } catch (error: any) {
      console.error("PDF to Word Error:", error);
      toast.error(error.message || "An error occurred during conversion.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [file, options]);

  return {
    file,
    options,
    setOptions,
    handleFileSelect,
    clearFile,
    convertDocument,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  };
}
