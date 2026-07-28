import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Settings, Zap, Flame, MonitorPlay, Activity, VolumeX, SlidersHorizontal, Scale } from "lucide-react";

export type CompressionPreset = "light" | "balanced" | "max";

export type VideoCompressionOptions = {
  preset: CompressionPreset;
  resolution: "original" | "1080p" | "720p" | "480p" | "360p";
  frameRate: "original" | "60" | "30" | "24";
  muteAudio: boolean;
  customCrf: string; // "auto" or numeric string
  videoBitrate: string; // "auto" or kbps
};

interface VideoCompressionOptionsPanelProps {
  options: VideoCompressionOptions;
  onChange: (options: VideoCompressionOptions) => void;
  originalSize: number;
}

export function VideoCompressionOptionsPanel({ options, onChange, originalSize }: VideoCompressionOptionsPanelProps) {
  
  const presets = [
    { 
      id: "light", 
      label: "Light", 
      desc: "Best Quality",
      icon: <Zap className="w-5 h-5 text-emerald-500 mb-2" />,
      estReduction: "~20-30%",
      color: "peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50"
    },
    { 
      id: "balanced", 
      label: "Balanced", 
      desc: "Recommended",
      icon: <Scale className="w-5 h-5 text-blue-500 mb-2" />,
      estReduction: "~40-60%",
      color: "peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
    },
    { 
      id: "max", 
      label: "Maximum", 
      desc: "Smallest Size",
      icon: <Flame className="w-5 h-5 text-orange-500 mb-2" />,
      estReduction: "~70-85%",
      color: "peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50"
    },
  ];

  // Helper to get estimated size
  const getEstimatedSize = (preset: CompressionPreset, size: number) => {
    let multiplier = 1;
    if (preset === "light") multiplier = 0.75;
    if (preset === "balanced") multiplier = 0.5;
    if (preset === "max") multiplier = 0.2;
    
    // Also factor in resolution if not original
    if (options.resolution === "1080p") multiplier *= 0.9;
    if (options.resolution === "720p") multiplier *= 0.7;
    if (options.resolution === "480p") multiplier *= 0.5;
    if (options.resolution === "360p") multiplier *= 0.35;
    
    return (size * multiplier) / (1024 * 1024);
  };

  const estSizeMB = getEstimatedSize(options.preset, originalSize).toFixed(1);
  const origSizeMB = (originalSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Compression Settings</h3>
            <p className="text-sm text-slate-500 font-medium">Choose your preferred balance of size and quality</p>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-bold text-slate-400">Estimated Size</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600">~{estSizeMB}</span>
            <span className="text-sm font-bold text-slate-500">MB</span>
          </div>
          <span className="text-xs font-medium text-slate-400 line-through">was {origSizeMB} MB</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Presets */}
        <div className="space-y-4">
          <RadioGroup 
            value={options.preset} 
            onValueChange={(val: any) => {
              onChange({ 
                ...options, 
                preset: val,
                // Reset advanced to auto when changing presets
                customCrf: "auto",
                videoBitrate: "auto"
              });
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {presets.map((p) => (
              <div key={p.id} className="relative h-full">
                <RadioGroupItem
                  value={p.id}
                  id={`preset-${p.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`preset-${p.id}`}
                  className={`flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-6 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all h-full ${p.color}`}
                >
                  {p.icon}
                  <span className="text-base font-bold text-slate-800 mb-1">{p.label}</span>
                  <span className="text-xs font-medium text-slate-500 mb-3">{p.desc}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                    {p.estReduction} Size
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Mobile Estimated Size */}
        <div className="md:hidden flex flex-col items-center justify-center p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <span className="text-sm font-bold text-slate-500 mb-1">Estimated Output Size</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-600">~{estSizeMB}</span>
            <span className="text-base font-bold text-slate-500">MB</span>
          </div>
          <span className="text-xs font-medium text-slate-400 mt-1 line-through">Original: {origSizeMB} MB</span>
        </div>

        {/* Advanced Options */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced" className="border-slate-200">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Advanced Settings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Resolution */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                    <MonitorPlay className="w-4 h-4 text-blue-500" />
                    <Label className="text-sm">Resolution</Label>
                  </div>
                  <Select value={options.resolution} onValueChange={(v: any) => onChange({ ...options, resolution: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Keep Original" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Keep Original</SelectItem>
                      <SelectItem value="1080p">1080p (FHD)</SelectItem>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="480p">480p (SD)</SelectItem>
                      <SelectItem value="360p">360p (Low Res)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Frame Rate */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <Label className="text-sm">Frame Rate (FPS)</Label>
                  </div>
                  <Select value={options.frameRate} onValueChange={(v: any) => onChange({ ...options, frameRate: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Keep Original" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Keep Original</SelectItem>
                      <SelectItem value="60">60 FPS</SelectItem>
                      <SelectItem value="30">30 FPS</SelectItem>
                      <SelectItem value="24">24 FPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom CRF */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <Label className="text-sm">Constant Rate Factor (CRF)</Label>
                  </div>
                  <Select value={options.customCrf} onValueChange={(v: any) => onChange({ ...options, customCrf: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Auto (Based on preset)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto (Based on preset)</SelectItem>
                      <SelectItem value="18">18 (Near Lossless, Large)</SelectItem>
                      <SelectItem value="23">23 (High Quality)</SelectItem>
                      <SelectItem value="28">28 (Medium Quality)</SelectItem>
                      <SelectItem value="35">35 (Low Quality, Small)</SelectItem>
                      <SelectItem value="40">40 (Very Low Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Video Bitrate */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                    <Settings className="w-4 h-4 text-purple-500" />
                    <Label className="text-sm">Max Bitrate</Label>
                  </div>
                  <Select value={options.videoBitrate} onValueChange={(v: any) => onChange({ ...options, videoBitrate: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Auto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="5000k">5000 kbps (High)</SelectItem>
                      <SelectItem value="2500k">2500 kbps (Medium)</SelectItem>
                      <SelectItem value="1000k">1000 kbps (Low)</SelectItem>
                      <SelectItem value="500k">500 kbps (Very Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* Mute Audio Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <VolumeX className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <Label htmlFor="mute-audio" className="font-bold text-slate-700 text-sm cursor-pointer">Remove Audio Track</Label>
                    <p className="text-xs text-slate-500">Muting audio can significantly reduce file size</p>
                  </div>
                </div>
                <Switch 
                  id="mute-audio"
                  checked={options.muteAudio}
                  onCheckedChange={(c) => onChange({ ...options, muteAudio: c })}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
