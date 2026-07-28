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
  options?: any; // To pass in chosen options like bitrate, sampleRate if needed
}

export function MediaResultCard({ result, onDownload, onReset, resetButtonText = "Process Another", downloadButtonText = "Download File", mediaType = "audio", options }: MediaResultCardProps) {
  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      
      <h3 className="text-2xl font-black text-slate-800 mb-2">Processing Complete!</h3>
      <p className="text-slate-600 mb-8 max-w-md mx-auto font-medium">
        Your file has been successfully processed into <span className="font-bold text-emerald-700">{result.newFormat}</span> format.
      </p>
      
      <div className="bg-white rounded-2xl border border-emerald-100 p-6 mb-8 max-w-2xl mx-auto shadow-sm text-left">
        <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            {mediaType === "video" ? <FileVideo className="w-6 h-6 text-blue-500" /> : <FileAudio className="w-6 h-6 text-blue-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate mb-1" title={result.filename}>{result.filename}</p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="text-emerald-600">{result.newFormat}</span>
              <span>•</span>
              <span>{formatFileSize(result.processedSize)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Format</p>
            <p className="text-sm font-bold text-slate-700">{result.newFormat}</p>
          </div>
          {options?.bitrate && options.bitrate !== 'auto' && (
             <div className="space-y-1">
               <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Bitrate</p>
               <p className="text-sm font-bold text-slate-700">{options.bitrate}</p>
             </div>
          )}
          {options?.sampleRate && options.sampleRate !== 'auto' && (
             <div className="space-y-1">
               <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Sample Rate</p>
               <p className="text-sm font-bold text-slate-700">{options.sampleRate}</p>
             </div>
          )}
          {options?.channels && options.channels !== 'auto' && (
             <div className="space-y-1">
               <p className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1"><Settings2 className="w-3 h-3"/> Channels</p>
               <p className="text-sm font-bold text-slate-700">{options.channels}</p>
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
          {resetButtonText}
        </Button>
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 rounded-2xl text-base font-bold shadow-lg shadow-emerald-500/30 transition-all hover:scale-105" 
          onClick={onDownload}
        >
          <Download className="w-5 h-5 mr-2" />
          {downloadButtonText}
        </Button>
      </div>
    </div>
  );
}
