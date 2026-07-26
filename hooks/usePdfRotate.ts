import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfRotateResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { inspectPdfSecurity, UnlockState } from "@/lib/pdf/security";

export function usePdfRotate() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [securityState, setSecurityState] = useState<UnlockState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfRotateResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inspectionIdRef = useRef<number>(0);

  // Rotation settings
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [pageScope, setPageScope] = useState<"all" | "selected">("all");
  const [pageSelection, setPageSelection] = useState<string>("");

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
    setDegrees(90);
    setPageScope("all");
    setPageSelection("");
    setResult((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

  const rotateFile = useCallback(async () => {
    if (!fileInfo) {
      toast.error("Please upload a PDF file.");
      return;
    }
    
    if (securityState === 'protected') {
      toast.error("Please unlock the PDF first.");
      return;
    }
    
    if (pageScope === "selected" && !pageSelection.trim()) {
      toast.error("Please specify which pages to rotate.");
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
      formData.append("degrees", degrees.toString());
      formData.append("pageScope", pageScope);
      formData.append("pageSelection", pageSelection);

      setTimeout(() => setStatusMessage("Applying rotation..."), 600);
      setTimeout(() => setStatusMessage("Generating PDF..."), 1200);

      const response = await fetch("/api/pdf/rotate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to rotate PDF");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const rotatedFilename = `${originalName}_rotated.pdf`;

      setResult({
        url,
        filename: rotatedFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        totalPageCount: fileInfo.pageCount || 0,
      });

      toast.success("PDF rotated successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Rotate error:", error);
      toast.error(error.message || "An error occurred while rotating the PDF.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, securityState, degrees, pageScope, pageSelection]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    rotateFile,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    degrees,
    setDegrees,
    pageScope,
    setPageScope,
    pageSelection,
    setPageSelection,
  };
}
