import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings2, Zap, Volume2, HardDrive, Cpu, Percent } from "lucide-react";
import { formatFileSize } from "@/lib/utils/image";

export type AudioCompressOptions = {
  mode: "low" | "balanced" | "high" | "custom";
  customBitrate: "64" | "96" | "128" | "160" | "192" | "256" | "320";
  customSampleRate: "auto" | "44100" | "48000";
  customChannels: "auto" | "1" | "2";
};

interface AudioCompressOptionsPanelProps {
  options: AudioCompressOptions;
  onChange: (options: AudioCompressOptions) => void;
  originalSize: number;
  duration?: number;
}

export function AudioCompressOptionsPanel({ options, onChange, originalSize, duration }: AudioCompressOptionsPanelProps) {
  
  const updateOption = <K extends keyof AudioCompressOptions>(key: K, value: AudioCompressOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  // Estimate output size
  let estimatedBitrateKbps = 128;
  if (options.mode === "low") estimatedBitrateKbps = 256;
  else if (options.mode === "high") estimatedBitrateKbps = 64;
  else if (options.mode === "custom") estimatedBitrateKbps = parseInt(options.customBitrate);

  let estimatedSizeBytes = 0;
  if (duration && duration > 0) {
    // (Bitrate in kbps * 1000 * duration in seconds) / 8 bits per byte
    estimatedSizeBytes = (estimatedBitrateKbps * 1000 * duration) / 8;
  } else {
    // Fallback naive estimation based on typical MP3 compression ratios if duration is unknown
    const ratioMap = { low: 0.8, balanced: 0.5, high: 0.25, custom: (estimatedBitrateKbps / 320) };
    estimatedSizeBytes = originalSize * ratioMap[options.mode];
  }

  // Ensure estimate doesn't exceed original size (in most cases)
  if (estimatedSizeBytes > originalSize) {
    estimatedSizeBytes = originalSize * 0.95; // Rough cap
  }

  const compressionPercent = Math.max(0, Math.round((1 - (estimatedSizeBytes / originalSize)) * 100));

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Settings2 className="w-5 h-5 text-emerald-500" />
          Compression Settings
        </div>
        
        <div className="flex gap-4 text-sm font-medium">
           <div className="flex items-center gap-1.5 text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              <HardDrive className="w-4 h-4 text-slate-400" />
              Est. Size: <span className="text-slate-900">{formatFileSize(estimatedSizeBytes)}</span>
           </div>
           <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 shadow-sm">
              <Percent className="w-4 h-4 text-emerald-500" />
              Save: ~{compressionPercent}%
           </div>
        </div>
      </div>

      <div className="p-6">
        <RadioGroup 
           value={options.mode} 
           onValueChange={(v) => updateOption("mode", v as any)}
           className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="mode-low" />
            <Label htmlFor="mode-low" className="flex flex-col cursor-pointer">
               <span className="font-semibold text-slate-800">Low Compression</span>
               <span className="text-sm text-slate-500 font-normal">Highest quality, minimal size reduction (256 kbps).</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="balanced" id="mode-balanced" />
            <Label htmlFor="mode-balanced" className="flex flex-col cursor-pointer">
               <span className="font-semibold text-slate-800">Balanced <span className="text-emerald-500 font-normal text-xs bg-emerald-50 px-1.5 py-0.5 rounded ml-1">Recommended</span></span>
               <span className="text-sm text-slate-500 font-normal">Standard quality, good size reduction (128 kbps).</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="mode-high" />
            <Label htmlFor="mode-high" className="flex flex-col cursor-pointer">
               <span className="font-semibold text-slate-800">High Compression</span>
               <span className="text-sm text-slate-500 font-normal">Maximum size reduction, noticeable quality loss (64 kbps).</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="mode-custom" />
            <Label htmlFor="mode-custom" className="flex flex-col cursor-pointer">
               <span className="font-semibold text-slate-800">Custom Settings</span>
               <span className="text-sm text-slate-500 font-normal">Manually configure bitrate, channels, and sample rate.</span>
            </Label>
          </div>
        </RadioGroup>

        {options.mode === "custom" && (
            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Target Bitrate
                  </Label>
                  <Select 
                    value={options.customBitrate} 
                    onValueChange={(v) => updateOption("customBitrate", v as any)}
                  >
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
                      <SelectValue placeholder="Select bitrate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="64">64 kbps (Smallest)</SelectItem>
                      <SelectItem value="96">96 kbps (Voice Quality)</SelectItem>
                      <SelectItem value="128">128 kbps (Standard Quality)</SelectItem>
                      <SelectItem value="160">160 kbps (Good Quality)</SelectItem>
                      <SelectItem value="192">192 kbps (High Quality)</SelectItem>
                      <SelectItem value="256">256 kbps (Very High Quality)</SelectItem>
                      <SelectItem value="320">320 kbps (Maximum Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-blue-500" />
                    Sample Rate
                  </Label>
                  <Select value={options.customSampleRate} onValueChange={(v) => updateOption("customSampleRate", v as any)}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
                      <SelectValue placeholder="Select sample rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Keep Original</SelectItem>
                      <SelectItem value="44100">44100 Hz (CD Quality)</SelectItem>
                      <SelectItem value="48000">48000 Hz (DVD Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-500" />
                    Channels
                  </Label>
                  <Select value={options.customChannels} onValueChange={(v) => updateOption("customChannels", v as any)}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
                      <SelectValue placeholder="Select channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Keep Original</SelectItem>
                      <SelectItem value="1">Mono (1 Channel)</SelectItem>
                      <SelectItem value="2">Stereo (2 Channels)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
