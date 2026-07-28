import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Scissors, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AudioTrimmerProps {
  audioUrl: string;
  duration: number;
  onTrim: (startTime: number, endTime: number) => void;
  disabled?: boolean;
}

export function AudioTrimmer({ audioUrl, duration, onTrim, disabled }: AudioTrimmerProps) {
  const [range, setRange] = useState([0, duration]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [waveform, setWaveform] = useState<number[]>([]);

  useEffect(() => {
    // Generate simple waveform data using AudioContext
    const generateWaveform = async () => {
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        
        // Use an OfflineAudioContext for faster decoding, or just AudioContext
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const channelData = audioBuffer.getChannelData(0); // Use first channel
        const step = Math.ceil(channelData.length / 100); // Create 100 buckets
        
        const newWaveform = [];
        for (let i = 0; i < 100; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) {
            const index = i * step + j;
            if (index < channelData.length) {
              sum += Math.abs(channelData[index]);
            }
          }
          newWaveform.push(sum / step);
        }
        
        // Normalize
        const max = Math.max(...newWaveform);
        setWaveform(newWaveform.map(n => n / max));
      } catch (e) {
        console.error("Failed to generate waveform", e);
        // Fallback dummy waveform if decoding fails
        setWaveform(Array.from({length: 100}, () => Math.random() * 0.5 + 0.2));
      }
    };
    
    generateWaveform();
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      // Stop playing if it reaches the end of the selected range
      if (audio.currentTime >= range[1] && isPlaying) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = range[0];
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [range, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // Ensure we start from the beginning of the range if we are outside of it
      if (audio.currentTime < range[0] || audio.currentTime >= range[1]) {
        audio.currentTime = range[0];
      }
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRangeChange = (value: number[]) => {
    setRange(value);
    onTrim(value[0], value[1]);
    if (audioRef.current && !isPlaying) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleManualTimeChange = (index: 0 | 1, val: string) => {
    // Basic parser for manual inputs: assuming seconds or mm:ss
    const parts = val.split(':');
    let secs = 0;
    if (parts.length === 2) {
      secs = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    } else {
      secs = parseFloat(val);
    }
    
    if (isNaN(secs)) return;
    
    secs = Math.max(0, Math.min(secs, duration));
    
    const newRange = [...range];
    newRange[index] = secs;
    
    // Ensure start < end
    if (index === 0 && newRange[0] >= newRange[1]) {
      newRange[0] = newRange[1] - 1;
    }
    if (index === 1 && newRange[1] <= newRange[0]) {
      newRange[1] = newRange[0] + 1;
    }
    
    handleRangeChange(newRange);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <Scissors className="w-5 h-5 text-emerald-500" />
          Trim Region
        </div>
        <div className="text-sm font-medium text-slate-500">
          Duration: {formatTime(range[1] - range[0])}
        </div>
      </div>

      <div className="p-6">
        {/* Waveform Visualization */}
        <div className="relative h-24 mb-6 rounded-lg bg-slate-50 overflow-hidden">
           {/* Render waveform bars */}
           <div className="absolute inset-0 flex items-center justify-between px-2 gap-[1px]">
             {waveform.map((val, i) => (
               <div 
                  key={i} 
                  className={`w-full bg-emerald-300 rounded-full transition-opacity duration-300`}
                  style={{ 
                    height: `${Math.max(4, val * 100)}%`,
                    opacity: (i / 100) * duration >= range[0] && (i / 100) * duration <= range[1] ? 1 : 0.3 
                  }} 
               />
             ))}
           </div>
           
           {/* Current Time Indicator */}
           <div 
             className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 transition-all duration-75"
             style={{ left: `${(currentTime / duration) * 100}%` }}
           >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500" />
           </div>
        </div>

        <Slider
          defaultValue={[0, duration]}
          value={range}
          max={duration}
          step={0.01}
          minStepsBetweenThumbs={0.1}
          onValueChange={handleRangeChange}
          className="mb-8"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
             <Button 
               variant="outline" 
               size="icon" 
               className="w-12 h-12 rounded-full bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 flex-shrink-0"
               onClick={togglePlay}
             >
               {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
             </Button>
             
             <div className="flex flex-col">
               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Preview</span>
               <span className="text-sm font-medium text-slate-700 font-mono">
                 {formatTime(currentTime)} / {formatTime(duration)}
               </span>
             </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="space-y-1.5 flex-1 sm:w-28">
               <Label className="text-xs font-semibold text-slate-500">Start Time</Label>
               <Input 
                 value={formatTime(range[0])} 
                 onChange={(e) => handleManualTimeChange(0, e.target.value)}
                 className="font-mono text-sm h-9 bg-slate-50"
               />
             </div>
             <div className="space-y-1.5 flex-1 sm:w-28">
               <Label className="text-xs font-semibold text-slate-500">End Time</Label>
               <Input 
                 value={formatTime(range[1])} 
                 onChange={(e) => handleManualTimeChange(1, e.target.value)}
                 className="font-mono text-sm h-9 bg-slate-50"
               />
             </div>
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for preview */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="auto" />}
    </div>
  );
}
