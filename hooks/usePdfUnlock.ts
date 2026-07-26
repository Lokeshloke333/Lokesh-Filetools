import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { PdfFileInfo, PdfUnlockResult } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { inspectPdfSecurity, UnlockState } from "@/lib/pdf/security";

export function usePdfUnlock() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [password, setPassword] = useState<string>("");
  const [unlockState, setUnlockState] = useState<UnlockState>('idle');
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfUnlockResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
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
    setPassword("");
    setPasswordError(null);
    setUnlockState('inspecting');

    const state = await inspectPdfSecurity(file);
    if (currentInspectionId !== inspectionIdRef.current) return;
    setUnlockState(state);

    getPdfPageCount(file)
      .then((count) => {
        setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
      })
      .catch(() => {
        // Ignored
      });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    inspectionIdRef.current++;
    setFileInfo(null);
    setPassword("");
    setPasswordError(null);
    setUnlockState('idle');
    setResult((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

  const unlockFile = useCallback(async () => {
    if (!fileInfo || unlockState !== 'protected') {
      return;
    }
    
    if (!password) {
      setPasswordError("Password is required to unlock this PDF.");
      return;
    }

    setUnlockState('unlocking');
    setStatusMessage("Uploading...");
    setPasswordError(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", fileInfo.file);
      formData.append("password", password);

      setTimeout(() => setStatusMessage("Validating Password..."), 600);
      setTimeout(() => setStatusMessage("Removing Encryption..."), 1200);

      const response = await fetch("/api/pdf/unlock", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 403 || errorData.error?.toLowerCase().includes('password')) {
            setPasswordError("Incorrect password. Please verify your password and try again.");
            setUnlockState('protected');
            return;
        }
        throw new Error(errorData.error || "Failed to unlock PDF");
      }

      setStatusMessage("Preparing Download...");
      const blob = await response.blob();
      const processedSize = blob.size;
      const url = URL.createObjectURL(blob);

      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const unlockedFilename = `${originalName}_unlocked.pdf`;

      setResult({
        url,
        filename: unlockedFilename,
        originalSize: fileInfo.file.size,
        processedSize,
      });

      setPassword("");
      setUnlockState('success');
      toast.success("PDF unlocked successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Unlock error:", error);
      toast.error(error.message || "An error occurred while unlocking the PDF.");
      setUnlockState('protected');
    } finally {
      setStatusMessage("");
    }
  }, [fileInfo, password, unlockState]);

  return {
    fileInfo,
    password,
    setPassword,
    handleFileSelect,
    clearAll,
    unlockFile,
    unlockState,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    passwordError,
  };
}
