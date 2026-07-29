import React from "react";
import { ZoomIn, ZoomOut, Maximize, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageToolbarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onFitToScreen: () => void;
  onActualSize: () => void;
  className?: string;
}

export function ImageToolbar({
  zoom,
  onZoomChange,
  onFitToScreen,
  onActualSize,
  className = ""
}: ImageToolbarProps) {
  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom + 0.25, 5)); // Max 5x zoom
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom - 0.25, 0.1)); // Min 0.1x zoom
  };

  return (
    <div className={`flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200 p-1.5 rounded-full shadow-lg ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-700" 
        onClick={handleZoomOut}
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <div className="text-xs font-semibold text-slate-600 w-12 text-center select-none">
        {Math.round(zoom * 100)}%
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-700" 
        onClick={handleZoomIn}
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-700" 
        onClick={onFitToScreen}
        title="Fit to Screen"
      >
        <Scan className="w-4 h-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="icon" 
        className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-700" 
        onClick={onActualSize}
        title="Actual Size"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  );
}
