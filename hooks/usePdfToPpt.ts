import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfToPptResult } from "@/lib/pdf/types";
import { inspectPdfSecurity } from "@/lib/pdf/security";

export function usePdfToPpt() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfToPptResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError(`${file.name}: Invalid file format. Only PDF is supported.`);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`${file.name}: File is too large. Maximum size is 100MB.`);
      return;
    }

    // Inspect PDF for encryption/corruption
    try {
      const inspection = await inspectPdfSecurity(file);
      if (inspection === 'protected' || inspection === 'permissionOnly') {
         setUploadError(`${file.name}: This PDF is password protected. Please use our Unlock PDF tool first.`);
         return;
      }
      if (inspection === 'corrupted' || inspection === 'unsupported') {
         setUploadError(`${file.name}: This PDF appears to be corrupted or unsupported and cannot be read.`);
         return;
      }
    } catch (e) {
      setUploadError(`${file.name}: Failed to inspect PDF.`);
      return;
    }

    const newInfo: PdfFileInfo = { file, id: crypto.randomUUID() };
    setFileInfo(newInfo);
    setResult(null);
    setUploadError(null);
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setUploadError(null);
  }, []);

  const processConversion = useCallback(async () => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setStatusMessage("Uploading PDF...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);

      setTimeout(() => setStatusMessage("Reading pages..."), 800);
      setTimeout(() => setStatusMessage("Converting pages..."), 2000);
      setTimeout(() => setStatusMessage("Building presentation..."), 3500);

      const response = await fetch("/api/pdf/pdf-to-ppt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to convert to PowerPoint");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const slideCount = parseInt(response.headers.get("X-Slide-Count") || "0", 10);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}.pptx`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        slideCount
      });

      toast.success("PowerPoint presentation generated successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Conversion error:", error);
      toast.error(error.message || "An error occurred during extraction.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo]);

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
