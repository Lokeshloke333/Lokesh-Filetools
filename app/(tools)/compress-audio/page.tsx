"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { AudioCompressOptionsPanel, AudioCompressOptions } from "@/components/tool/AudioCompressOptionsPanel";
import { Button } from "@/components/ui/button";
import { Loader2, Music, AlertTriangle, ArrowRight, AudioLines, Download } from "lucide-react";
import { useAudioCompressor } from "@/hooks/useAudioCompressor";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";

export default function CompressAudioPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processCompression
  } = useAudioCompressor();

  const { handleDownload } = useDownload();

  const [options, setOptions] = useState<AudioCompressOptions>({
    mode: "balanced",
    customBitrate: "128",
    customSampleRate: "auto",
    customChannels: "auto"
  });

  const handleStartCompression = () => {
    processCompression(options);
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
      answer: "Yes, you can compress audio files up to 200MB. Processing happens entirely locally in your browser using WebAssembly, meaning zero upload time and zero server wait time.",
    },
    {
      question: "Are my audio files secure?",
      answer: "Absolutely. We use local browser processing (WASM). Your audio files never leave your computer, ensuring absolute privacy.",
    },
    {
      question: "Why did my WAV file turn into an MP3?",
      answer: "WAV is a completely uncompressed format. The only way to drastically compress a WAV file is to convert it into a lossy format like MP3. Our compressor handles this automatically for you.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <ToolHeader 
          title="Compress Audio File"
          subtitle="Reduce the file size of your MP3, WAV, and M4A files without losing quality."
          icon={<AudioLines className="w-6 h-6 text-emerald-500" />}
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
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Compressing Audio</h3>
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
                    <span>{formatDuration(fileInfo.duration)}</span>
                 </div>
               </div>
            </div>

            <AudioCompressOptionsPanel 
              options={options} 
              onChange={setOptions} 
              originalSize={fileInfo.file.size}
              duration={fileInfo.duration}
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
                    onClick={handleStartCompression}
                    disabled={isProcessing}
                  >
                    Compress Audio <ArrowRight className="w-5 h-5 ml-2" />
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
          <MediaResultCard
            result={{
              ...result,
              originalFormat: fileInfo?.file.name.split('.').pop()?.toUpperCase() || result.format.toUpperCase(),
              newFormat: result.format.toUpperCase(),
            }}
            onDownload={() => handleDownload(result.url, result.filename)}
            onReset={clearAll}
            resetButtonText="Compress Another"
            downloadButtonText="Download Compressed Audio"
            mediaType="audio"
          />
        )}
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our Audio Compressor"
        content={
          <>
            <p>
              To provide blazing-fast compressions for files up to 200MB, we use <strong>FFmpeg WebAssembly</strong>. Instead of uploading your massive audio files to a remote server, our tool compresses the audio directly inside your browser.
            </p>
            <p>
              This means your audio files are processed locally using your device's CPU. Not only does this guarantee 100% privacy, but it also allows you to adjust compression rates on-the-fly without waiting for slow internet uploads.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
