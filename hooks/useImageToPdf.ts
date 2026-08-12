/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { FileWithPreview } from "./useImageUpload";
import { validateImage } from "@/lib/image/validation";
import { ImageToPdfOptions, convertImagesToPdf } from "@/lib/pdf/image-to-pdf";
import { PdfMergeResult } from "@/lib/pdf/types";

export function useImageToPdf() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: "A4",
    orientation: "portrait",
    margins: "none",
    imageFit: "fit",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfMergeResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [files, result]);

  const handleFilesSelect = useCallback((newFiles: File[]) => {
    let hasError = false;

    setFiles((currentFiles) => {
      const validFiles: FileWithPreview[] = [];
      for (const f of newFiles) {
        const { valid, error } = validateImage(f);
        if (!valid) {
          setUploadError(`${f.name}: ${error}`);
          hasError = true;
          continue;
        }

        // Check for duplicates
        if (currentFiles.some((existing) => existing.name === f.name && existing.size === f.size)) {
          setUploadError(`${f.name} is already added.`);
          hasError = true;
          continue;
        }

        const preview = URL.createObjectURL(f);
        const fileWithPreview = f as FileWithPreview;
        fileWithPreview.preview = preview;
        validFiles.push(fileWithPreview);
      }
      
      if (!hasError) setUploadError(null);
      return [...currentFiles, ...validFiles];
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const removeFile = useCallback((name: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find(f => f.name === name);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.name !== name);
    });
  }, []);

  const clearAll = useCallback(() => {
    setFiles((prev) => {
      prev.forEach(f => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
      return [];
    });
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const generatePdf = useCallback(async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Uploading...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const statuses = ["Preparing Images...", "Generating PDF...", "Optimizing..."];
      let statusIndex = 0;
      const progressInterval = setInterval(() => {
        statusIndex = Math.min(statusIndex + 1, statuses.length - 1);
        setStatusMessage(statuses[statusIndex]);
      }, 1500);

      const pdfBytes = await convertImagesToPdf(files, options);

      clearInterval(progressInterval);

      setStatusMessage("Preparing Download...");
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);

      setResult({
        url,
        filename: "converted-document.pdf",
        originalSize: totalOriginalSize,
        processedSize: blob.size,
        totalPageCount: files.length,
      });

      toast.success("PDF generated successfully!");
    } catch (error: any) {
      console.error("Generate error:", error);
      toast.error(error.message || "An error occurred while generating the PDF.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [files, options]);

  return {
    files,
    setFiles,
    options,
    setOptions,
    handleFilesSelect,
    removeFile,
    clearAll,
    generatePdf,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  };
}
