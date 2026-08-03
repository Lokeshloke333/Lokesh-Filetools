import { useCallback } from "react";
import { downloadFile } from "@/lib/utils/image";
import JSZip from "jszip";

export function useDownload() {
  const handleDownload = useCallback((url: string | undefined, filename: string | undefined) => {
    if (url && filename) {
      downloadFile(url, filename);
    }
  }, []);

  const handleBatchDownload = useCallback(async (items: { url: string; filename: string }[], zipFilename: string = "compressed_images.zip") => {
    if (!items.length) return;
    
    const zip = new JSZip();
    
    // Fetch all blobs and add them to zip
    const fetchPromises = items.map(async (item) => {
      try {
        const response = await fetch(item.url);
        const blob = await response.blob();
        zip.file(item.filename, blob);
      } catch (err) {
        console.error(`Failed to fetch ${item.filename} for zipping`, err);
      }
    });

    await Promise.all(fetchPromises);
    
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    
    downloadFile(url, zipFilename);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  return { handleDownload, handleBatchDownload };
}
