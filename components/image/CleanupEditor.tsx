import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Wand2, 
  Eraser, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Check, 
  X,
  Hand
} from "lucide-react";
import { magicErase } from "@/lib/image/magicErase";

interface CleanupEditorProps {
  originalBlob: Blob;
  onSave: (editedBlob: Blob, editedUrl: string) => void;
  onCancel: () => void;
}

type Tool = "magic-erase" | "eraser" | "pan";

export function CleanupEditor({ originalBlob, onSave, onCancel }: CleanupEditorProps) {
  const [tool, setTool] = useState<Tool>("magic-erase");
  const [brushSize, setBrushSize] = useState(25);
  const [tolerance, setTolerance] = useState(20);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Offscreen buffer canvas to hold the actual full-resolution image
  const bufferCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // History state (stored in refs to avoid React re-renders with large ImageData objects)
  const historyRef = useRef<ImageData[]>([]);
  const historyIndexRef = useRef(-1);
  const initialImageDataRef = useRef<ImageData | null>(null);
  
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number, y: number } | null>(null);
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const isPointerInsideRef = useRef(false);

  // Update cursor visual when size/zoom changes
  useEffect(() => {
    if (!cursorRef.current) return;
    if (tool !== "eraser") {
      cursorRef.current.style.display = "none";
      return;
    }
    const size = brushSize * zoom;
    cursorRef.current.style.width = `${size}px`;
    cursorRef.current.style.height = `${size}px`;
    
    if (isPointerInsideRef.current) {
      cursorRef.current.style.display = "block";
    }
  }, [tool, brushSize, zoom]);

  // Initialize the editor
  useEffect(() => {
    const initEditor = async () => {
      const url = URL.createObjectURL(originalBlob);
      const img = new Image();
      img.src = url;
      await new Promise((resolve) => { img.onload = resolve; });
      URL.revokeObjectURL(url);
      
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      bufferCanvasRef.current = canvas;
      initialImageDataRef.current = initialData;
      
      // Initialize history
      historyRef.current = [new ImageData(new Uint8ClampedArray(initialData.data), initialData.width, initialData.height)];
      historyIndexRef.current = 0;
      updateHistoryButtons();
      
      // Initial render to visible canvas
      renderVisibleCanvas();
      
      // Fit to screen initially
      fitToScreen(img.naturalWidth, img.naturalHeight);
    };
    
    initEditor();
  }, [originalBlob]);

  const fitToScreen = (imgWidth: number, imgHeight: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Leave 40px padding
    const scaleX = (rect.width - 40) / imgWidth;
    const scaleY = (rect.height - 40) / imgHeight;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in past 100% initially
    setZoom(newZoom);
    setPan({ x: 0, y: 0 });
  };

  const renderVisibleCanvas = useCallback(() => {
    if (!visibleCanvasRef.current || !bufferCanvasRef.current) return;
    const vCanvas = visibleCanvasRef.current;
    const bCanvas = bufferCanvasRef.current;
    
    vCanvas.width = bCanvas.width;
    vCanvas.height = bCanvas.height;
    
    const ctx = vCanvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, vCanvas.width, vCanvas.height);
    ctx.drawImage(bCanvas, 0, 0);
  }, []);

  const saveState = () => {
    if (!bufferCanvasRef.current) return;
    const ctx = bufferCanvasRef.current.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    
    const currentData = ctx.getImageData(0, 0, bufferCanvasRef.current.width, bufferCanvasRef.current.height);
    
    // Truncate redo history
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    
    // Add new state
    historyRef.current.push(currentData);
    
    // Cap history at 15 steps to save memory
    if (historyRef.current.length > 15) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }
    
    updateHistoryButtons();
  };

  const updateHistoryButtons = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      restoreState(historyRef.current[historyIndexRef.current]);
      updateHistoryButtons();
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      restoreState(historyRef.current[historyIndexRef.current]);
      updateHistoryButtons();
    }
  };

  const handleReset = () => {
    if (initialImageDataRef.current) {
      restoreState(initialImageDataRef.current);
      saveState();
    }
  };

  const restoreState = (imageData: ImageData) => {
    if (!bufferCanvasRef.current) return;
    const ctx = bufferCanvasRef.current.getContext("2d");
    if (!ctx) return;
    
    ctx.putImageData(imageData, 0, 0);
    renderVisibleCanvas();
  };

  const getEventCoordinates = (e: React.PointerEvent | React.MouseEvent | React.WheelEvent) => {
    if (!visibleCanvasRef.current || !containerRef.current) return { x: 0, y: 0 };
    
    const rect = visibleCanvasRef.current.getBoundingClientRect();
    
    // The precise coordinates on the actual high-res canvas
    const scaleX = visibleCanvasRef.current.width / rect.width;
    const scaleY = visibleCanvasRef.current.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    return { x, y };
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    isPointerInsideRef.current = true;
    if (tool === "eraser" && cursorRef.current) {
      cursorRef.current.style.display = "block";
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    isPointerInsideRef.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.display = "none";
    }
    // Release drawing if mouse leaves canvas mid-draw
    if (isDrawingRef.current && tool === "eraser") {
      isDrawingRef.current = false;
      lastPosRef.current = null;
      saveState();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Middle click always pans
    if (e.button === 1 || tool === "pan") {
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (e.button !== 0) return; // Only left click for tools
    if (!bufferCanvasRef.current) return;
    
    const { x, y } = getEventCoordinates(e);

    if (tool === "magic-erase") {
      const ctx = bufferCanvasRef.current.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      
      const imgData = ctx.getImageData(0, 0, bufferCanvasRef.current.width, bufferCanvasRef.current.height);
      const newImgData = magicErase(imgData, Math.floor(x), Math.floor(y), tolerance);
      
      ctx.putImageData(newImgData, 0, 0);
      renderVisibleCanvas();
      saveState();
    } 
    else if (tool === "eraser") {
      if (cursorRef.current) {
        cursorRef.current.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
        cursorRef.current.style.borderColor = "rgba(255, 255, 255, 1)";
      }
      isDrawingRef.current = true;
      lastPosRef.current = { x, y };
      
      // Draw initial dot
      const ctx = bufferCanvasRef.current.getContext("2d");
      if (!ctx) return;
      
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over"; // reset
      
      renderVisibleCanvas();
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      setPan(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
      return;
    }

    if (tool === "eraser" && cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }

    if (!isDrawingRef.current || tool !== "eraser" || !bufferCanvasRef.current || !lastPosRef.current) return;

    const { x, y } = getEventCoordinates(e);
    const ctx = bufferCanvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over"; // reset

    lastPosRef.current = { x, y };
    
    // Performance optimization: use requestAnimationFrame or just render directly
    // Direct rendering is usually fine for hardware accelerated canvas
    renderVisibleCanvas();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      return;
    }

    if (isDrawingRef.current && tool === "eraser") {
      if (cursorRef.current) {
        cursorRef.current.style.backgroundColor = "transparent";
        cursorRef.current.style.borderColor = "rgba(255, 255, 255, 0.8)";
      }
      isDrawingRef.current = false;
      lastPosRef.current = null;
      e.currentTarget.releasePointerCapture(e.pointerId);
      saveState();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.005;
      const newZoom = Math.max(0.1, Math.min(10, zoom * (1 + delta)));
      setZoom(newZoom);
    }
  };

  const handleDone = () => {
    if (!bufferCanvasRef.current) return;
    bufferCanvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(blob, url);
      }
    }, "image/png", 1.0);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/95 flex flex-col backdrop-blur-sm animate-in fade-in duration-200" style={{ height: "100dvh" }}>
      
      {/* Top Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm z-10 flex flex-nowrap overflow-x-auto whitespace-nowrap items-center justify-between gap-4 flex-shrink-0">
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-slate-100 p-1 rounded-lg flex gap-1 flex-shrink-0">
            <Button
              variant={tool === "magic-erase" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("magic-erase")}
              className={tool === "magic-erase" ? "bg-purple-600 hover:bg-purple-700" : ""}
              title="Magic Erase (M)"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Magic Erase
            </Button>
            <Button
              variant={tool === "eraser" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("eraser")}
              className={tool === "eraser" ? "bg-purple-600 hover:bg-purple-700" : ""}
              title="Eraser Brush (E)"
            >
              <Eraser className="w-4 h-4 mr-2" />
              Eraser
            </Button>
            <Button
              variant={tool === "pan" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTool("pan")}
              className={tool === "pan" ? "bg-purple-600 hover:bg-purple-700" : ""}
              title="Pan (Space / Middle Click)"
            >
              <Hand className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2" />

          {tool === "magic-erase" && (
            <div className="flex items-center gap-3 w-48">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Tolerance: {tolerance}</span>
              <Slider
                value={[tolerance]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => setTolerance(v[0])}
              />
            </div>
          )}

          {tool === "eraser" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 mr-2">Size:</span>
              {[10, 25, 50, 100].map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${brushSize === size ? 'border-purple-600 bg-purple-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                >
                  <div className="bg-slate-800 rounded-full" style={{ width: Math.max(4, size/5), height: Math.max(4, size/5) }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo} title="Redo (Ctrl+Y)">
            <Redo2 className="w-4 h-4" />
          </Button>
          
          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.max(0.1, z - 0.2))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(z => Math.min(10, z + 0.2))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            if (initialImageDataRef.current) fitToScreen(initialImageDataRef.current.width, initialImageDataRef.current.height);
          }} title="Fit to screen">
            <Maximize className="w-4 h-4" />
          </Button>
          
          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center touch-none cursor-crosshair"
        style={{
          cursor: tool === "pan" ? (isDragging ? "grabbing" : "grab") : (tool === "eraser" ? "none" : "crosshair")
        }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div 
          className="relative transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* Checkerboard background */}
          <div className="absolute inset-0 pointer-events-none rounded-md overflow-hidden shadow-2xl" 
               style={{ 
                 backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', 
                 backgroundSize: '20px 20px', 
                 backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                 backgroundColor: '#fff'
               }}
          />
          <canvas
            ref={visibleCanvasRef}
            className="relative z-10 touch-none select-none max-w-none"
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-white border-t border-slate-200 p-4 flex justify-center z-10 flex-shrink-0">
        <div className="flex justify-between items-center w-full max-w-2xl px-4">
          <Button variant="outline" onClick={onCancel} className="text-slate-600">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleDone} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8">
            <Check className="w-4 h-4 mr-2" />
            Done
          </Button>
        </div>
      </div>

      {/* Eraser Cursor Overlay */}
      <div 
        ref={cursorRef}
        className="eraser-cursor"
        style={{
          position: "fixed",
          pointerEvents: "none",
          borderRadius: "50%",
          border: "1.5px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0, 0, 0, 0.2)",
          transform: "translate(-50%, -50%)",
          zIndex: 99999,
          display: "none",
          transition: "width 0.1s ease-out, height 0.1s ease-out, background-color 0.15s ease, border-color 0.15s ease",
        }}
      />

      {/* Keyboard Shortcuts and Hide Chatbot */}
      <style dangerouslySetInnerHTML={{__html: `
        .cursor-crosshair canvas { cursor: crosshair; }
        /* Hide common chatbot launcher positions if they have high z-index */
        [id*="chat"], [class*="chat"] { z-index: 1 !important; }
      `}} />
    </div>
  );
}
