"use client";

import React, { useRef } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { AudioTrimmer } from "@/components/tool/AudioTrimmer";
import { Button } from "@/components/ui/button";
import { Loader2, Music, AlertTriangle, ArrowRight, AudioLines, Download, Scissors } from "lucide-react";
import { useAudioTrim } from "@/hooks/useAudioTrim";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";

export default function TrimAudioPage() {
  const {
    fileInfo,
    audioUrl,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processTrim
  } = useAudioTrim();

  const { handleDownload } = useDownload();
  const trimRangeRef = useRef<[number, number]>([0, 0]);

  const handleStartTrim = () => {
    processTrim(trimRangeRef.current[0], trimRangeRef.current[1]);
  };

  const handleTrimChange = (start: number, end: number) => {
    trimRangeRef.current = [start, end];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const faqs = [
    {
      question: "Is there a file size limit?",
      answer: "Yes, you can trim audio files up to 200MB. Processing happens entirely locally in your browser using WebAssembly, meaning zero upload time and zero server wait time.",
    },
    {
      question: "Will I lose audio quality when I trim?",
      answer: "No. Our trimmer uses an advanced 'stream copy' technique by default. This means it just cuts the file at your exact timestamps without re-encoding the audio, perfectly preserving 100% of the original quality.",
    },
    {
      question: "Are my audio files secure?",
      answer: "Absolutely. We use local browser processing (WASM). Your audio files never leave your computer, ensuring absolute privacy.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <ToolHeader 
          title="Trim Audio File"
          subtitle="Cut out unwanted parts of your audio files with our precision visual trimmer."
          icon={<Scissors className="w-6 h-6 text-emerald-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="MP3, WAV, AAC, FLAC, M4A, OGG, AIFF, WMA"
            accept="audio/*"
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
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Trimming Audio</h3>
                   <p className="text-sm font-medium text-emerald-600 animate-pulse">{statusMessage || "Processing..."}</p>
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
                    <span>{formatDuration(fileInfo.duration)}</span>
                 </div>
               </div>
            </div>

            {audioUrl && fileInfo.duration && (
              <AudioTrimmer 
                audioUrl={audioUrl} 
                duration={fileInfo.duration} 
                onTrim={handleTrimChange}
                disabled={isProcessing}
              />
            )}

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
                    onClick={handleStartTrim}
                    disabled={isProcessing || !fileInfo.duration}
                  >
                    Trim Audio <ArrowRight className="w-5 h-5 ml-2" />
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
              <Scissors className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Audio Trimmed Successfully</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Your audio has been cut to the exact specified timestamps!
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left bg-white p-4 rounded-xl border border-emerald-100">
               <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Original Size</p>
                  <p className="text-lg font-medium text-slate-700 truncate">{formatFileSize(result.originalSize)}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Trimmed Size</p>
                  <p className="text-lg font-bold text-emerald-600 truncate">{formatFileSize(result.processedSize)}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Trim Another</Button>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                <Download className="w-4 h-4 mr-2" /> Download File
              </Button>
            </div>
          </div>
        )}
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our Audio Trimmer"
        content={
          <>
            <p>
              To provide blazing-fast trimming for files up to 200MB, we use <strong>FFmpeg WebAssembly</strong>. Instead of uploading your massive audio files to a remote server, our tool processes the audio directly inside your browser.
            </p>
            <p>
              This means your audio files are processed locally using your device's CPU. Not only does this guarantee 100% privacy, but it also allows you to trim instantly without waiting for slow internet uploads or downloads.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
