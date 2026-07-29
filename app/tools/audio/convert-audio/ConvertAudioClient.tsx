"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { AudioOptionsPanel, AudioOptions } from "@/components/tool/AudioOptionsPanel";
import { Button } from "@/components/ui/button";
import { Loader2, Music, AlertTriangle, ArrowRight, AudioWaveform } from "lucide-react";
import { useAudioConverter } from "@/hooks/useAudioConverter";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";

export interface ConvertAudioClientProps {
  initialFromFormat?: string;
  initialToFormat?: string;
  title?: string;
  subtitle?: string;
  aboutTitle?: string;
  aboutContent?: React.ReactNode;
  supported?: boolean;
}

export default function ConvertAudioClient({
  initialFromFormat,
  initialToFormat,
  title = "Universal Audio Converter",
  subtitle = "Convert audio files between MP3, WAV, FLAC and more without losing quality.",
  aboutTitle,
  aboutContent,
  supported = true,
}: ConvertAudioClientProps = {}) {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processConversion
  } = useAudioConverter();

  const { handleDownload } = useDownload();

  const [options, setOptions] = useState<AudioOptions>({
    format: (initialToFormat?.toLowerCase() as any) || "mp3",
    bitrate: "auto",
    sampleRate: "auto",
    channels: "auto"
  });

  // Attempt to read basic audio metadata (duration) using native browser API
  const [durationStr, setDurationStr] = useState<string>("Unknown");

  useEffect(() => {
    if (fileInfo?.file) {
      const audioUrl = URL.createObjectURL(fileInfo.file);
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => {
        const mins = Math.floor(audio.duration / 60);
        const secs = Math.floor(audio.duration % 60);
        setDurationStr(`${mins}:${secs.toString().padStart(2, '0')}`);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setDurationStr("Unknown");
        URL.revokeObjectURL(audioUrl);
      };
    } else {
      setDurationStr("Unknown");
    }
  }, [fileInfo]);

  const handleStartConversion = () => {
    processConversion(options);
  };

  const faqs = [
    {
      question: "Is there a file size limit?",
      answer: "Yes, you can convert audio files up to 200MB. Since processing happens entirely locally in your browser using WebAssembly, you don't have to wait for large files to upload to a server.",
    },
    {
      question: "Are my audio files secure?",
      answer: "Absolutely. We use local browser processing (WASM). Your audio files never leave your computer, ensuring absolute privacy.",
    },
    {
      question: "Which formats support metadata preservation?",
      answer: "Most popular formats like MP3, M4A, OGG, and FLAC will preserve basic metadata (like Title, Artist, and Album art) during conversion.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <ToolHeader 
          title={title}
          subtitle={subtitle}
          icon={<AudioWaveform className="w-6 h-6 text-emerald-500" />}
        />

        {supported === false && !result && !fileInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center max-w-2xl mx-auto">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-900 mb-3">
              {title} is coming soon.
            </h3>
            <p className="text-amber-800 mb-8 leading-relaxed">
              This conversion page is ready, but <strong>{initialToFormat}</strong> export is currently under development.
              Meanwhile, you can convert {initialFromFormat} to other supported formats like MP3 and WAV using our universal Audio Converter.
            </p>
            <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 py-2.5 h-auto font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <Link href="/tools/audio/convert-audio">
                Open Audio Converter
              </Link>
            </Button>
          </div>
        )}
        
        {supported !== false && !result && !fileInfo && (
          <UploadArea 
            acceptedFormats={initialFromFormat ? initialFromFormat.toUpperCase() : "MP3, WAV, AAC, FLAC, M4A, OGG, AIFF, WMA"}
            accept={initialFromFormat ? `.${initialFromFormat.toLowerCase()},audio/${initialFromFormat.toLowerCase()}` : "audio/*"}
            maxSizeMB={200}
            onFileSelect={handleFileSelect}
            multiple={false}
            error={uploadError}
            onErrorClear={clearUploadError}
          />
        )}

        {!result && fileInfo && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {isProcessing && (
              <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                 <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center min-w-[300px]">
                   <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-6" />
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Audio</h3>
                   <p className="text-sm font-medium text-emerald-600 animate-pulse">{statusMessage || "Analyzing..."}</p>
                 </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8">
               <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                 <Music className="w-8 h-8 text-emerald-500" />
               </div>
               <div className="flex-1 text-center sm:text-left min-w-0">
                 <h3 className="text-lg font-bold text-slate-800 truncate mb-1">{fileInfo.file.name}</h3>
                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
                    <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">{fileInfo.file.type || 'audio/unknown'}</span>
                    <span>•</span>
                    <span>{formatFileSize(fileInfo.file.size)}</span>
                    <span>•</span>
                    <span>{durationStr}</span>
                 </div>
               </div>
            </div>

            <AudioOptionsPanel 
              options={options} 
              onChange={setOptions} 
              originalFormat={fileInfo.file.name.split('.').pop()}
            />

            {uploadError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mt-6">
                    <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{uploadError}</p>
                </div>
            ) : (
                <div className="mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all"
                    onClick={handleStartConversion}
                    disabled={isProcessing}
                  >
                    Convert to {options.format.toUpperCase()} <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
            )}
            
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" onClick={clearAll} disabled={isProcessing} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                  Cancel & Remove File
               </Button>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AudioWaveform className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Audio Converted Successfully</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Your audio has been successfully converted from <span className="font-bold">{result.originalFormat}</span> to <span className="font-bold">{result.newFormat}</span>.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left bg-white p-4 rounded-xl border border-emerald-100">
               <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Original</p>
                  <p className="text-sm font-medium text-slate-700 truncate">{fileInfo?.file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(result.originalSize)}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Converted</p>
                  <p className="text-sm font-medium text-slate-700 truncate">{result.filename}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(result.processedSize)}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Convert Another File</Button>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                Download Audio
              </Button>
            </div>
          </div>
        )}
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      {aboutTitle && aboutContent ? (
          <AboutTool title={aboutTitle} content={aboutContent} />
        ) : (
          <AboutTool 
            title="About our Audio Conversion Engine"
            content={
              <>
                <p>
                  To provide incredibly flexible audio processing, we utilize <strong>FFmpeg WebAssembly</strong>. Instead of uploading your audio files to a cloud server, our tool downloads a lightweight conversion engine directly into your browser.
                </p>
                <p>
                  This means your media is processed locally using your device's CPU. Not only does this guarantee absolute privacy since the files never leave your machine, but it also avoids slow internet upload speeds and limitations.
                </p>
              </>
            }
          />
        )}
    </ToolLayout>
  );
}
