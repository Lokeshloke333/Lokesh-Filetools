import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Zap, Volume2 } from "lucide-react";

export type AudioOptions = {
  format: "mp3" | "wav" | "aac" | "m4a" | "flac" | "ogg" | "aiff";
  bitrate: "auto" | "128k" | "192k" | "256k" | "320k";
  sampleRate: "auto" | "44100" | "48000" | "96000";
  channels: "auto" | "1" | "2";
};

interface AudioOptionsPanelProps {
  options: AudioOptions;
  onChange: (options: AudioOptions) => void;
  originalFormat?: string;
}

export function AudioOptionsPanel({ options, onChange, originalFormat }: AudioOptionsPanelProps) {
  
  const updateOption = <K extends keyof AudioOptions>(key: K, value: AudioOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const isLossless = ["wav", "flac", "aiff"].includes(options.format);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Settings2 className="w-5 h-5 text-emerald-500" />
          Conversion Settings
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Output Format */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            Output Format
          </Label>
          <Select value={options.format} onValueChange={(v) => updateOption("format", v as any)}>
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3 (Standard Audio)</SelectItem>
              <SelectItem value="wav">WAV (Lossless Uncompressed)</SelectItem>
              <SelectItem value="aac">AAC (Advanced Audio Coding)</SelectItem>
              <SelectItem value="m4a">M4A (Apple Audio)</SelectItem>
              <SelectItem value="flac">FLAC (Free Lossless)</SelectItem>
              <SelectItem value="ogg">OGG (Vorbis)</SelectItem>
              <SelectItem value="aiff">AIFF (Audio Interchange)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bitrate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Audio Bitrate
          </Label>
          <Select 
            value={options.bitrate} 
            onValueChange={(v) => updateOption("bitrate", v as any)}
            disabled={isLossless}
          >
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
              <SelectValue placeholder="Select bitrate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Keep Original (Auto)</SelectItem>
              <SelectItem value="128k">128 kbps (Standard Quality)</SelectItem>
              <SelectItem value="192k">192 kbps (High Quality)</SelectItem>
              <SelectItem value="256k">256 kbps (Very High Quality)</SelectItem>
              <SelectItem value="320k">320 kbps (Maximum Quality)</SelectItem>
            </SelectContent>
          </Select>
          {isLossless && (
            <p className="text-xs text-slate-500">Bitrate is determined automatically for lossless formats.</p>
          )}
        </div>

        {/* Sample Rate */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-blue-500" />
            Sample Rate
          </Label>
          <Select value={options.sampleRate} onValueChange={(v) => updateOption("sampleRate", v as any)}>
            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-emerald-500">
              <SelectValue placeholder="Select sample rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Keep Original</SelectItem>
              <SelectItem value="44100">44100 Hz (CD Quality)</SelectItem>
              <SelectItem value="48000">48000 Hz (DVD Quality)</SelectItem>
              <SelectItem value="96000">96000 Hz (Studio Quality)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">
            Channels
          </Label>
          <Select value={options.channels} onValueChange={(v) => updateOption("channels", v as any)}>
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
    </div>
  );
}
