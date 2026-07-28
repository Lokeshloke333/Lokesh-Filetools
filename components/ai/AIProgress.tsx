import React from "react";
import { Loader2 } from "lucide-react";

interface AIProgressProps {
  stage: string;
  progress: number;
}

export function AIProgress({ stage, progress }: AIProgressProps) {
  return (
    <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center flex flex-col items-center min-w-[320px]">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-6" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">{stage}</h3>
        
        <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden mt-2">
          <div 
            className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{progress}%</p>
      </div>
    </div>
  );
}
