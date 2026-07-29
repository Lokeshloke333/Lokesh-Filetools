import React from "react";
import { formatFileSize } from "@/lib/utils/image";
import { ArrowRight } from "lucide-react";

export interface ImageInfoProps {
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  originalSize: number;
  previewWidth?: number;
  previewHeight?: number;
  previewFormat?: string;
  estimatedSize?: number;
}

export function ImageInfoCard({
  originalWidth,
  originalHeight,
  originalFormat,
  originalSize,
  previewWidth,
  previewHeight,
  previewFormat,
  estimatedSize
}: ImageInfoProps) {
  
  // Use preview values if provided, otherwise fallback to original
  const pWidth = previewWidth ?? originalWidth;
  const pHeight = previewHeight ?? originalHeight;
  const pFormat = previewFormat ?? originalFormat;
  const pSize = estimatedSize ?? originalSize;

  const isSizeReduced = pSize < originalSize;
  const isSizeIncreased = pSize > originalSize;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 mt-4">
      
      {/* Original Side */}
      <div className="flex-1 p-4 bg-slate-50/50">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Original</div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Dimensions</div>
            <div className="font-medium text-slate-800 text-sm">{originalWidth} × {originalHeight}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Format</div>
            <div className="font-medium text-slate-800 text-sm uppercase">{originalFormat}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 mb-0.5">File Size</div>
            <div className="font-medium text-slate-800 text-sm">{formatFileSize(originalSize)}</div>
          </div>
        </div>
      </div>

      {/* Separator Icon (visible only on sm+ screens) */}
      <div className="hidden sm:flex items-center justify-center bg-white px-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Preview Side */}
      <div className="flex-1 p-4 bg-blue-50/30">
        <div className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-2">Output Preview</div>
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Dimensions</div>
            <div className="font-medium text-blue-900 text-sm">{pWidth} × {pHeight}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Format</div>
            <div className="font-medium text-blue-900 text-sm uppercase">{pFormat}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 mb-0.5">Est. File Size</div>
            <div className={`font-medium text-sm flex items-center gap-2 ${isSizeReduced ? 'text-green-600' : isSizeIncreased ? 'text-amber-600' : 'text-blue-900'}`}>
              {formatFileSize(pSize)}
              {isSizeReduced && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md font-bold">-{Math.round(((originalSize - pSize) / originalSize) * 100)}%</span>}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
