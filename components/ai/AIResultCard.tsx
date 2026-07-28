import React from "react";
import { formatFileSize } from "@/lib/utils/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";
import { AIComparisonSlider } from "./AIComparisonSlider";

interface AIResultCardProps {
  originalImage: string;
  processedImage: string;
  originalSize: number;
  processedSize: number;
  width?: number;
  height?: number;
  onDownload: () => void;
  onReset: () => void;
}

export function AIResultCard({ 
  originalImage, 
  processedImage, 
  originalSize, 
  processedSize,
  width,
  height,
  onDownload, 
  onReset 
}: AIResultCardProps) {
  return (
    <div className="bg-purple-50/50 border border-purple-100 rounded-3xl p-6 sm:p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-slate-800">Processing Complete</h3>
            <p className="text-sm text-purple-600 font-medium">Background removed successfully</p>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <AIComparisonSlider originalImage={originalImage} processedImage={processedImage} />
      </div>
      
      <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-8 max-w-3xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 divide-x divide-slate-100 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Original Size</p>
             <p className="text-lg font-black text-slate-700">{formatFileSize(originalSize)}</p>
          </div>
          <div className="flex-1 sm:flex-none pl-6">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Output Size</p>
             <p className="text-lg font-black text-purple-700">{formatFileSize(processedSize)}</p>
          </div>
          {width && height && (
            <div className="flex-1 sm:flex-none pl-6 hidden md:block">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resolution</p>
               <p className="text-lg font-black text-slate-700">{width} × {height}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset} 
          className="bg-white hover:bg-slate-50 h-14 rounded-2xl text-base font-bold text-slate-700 border-slate-200"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Remove Another Background
        </Button>
        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 text-white h-14 rounded-2xl text-base font-bold shadow-lg shadow-purple-500/30 transition-all hover:scale-105" 
          onClick={onDownload}
        >
          <Download className="w-5 h-5 mr-2" />
          Download Transparent PNG
        </Button>
      </div>
    </div>
  );
}
