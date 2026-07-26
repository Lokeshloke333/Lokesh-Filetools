import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfWatermarkResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { inspectPdfSecurity, UnlockState } from "@/lib/pdf/security";
import { WatermarkConfig } from "@/lib/pdf/watermark";

export function usePdfWatermark() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [securityState, setSecurityState] = useState<UnlockState>('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfWatermarkResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [config, setConfig] = useState<WatermarkConfig>({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontFamily: 'Helvetica',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    color: '#000000',
    fontSize: 48,
    imageScale: 100,
    opacity: 50,
    rotation: 45,
    position: 'center',
    customX: 0,
    customY: 0,
    pageScope: 'all',
    pageRange: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

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
    setSecurityState('inspecting');

    const state = await inspectPdfSecurity(file);
    if (currentInspectionId !== inspectionIdRef.current) return;
    setSecurityState(state);

    if (state === 'notProtected' || state === 'permissionOnly') {
      try {
        const count = await getPdfPageCount(file);
        setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
      } catch (err) {
        // Ignored, count failed
      }
    }
  }, []);

  const handleImageSelect = useCallback((file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file must be less than 10MB");
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and SVG images are supported.");
      return;
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  }, []);

  const handleImageRemove = useCallback(() => {
    setImageFile(null);
    setImagePreviewUrl(null);
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    inspectionIdRef.current++;
    setFileInfo(null);
    setSecurityState('idle');
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const updateConfig = useCallback((updates: Partial<WatermarkConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const processWatermark = useCallback(async () => {
    if (!fileInfo) return;
    if (config.type === 'text' && !config.text.trim()) {
      toast.error("Please enter watermark text.");
      return;
    }
    if (config.type === 'image' && !imageFile) {
      toast.error("Please upload an image to use as a watermark.");
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
      formData.append("config", JSON.stringify(config));
      if (config.type === 'image' && imageFile) {
        formData.append("imageFile", imageFile);
      }

      setTimeout(() => setStatusMessage("Applying watermark..."), 800);
      setTimeout(() => setStatusMessage("Generating PDF..."), 1500);

      const response = await fetch("/api/pdf/watermark", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to watermark PDF");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const pagesAffected = parseInt(response.headers.get("X-Pages-Affected") || "0", 10);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const finalFilename = `${originalName}_watermarked.pdf`;

      setResult({
        url,
        filename: finalFilename,
        originalSize: fileInfo.file.size,
        processedSize,
        pagesAffected,
        watermarkType: config.type,
      });

      toast.success("Watermark added successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Watermark error:", error);
      toast.error(error.message || "An error occurred while adding the watermark.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, config, imageFile]);

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
    
    config,
    updateConfig,
    imageFile,
    imagePreviewUrl,
    handleImageSelect,
    handleImageRemove,
    processWatermark
  };
}
