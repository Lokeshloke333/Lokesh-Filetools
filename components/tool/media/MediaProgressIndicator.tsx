import React from "react";
import { Loader2, Clock } from "lucide-react";
import { ProcessingState } from "@/hooks/useMediaProcessor";
import { formatDuration } from "@/lib/utils/media";

interface MediaProgressIndicatorProps {
  state: ProcessingState;
}

export function MediaProgressIndicator({ state }: MediaProgressIndicatorProps) {
  if (!state.isProcessing) return null;

  return (
    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center flex flex-col items-center w-full max-w-md mx-4">
        
        <div className="relative mb-8">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              className="text-slate-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
            <circle
              className="text-blue-500 transition-all duration-300 ease-out"
              strokeWidth="8"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * state.progress) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="58"
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black text-slate-800">{state.progress}%</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">Processing Media</h3>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          <p className="text-sm font-medium text-blue-600">{state.stage || "Analyzing..."}</p>
        </div>

        {/* Custom generic progress bar line */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${state.progress}%` }}
          />
        </div>

        {state.estimatedTimeRemaining !== undefined && state.progress > 0 && state.progress < 100 && (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated time remaining: {formatDuration(state.estimatedTimeRemaining)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
