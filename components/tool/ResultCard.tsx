import React from "react";
import { ProcessorResult } from "@/hooks/useImageProcessor";
import { formatFileSize } from "@/lib/utils/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ArrowDown, Maximize } from "lucide-react";

interface ResultCardProps {
  result: ProcessorResult;
  onDownload: () => void;
  onReset: () => void;
  originalFile: File & { preview?: string };
  mode?: "compress" | "resize" | "crop" | "rotate" | "convert" | "default";
}

export function ResultCard({ result, onDownload, onReset, originalFile, mode = "default" }: ResultCardProps) {
  // Try to get original dimensions from the preview image if possible, or pass them in.
  // For now we just display the new dimensions from `result`.
  
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Top bar */}
        {mode === "compress" && result.savedPercentage > 0 && (
          <div className="bg-green-50 px-6 py-4 border-b border-green-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700 font-bold">
              <ArrowDown className="w-5 h-5" />
              <span>Saved {result.savedPercentage}%</span>
            </div>
            <div className="text-sm font-medium text-green-600">
              {formatFileSize(result.originalSize - result.processedSize)} smaller
            </div>
          </div>
        )}
        
        {(mode === "resize" || mode === "crop" || mode === "rotate") && (
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700 font-bold">
              <Maximize className="w-5 h-5" />
              <span>{mode === "resize" ? "Resized" : mode === "crop" ? "Cropped" : "Processed"} Successfully</span>
            </div>
            <div className="text-sm font-medium text-blue-600">
              {result.width} × {result.height} px
            </div>
          </div>
        )}

        {mode === "convert" && (
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-700 font-bold">
              <Maximize className="w-5 h-5" />
              <span>Converted Successfully</span>
            </div>
            <div className="text-sm font-medium text-purple-600 uppercase tracking-wider">
              {originalFile.type.split('/')[1] || "IMAGE"} → {result.outputFormat}
            </div>
          </div>
        )}

        {result.message && (
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center text-amber-800 text-sm font-medium">
            {result.message}
          </div>
        )}

        {/* Previews side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          {/* Original */}
          <div className="p-6 flex flex-col items-center">
            <div className="text-sm font-semibold text-slate-500 mb-4">Original</div>
            <div className="w-full h-48 bg-slate-50 rounded-xl mb-4 relative flex items-center justify-center overflow-hidden border border-slate-100 p-2">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }}></div>
              {originalFile.preview && (
                <img src={originalFile.preview} className="max-w-full max-h-full object-contain relative z-10" alt="Original" />
              )}
            </div>
            <div className="font-bold text-slate-800 text-lg">{formatFileSize(result.originalSize)}</div>
            {mode === "convert" && (
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase">
                {originalFile.type.split('/')[1] || "ORIGINAL"}
              </div>
            )}
          </div>

          {/* Processed */}
          <div className="p-6 flex flex-col items-center bg-slate-50/30">
            <div className="text-sm font-semibold text-blue-600 mb-4">Processed</div>
            <div className="w-full h-48 bg-white rounded-xl mb-4 relative flex items-center justify-center overflow-hidden border border-blue-100 p-2 shadow-sm">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }}></div>
              <img src={result.preview} className="max-w-full max-h-full object-contain relative z-10" alt="Processed" />
            </div>
            <div className="font-bold text-green-600 text-lg">{formatFileSize(result.processedSize)}</div>
            {(mode === "resize" || mode === "crop" || mode === "rotate") && (
              <div className="text-xs font-medium text-slate-500 mt-1">
                {result.width} × {result.height}
              </div>
            )}
            {mode === "convert" && (
              <div className="text-xs font-medium text-slate-500 mt-1 uppercase">
                {result.outputFormat}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onDownload} 
          size="lg" 
          className="w-full sm:flex-1 h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Image
        </Button>
        <Button 
          onClick={onReset} 
          size="lg" 
          variant="outline"
          className="sm:flex-none sm:w-auto h-14 rounded-2xl text-base font-bold bg-white"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Process Another
        </Button>
      </div>
    </div>
  );
}
