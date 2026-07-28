import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Film, Zap, MonitorPlay, Activity, VolumeX } from "lucide-react";

export type VideoConversionOptions = {
  format: "mp4" | "mov" | "avi" | "mkv" | "webm" | "gif" | "mp3";
  videoCodec: "h264" | "h265" | "vp9" | "copy";
  audioCodec: "aac" | "mp3" | "copy";
  quality: "high" | "medium" | "low";
  resolution: "original" | "1080p" | "720p" | "480p";
  frameRate: "original" | "60" | "30" | "24";
  muteAudio: boolean;
};

interface VideoConversionOptionsPanelProps {
  options: VideoConversionOptions;
  onChange: (options: VideoConversionOptions) => void;
}

export function VideoConversionOptionsPanel({ options, onChange }: VideoConversionOptionsPanelProps) {
  const formats = [
    { id: "mp4", label: "MP4", desc: "Recommended" },
    { id: "mov", label: "MOV", desc: "Apple standard" },
    { id: "avi", label: "AVI", desc: "Legacy format" },
    { id: "mkv", label: "MKV", desc: "High quality" },
    { id: "webm", label: "WEBM", desc: "Web standard" },
    { id: "gif", label: "GIF", desc: "Short animations" },
    { id: "mp3", label: "MP3", desc: "Extract audio" },
  ];

  const qualities = [
    { id: "high", label: "High", desc: "Best quality" },
    { id: "medium", label: "Medium", desc: "Balanced" },
    { id: "low", label: "Low", desc: "Smallest size" },
  ];

  // Dynamically available video codecs based on format
  let availableVideoCodecs = [
    { id: "h264", label: "H.264 (Standard)" },
    { id: "h265", label: "H.265 (HEVC)" },
    { id: "copy", label: "Copy (No re-encoding)" }
  ];

  if (options.format === "webm") {
    availableVideoCodecs = [
      { id: "vp9", label: "VP9" },
      { id: "copy", label: "Copy (No re-encoding)" }
    ];
  } else if (options.format === "gif" || options.format === "mp3") {
    availableVideoCodecs = [];
  }

  // Ensure selected video codec is valid for format
  React.useEffect(() => {
    if (options.format === "webm" && options.videoCodec !== "vp9" && options.videoCodec !== "copy") {
      onChange({ ...options, videoCodec: "vp9" });
    } else if (options.format !== "webm" && options.format !== "gif" && options.format !== "mp3" && options.videoCodec === "vp9") {
      onChange({ ...options, videoCodec: "h264" });
    }
  }, [options.format, options.videoCodec, onChange, options]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Conversion Options</h3>
          <p className="text-sm text-slate-500 font-medium">Customize format, quality, and output settings</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Format Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
            <Film className="w-4 h-4 text-indigo-500" />
            <Label className="text-base">Output Format</Label>
          </div>
          <RadioGroup 
            value={options.format} 
            onValueChange={(val: any) => onChange({ ...options, format: val })}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3"
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
                  className="flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 hover:border-indigo-200 peer-data-[state=checked]:border-indigo-500 peer-data-[state=checked]:bg-indigo-50 cursor-pointer transition-all h-full"
                >
                  <span className="text-sm font-bold text-slate-800 mb-1 uppercase">{format.label}</span>
                  <span className="text-[10px] text-center font-medium text-slate-500">{format.desc}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {options.format !== "mp3" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Left Column: Quality & Video */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <Label className="text-base">Quality</Label>
                </div>
                <RadioGroup 
                  value={options.quality} 
                  onValueChange={(val: any) => onChange({ ...options, quality: val })}
                  className="grid grid-cols-3 gap-2"
                >
                  {qualities.map((q) => (
                    <div key={q.id} className="relative">
                      <RadioGroupItem value={q.id} id={`quality-${q.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`quality-${q.id}`}
                        className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-slate-200 bg-white p-2 hover:bg-slate-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 cursor-pointer transition-all h-full"
                      >
                        <span className="text-sm font-bold text-slate-800">{q.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {availableVideoCodecs.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-bold text-slate-700">Video Codec</Label>
                  <Select value={options.videoCodec} onValueChange={(v: any) => onChange({ ...options, videoCodec: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Select codec" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVideoCodecs.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Right Column: Resolution & Framerate */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                  <MonitorPlay className="w-4 h-4 text-blue-500" />
                  <Label className="text-base">Resolution</Label>
                </div>
                <Select value={options.resolution} onValueChange={(v: any) => onChange({ ...options, resolution: v })}>
                  <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="original">Keep Original</SelectItem>
                    <SelectItem value="1080p">1080p (FHD)</SelectItem>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="480p">480p (SD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {options.format !== "gif" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                    <Activity className="w-4 h-4 text-orange-500" />
                    <Label className="text-base">Frame Rate (FPS)</Label>
                  </div>
                  <Select value={options.frameRate} onValueChange={(v: any) => onChange({ ...options, frameRate: v })}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 h-11 rounded-xl">
                      <SelectValue placeholder="Select frame rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Keep Original</SelectItem>
                      <SelectItem value="60">60 FPS (Smooth)</SelectItem>
                      <SelectItem value="30">30 FPS (Standard)</SelectItem>
                      <SelectItem value="24">24 FPS (Cinematic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        )}

        {options.format !== "mp3" && options.format !== "gif" && (
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <VolumeX className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <Label htmlFor="mute-audio" className="font-bold text-slate-700 text-sm cursor-pointer">Mute Audio</Label>
                <p className="text-xs text-slate-500">Remove audio track from the video</p>
              </div>
            </div>
            <Switch 
              id="mute-audio"
              checked={options.muteAudio}
              onCheckedChange={(c) => onChange({ ...options, muteAudio: c })}
              className="data-[state=checked]:bg-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
