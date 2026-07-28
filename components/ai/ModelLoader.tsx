import React from "react";
import { Loader2, BrainCircuit } from "lucide-react";

interface ModelLoaderProps {
  stage: string;
  progress: number;
}

export function ModelLoader({ stage, progress }: ModelLoaderProps) {
  return (
    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 text-center flex flex-col items-center w-full max-w-sm mx-4">
        
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center border-4 border-purple-100 relative">
            <BrainCircuit className="w-10 h-10 text-purple-600 animate-pulse" />
            
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                className="text-purple-500 transition-all duration-300 ease-out"
                strokeWidth="4"
                strokeDasharray={283} // 2 * PI * 45
                strokeDashoffset={283 - (283 * progress) / 100}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="48"
                cy="48"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">{stage}</h3>
        
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{progress}% Complete</p>
          <p className="text-xs text-slate-400 mt-2">This usually happens once. The model will be cached for future use.</p>
        </div>
      </div>
    </div>
  );
}
