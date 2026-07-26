import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfPptResult } from "@/lib/pdf/types";
import { PptToPdfOptions } from "@/lib/pdf/ppt-to-pdf";

export function usePdfPpt() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfPptResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<PptToPdfOptions>({
    pageSize: 'A4',
    orientation: 'Landscape',
    slidesPerPage: '1',
    includeNotes: false
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.ppt') && !file.name.toLowerCase().endsWith('.pptx')) {
      setUploadError(`${file.name}: Invalid file format. Only .ppt and .pptx are supported.`);
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`${file.name}: File is too large. Maximum size is 100MB.`);
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
  }, []);

  const updateOptions = useCallback((updates: Partial<PptToPdfOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  }, []);

  const processConversion = useCallback(async () => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setStatusMessage("Uploading presentation...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      formData.append("options", JSON.stringify(options));

      setTimeout(() => setStatusMessage("Reading slides..."), 600);
      setTimeout(() => setStatusMessage("Rendering presentation..."), 1500);
      setTimeout(() => setStatusMessage("Generating PDF..."), 3000);

      const response = await fetch("/api/pdf/ppt-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to convert PPT to PDF");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const slideCount = parseInt(response.headers.get("X-Slide-Count") || "0", 10);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}.pdf`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        slideCount,
      });

      toast.success("Presentation converted to PDF successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Conversion error:", error);
      toast.error(error.message || "An error occurred while converting the file.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, options]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    options,
    updateOptions,
    processConversion
  };
}
