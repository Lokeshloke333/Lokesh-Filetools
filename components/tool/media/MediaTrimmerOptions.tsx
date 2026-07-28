import React, { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Scissors, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize } from "lucide-react";

interface MediaTrimmerOptionsProps {
  file: File;
  duration: number; // in seconds
  onRangeChange: (start: number, end: number) => void;
  mediaType?: "video" | "audio";
}

export function MediaTrimmerOptions({ file, duration, onRangeChange, mediaType = "video" }: MediaTrimmerOptionsProps) {
  const [range, setRange] = useState<[number, number]>([0, duration]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setRange([0, duration]);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, duration]);

  // Sync state to parent
  useEffect(() => {
    onRangeChange(range[0], range[1]);
  }, [range, onRangeChange]);

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      // Auto pause if reached the end of the trim range
      if (mediaRef.current.currentTime >= range[1] && isPlaying) {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        // If at the end of the range, reset to start of range
        if (mediaRef.current.currentTime >= range[1]) {
          mediaRef.current.currentTime = range[0];
        } else if (mediaRef.current.currentTime < range[0]) {
          mediaRef.current.currentTime = range[0];
        }
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSliderChange = (newValues: number[]) => {
    if (newValues.length === 2) {
      const newStart = newValues[0];
      const newEnd = newValues[1];
      
      // Prevent overlapping
      if (newStart >= newEnd) return;

      // Determine which thumb moved and seek to it
      if (newStart !== range[0] && mediaRef.current) {
        mediaRef.current.currentTime = newStart;
      } else if (newEnd !== range[1] && mediaRef.current) {
        mediaRef.current.currentTime = newEnd;
      }
      
      setRange([newStart, newEnd]);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleManualInput = (type: "start" | "end", val: string) => {
    const parts = val.split(':');
    let totalSeconds = 0;
    if (parts.length === 3) {
      totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
    } else if (parts.length === 2) {
      totalSeconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    } else {
      totalSeconds = parseFloat(parts[0]);
    }

    if (isNaN(totalSeconds)) return;

    if (type === "start") {
      if (totalSeconds >= 0 && totalSeconds < range[1]) {
        setRange([totalSeconds, range[1]]);
        if (mediaRef.current) mediaRef.current.currentTime = totalSeconds;
      }
    } else {
      if (totalSeconds <= duration && totalSeconds > range[0]) {
        setRange([range[0], totalSeconds]);
        if (mediaRef.current) mediaRef.current.currentTime = totalSeconds;
      }
    }
  };

  const applyQuickTrim = (type: "first10" | "last10" | "reset") => {
    if (type === "first10") {
      const end = Math.min(10, duration);
      setRange([0, end]);
      if (mediaRef.current) mediaRef.current.currentTime = 0;
    } else if (type === "last10") {
      const start = Math.max(0, duration - 10);
      setRange([start, duration]);
      if (mediaRef.current) mediaRef.current.currentTime = start;
    } else if (type === "reset") {
      setRange([0, duration]);
      if (mediaRef.current) mediaRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Scissors className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Trim Selection</h3>
          <p className="text-sm text-slate-500 font-medium">Select the portion you want to keep</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Preview Player */}
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center group">
          {mediaUrl && mediaType === "video" ? (
            <video 
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={mediaUrl} 
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
          ) : mediaUrl && mediaType === "audio" ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 relative">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                 <div className="w-full h-full flex items-center justify-center gap-1">
                    {Array.from({length: 40}).map((_, i) => (
                      <div key={i} className="w-1 bg-blue-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 60 + 10}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                 </div>
              </div>
              <audio 
                ref={mediaRef as React.RefObject<HTMLAudioElement>}
                src={mediaUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
            </div>
          ) : (
             <div className="text-slate-500">Loading Preview...</div>
          )}

          {/* Player Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
             <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
               {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
             </button>
             <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
               {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
             </button>
             <div className="flex-1 text-white font-mono text-sm font-medium">
               {formatTime(currentTime)} / {formatTime(duration)}
             </div>
             {mediaType === "video" && (
                <button onClick={() => {
                   if (mediaRef.current && mediaRef.current.requestFullscreen) {
                      mediaRef.current.requestFullscreen();
                   }
                }} className="text-white hover:text-blue-400 transition-colors">
                  <Maximize className="w-5 h-5" />
                </button>
             )}
          </div>
        </div>

        {/* Trimmer Slider */}
        <div className="px-2 py-4">
           <Slider
              min={0}
              max={duration}
              step={0.1}
              value={range}
              onValueChange={handleSliderChange}
              className="w-full"
           />
           <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 font-mono">
              <span>{formatTime(range[0])}</span>
              <span>{formatTime(range[1])}</span>
           </div>
        </div>

        {/* Manual Inputs & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
           
           <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                 <Label className="text-xs font-bold text-slate-500 uppercase">Start Time</Label>
                 <Input 
                   type="text" 
                   value={formatTime(range[0])} 
                   onChange={(e) => handleManualInput("start", e.target.value)}
                   className="font-mono text-sm bg-slate-50"
                 />
              </div>
              <div className="flex-1 space-y-2">
                 <Label className="text-xs font-bold text-slate-500 uppercase">End Time</Label>
                 <Input 
                   type="text" 
                   value={formatTime(range[1])} 
                   onChange={(e) => handleManualInput("end", e.target.value)}
                   className="font-mono text-sm bg-slate-50"
                 />
              </div>
           </div>

           <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => applyQuickTrim("first10")} className="text-xs">
                 First 10s
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyQuickTrim("last10")} className="text-xs">
                 Last 10s
              </Button>
              <Button variant="outline" size="sm" onClick={() => applyQuickTrim("reset")} className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">
                 <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
           </div>
           
        </div>

      </div>
    </div>
  );
}
