import React from "react";
import { formatFileSize } from "@/lib/utils/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Layers, FileText } from "lucide-react";
import { PdfMergeResult } from "@/lib/pdf/types";

interface PdfResultCardProps {
  result: PdfMergeResult;
  onDownload: () => void;
  onReset: () => void;
  title?: string;
  successMessage?: string;
  sizeLabel?: string;
  resetButtonText?: string;
  downloadButtonText?: string;
  icon?: React.ReactNode;
}

export function PdfResultCard({
  result,
  onDownload,
  onReset,
  title = "PDF Ready",
  successMessage = "Your PDF document is ready!",
  sizeLabel = "PDF Size",
  resetButtonText = "Convert Another",
  downloadButtonText = "Download PDF",
  icon,
}: PdfResultCardProps) {
  const pageText = result.totalPageCount === 1 ? "1 Page" : `${result.totalPageCount} Pages`;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Top bar */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <Layers className="w-5 h-5" />
            <span>{title}</span>
          </div>
          <div className="text-sm font-medium text-blue-600">
            {pageText}
          </div>
        </div>

        {/* Info Area */}
        <div className="p-8 flex flex-col items-center text-center">
          {icon ? (
            icon
          ) : (
            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-red-100 shadow-inner">
              <FileText className="w-12 h-12 text-red-500" />
            </div>
          )}
          
          <h3 className="text-2xl font-bold text-slate-800 mb-2">
            {successMessage}
          </h3>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex flex-col items-center">
              <span className="text-sm text-slate-500 font-medium mb-1">Original Size</span>
              <span className="text-lg font-bold text-slate-700">{formatFileSize(result.originalSize)}</span>
            </div>
            
            <div className="w-px h-10 bg-slate-200"></div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-slate-500 font-medium mb-1">{sizeLabel}</span>
              <span className="text-lg font-bold text-green-600">{formatFileSize(result.processedSize)}</span>
            </div>

            <div className="w-px h-10 bg-slate-200"></div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm text-slate-500 font-medium mb-1">Total Pages</span>
              <span className="text-lg font-bold text-blue-600">{result.totalPageCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onDownload} 
          size="lg" 
          className="flex-1 h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20"
        >
          <Download className="w-5 h-5 mr-2" />
          {downloadButtonText}
        </Button>
        <Button 
          onClick={onReset} 
          size="lg" 
          variant="outline"
          className="sm:flex-none sm:w-auto h-14 rounded-2xl text-base font-bold bg-white"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {resetButtonText}
        </Button>
      </div>
    </div>
  );
}
