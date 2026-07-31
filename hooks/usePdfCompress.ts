/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfCompressionLevel, PdfCompressResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";

export function usePdfCompress() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [level, setLevel] = useState<PdfCompressionLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfCompressResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    const { valid, error } = validatePdf(file, []);
    if (!valid) {
      setUploadError(`${file.name}: ${error}`);
      return;
    }

    const newInfo: PdfFileInfo = { file, id: crypto.randomUUID() };
    setFileInfo(newInfo);
    setResult(null);

    // Fetch page count
    getPdfPageCount(file).then((count) => {
      setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setResult((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

  const compressFile = useCallback(async () => {
    if (!fileInfo) {
      toast.error("Please upload a PDF file.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Initializing...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      // Dynamically import QPDF engine
      const { compressPdfQpdf } = await import('@/lib/pdf/qpdf-compressor');
      
      const originalSize = fileInfo.file.size;
      setStatusMessage("Optimizing PDF structure...");
      let finalBytes: Uint8Array;
      let finalOptimized = false;

      try {
        const qpdfResult = await compressPdfQpdf(
          fileInfo.file, 
          level,
          (msg) => setStatusMessage(msg)
        );

        finalBytes = qpdfResult.bytes;
        finalOptimized = qpdfResult.optimized;

        // If QPDF didn't optimize much (e.g., image-heavy PDF), try falling back to canvas compressor
        if (!finalOptimized) {
          setStatusMessage("Compressing images...");
          const { compressPdfClient } = await import('@/lib/pdf/client-compressor');
          const clientResult = await compressPdfClient(
            fileInfo.file,
            level,
            (msg) => setStatusMessage(msg)
          );
          
          if (clientResult.optimized && clientResult.bytes.length < finalBytes.length) {
            finalBytes = clientResult.bytes;
            finalOptimized = true;
          }
        }
      } catch (err: unknown) {
        console.warn("QPDF compression failed, using fallback:", err);
        setStatusMessage("Compressing images...");
        
        const { compressPdfClient } = await import('@/lib/pdf/client-compressor');
        const clientResult = await compressPdfClient(
          fileInfo.file,
          level,
          (msg) => setStatusMessage(msg)
        );
        finalBytes = clientResult.bytes;
        finalOptimized = clientResult.optimized;
      }

      if (!finalOptimized) {
        toast.info("This PDF is already optimized and cannot be compressed much.");
      } else {
        toast.success("PDF compressed successfully!");
      }

      setStatusMessage("Preparing Download...");
      
      if (!finalBytes || finalBytes.length === 0) {
        throw new Error("Compression failed: Resulting file is empty.");
      }
      
      if (!originalSize) {
        throw new Error("Compression failed: Missing original file size.");
      }

      const blob = new Blob([finalBytes as BlobPart], { type: 'application/pdf' });
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const compressedFilename = `${originalName}_compressed.pdf`;

      setResult({
        url,
        filename: compressedFilename,
        originalSize,
        processedSize,
      });

    } catch (error: unknown) {
      console.error("Compress error:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred while compressing the PDF.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, level]);

  return {
    fileInfo,
    level,
    setLevel,
    handleFileSelect,
    clearAll,
    compressFile,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  };
}
