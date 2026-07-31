import { useState, useEffect, useRef } from "react";
import { getPdfPageCount } from "@/lib/pdf/getPdfPageCount";

export function useDocumentPreview(files: File[], options: any) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastHashRef = useRef<string>("");

  useEffect(() => {
    // If no files, clear preview
    if (files.length === 0) {
      setPreviewUrl(null);
      setTotalPages(0);
      setCurrentPage(1);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Hash to prevent unnecessary requests if options/files are practically the same
    const fileNames = files.map(f => f.name + f.size).join("|");
    const optionsHash = JSON.stringify(options);
    const currentHash = `${fileNames}-${optionsHash}`;

    if (currentHash === lastHashRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Show loading immediately for better UX
    setIsLoading(true);
    setError(null);

    debounceTimerRef.current = setTimeout(async () => {
      lastHashRef.current = currentHash;

      // Cancel previous request if still ongoing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        
        // Append all options (pageSize, orientation, margins)
        Object.entries(options).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        const response = await fetch("/api/pdf/word-to-pdf", {
          method: "POST",
          body: formData,
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to generate preview");
        }

        const blob = await response.blob();
        
        // Revoke old url to prevent memory leaks
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });

        const pageCountHeader = response.headers.get("X-Total-Pages");
        let count = pageCountHeader ? parseInt(pageCountHeader, 10) : 0;
        if (!count || isNaN(count)) {
          count = await getPdfPageCount(blob);
        }
        setTotalPages(count);
        setCurrentPage(1);
      } catch (err: any) {
        if (err.name === "AbortError") {
          // Ignore abort errors
          return;
        }
        console.error("Preview generation error:", err);
        setError("Preview unavailable. Your document can still be converted successfully.");
      } finally {
        if (abortControllerRef.current === abortController) {
          setIsLoading(false);
          abortControllerRef.current = null;
        }
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [files, options]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return {
    previewUrl,
    isLoading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
  };
}
