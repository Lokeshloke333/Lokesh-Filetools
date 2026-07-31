/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { PdfFileInfo } from "@/lib/pdf/types";
import { validatePdf } from "@/lib/pdf/validation";
import { getPdfPageCount } from "@/lib/pdf/utils";
import { PdfToImageSettings } from "@/components/tool/PdfToImageOptions";

export interface PdfToImageResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  imageCount: number;
}

export function usePdfToImage() {
  const [fileInfo, setFileInfo] = useState<PdfFileInfo | null>(null);
  const [options, setOptions] = useState<PdfToImageSettings>({
    format: "PNG",
    quality: "high",
    dpi: "300",
    pageSelection: "all",
    customRange: "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [result, setResult] = useState<PdfToImageResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file) return;

    const { valid, error } = validatePdf(file, []);
    if (!valid) {
      setUploadError(`${file.name}: ${error}`);
      return;
    }

    const newInfo: PdfFileInfo = { file, id: crypto.randomUUID() };
    setFileInfo(newInfo);
    setUploadError(null);
    setResult(null);

    // Fetch page count
    getPdfPageCount(file).then((count) => {
      setFileInfo((prev) => (prev && prev.id === newInfo.id ? { ...prev, pageCount: count } : prev));
    });
  }, []);

  const clearUploadError = useCallback(() => {
    setUploadError(null);
  }, []);

  const clearAll = useCallback(() => {
    setFileInfo(null);
    setResult((prev) => {
      if (prev?.url) {
        URL.revokeObjectURL(prev.url);
      }
      return null;
    });
  }, []);

  const convertFile = useCallback(async () => {
    if (!fileInfo) {
      toast.error("Please upload a PDF file.");
      return;
    }

    if (options.pageSelection === "custom" && !options.customRange.trim()) {
      toast.error("Please enter a valid page range.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Loading PDF Engine...");
    setResult((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    try {
      const JSZip = (await import("jszip")).default;
      const pdfjsLib = await import("pdfjs-dist");
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      setStatusMessage("Reading PDF...");
      
      const arrayBuffer = await fileInfo.file.arrayBuffer();
      
      console.log("File:", fileInfo.file);
      console.log("ArrayBuffer length:", arrayBuffer.byteLength);
      
      const documentOptions = {
        data: new Uint8Array(arrayBuffer)
      };
      
      console.log("getDocument argument:", documentOptions);
      
      const pdf = await pdfjsLib.getDocument(documentOptions).promise;
      const totalPages = pdf.numPages;

      let pagesToRender: number[] = [];
      if (options.pageSelection === "all") {
        pagesToRender = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        const parts = options.customRange.split(",");
        for (const part of parts) {
          const range = part.trim().split("-");
          if (range.length === 1) {
            const p = parseInt(range[0], 10);
            if (!isNaN(p) && p >= 1 && p <= totalPages) pagesToRender.push(p);
          } else if (range.length === 2) {
            const start = parseInt(range[0], 10);
            const end = parseInt(range[1], 10);
            if (!isNaN(start) && !isNaN(end) && start >= 1 && end <= totalPages && start <= end) {
              for (let i = start; i <= end; i++) pagesToRender.push(i);
            }
          }
        }
        pagesToRender = Array.from(new Set(pagesToRender)).sort((a, b) => a - b);
      }

      if (pagesToRender.length === 0) {
        throw new Error("No valid pages selected for rendering.");
      }

      const zip = new JSZip();
      const format = options.format.toLowerCase();
      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      
      let qualityVal = 0.8;
      if (format === "jpg") {
        qualityVal = options.quality === "high" ? 0.95 : options.quality === "medium" ? 0.8 : 0.6;
      }
      
      const dpi = parseInt(options.dpi, 10) || 150;
      const scale = dpi / 72;

      for (let i = 0; i < pagesToRender.length; i++) {
        const pageNum = pagesToRender[i];
        setStatusMessage(`Rendering Page ${pageNum} (${i + 1} of ${pagesToRender.length})...`);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) throw new Error("Failed to create canvas context");
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        if (format === "jpg") {
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({ canvasContext: context, viewport } as any).promise;
        
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, qualityVal);
        });

        if (!blob) throw new Error(`Failed to generate image for page ${pageNum}`);

        const paddedPage = pageNum.toString().padStart(Math.max(3, totalPages.toString().length), "0");
        zip.file(`page-${paddedPage}.${format}`, blob);
      }

      setStatusMessage("Creating ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob" });

      setStatusMessage("Preparing Download...");
      
      const url = URL.createObjectURL(zipBlob);
      const originalName = fileInfo.file.name.replace(/\.[^/.]+$/, "");
      const zipFilename = `${originalName}_images.zip`;

      setResult({
        url,
        filename: zipFilename,
        originalSize: fileInfo.file.size,
        processedSize: zipBlob.size,
        imageCount: pagesToRender.length,
      });

      toast.success("PDF converted to images successfully!");
    } catch (error: any) {
      console.error("Convert error:", error);
      toast.error(error.message || "An error occurred while converting the PDF.");
    } finally {
      setIsProcessing(false);
      setStatusMessage("");
    }
  }, [fileInfo, options]);

  return {
    fileInfo,
    options,
    setOptions,
    handleFileSelect,
    clearAll,
    convertFile,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  };
}
