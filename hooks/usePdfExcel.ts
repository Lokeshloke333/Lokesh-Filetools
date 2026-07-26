import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfExcelResult } from "@/lib/pdf/types";
import { ExcelToPdfOptions } from "@/lib/pdf/excel-to-pdf";

export function usePdfExcel() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfExcelResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<ExcelToPdfOptions>({
    pageSize: 'A4',
    orientation: 'auto',
    scaling: 'fit-width',
    margins: 'normal'
  });

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadError(`${file.name}: Invalid file format. Only .xlsx and .xls are supported.`);
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

  const updateOptions = useCallback((updates: Partial<ExcelToPdfOptions>) => {
    setOptions(prev => ({ ...prev, ...updates }));
  }, []);

  const processConversion = useCallback(async () => {
    if (!fileInfo) return;
    
    setIsProcessing(true);
    setStatusMessage("Uploading Excel...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      formData.append("options", JSON.stringify(options));

      setTimeout(() => setStatusMessage("Reading workbook..."), 600);
      setTimeout(() => setStatusMessage("Generating PDF..."), 1500);

      const response = await fetch("/api/pdf/excel-to-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to convert Excel to PDF");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const worksheetCount = parseInt(response.headers.get("X-Worksheet-Count") || "0", 10);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}.pdf`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        worksheetCount,
      });

      toast.success("Excel converted to PDF successfully!");
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
