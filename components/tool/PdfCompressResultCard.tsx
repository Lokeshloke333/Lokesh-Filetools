import React from "react";
import { CheckCircle2, Download, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils/image";
import { PdfCompressResult } from "@/lib/pdf/types";

interface PdfCompressResultCardProps {
  result: PdfCompressResult;
  onDownload: () => void;
  onReset: () => void;
}

export function PdfCompressResultCard({ result, onDownload, onReset }: PdfCompressResultCardProps) {
  const savedBytes = Math.max(0, result.originalSize - result.processedSize);
  const savedPercent = result.originalSize > 0 
    ? Math.round((savedBytes / result.originalSize) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-xl shadow-green-900/5 text-center flex flex-col items-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
        <Zap className="w-12 h-12 text-green-500" />
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
      </div>
      
      <h3 className="text-3xl font-black text-slate-800 mb-3">Compression Complete!</h3>
      <p className="text-slate-500 mb-8 max-w-md text-lg">
        Your PDF has been successfully compressed and optimized.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full justify-center mb-8">
        <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100 flex flex-col items-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Original Size</span>
          <span className="text-lg font-bold text-slate-700">{formatFileSize(result.originalSize)}</span>
        </div>
        <div className="bg-green-50 px-4 py-3 rounded-2xl border border-green-100 flex flex-col items-center">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Compressed</span>
          <span className="text-lg font-bold text-green-700">{formatFileSize(result.processedSize)}</span>
        </div>
        
        {savedBytes > 0 ? (
          <div className="col-span-2 bg-blue-50 px-6 py-5 rounded-2xl border border-blue-100 flex flex-col items-center justify-center shadow-inner">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Space Saved</span>
            <span className="text-4xl font-black text-blue-700 tracking-tight my-1">
              {savedPercent}%
            </span>
            <span className="text-sm font-semibold text-blue-600/80">
              ({formatFileSize(savedBytes)} removed)
            </span>
          </div>
        ) : (
          <div className="col-span-2 bg-slate-50 px-6 py-5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
            <span className="text-sm font-semibold text-slate-600">
              Already fully optimized
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button 
          size="lg" 
          className="h-14 px-8 rounded-2xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all"
          onClick={onDownload}
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </Button>
        <Button 
          size="lg"
          variant="outline"
          className="h-14 px-8 rounded-2xl text-base font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          onClick={onReset}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Compress Another PDF
        </Button>
      </div>
    </div>
  );
}
