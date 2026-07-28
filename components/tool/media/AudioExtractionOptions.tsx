import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings, Music, Zap } from "lucide-react";

export type AudioExtractionOptions = {
  format: "mp3" | "wav" | "aac" | "flac" | "ogg";
  quality: "high" | "medium" | "small";
};

interface AudioExtractionOptionsPanelProps {
  options: AudioExtractionOptions;
  onChange: (options: AudioExtractionOptions) => void;
}

export function AudioExtractionOptionsPanel({ options, onChange }: AudioExtractionOptionsPanelProps) {
  
  const formats = [
    { id: "mp3", label: "MP3", desc: "Universal" },
    { id: "wav", label: "WAV", desc: "Lossless" },
    { id: "aac", label: "AAC", desc: "High Quality" },
    { id: "flac", label: "FLAC", desc: "Highest Quality" },
    { id: "ogg", label: "OGG", desc: "Open Source" },
  ];

  const qualities = [
    { id: "high", label: "High Quality", desc: "Best sound, larger size" },
    { id: "medium", label: "Medium", desc: "Balanced size and quality" },
    { id: "small", label: "Small Size", desc: "Lower quality, fast download" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Extraction Options</h3>
          <p className="text-sm text-slate-500 font-medium">Choose your preferred output format and quality</p>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Format Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
            <Music className="w-4 h-4 text-blue-500" />
            <Label className="text-base">Audio Format</Label>
          </div>
          <RadioGroup 
            value={options.format} 
            onValueChange={(val: any) => onChange({ ...options, format: val })}
            className="grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            {formats.map((format) => (
              <div key={format.id} className="relative">
                <RadioGroupItem
                  value={format.id}
                  id={`format-${format.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`format-${format.id}`}
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-blue-200 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 cursor-pointer transition-all"
                >
                  <span className="text-lg font-bold text-slate-800 mb-1">{format.label}</span>
                  <span className="text-xs font-medium text-slate-500">{format.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Quality Selection - Only show if not lossless */}
        {options.format !== 'wav' && options.format !== 'flac' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <Label className="text-base">Audio Quality</Label>
            </div>
            <RadioGroup 
              value={options.quality} 
              onValueChange={(val: any) => onChange({ ...options, quality: val })}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {qualities.map((q) => (
                <div key={q.id} className="relative">
                  <RadioGroupItem
                    value={q.id}
                    id={`quality-${q.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`quality-${q.id}`}
                    className="flex flex-col items-center justify-center text-center rounded-2xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 hover:border-emerald-200 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all"
                  >
                    <span className="text-base font-bold text-slate-800 mb-1">{q.label}</span>
                    <span className="text-xs font-medium text-slate-500">{q.desc}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

      </div>
    </div>
  );
}
