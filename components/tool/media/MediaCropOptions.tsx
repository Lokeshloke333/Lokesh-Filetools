"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crop, Monitor, Smartphone, Square, RefreshCcw } from "lucide-react";

interface MediaCropOptionsProps {
  onAspectRatioChange: (ratio: number | undefined) => void;
  onReset: () => void;
}

const PRESETS = [
  { label: "Free", value: undefined, icon: Crop },
  { label: "1:1", value: 1, icon: Square },
  { label: "16:9", value: 16 / 9, icon: Monitor },
  { label: "9:16", value: 9 / 16, icon: Smartphone },
  { label: "4:3", value: 4 / 3, icon: Monitor },
  { label: "3:2", value: 3 / 2, icon: Monitor },
];

export function MediaCropOptions({ onAspectRatioChange, onReset }: MediaCropOptionsProps) {
  const [activePreset, setActivePreset] = useState<number | undefined>(undefined);

  const handleSelectPreset = (value: number | undefined) => {
    setActivePreset(value);
    onAspectRatioChange(value);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full">
          <label className="block text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
            Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-3">
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const isActive = activePreset === preset.value;
              return (
                <button
                  key={preset.label}
                  onClick={() => handleSelectPreset(preset.value)}
                  className={`
                    flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-500 shadow-sm" 
                      : "bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100 hover:text-slate-900"}
                  `}
                >
                  <Icon className="w-4 h-4 mr-2 opacity-70" />
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="md:border-l md:border-slate-200 md:pl-6 w-full md:w-auto flex justify-end">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="flex items-center text-slate-600 hover:text-slate-900 h-10 px-4 rounded-xl"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reset Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
