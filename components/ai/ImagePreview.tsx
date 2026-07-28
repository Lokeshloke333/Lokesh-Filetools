import React, { useState } from "react";
import { Grid, Square } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
}

export function ImagePreview({ imageUrl, alt = "Preview" }: ImagePreviewProps) {
  const [bgMode, setBgMode] = useState<"checkerboard" | "white" | "black" | "grey">("checkerboard");

  const bgStyles = {
    checkerboard: {
      backgroundImage: 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    },
    white: { backgroundColor: '#ffffff' },
    black: { backgroundColor: '#000000' },
    grey: { backgroundColor: '#808080' }
  };

  return (
    <div className="w-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
      <div className="bg-slate-50 border-b border-slate-100 p-2 flex items-center justify-between px-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</span>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setBgMode("checkerboard")}
            className={`p-1.5 rounded-md transition-colors ${bgMode === "checkerboard" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            title="Checkerboard"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setBgMode("white")}
            className={`p-1.5 rounded-md transition-colors ${bgMode === "white" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            title="White Background"
          >
            <Square className="w-4 h-4 fill-white text-slate-300" />
          </button>
          <button 
            onClick={() => setBgMode("grey")}
            className={`p-1.5 rounded-md transition-colors ${bgMode === "grey" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            title="Grey Background"
          >
            <Square className="w-4 h-4 fill-gray-500 text-gray-500" />
          </button>
          <button 
            onClick={() => setBgMode("black")}
            className={`p-1.5 rounded-md transition-colors ${bgMode === "black" ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"}`}
            title="Black Background"
          >
            <Square className="w-4 h-4 fill-black text-black" />
          </button>
        </div>
      </div>
      
      <div 
        className="w-full h-[300px] sm:h-[400px] flex items-center justify-center p-4 relative"
        style={bgStyles[bgMode]}
      >
        <img src={imageUrl} alt={alt} className="max-w-full max-h-full object-contain drop-shadow-lg relative z-10" />
      </div>
    </div>
  );
}
