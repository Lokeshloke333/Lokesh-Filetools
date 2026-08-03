"use client";

import React, { useEffect, useState, useRef } from "react";
import { ImageItem, EnhancerSettings } from "./types";
import { ImageProcessor } from "./ImageProcessor";
import { UploadArea } from "@/components/tool/UploadArea";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Image as ImageIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface EnhancerWorkspaceProps {
  images: ImageItem[];
  currentIndex: number;
  settings: EnhancerSettings;
  onImagesUpload: (files: File[]) => void;
  onDownload: () => void;
  isProcessing: boolean;
}

export function EnhancerWorkspace({ 
  images, 
  currentIndex, 
  settings, 
  onImagesUpload,
  onDownload,
  isProcessing
}: EnhancerWorkspaceProps) {
  
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [comparePosition, setComparePosition] = useState(50); // 0 to 100
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    if (!currentImage) {
      setPreviewSrc(null);
      return;
    }

    let isMounted = true;
    const updatePreview = async () => {
      setIsRenderingPreview(true);
      try {
        // Use a scaled-down max dimension for real-time previewing
        const result = await ImageProcessor.processImage(currentImage.originalSrc, settings, 1200, 1200);
        if (isMounted) setPreviewSrc(result);
      } catch (e) {
        console.error("Preview failed", e);
      } finally {
        if (isMounted) setIsRenderingPreview(false);
      }
    };

    // Debounce the preview slightly to prevent lag on fast slider movements
    const timer = setTimeout(updatePreview, 100);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentImage, settings]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setComparePosition(percent);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointermove', handlePointerMove);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    handlePointerMove(e);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);
  };

  if (images.length === 0) {
    return (
      <UploadArea 
        acceptedFormats="JPG/JPEG, PNG, WebP"
        maxSizeMB={20}
        multiple={true}
        onFileSelect={(file) => onImagesUpload([file])}
        onFilesSelect={(files) => onImagesUpload(files)}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px] overflow-hidden">
      
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{currentImage.name}</h3>
            <p className="text-xs text-slate-500">
              Image {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={onDownload}
          disabled={isProcessing || !previewSrc}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {images.length > 1 ? "Download All" : "Download"}
        </Button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))] bg-[length:20px_20px]" />

        {isRenderingPreview && !previewSrc && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        <div 
          ref={containerRef}
          className="relative max-w-full max-h-full rounded-xl overflow-hidden shadow-2xl select-none cursor-ew-resize group touch-none"
          onPointerDown={handlePointerDown}
          style={{ width: "fit-content", height: "fit-content" }}
        >
          {/* Enhanced Image (Bottom Layer) */}
          {previewSrc && (
            <img 
              src={previewSrc} 
              alt="Enhanced Preview" 
              className="block max-w-full max-h-[calc(100vh-350px)] object-contain pointer-events-none"
            />
          )}

          {/* Original Image (Top Layer, Masked) */}
          <div 
            className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none"
            style={{ width: `${comparePosition}%` }}
          >
            <img 
              src={currentImage.originalSrc} 
              alt="Original" 
              className="block max-w-none h-full object-cover pointer-events-none"
            />
            
            {/* Before Label */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              Before
            </div>
          </div>

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] -ml-[2px] pointer-events-none z-10"
            style={{ left: `${comparePosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
                <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>

          {/* After Label */}
          {previewSrc && (
            <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              After
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
