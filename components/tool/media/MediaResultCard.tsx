import React from "react";
import { MediaResult } from "@/hooks/useMediaProcessor";
import { formatFileSize } from "@/lib/utils/image";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, CheckCircle2, FileAudio, FileVideo, Settings2 } from "lucide-react";

interface MediaResultCardProps {
  result: MediaResult;
  onDownload: () => void;
  onReset: () => void;
  resetButtonText?: string;
  downloadButtonText?: string;
  mediaType?: "audio" | "video";
  options?: any;
}

export function MediaResultCard({ 
  result, 
  onDownload, 
  onReset, 
  resetButtonText = "Process Another", 
  downloadButtonText = "Download File", 
  mediaType = "audio", 
  options 
}: MediaResultCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 md:p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 box-border overflow-hidden">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner border border-emerald-200">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Processing Complete!</h3>
      <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-md mx-auto font-medium px-2">
        Your file has been successfully processed into <span className="font-bold text-emerald-700">{result.newFormat}</span> format.
      </p>
      
      <div className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-6 mb-6 sm:mb-8 max-w-xl mx-auto shadow-sm text-left w-full overflow-hidden box-border">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            {mediaType === "video" ? <FileVideo className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" /> : <FileAudio className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
          </div>
          <div className="flex-1 min-w-0 overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate mb-1" title={result.filename}>{result.filename}</p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              <span className="text-emerald-600 shrink-0">{result.newFormat}</span>
              <span>•</span>
              <span className="shrink-0">{formatFileSize(result.processedSize)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Format</p>
            <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{result.newFormat}</p>
          </div>
          {options?.bitrate && options.bitrate !== 'auto' && (
             <div className="space-y-1 min-w-0">
               <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Bitrate</p>
               <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{options.bitrate}</p>
             </div>
          )}
          {options?.sampleRate && options.sampleRate !== 'auto' && (
             <div className="space-y-1 min-w-0">
               <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Sample Rate</p>
               <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{options.sampleRate}</p>
             </div>
          )}
          {options?.channels && options.channels !== 'auto' && (
             <div className="space-y-1 min-w-0">
               <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Channels</p>
               <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{options.channels}</p>
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 w-full">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={onReset} 
          className="bg-white hover:bg-slate-50 h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-bold text-slate-700 border-slate-200 w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
          {resetButtonText}
        </Button>
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 sm:h-14 rounded-2xl text-sm sm:text-base font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] w-full sm:w-auto" 
          onClick={onDownload}
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 shrink-0" />
          {downloadButtonText}
        </Button>
      </div>
    </div>
  );
}
