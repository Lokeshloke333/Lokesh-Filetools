import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfDeleteResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { inspectPdfSecurity, UnlockState } from "@/lib/pdf/security";

export function usePdfDelete() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [securityState, setSecurityState] = useState<UnlockState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfDeleteResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // A Set of 1-indexed page numbers to delete
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  
  const inspectionIdRef = useRef<number>(0);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    const { valid, error } = validatePdf(file, []);
    if (!valid) {
      setUploadError(`${file.name}: ${error}`);
      return;
    }

    const currentInspectionId = ++inspectionIdRef.current;
    
    const newInfo: PdfFileInfo = { file, id: crypto.randomUUID() };
    setFileInfo(newInfo);
    setResult(null);
    setSelectedPages(new Set());
    setSecurityState('inspecting');

    const state = await inspectPdfSecurity(file);
    if (currentInspectionId !== inspectionIdRef.current) return;
    setSecurityState(state);

    if (state === 'notProtected' || state === 'permissionOnly') {
      getPdfPageCount(file)
        .then((count) => {
          setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
        })
        .catch(() => {
          // Ignored
        });
    }
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    inspectionIdRef.current++;
    setFileInfo(null);
    setSecurityState('idle');
    setSelectedPages(new Set());
    setResult((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (fileInfo?.pageCount) {
      const all = new Set(Array.from({ length: fileInfo.pageCount }, (_, i) => i + 1));
      setSelectedPages(all);
    }
  }, [fileInfo?.pageCount]);

  const handleDeselectAll = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  const handleInvertSelection = useCallback(() => {
    if (fileInfo?.pageCount) {
      const inverted = new Set<number>();
      for (let i = 1; i <= fileInfo.pageCount; i++) {
        if (!selectedPages.has(i)) inverted.add(i);
      }
      setSelectedPages(inverted);
    }
  }, [fileInfo?.pageCount, selectedPages]);

  const deleteSelectedPages = useCallback(async () => {
    if (!fileInfo) {
      toast.error("Please upload a PDF file.");
      return;
    }
    
    if (securityState === 'protected') {
      toast.error("Please unlock the PDF first.");
      return;
    }
    
    if (selectedPages.size === 0) {
      toast.error("Please select at least one page to delete.");
      return;
    }

    const totalPages = fileInfo.pageCount || 0;
    if (totalPages > 0 && selectedPages.size >= totalPages) {
      toast.error("A PDF must contain at least one page.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Uploading PDF...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      
      // Convert 1-indexed UI selection to 0-indexed API parameters
      const zeroIndexedArray = Array.from(selectedPages).map(p => p - 1);
      formData.append("pagesToDelete", zeroIndexedArray.join(","));

      setTimeout(() => setStatusMessage("Deleting selected pages..."), 600);
      setTimeout(() => setStatusMessage("Generating new PDF..."), 1200);

      const response = await fetch("/api/pdf/delete", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete PDF pages");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}_deleted.pdf`;
      const totalRemaining = totalPages - selectedPages.size;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        totalDeleted: selectedPages.size,
        totalRemaining: totalRemaining > 0 ? totalRemaining : 0, // Fallback if count was unknown
      });

      toast.success("Pages deleted successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Delete error:", error);
      toast.error(error.message || "An error occurred while deleting PDF pages.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, securityState, selectedPages]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    deleteSelectedPages,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    selectedPages,
    setSelectedPages,
    handleSelectAll,
    handleDeselectAll,
    handleInvertSelection
  };
}
