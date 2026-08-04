"use client";

import React from "react";
import { UpscaleFactor } from "./types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings, Zap, ArrowRight, HardDrive, MonitorUp, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UpscaleSettingsProps {
  scale: UpscaleFactor;
  onChangeScale: (scale: UpscaleFactor) => void;
  onProcess: () => void;
  isProcessing: boolean;
  progress: number;
  status: string;
  hasImages: boolean;
}

export function UpscaleSettings({ 
  scale, 
  onChangeScale, 
  onProcess, 
  isProcessing, 
  progress,
  status,
  hasImages
}: UpscaleSettingsProps) {
  
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0 rounded-t-3xl">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <MonitorUp className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-800">Upscale Settings</h2>
        </div>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        {/* Scale Factor */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" /> Scale Factor
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={isProcessing}
              onClick={() => onChangeScale(2)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                scale === 2 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <span className="font-bold text-lg">2x</span>
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Standard</span>
            </button>
            <button
              disabled={isProcessing}
              onClick={() => onChangeScale(4)}
              className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                scale === 4 
                  ? 'border-purple-500 bg-purple-50 text-purple-700' 
                  : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <span className="font-bold text-lg">4x</span>
              <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">Maximum</span>
            </button>
          </div>
          
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-3 flex items-start gap-2">
            <HardDrive className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
            <span>
              Upscaling happens locally. 4x requires significantly more device memory and time.
            </span>
          </p>
        </div>

      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 rounded-b-3xl">
        {isProcessing ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-blue-700 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> {status}
              </span>
              <span className="font-bold text-blue-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" indicatorClassName="bg-blue-600" />
            <p className="text-xs text-slate-500 text-center animate-pulse">
              Please don't close this tab
            </p>
          </div>
        ) : (
          <Button 
            onClick={onProcess}
            disabled={!hasImages}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-blue-500/20 py-6"
          >
            <Zap className="w-5 h-5 mr-2" />
            <span className="text-base">Upscale Images</span>
            <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        )}
      </div>
    </div>
  );
}
