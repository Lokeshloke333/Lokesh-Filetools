import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfOrganizeResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { inspectPdfSecurity, UnlockState } from "@/lib/pdf/security";

export type PageItem = {
  id: string; // unique stable ID for rendering/dragging
  originalPageNum: number; // 1-indexed original page
  rotation: number; // cumulative rotation
  isSelected: boolean;
};

export function usePdfOrganize() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [securityState, setSecurityState] = useState<UnlockState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfOrganizeResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [pages, setPages] = useState<PageItem[]>([]);
  const initialPagesRef = useRef<PageItem[]>([]);
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
    setPages([]);
    setSecurityState('inspecting');

    const state = await inspectPdfSecurity(file);
    if (currentInspectionId !== inspectionIdRef.current) return;
    setSecurityState(state);

    if (state === 'notProtected' || state === 'permissionOnly') {
      try {
        const count = await getPdfPageCount(file);
        setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
        
        // Initialize pages
        const initial = Array.from({ length: count || 0 }, (_, i) => ({
          id: `page-${i + 1}-${crypto.randomUUID()}`,
          originalPageNum: i + 1,
          rotation: 0,
          isSelected: false,
        }));
        setPages(initial);
        initialPagesRef.current = JSON.parse(JSON.stringify(initial));
      } catch (err) {
        // Ignored, count failed
      }
    }
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    inspectionIdRef.current++;
    setFileInfo(null);
    setSecurityState('idle');
    setPages([]);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  // Selection actions
  const selectAll = useCallback(() => setPages(p => p.map(pg => ({ ...pg, isSelected: true }))), []);
  const deselectAll = useCallback(() => setPages(p => p.map(pg => ({ ...pg, isSelected: false }))), []);
  const invertSelection = useCallback(() => setPages(p => p.map(pg => ({ ...pg, isSelected: !pg.isSelected }))), []);
  const toggleSelection = useCallback((id: string) => {
    setPages(p => p.map(pg => pg.id === id ? { ...pg, isSelected: !pg.isSelected } : pg));
  }, []);

  // Operations
  const deleteSelected = useCallback(() => {
    setPages(p => {
      const remaining = p.filter(pg => !pg.isSelected);
      if (remaining.length === 0) {
        toast.error("A PDF must contain at least one page.");
        return p;
      }
      return remaining;
    });
  }, []);

  const rotateSelected = useCallback((direction: 'left' | 'right') => {
    const amount = direction === 'right' ? 90 : 270; // 270 is same as -90
    setPages(p => p.map(pg => pg.isSelected ? { ...pg, rotation: (pg.rotation + amount) % 360 } : pg));
  }, []);

  const rotateIndividual = useCallback((id: string, direction: 'left' | 'right') => {
    const amount = direction === 'right' ? 90 : 270;
    setPages(p => p.map(pg => pg.id === id ? { ...pg, rotation: (pg.rotation + amount) % 360 } : pg));
  }, []);

  const resetAll = useCallback(() => {
    if (initialPagesRef.current.length > 0) {
      setPages(JSON.parse(JSON.stringify(initialPagesRef.current)));
      toast.success("Workspace reset to original state.");
    }
  }, []);

  const handleDragEnd = useCallback((newPages: PageItem[]) => {
    setPages(newPages);
  }, []);

  const processOrganization = useCallback(async () => {
    if (!fileInfo || pages.length === 0) return;
    
    setIsProcessing(true);
    setStatusMessage("Loading PDF...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      
      const operations = pages.map(pg => ({
        originalPageNum: pg.originalPageNum,
        rotation: pg.rotation
      }));
      formData.append("operations", JSON.stringify(operations));

      setTimeout(() => setStatusMessage("Applying page changes..."), 600);
      setTimeout(() => setStatusMessage("Generating PDF..."), 1200);

      const response = await fetch("/api/pdf/organize", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to organize PDF");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}_organized.pdf`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        originalPageCount: fileInfo.pageCount || 0,
        finalPageCount: pages.length
      });

      toast.success("PDF organized successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Organize error:", error);
      toast.error(error.message || "An error occurred while organizing the PDF.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, pages]);

  return {
    fileInfo,
    handleFileSelect,
    clearAll,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    
    pages,
    selectAll,
    deselectAll,
    invertSelection,
    toggleSelection,
    deleteSelected,
    rotateSelected,
    rotateIndividual,
    resetAll,
    handleDragEnd,
    processOrganization
  };
}
