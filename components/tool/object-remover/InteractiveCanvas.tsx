"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Point, ToolMode, BrushStroke, MaskState } from "./types";

interface InteractiveCanvasProps {
  imageSrc: string;
  toolMode: ToolMode;
  brushSize: number;
  onStrokeEnd: (stroke: BrushStroke) => void;
  strokes: BrushStroke[];
  onZoomChange?: (zoom: number) => void;
}

export function InteractiveCanvas({
  imageSrc,
  toolMode,
  brushSize,
  onStrokeEnd,
  strokes,
  onZoomChange
}: InteractiveCanvasProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Viewport transformation
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  
  // Interaction state
  const isInteracting = useRef(false);
  const lastMousePos = useRef<Point>({ x: 0, y: 0 });
  const currentStroke = useRef<Point[]>([]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const cvs = imageCanvasRef.current;
      const mcvs = maskCanvasRef.current;
      if (!cvs || !mcvs || !containerRef.current) return;
      
      cvs.width = img.width;
      cvs.height = img.height;
      mcvs.width = img.width;
      mcvs.height = img.height;
      
      const ctx = cvs.getContext("2d");
      if (ctx) ctx.drawImage(img, 0, 0);
      
      // Calculate initial fit scale
      const containerRect = containerRef.current.getBoundingClientRect();
      const scaleX = containerRect.width / img.width;
      const scaleY = containerRect.height / img.height;
      const initialScale = Math.min(scaleX, scaleY) * 0.95; // 95% fit
      
      setScale(initialScale);
      
      // Center image
      setOffset({
        x: (containerRect.width - img.width * initialScale) / 2,
        y: (containerRect.height - img.height * initialScale) / 2
      });
      
      setImageLoaded(true);
    };
  }, [imageSrc]);

  // Render mask strokes
  useEffect(() => {
    const mcvs = maskCanvasRef.current;
    if (!mcvs) return;
    const ctx = mcvs.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, mcvs.width, mcvs.height);
    
    // Set composition operation so erase mode works
    strokes.forEach(stroke => {
      ctx.globalCompositeOperation = stroke.mode === 'erase' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = "rgba(0, 255, 136, 0.5)"; // Neon green mask
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = stroke.size;
      
      if (stroke.points.length === 0) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
    
    // Reset composition for future drawing
    ctx.globalCompositeOperation = 'source-over';
    
  }, [strokes]);

  // Coordinate conversion
  const getCanvasPoint = (e: React.PointerEvent): Point => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    // e.clientX is relative to viewport. Subtract rect.left to get relative to container.
    // Subtract offset.x, then divide by scale to get canvas coordinates.
    return {
      x: ((e.clientX - rect.left) - offset.x) / scale,
      y: ((e.clientY - rect.top) - offset.y) / scale
    };
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isInteracting.current = true;
    const pt = getCanvasPoint(e);
    
    if (toolMode === 'pan') {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      currentStroke.current = [pt];
      drawLiveStroke(pt);
    }
    
    // Prevent default touch behaviors (like scrolling) on mobile
    if (e.target instanceof HTMLElement) {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting.current) return;
    
    if (toolMode === 'pan') {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    } else {
      const pt = getCanvasPoint(e);
      currentStroke.current.push(pt);
      drawLiveStroke(pt);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isInteracting.current) return;
    isInteracting.current = false;
    
    if (toolMode !== 'pan') {
      if (currentStroke.current.length > 0) {
        onStrokeEnd({
          points: [...currentStroke.current],
          size: brushSize / scale, // Save unscaled brush size so it scales properly on zoom
          mode: toolMode
        });
        currentStroke.current = [];
      }
    }
    
    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  const drawLiveStroke = (pt: Point) => {
    const mcvs = maskCanvasRef.current;
    if (!mcvs) return;
    const ctx = mcvs.getContext("2d");
    if (!ctx) return;
    
    ctx.globalCompositeOperation = toolMode === 'erase' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize / scale;
    
    const points = currentStroke.current;
    if (points.length < 2) {
      // Draw a dot
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, (brushSize / scale) / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
    ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
    
    ctx.globalCompositeOperation = 'source-over';
  };

  // Zoom handling
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const delta = -e.deltaY * zoomSensitivity;
    
    const newScale = Math.max(0.1, Math.min(10, scale * Math.exp(delta)));
    
    // Zoom around mouse position
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const canvasX = (mouseX - offset.x) / scale;
      const canvasY = (mouseY - offset.y) / scale;
      
      setOffset({
        x: mouseX - canvasX * newScale,
        y: mouseY - canvasY * newScale
      });
    }
    
    setScale(newScale);
    if (onZoomChange) onZoomChange(newScale);
  };

  // Provide getMaskData utility directly to parent via ref/imperative handle?
  // Or parent can request it. For simplicity, parent can grab the canvas ref.
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full max-h-[70vh] bg-slate-900 rounded-xl overflow-hidden touch-none ${
        toolMode === 'pan' ? 'cursor-grab active:cursor-grabbing' : 'cursor-crosshair'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }} // Prevent browser pull-to-refresh
    >
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))] bg-[length:20px_20px] pointer-events-none" />
      
      <div 
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
        className="relative"
      >
        <canvas ref={imageCanvasRef} className="block shadow-2xl" />
        <canvas ref={maskCanvasRef} className="block absolute top-0 left-0 pointer-events-none" />
      </div>

      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
          Loading image onto canvas...
        </div>
      )}
      
      {/* Expose the mask canvas to parent so parent can extract ImageData for processing */}
      <div className="hidden" id="mask-canvas-provider" data-mask={maskCanvasRef.current ? 'ready' : 'loading'} />
    </div>
  );
}
