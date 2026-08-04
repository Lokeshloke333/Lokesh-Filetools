"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { FAQSection } from "@/components/tool/FAQSection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Video, ArrowRight, AlertTriangle, Download, RotateCcw, Zap, Settings2, Scissors, Info } from "lucide-react";
import { useFFmpeg } from "@/hooks/useFFmpeg";
import { useDownload } from "@/hooks/useDownload";
import { getBasicMediaMetadata, MediaMetadata, formatDuration } from "@/lib/utils/media";
import { formatFileSize } from "@/lib/utils/image";
import { fetchFile } from "@ffmpeg/util";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";

export interface VideoToGifClientProps {
  initialFromFormat?: string;
  title?: string;
  subtitle?: string;
  faqs?: { question: string; answer: string }[];
}

export default function VideoToGifClient({
  initialFromFormat,
  title = "Video to GIF Converter",
  subtitle = "Convert videos to animated GIFs online for free. Fast, secure, and browser-based.",
  faqs = []
}: VideoToGifClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  
  // Settings
  const [optimize, setOptimize] = useState(true);
  const [fps, setFps] = useState("15");
  const [width, setWidth] = useState("original");
  const [loop, setLoop] = useState("0"); // 0 = infinite, -1 = once
  const [quality, setQuality] = useState("balanced"); // high, balanced, smallest
  
  // Trimming
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("");
  
  // Result
  const [result, setResult] = useState<{ url: string; size: number; duration: number } | null>(null);

  const { loadFFmpeg, getFFmpeg } = useFFmpeg();
  const { handleDownload } = useDownload();
  const progressRef = useRef(0);

  useEffect(() => {
    if (file) {
      getBasicMediaMetadata(file).then((data) => {
        setMetadata(data);
        setStartTime(0);
        setEndTime(data.duration || 10);
      });
    } else {
      setMetadata(null);
    }
  }, [file]);

  const handleFileSelect = (f: File) => {
    if (!f) return;
    if (f.size > 1000 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 1GB.");
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleStartConversion = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setStage("Uploading...");
    setResult(null);

    try {
      const ffmpeg = await loadFFmpeg();
      
      // Override the standard logger for custom progress
      ffmpeg.on('log', ({ message }) => {
        console.log("[FFmpeg]", message);
        if (message.includes("frame=")) {
          const match = message.match(/time=([0-9:.]+)/);
          if (match && match[1]) {
            const timeParts = match[1].split(':');
            const h = parseFloat(timeParts[0]);
            const m = parseFloat(timeParts[1]);
            const s = parseFloat(timeParts[2]);
            const currentSeconds = (h * 3600) + (m * 60) + s;
            const totalSeconds = endTime - startTime;
            if (totalSeconds > 0) {
              // Handled by progress event mainly, fallback here if needed
            }
          }
        }
      });
      
      // better progress using ffmpeg.on('progress')
      ffmpeg.on('progress', ({ progress, time }) => {
        const totalDuration = endTime - startTime;
        if (totalDuration > 0 && time !== undefined) {
           const currentSeconds = time / 1000000;
           const passProgress = Math.min((currentSeconds / totalDuration) * 50, 50);
           const base = progressRef.current >= 50 ? 50 : 0;
           setProgress(base + passProgress);
        } else {
           const base = progressRef.current >= 50 ? 50 : 0;
           setProgress(base + (progress * 50));
        }
      });

      setStage("Reading video...");
      const inputName = `input_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const duration = endTime - startTime;
      
      // Auto optimization logic
      let finalFps = fps;
      let finalWidth = width;
      
      if (optimize) {
        if (duration > 30) finalFps = "10";
        else if (duration > 15) finalFps = "12";
        else finalFps = "15";
        
        finalWidth = "min(720,iw)";
      }

      // Build scale filter
      let scaleFilter = "";
      if (finalWidth !== "original") {
        scaleFilter = `,scale='${finalWidth}':-1:flags=lanczos`;
      }
      
      const loopFlag = loop === "0" ? "0" : "-1";
      
      // Quality mapping
      let paletteGenArgs = "stats_mode=diff";
      let paletteUseArgs = "dither=bayer:bayer_scale=5:diff_mode=rectangle";
      
      if (quality === "balanced") {
        paletteGenArgs = "max_colors=128:stats_mode=diff";
        paletteUseArgs = "dither=bayer:bayer_scale=3:diff_mode=rectangle";
      } else if (quality === "smallest") {
        paletteGenArgs = "max_colors=64:stats_mode=single";
        paletteUseArgs = "dither=none";
      }

      setStage("Generating palette...");
      setProgress(5);
      progressRef.current = 0;
      
      // Pass 1: Palettegen
      const p1Args = [
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-i', inputName,
        '-vf', `fps=${finalFps}${scaleFilter},palettegen=${paletteGenArgs}`,
        '-y', 'palette.png'
      ];
      await ffmpeg.exec(p1Args);

      setStage("Encoding GIF...");
      setProgress(50);
      progressRef.current = 50;
      
      // Pass 2: Paletteuse
      const p2Args = [
        '-ss', startTime.toString(),
        '-to', endTime.toString(),
        '-i', inputName,
        '-i', 'palette.png',
        '-filter_complex', `[0:v]fps=${finalFps}${scaleFilter}[x];[x][1:v]paletteuse=${paletteUseArgs}`,
        '-loop', loopFlag,
        '-y', 'output.gif'
      ];
      await ffmpeg.exec(p2Args);

      setStage("Finalizing...");
      setProgress(95);

      const data = await ffmpeg.readFile('output.gif');
      const blob = new Blob([data as any], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      
      setResult({
        url,
        size: blob.size,
        duration: endTime - startTime
      });
      
      setStage("Done.");
      setProgress(100);
      toast.success("GIF generated successfully!");

      // Cleanup memory
      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile('palette.png');
      await ffmpeg.deleteFile('output.gif');
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate GIF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentDuration = endTime - startTime;
  
  let estimatedSizeStr = "";
  if (file && metadata) {
    const finalFpsNum = optimize ? (currentDuration > 30 ? 10 : currentDuration > 15 ? 12 : 15) : Number(fps);
    const w = optimize ? Math.min(metadata.width || 720, 720) : (width === 'original' ? metadata.width || 720 : Number(width));
    const h = (w / (metadata.width || 1)) * (metadata.height || 1) || w;
    // Rough estimate: pixels * fps * duration * bytes_per_pixel(approx 0.5 for gif)
    const estBytes = (w * h * finalFpsNum * currentDuration * 0.5);
    estimatedSizeStr = formatFileSize(estBytes);
  }

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title={title}
          subtitle={subtitle}
          icon={<Video className="w-6 h-6 text-blue-500" />}
        />

        {!file && (
          <UploadArea
            onFileSelect={handleFileSelect}
            accept=".mp4,.mp3,.mov,.webm,.avi,video/*,audio/*"
            acceptedFormats="MP4, MP3, MOV, WEBM, AVI"
            maxSizeMB={1000}
          />
        )}

        {file && !result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <MediaProgressIndicator state={{ isProcessing, progress, stage }} />
            
            {/* Settings Panel */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-slate-800">GIF Settings</h3>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <div className="space-y-0.5">
                    <Label className="text-purple-900 font-bold">Optimize GIF Size</Label>
                    <p className="text-xs text-purple-700 leading-tight">Auto-scales resolution & FPS to prevent massive files.</p>
                  </div>
                  <Switch 
                    checked={optimize} 
                    onCheckedChange={setOptimize}
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className={`text-slate-600 ${optimize ? 'opacity-50' : ''}`}>Framerate (FPS)</Label>
                  <Select value={fps} onValueChange={setFps} disabled={optimize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 FPS (Smallest)</SelectItem>
                      <SelectItem value="12">12 FPS</SelectItem>
                      <SelectItem value="15">15 FPS (Default)</SelectItem>
                      <SelectItem value="20">20 FPS (Smooth)</SelectItem>
                      <SelectItem value="30">30 FPS (Very Large)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className={`text-slate-600 ${optimize ? 'opacity-50' : ''}`}>Maximum Width</Label>
                  <Select value={width} onValueChange={setWidth} disabled={optimize}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">Original (Not recommended)</SelectItem>
                      <SelectItem value="320">320px (Tiny)</SelectItem>
                      <SelectItem value="480">480px (Small)</SelectItem>
                      <SelectItem value="640">640px (Medium)</SelectItem>
                      <SelectItem value="720">720px (Large)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600">Quality / Colors</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (256 colors, dithered)</SelectItem>
                      <SelectItem value="balanced">Balanced (128 colors)</SelectItem>
                      <SelectItem value="smallest">Smallest File (64 colors)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-600">Loop</Label>
                  <Select value={loop} onValueChange={setLoop}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Infinite Loop</SelectItem>
                      <SelectItem value="-1">Play Once</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {estimatedSizeStr && (
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 text-sm text-slate-500">
                    <Info className="w-4 h-4" />
                    <span>Est. Size: <strong>~{estimatedSizeStr}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Trimmer & Action */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 line-clamp-1">{file.name}</h3>
                      <p className="text-sm text-slate-500">{formatFileSize(file.size)} • {metadata ? formatDuration(metadata.duration) : "Loading..."}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-slate-400" />
                    <Label className="text-slate-700">Trim Clip</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Start Time (seconds)</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        max={endTime - 1} 
                        step="0.1"
                        value={startTime} 
                        onChange={(e) => setStartTime(Number(e.target.value))}
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">End Time (seconds)</Label>
                      <Input 
                        type="number" 
                        min={startTime + 1} 
                        max={metadata?.duration || 9999} 
                        step="0.1"
                        value={endTime} 
                        onChange={(e) => setEndTime(Number(e.target.value))}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                  
                  {currentDuration > 30 ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-red-600" />
                      <p>Maximum GIF duration is 30 seconds. Please trim the clip to continue.</p>
                    </div>
                  ) : currentDuration > 15 && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-sm flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                      <p>This video is long. For smaller GIFs we recommend trimming the clip.</p>
                    </div>
                  )}
                </div>

                <Button 
                  size="lg" 
                  className={`w-full h-14 text-lg rounded-2xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed ${isProcessing ? 'hidden' : ''}`}
                  onClick={handleStartConversion}
                  disabled={currentDuration > 30 || isProcessing}
                >
                  Generate GIF <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Result Preview */}
        {result && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8 text-center max-w-2xl mx-auto w-full box-border overflow-hidden flex flex-col items-center justify-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
              <Download className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Your GIF is Ready!</h2>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 inline-block max-w-full overflow-hidden border border-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Generated GIF" className="max-h-[400px] object-contain rounded-xl mx-auto" />
            </div>

            {result.size > (file?.size || 0) && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-sm flex items-start gap-2 mb-6 text-left">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <p>GIFs are naturally larger than MP4 videos. Lower FPS or trim the clip to reduce file size.</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 font-medium">Original Size</p>
                <p className="font-bold text-slate-800">{formatFileSize(file?.size || 0)}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 font-medium">GIF Size</p>
                <p className={`font-bold ${result.size > (file?.size || 0) ? 'text-amber-600' : 'text-purple-600'}`}>
                  {formatFileSize(result.size)}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 font-medium">Space Diff</p>
                <p className={`font-bold ${result.size > (file?.size || 0) ? 'text-amber-600' : 'text-green-600'}`}>
                  {result.size > (file?.size || 0) ? '+' : '-'}{formatFileSize(Math.abs(result.size - (file?.size || 0)))}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-500 mb-1 font-medium">Duration</p>
                <p className="font-bold text-slate-800">{formatDuration(result.duration)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg rounded-2xl bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleDownload(result.url, `fileinator_${file?.name.split('.')[0] || 'video'}.gif`)}
              >
                <Download className="w-5 h-5 mr-2" /> Download GIF
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg rounded-2xl"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
              >
                <RotateCcw className="w-5 h-5 mr-2" /> Convert Another
              </Button>
            </div>
          </div>
        )}

        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}
      </div>
    </ToolLayout>
  );
}
