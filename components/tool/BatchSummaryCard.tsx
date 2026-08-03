import React from "react";
import { Download, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize, calculateSavings } from "@/lib/utils/image";
import { BatchItem } from "@/hooks/useBatchImageCompressor";

interface BatchSummaryCardProps {
  items: BatchItem[];
  onDownloadAll: () => void;
  onCompressMore: () => void;
  isDownloading?: boolean;
}

export function BatchSummaryCard({ items, onDownloadAll, onCompressMore, isDownloading }: BatchSummaryCardProps) {
  const completedItems = items.filter(i => i.status === "completed" && i.result);
  
  const totalOriginal = completedItems.reduce((acc, item) => acc + (item.file.size || 0), 0);
  const totalCompressed = completedItems.reduce((acc, item) => {
    // If it's already optimized, we consider the processed size to be the original size
    const isAlreadyOptimized = item.result?.message === "Already Optimized ✓" || (item.result && item.result.processedSize >= item.result.originalSize);
    return acc + (isAlreadyOptimized ? item.file.size : (item.result?.processedSize || 0));
  }, 0);
  
  const totalSaved = totalOriginal - totalCompressed;
  const savedPercentage = totalOriginal > 0 ? (totalSaved / totalOriginal) * 100 : 0;

  // We only show download all if there's at least one item that was actually compressed
  // If all were "already optimized", downloading all would just be downloading original files.
  // Wait, users might still want them zipped, let's allow it if there's any completed item.
  
  if (completedItems.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Batch Summary</h3>
          <p className="text-sm font-medium text-slate-500">{completedItems.length} Images Optimized</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Original Total</p>
          <p className="text-lg font-black text-slate-700">{formatFileSize(totalOriginal)}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Compressed</p>
          <p className="text-lg font-black text-slate-700">{formatFileSize(totalCompressed)}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-100 col-span-2 sm:col-span-1">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Saved</p>
          <p className="text-lg font-black text-emerald-700 flex items-baseline gap-1.5">
            {formatFileSize(totalSaved)}
            <span className="text-sm font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
              {Math.round(savedPercentage)}%
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          size="lg" 
          onClick={onDownloadAll}
          disabled={isDownloading}
          className="flex-1 rounded-2xl h-14 text-base font-bold shadow-lg shadow-blue-500/20"
        >
          <Download className="w-5 h-5 mr-2" />
          {isDownloading ? "Zipping..." : "Download All (ZIP)"}
        </Button>
        <Button 
          size="lg"
          variant="outline"
          onClick={onCompressMore}
          className="rounded-2xl h-14 text-base font-bold text-slate-600 bg-white hover:bg-slate-50 border-slate-200"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Compress More
        </Button>
      </div>
    </div>
  );
}
