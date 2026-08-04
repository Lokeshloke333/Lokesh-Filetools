"use client";

import React, { useRef, useState } from "react";
import { ImageItem, UpscaleResult } from "./types";
import { UploadArea } from "@/components/tool/UploadArea";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, Sparkles, ChevronsLeftRight } from "lucide-react";

interface UpscalerWorkspaceProps {
  images: ImageItem[];
  currentIndex: number;
  results: UpscaleResult[];
  onImagesUpload: (files: File[]) => void;
  onDownload: () => void;
}

export function UpscalerWorkspace({ 
  images, 
  currentIndex, 
  results,
  onImagesUpload,
  onDownload
}: UpscalerWorkspaceProps) {
  
  const [comparePosition, setComparePosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const currentImage = images[currentIndex];
  const currentResult = results.find(r => r.id === currentImage?.id);

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
    if (!currentResult) return;
    isDragging.current = true;
    handlePointerMove(e);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointermove', handlePointerMove);
  };

  if (images.length === 0) {
    return (
      <UploadArea 
        acceptedFormats="JPG/JPEG, PNG, WebP"
        maxSizeMB={10} // AI upscaling crashes easily on >10MB
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
              {currentResult ? "Upscaled Successfully" : "Original Image"}
            </p>
          </div>
        </div>
        
        {results.length > 0 && (
          <Button 
            onClick={onDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            {results.length > 1 ? "Download All" : "Download"}
          </Button>
        )}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))] bg-[length:20px_20px]" />

        {!currentResult && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-white/10 shadow-xl">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Ready to upscale</span>
          </div>
        )}

        <div 
          ref={containerRef}
          className={`relative max-w-full max-h-[calc(100vh-350px)] rounded-xl overflow-hidden shadow-2xl select-none ${currentResult ? 'cursor-ew-resize touch-none' : ''}`}
          onPointerDown={handlePointerDown}
          style={{ width: "fit-content", height: "fit-content" }}
        >
          {/* Base Layer: Either the Upscaled image or Original if not upscaled yet */}
          <img 
            src={currentResult ? currentResult.resultSrc : currentImage.originalSrc} 
            alt={currentResult ? "Upscaled" : "Original"} 
            className="block max-w-full max-h-[calc(100vh-350px)] object-contain pointer-events-none select-none"
            draggable={false}
          />

          {/* Interactive Comparison Layer (Only when upscaled) */}
          {currentResult && (
            <>
              {/* Original Image (Masked via clip-path) */}
              <div 
                className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden"
                style={{ 
                  clipPath: `inset(0 calc(100% - ${comparePosition}%) 0 0)`,
                  WebkitClipPath: `inset(0 calc(100% - ${comparePosition}%) 0 0)`
                }}
              >
                <img 
                  src={currentImage.originalSrc} 
                  alt="Original" 
                  className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10 pointer-events-none border border-white/10">
                Original
              </div>
              <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10 pointer-events-none border border-blue-400/30">
                AI Upscaled
              </div>

              {/* Slider Line */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none z-10"
                style={{ left: `calc(${comparePosition}% - 1px)` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] flex items-center justify-center border-2 border-white pointer-events-none">
                  <ChevronsLeftRight className="w-5 h-5" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
