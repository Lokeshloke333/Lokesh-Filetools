import React, { useState, useRef, useEffect } from "react";
import { ImageCanvas } from "./ImageCanvas";
import { ImageToolbar } from "./ImageToolbar";
import { X } from "lucide-react";

interface ImageComparisonProps {
  originalImage: HTMLImageElement | string | null;
  processedImage: HTMLImageElement | string | null;
  fileName?: string;
  onClear: () => void;
  className?: string;
}

export function ImageComparison({
  originalImage,
  processedImage,
  fileName,
  onClear,
  className = ""
}: ImageComparisonProps) {
  const [zoom, setZoom] = useState(1);
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [origImgNode, setOrigImgNode] = useState<HTMLImageElement | null>(null);
  const [procImgNode, setProcImgNode] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof originalImage === "string") {
      const img = new Image();
      img.src = originalImage;
      img.onload = () => setOrigImgNode(img);
    } else {
      setOrigImgNode(originalImage);
    }
  }, [originalImage]);

  useEffect(() => {
    if (typeof processedImage === "string") {
      const img = new Image();
      img.src = processedImage;
      img.onload = () => setProcImgNode(img);
    } else {
      setProcImgNode(processedImage);
    }
  }, [processedImage]);

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateSlider(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className={`relative w-full h-[400px] md:h-[500px] rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col group ${className}`}>
      
      {/* Top Bar with Filename and Clear Button */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        {fileName && (
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50 text-sm font-medium text-slate-700 pointer-events-auto max-w-[70%] truncate">
            {fileName}
          </div>
        )}
        <button 
          onClick={onClear}
          className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full shadow-sm backdrop-blur-md transition-colors text-slate-500 pointer-events-auto ml-auto"
          title="Remove Image"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 w-full relative overflow-hidden bg-slate-100/50 touch-none cursor-ew-resize"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Processed Image (Background, fully visible) */}
        <div className="absolute inset-0 pointer-events-none">
          <ImageCanvas 
            image={procImgNode || origImgNode} 
            zoom={zoom} 
            className="absolute inset-0"
          />
        </div>

        {/* Original Image (Foreground, clipped) */}
        <div 
          className="absolute inset-0 pointer-events-none border-r-2 border-white shadow-[1px_0_10px_rgba(0,0,0,0.2)]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <ImageCanvas 
            image={origImgNode} 
            zoom={zoom} 
            className="absolute inset-0"
          />
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center pointer-events-auto cursor-ew-resize group-hover:scale-110 transition-transform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
          <div className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md select-none">
            Original
          </div>
        </div>
        <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
          <div className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md select-none">
            Processed
          </div>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none focus-within:opacity-100">
        <div className="pointer-events-auto">
          <ImageToolbar 
            zoom={zoom}
            onZoomChange={handleZoomChange}
            onFitToScreen={() => handleZoomChange(1)}
            onActualSize={() => handleZoomChange(2)}
          />
        </div>
      </div>
    </div>
  );
}
