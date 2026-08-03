import React from "react";
import { Download, Loader2, CheckCircle2, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize, calculateSavings } from "@/lib/utils/image";
import { BatchItem } from "@/hooks/useBatchImageCompressor";
import Image from "next/image";

interface BatchResultCardProps {
  item: BatchItem;
  onDownload: () => void;
  onRemove: () => void;
}

export function BatchResultCard({ item, onDownload, onRemove }: BatchResultCardProps) {
  const isAlreadyOptimized = item.result?.message === "Already Optimized ✓" || (item.result && item.result.processedSize >= item.result.originalSize);
  const isCompleted = item.status === "completed";
  const isProcessing = item.status === "processing";
  const isError = item.status === "error";

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:shadow-md hover:border-slate-300">
      
      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
        <Image 
          src={item.preview} 
          alt={item.file.name} 
          fill 
          className="object-cover" 
          unoptimized 
        />
      </div>

      {/* Info & Status */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 truncate mb-1" title={item.file.name}>
          {item.file.name}
        </h4>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          <span className="text-slate-500">{formatFileSize(item.file.size)}</span>
          
          {isProcessing && (
            <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Optimizing...
            </span>
          )}

          {isError && (
            <span className="flex items-center text-red-600 bg-red-50 px-2 py-0.5 rounded-full" title={item.error}>
              <XCircle className="w-3 h-3 mr-1" />
              Failed
            </span>
          )}

          {isCompleted && item.result && (
            <>
              <span className="text-slate-300">→</span>
              {isAlreadyOptimized ? (
                <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Already Optimized ✓
                </span>
              ) : (
                <>
                  <span className="text-slate-700">{formatFileSize(item.result.processedSize)}</span>
                  <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    -{Math.round(item.result.savedPercentage)}%
                  </span>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
        {isCompleted && item.result && !isAlreadyOptimized && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDownload}
            className="rounded-xl h-9 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRemove}
          className="rounded-xl h-9 w-9 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
          title="Remove"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
