"use client";

import React, { useRef, useState } from "react";
import { ImageItem, ToolMode, BrushStroke } from "./types";
import { UploadArea } from "@/components/tool/UploadArea";
import { Button } from "@/components/ui/button";
import { Download, Image as ImageIcon, RotateCcw, Undo2, Redo2, Loader2, Maximize } from "lucide-react";
import { InteractiveCanvas } from "./InteractiveCanvas";
import { InpaintingEngine } from "./InpaintingEngine";

interface RemoverWorkspaceProps {
  image: ImageItem | null;
  toolMode: ToolMode;
  brushSize: number;
  onImageUpload: (files: File[]) => void;
  strokes: BrushStroke[];
  onStrokeEnd: (stroke: BrushStroke) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
  progress: number;
  setProgress: (val: number) => void;
}

export function RemoverWorkspace({ 
  image, 
  toolMode,
  brushSize,
  onImageUpload,
  strokes,
  onStrokeEnd,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isProcessing,
  setIsProcessing,
  progress,
  setProgress
}: RemoverWorkspaceProps) {
  
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [comparePosition, setComparePosition] = useState(50);
  const isDragging = useRef(false);

  // Since we don't have direct access to canvas contexts inside InteractiveCanvas,
  // we'll fetch them using querySelector (hacky but works) or we can pass a ref. 
  // For simplicity, we just use DOM access because it's client-rendered.
  const handleProcess = async () => {
    if (!image) return;
    
    // Find the canvases
    const canvases = document.querySelectorAll('canvas');
    if (canvases.length < 2) return;
    
    const imageCanvas = canvases[0];
    const maskCanvas = canvases[1];
    
    const imgCtx = imageCanvas.getContext('2d', { willReadFrequently: true });
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    
    if (!imgCtx || !maskCtx) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const imgData = imgCtx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
      const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
      
      // Process in a micro-task or worker to avoid completely freezing the UI.
      // Since it's pure JS, we'll use a setTimeout to let the UI update the "processing" state first.
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const resultData = InpaintingEngine.process(imgData, maskData, (p) => setProgress(p));
      
      // Create a new canvas to convert ImageData to DataURL
      const outCanvas = document.createElement('canvas');
      outCanvas.width = resultData.width;
      outCanvas.height = resultData.height;
      const outCtx = outCanvas.getContext('2d');
      if (outCtx) {
        outCtx.putImageData(resultData, 0, 0);
        setResultSrc(outCanvas.toDataURL("image/png"));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to process image.");
    } finally {
      setIsProcessing(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleDownload = () => {
    if (!resultSrc || !image) return;
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = `cleaned-${image.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Slider controls for comparison
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
    if (!isDragging.current) return;
    const rect = (e.target as HTMLElement).closest('.comparison-container')?.getBoundingClientRect();
    if (!rect) return;
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

  if (!image) {
    return (
      <UploadArea 
        acceptedFormats="JPG/JPEG, PNG, WebP"
        maxSizeMB={10} 
        multiple={false}
        onFileSelect={(file) => onImageUpload([file])}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full min-h-[500px] overflow-hidden">
      
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">{image.name}</h3>
            <p className="text-xs text-slate-500">
              {resultSrc ? "Cleaned" : strokes.length > 0 ? "Ready to process" : "Draw mask"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!resultSrc && (
            <>
              <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo || isProcessing}>
                <Undo2 className="w-4 h-4 mr-2" /> Undo
              </Button>
              <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo || isProcessing}>
                <Redo2 className="w-4 h-4 mr-2" /> Redo
              </Button>
              <Button 
                onClick={handleProcess} 
                disabled={strokes.length === 0 || isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white ml-2"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Maximize className="w-4 h-4 mr-2" />}
                {isProcessing ? `Processing ${Math.round(progress)}%` : "Remove Object"}
              </Button>
            </>
          )}

          {resultSrc && (
            <>
              <Button variant="outline" size="sm" onClick={() => setResultSrc(null)}>
                <RotateCcw className="w-4 h-4 mr-2" /> Keep Editing
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-slate-900 comparison-container">
        
        {!resultSrc ? (
          <InteractiveCanvas 
            imageSrc={image.originalSrc}
            toolMode={toolMode}
            brushSize={brushSize}
            onStrokeEnd={onStrokeEnd}
            strokes={strokes}
          />
        ) : (
          <div 
            className="relative max-w-full max-h-[calc(100vh-350px)] rounded-xl overflow-hidden shadow-2xl select-none cursor-ew-resize touch-none"
            onPointerDown={handlePointerDown}
            style={{ width: "fit-content", height: "fit-content" }}
          >
            {/* Base Layer: Cleaned Image */}
            <img 
              src={resultSrc} 
              alt="Cleaned" 
              className="block max-w-full max-h-[calc(100vh-350px)] object-contain pointer-events-none"
            />

            {/* Original Image Masked */}
            <div 
              className="absolute top-0 left-0 bottom-0 overflow-hidden pointer-events-none"
              style={{ width: `${comparePosition}%` }}
            >
              <img 
                src={image.originalSrc} 
                alt="Original" 
                className="block max-w-full max-h-[calc(100vh-350px)] object-cover pointer-events-none"
              />
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                Original
              </div>
            </div>

            {/* Slider Line */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] -ml-[2px] pointer-events-none z-10"
              style={{ left: `${comparePosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 text-white rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                <div className="flex gap-1">
                  <div className="w-0.5 h-3 bg-white rounded-full" />
                  <div className="w-0.5 h-3 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg z-10 pointer-events-none">
              Cleaned
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
