"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import { ImageItem, UpscaleFactor, UpscaleResult } from "./types";
import { UpscalerEngine } from "./UpscalerEngine";
import { UpscaleSettings } from "./UpscaleSettings";
import { UpscalerWorkspace } from "./UpscalerWorkspace";
import { BatchCarousel } from "@/components/tool/ai-image-enhancer/BatchCarousel"; // Reusing the carousel from enhancer
import { UploadArea } from "@/components/tool/UploadArea";

export function UpscalerTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState<UpscaleFactor>(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [results, setResults] = useState<UpscaleResult[]>([]);

  // Cleanup Upscaler on unmount to free memory
  useEffect(() => {
    return () => {
      UpscalerEngine.dispose().catch(console.error);
    };
  }, []);

  const handleImagesUpload = (files: File[]) => {
    const newImages = files.map(f => ({
      id: uuidv4(),
      file: f,
      originalSrc: URL.createObjectURL(f),
      name: f.name
    }));
    
    setImages(prev => [...prev, ...newImages]);
    if (images.length === 0) setCurrentIndex(0);
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (currentIndex >= filtered.length) setCurrentIndex(Math.max(0, filtered.length - 1));
      return filtered;
    });
    setResults(prev => prev.filter(r => r.id !== id));
  };

  const handleProcess = async () => {
    if (images.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const newResults: UpscaleResult[] = [];
      const totalImages = images.length;
      
      for (let i = 0; i < totalImages; i++) {
        const img = images[i];
        
        // Skip if already processed for this scale? (For simplicity, we re-process everything when clicked)
        setCurrentIndex(i); // Auto-focus the image being processed
        
        const resultSrc = await UpscalerEngine.upscale(
          img.originalSrc, 
          scale, 
          (p, s) => {
            const baseProgress = (i / totalImages) * 100;
            const currentImgProgress = (p / totalImages);
            setProgress(baseProgress + currentImgProgress);
            setStatus(s || "Processing...");
          }
        );
        
        if (!resultSrc || resultSrc.length < 100) {
          throw new Error("Invalid upscale output.");
        }
        
        newResults.push({ id: img.id, resultSrc });
      }
      
      setResults(newResults);
      setProgress(100);
      setStatus("Complete");
      
    } catch (error) {
      console.error("Upscaling failed:", error);
      alert("An error occurred during upscaling. This can happen if the image is too large for your device's memory.");
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProgress(0);
        setStatus("Ready");
      }, 1000);
    }
  };

  const handleDownload = async () => {
    if (results.length === 0) return;

    if (results.length === 1) {
      triggerDownload(results[0].resultSrc, `upscaled-${scale}x-${images[0].name}`);
    } else {
      const zip = new JSZip();
      for (const res of results) {
        const img = images.find(i => i.id === res.id);
        if (!img) continue;
        const base64Data = res.resultSrc.split(',')[1];
        zip.file(`upscaled-${scale}x-${img.name}`, base64Data, { base64: true });
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      triggerDownload(url, `upscaled-images-${scale}x.zip`);
      URL.revokeObjectURL(url);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={images.length > 0 ? "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" : "block"}>
        
        {images.length > 0 && (
          <div className="lg:col-span-1 hidden lg:block h-full">
            <UpscaleSettings 
              scale={scale}
              onChangeScale={setScale}
              onProcess={handleProcess}
              isProcessing={isProcessing}
              progress={progress}
              status={status}
              hasImages={images.length > 0}
            />
          </div>
        )}

        <div className={images.length > 0 ? "lg:col-span-3" : "w-full"}>
          {images.length === 0 ? (
            <UploadArea 
              acceptedFormats="JPG/JPEG, PNG, WebP"
              maxSizeMB={10}
              multiple={true}
              onFileSelect={(file) => handleImagesUpload([file])}
              onFilesSelect={handleImagesUpload}
            />
          ) : (
            <>
              <UpscalerWorkspace 
                images={images}
                currentIndex={currentIndex}
                results={results}
                onImagesUpload={handleImagesUpload}
                onDownload={handleDownload}
              />
              
              <BatchCarousel 
                images={images}
                currentIndex={currentIndex}
                onSelect={setCurrentIndex}
                onRemove={handleRemoveImage}
              />
            </>
          )}
        </div>

        {images.length > 0 && (
          <div className="lg:hidden col-span-1">
            <UpscaleSettings 
              scale={scale}
              onChangeScale={setScale}
              onProcess={handleProcess}
              isProcessing={isProcessing}
              progress={progress}
              status={status}
              hasImages={images.length > 0}
            />
          </div>
        )}

      </div>
    </div>
  );
}
