import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { validateProtectPdfFile, PdfProtectOptions } from "@/lib/pdf/protect.validation";

export interface PdfProtectResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalPageCount: number;
}

export function usePdfProtect() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<PdfProtectOptions>({
    password: "",
    algorithm: "AES-256",
    allowPrinting: false,
    allowCopying: false,
    allowModifying: false,
    allowAnnotating: false,
    allowFillingForms: false,
    allowExtraction: false,
    allowAssembly: false,
    allowHighQualityPrint: false,
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfProtectResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (result?.url) {
        URL.revokeObjectURL(result.url);
      }
    };
  }, [result]);

  const handleFileSelect = useCallback((newFiles: File[]) => {
    if (newFiles.length === 0) return;
    const f = newFiles[0];
    
    const { valid, error } = validateProtectPdfFile(f);
    if (!valid) {
      setUploadError(`${f.name}: ${error}`);
      return;
    }

    setUploadError(null);
    setFile(f);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });
    setOptions((prev) => ({ ...prev, password: "" }));
    setConfirmPassword("");
  }, []);

  const protectDocument = useCallback(async () => {
    if (!file) {
      toast.error("Please upload a PDF document.");
      return;
    }

    if (!options.password || options.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (options.password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Uploading...");

    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", options.password);
      formData.append("algorithm", options.algorithm || "AES-256");
      formData.append("allowPrinting", options.allowPrinting ? "true" : "false");
      formData.append("allowCopying", options.allowCopying ? "true" : "false");
      formData.append("allowModifying", options.allowModifying ? "true" : "false");
      formData.append("allowAnnotating", options.allowAnnotating ? "true" : "false");
      formData.append("allowFillingForms", options.allowFillingForms ? "true" : "false");
      formData.append("allowExtraction", options.allowExtraction ? "true" : "false");
      formData.append("allowAssembly", options.allowAssembly ? "true" : "false");
      formData.append("allowHighQualityPrint", options.allowHighQualityPrint ? "true" : "false");

      const statuses = [
        "Uploading PDF...",
        "Encrypting PDF...",
        "Applying permissions...",
        "Generating protected PDF...",
        "Preparing download...",
      ];
      let statusIndex = 0;
      const progressInterval = setInterval(() => {
        statusIndex = Math.min(statusIndex + 1, statuses.length - 1);
        setStatusMessage(statuses[statusIndex]);
      }, 1000);

      const response = await fetch("/api/pdf/protect", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to protect PDF document.");
      }

      setStatusMessage("Preparing download...");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        filename: file.name.replace(/\.pdf$/i, "_protected.pdf"),
        originalSize: file.size,
        processedSize: blob.size,
        totalPageCount: 1, // Placeholder
      });

      toast.success("PDF Protected Successfully");
    } catch (error: any) {
      console.error("PDF Protect Error:", error);
      toast.error(error.message || "An error occurred during encryption.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [file, options, confirmPassword]);

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: "", color: "bg-slate-200", score: 0 };
    if (pass.length < 6) return { label: "Too Short", color: "bg-red-500", score: 0 };
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;

    if (score < 2) return { label: "Weak", color: "bg-orange-500", score: 1 };
    if (score < 4) return { label: "Medium", color: "bg-amber-500", score: 2 };
    return { label: "Strong", color: "bg-green-500", score: 3 };
  };

  return {
    file,
    options,
    setOptions,
    confirmPassword,
    setConfirmPassword,
    handleFileSelect,
    clearFile,
    protectDocument,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    getPasswordStrength,
  };
}
