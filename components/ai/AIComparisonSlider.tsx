import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeftRight } from "lucide-react";

interface AIComparisonSliderProps {
  originalImage: string;
  processedImage: string;
}

export function AIComparisonSlider({ originalImage, processedImage }: AIComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", stopDragging);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDragging);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging, onMouseMove, stopDragging, onTouchMove]);

  return (
    <div className="w-full relative bg-slate-100 rounded-2xl overflow-hidden group border border-slate-200" ref={containerRef}>
      
      {/* Container for aspect ratio. Using a standard 16:9 for the preview box, but images fit inside */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px]">
        
        {/* Transparent Checkerboard Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />

        {/* Processed Image (Background removed - Transparent) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none">
          <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain drop-shadow-xl" />
        </div>

        {/* Original Image (Clipped) */}
        <div 
          className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-50 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
        </div>

        {/* Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 z-30 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 z-30 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Original
        </div>
        <div className="absolute top-4 right-4 z-30 bg-purple-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Result
        </div>

      </div>
    </div>
  );
}
