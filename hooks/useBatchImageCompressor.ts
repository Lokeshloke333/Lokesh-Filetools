import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { ProcessorResult } from "./useImageProcessor";
import { validateImage } from "@/lib/image/validation";

export interface BatchItem {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "processing" | "completed" | "error";
  result?: ProcessorResult;
  error?: string;
  progress?: number;
}

export function useBatchImageCompressor() {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
        if (item.result?.preview) URL.revokeObjectURL(item.result.preview);
      });
    };
  }, []); // Only on unmount because we manage URLs manually in remove/clear

  const addFiles = useCallback((files: File[]) => {
    const newItems: BatchItem[] = [];
    
    files.forEach(file => {
      const { valid, error } = validateImage(file, 50);
      if (!valid) {
        toast.error(`${file.name}: ${error || "Invalid file"}`);
        return;
      }
      
      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
      });
    });

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id);
      if (item) {
        if (item.preview) URL.revokeObjectURL(item.preview);
        if (item.result?.preview) URL.revokeObjectURL(item.result.preview);
      }
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems(prev => {
      prev.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
        if (item.result?.preview) URL.revokeObjectURL(item.result.preview);
      });
      return [];
    });
  }, []);

  const processAll = useCallback(async (settings: Record<string, any>) => {
    setIsProcessing(true);

    for (const item of items) {
      if (item.status === "completed") continue;
      
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "processing" } : i));
      
      try {
        const formData = new FormData();
        formData.append("file", item.file);
        
        Object.entries(settings).forEach(([key, value]) => {
          formData.append(key, typeof value === "string" ? value : String(value));
        });

        const response = await fetch(`/api/image/compress`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || "Processing failed");
        }

        const blob = await response.blob();
        const originalSize = Number(response.headers.get("x-original-size") || 0);
        const processedSize = Number(response.headers.get("x-processed-size") || Number(response.headers.get("x-compressed-size")) || 0);
        const savedPercentage = Number(response.headers.get("x-saved-percentage") || 0);
        const filename = response.headers.get("x-filename") || `compressed-${item.file.name}`;
        const width = Number(response.headers.get("x-width") || 0);
        const height = Number(response.headers.get("x-height") || 0);
        const outputFormat = filename.split('.').pop()?.toUpperCase() || "";
        const messageHeader = response.headers.get("x-compression-message");
        const message = messageHeader ? decodeURIComponent(messageHeader) : undefined;

        const preview = URL.createObjectURL(blob);

        const result: ProcessorResult = {
          preview,
          originalSize,
          processedSize,
          savedPercentage,
          filename,
          width,
          height,
          outputFormat,
          message,
        };

        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "completed", result } : i));
      } catch (error: any) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "error", error: error.message } : i));
        toast.error(`Failed to compress ${item.file.name}`);
      }
    }
    
    setIsProcessing(false);
  }, [items]);

  return {
    items,
    isProcessing,
    addFiles,
    removeFile,
    clearAll,
    processAll,
  };
}
