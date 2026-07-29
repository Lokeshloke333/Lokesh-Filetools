import React, { useState, useEffect } from "react";
import { ImageCanvas } from "./ImageCanvas";
import { ImageToolbar } from "./ImageToolbar";
import { TransformState } from "@/lib/image/imageTransform";
import { X, Image as ImageIcon } from "lucide-react";

export interface SharedImagePreviewProps {
  image: HTMLImageElement | string | null;
  transform?: TransformState;
  targetWidth?: number;
  targetHeight?: number;
  simulateFormat?: string;
  filter?: string;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  onClear?: () => void;
  fileName?: string;
  className?: string;
  children?: React.ReactNode; // For overlays like react-image-crop
}

export function ImagePreview({
  image,
  transform,
  targetWidth,
  targetHeight,
  simulateFormat,
  filter,
  zoom = 1,
  onZoomChange,
  onClear,
  fileName,
  className = "",
  children
}: SharedImagePreviewProps) {
  
  const [imgNode, setImgNode] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (typeof image === "string") {
      const img = new Image();
      img.src = image;
      img.onload = () => setImgNode(img);
    } else {
      setImgNode(image);
    }
  }, [image]);

  const handleFitToScreen = () => {
    onZoomChange?.(1);
  };

  const handleActualSize = () => {
    onZoomChange?.(2);
  };

  return (
    <div className={`relative w-full h-[400px] md:h-[500px] rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col group ${className}`}>
      
      {/* Top Bar with Filename and Clear Button */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {fileName && (
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50 text-sm font-medium text-slate-700 pointer-events-auto max-w-[70%] truncate">
            {fileName}
          </div>
        )}
        {onClear && (
          <button 
            onClick={onClear}
            className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full shadow-sm backdrop-blur-md transition-colors text-slate-500 pointer-events-auto ml-auto"
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center bg-slate-100/50">
        {!imgNode ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-medium">No image loaded</p>
          </div>
        ) : (
          <>
            <ImageCanvas 
              image={imgNode}
              transform={transform}
              targetWidth={targetWidth}
              targetHeight={targetHeight}
              simulateFormat={simulateFormat}
              filter={filter}
              zoom={zoom}
              className="absolute inset-0"
            />
            {/* Any overlays (e.g. crop UI) */}
            {children && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto" style={{ transform: `scale(${zoom})` }}>
                  {children}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Toolbar */}
      {imgNode && onZoomChange && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none focus-within:opacity-100">
          <div className="pointer-events-auto">
            <ImageToolbar 
              zoom={zoom}
              onZoomChange={onZoomChange}
              onFitToScreen={handleFitToScreen}
              onActualSize={handleActualSize}
            />
          </div>
        </div>
      )}
    </div>
  );
}
