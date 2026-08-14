"use client";

import React, { useState, useRef, useEffect } from "react";

interface WatermarkRegionProps {
  id: string;
  x: number; // %
  y: number; // %
  width: number; // %
  height: number; // %
  isActive: boolean;
  onSelect: () => void;
  onChange: (updates: { x?: number; y?: number; width?: number; height?: number }) => void;
  onDelete: () => void;
}

export function WatermarkRegion({ id, x, y, width, height, isActive, onSelect, onChange, onDelete }: WatermarkRegionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  
  const startPos = useRef({ x: 0, y: 0 });
  const startRect = useRef({ x, y, width, height });

  // Sync refs when not actively changing to ensure accurate start values
  useEffect(() => {
    if (!isDragging && !isResizing) {
      startRect.current = { x, y, width, height };
    }
  }, [x, y, width, height, isDragging, isResizing]);

  const handlePointerDown = (e: React.PointerEvent, action: string | null = null) => {
    // Prevent default to avoid scrolling and text selection during drag on mobile
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    
    startPos.current = { x: e.clientX, y: e.clientY };
    startRect.current = { x, y, width, height };
    
    if (action) {
      setIsResizing(action);
    } else {
      setIsDragging(true);
    }

    const handlePointerMove = (ev: PointerEvent) => {
      const container = target.closest('.watermark-container') as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaX = ((ev.clientX - startPos.current.x) / rect.width) * 100;
      const deltaY = ((ev.clientY - startPos.current.y) / rect.height) * 100;

      if (action) {
        // Resizing
        let newX = startRect.current.x;
        let newY = startRect.current.y;
        let newW = startRect.current.width;
        let newH = startRect.current.height;

        if (action.includes('w')) {
          newX = startRect.current.x + deltaX;
          newW = startRect.current.width - deltaX;
        }
        if (action.includes('e')) {
          newW = startRect.current.width + deltaX;
        }
        if (action.includes('n')) {
          newY = startRect.current.y + deltaY;
          newH = startRect.current.height - deltaY;
        }
        if (action.includes('s')) {
          newH = startRect.current.height + deltaY;
        }

        // Min dimensions
        const MIN_SIZE = 2; // 2% minimum
        if (newW < MIN_SIZE) {
          if (action.includes('w')) newX = startRect.current.x + startRect.current.width - MIN_SIZE;
          newW = MIN_SIZE;
        }
        if (newH < MIN_SIZE) {
          if (action.includes('n')) newY = startRect.current.y + startRect.current.height - MIN_SIZE;
          newH = MIN_SIZE;
        }
        
        // Prevent going out of bounds
        if (newX < 0) { newW += newX; newX = 0; }
        if (newY < 0) { newH += newY; newY = 0; }
        if (newX + newW > 100) newW = 100 - newX;
        if (newY + newH > 100) newH = 100 - newY;

        onChange({ x: newX, y: newY, width: newW, height: newH });

      } else {
        // Dragging
        let newX = startRect.current.x + deltaX;
        let newY = startRect.current.y + deltaY;

        newX = Math.max(0, Math.min(newX, 100 - startRect.current.width));
        newY = Math.max(0, Math.min(newY, 100 - startRect.current.height));

        onChange({ x: newX, y: newY });
      }
    };

    const handlePointerUp = (ev: PointerEvent) => {
      setIsDragging(false);
      setIsResizing(null);
      target.releasePointerCapture(ev.pointerId);
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerup', handlePointerUp);
      target.removeEventListener('pointercancel', handlePointerUp);
    };

    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerup', handlePointerUp);
    target.addEventListener('pointercancel', handlePointerUp);
  };

  // Helper to render a larger hit area handle with a small visual core
  const renderHandle = (positionClass: string, cursor: string, action: string) => (
    <div 
      className={`absolute ${positionClass} w-8 h-8 flex items-center justify-center ${cursor} z-20`}
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => handlePointerDown(e, action)}
    >
      <div className="w-3 h-3 bg-yellow-400 border border-white shadow-sm pointer-events-none" />
    </div>
  );

  return (
    <div
      className={`absolute border-2 ${isActive ? 'border-yellow-400 z-20 shadow-md' : 'border-slate-300 border-dashed z-10'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onPointerDown={(e) => handlePointerDown(e)}
    >
      {/* Background (Blur effect for live preview) */}
      <div 
         className="w-full h-full backdrop-blur-[12px] bg-white/10" 
         style={{ pointerEvents: 'none' }}
      />

      {/* Delete button */}
      {isActive && (
        <button
          className="absolute -top-4 -right-4 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-md z-30 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          onPointerDown={(e) => {
            e.stopPropagation(); // prevent drag
          }}
        >
          ✕
        </button>
      )}

      {/* Resize Handles (Larger hit area, small visual box) */}
      {isActive && (
        <>
          {renderHandle("top-0 left-0 -translate-x-4 -translate-y-4", "cursor-nwse-resize", "nw")}
          {renderHandle("top-0 right-0 translate-x-4 -translate-y-4", "cursor-nesw-resize", "ne")}
          {renderHandle("bottom-0 left-0 -translate-x-4 translate-y-4", "cursor-nesw-resize", "sw")}
          {renderHandle("bottom-0 right-0 translate-x-4 translate-y-4", "cursor-nwse-resize", "se")}
          
          {renderHandle("top-0 left-1/2 -translate-x-1/2 -translate-y-4", "cursor-ns-resize", "n")}
          {renderHandle("bottom-0 left-1/2 -translate-x-1/2 translate-y-4", "cursor-ns-resize", "s")}
          {renderHandle("top-1/2 left-0 -translate-x-4 -translate-y-1/2", "cursor-ew-resize", "w")}
          {renderHandle("top-1/2 right-0 translate-x-4 -translate-y-1/2", "cursor-ew-resize", "e")}
        </>
      )}
    </div>
  );
}
