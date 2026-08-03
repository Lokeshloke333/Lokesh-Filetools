"use client";

import React from "react";
import { EnhancerSettings, DEFAULT_ENHANCER_SETTINGS } from "./types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sparkles, Sun, Contrast, Droplets, Droplet, Layers, Wand2 } from "lucide-react";

interface SettingsPanelProps {
  settings: EnhancerSettings;
  onChange: (settings: EnhancerSettings) => void;
  onAutoEnhance: () => void;
  onApplyToAll: () => void;
  isBatch: boolean;
}

export function SettingsPanel({ settings, onChange, onAutoEnhance, onApplyToAll, isBatch }: SettingsPanelProps) {
  
  const updateSetting = <K extends keyof EnhancerSettings>(key: K, value: EnhancerSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const resetSettings = () => {
    onChange(DEFAULT_ENHANCER_SETTINGS);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full max-h-[calc(100vh-200px)]">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-slate-800">Enhancements</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={resetSettings} className="text-slate-500 hover:text-slate-700">
            Reset
          </Button>
        </div>
        
        <Button 
          onClick={onAutoEnhance}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-md shadow-purple-500/20"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          Auto Enhance
        </Button>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        {/* Basic Adjustments */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Basic</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" /> Brightness
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.brightness}%</span>
            </div>
            <Slider
              value={[settings.brightness]}
              min={0}
              max={200}
              step={1}
              onValueChange={([val]) => updateSetting("brightness", val)}
              className="py-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Contrast className="w-4 h-4 text-slate-600" /> Contrast
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.contrast}%</span>
            </div>
            <Slider
              value={[settings.contrast]}
              min={0}
              max={200}
              step={1}
              onValueChange={([val]) => updateSetting("contrast", val)}
              className="py-1"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Color Adjustments */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Color</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500" /> Saturation
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.saturation}%</span>
            </div>
            <Slider
              value={[settings.saturation]}
              min={0}
              max={200}
              step={1}
              onValueChange={([val]) => updateSetting("saturation", val)}
              className="py-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-pink-500" /> Vibrance
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.vibrance}</span>
            </div>
            <Slider
              value={[settings.vibrance]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => updateSetting("vibrance", val)}
              className="py-1"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        {/* Detail Adjustments */}
        <div className="space-y-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" /> Sharpen
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.sharpen}</span>
            </div>
            <Slider
              value={[settings.sharpen]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => updateSetting("sharpen", val)}
              className="py-1"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400" /> Denoise
              </Label>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.denoise}</span>
            </div>
            <Slider
              value={[settings.denoise]}
              min={0}
              max={100}
              step={1}
              onValueChange={([val]) => updateSetting("denoise", val)}
              className="py-1"
            />
          </div>
        </div>

      </div>

      {isBatch && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 rounded-b-3xl">
          <Button 
            onClick={onApplyToAll}
            variant="outline"
            className="w-full text-slate-700 bg-white"
          >
            Apply to All Images
          </Button>
        </div>
      )}
    </div>
  );
}
