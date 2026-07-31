"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Scissors, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { MediaTrimmerOptions } from "@/components/tool/media/MediaTrimmerOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function TrimVideoClient() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    processingState,
    result,
    uploadError,
    clearUploadError,
    processMedia
  } = useMediaProcessor();

  const { handleDownload } = useDownload();

  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (fileInfo?.file) {
      getBasicMediaMetadata(fileInfo.file).then((data) => {
        setMetadata(data);
        if (data.duration) {
          setTrimRange([0, data.duration]);
        }
      });
    } else {
      setMetadata(null);
      setTrimRange([0, 0]);
    }
  }, [fileInfo]);

  const onFileSelectWrapper = (file: File) => {
    handleFileSelect(file, {
      maxSizeMB: 1000,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', 'video/']
    });
  };

  const handleStartTrim = () => {
    if (trimRange[1] <= trimRange[0]) {
      // Invalid range
      return;
    }

    const commandArgs: string[] = [];

    // Force MP4 output container for best compatibility unless it was WEBM/MKV
    let outputExt = 'mp4';
    let mimeType = 'video/mp4';
    if (fileInfo?.file.name.toLowerCase().endsWith('.webm')) {
      outputExt = 'webm';
      mimeType = 'video/webm';
    } else if (fileInfo?.file.name.toLowerCase().endsWith('.mkv')) {
      outputExt = 'mkv';
      mimeType = 'video/x-matroska';
    } else if (fileInfo?.file.name.toLowerCase().endsWith('.mov')) {
      outputExt = 'mov';
      mimeType = 'video/quicktime';
    }

    // FFmpeg Fast Trimming
    // -ss (start time), -to (end time), -c copy (stream copy, no re-encoding)
    // Note: -ss before -i is faster for large files, but for exact cutting we can pass it after, or use both for fast+accurate.
    // However, since we are doing stream copy (-c copy), accuracy is tied to keyframes anyway.
    
    // We will place -ss BEFORE -i in useMediaProcessor implicitly? No, useMediaProcessor just does:
    // ffmpeg.exec(['-i', inputName, ...commandArgs, outputName]);
    // So if we need -ss before -i, we can't do it with our current hook if it auto-prepends -i.
    // Wait, useMediaProcessor:
    // await ffmpeg.exec(['-i', inputFileName, ...commandArgs, outputFileName]);
    // It's perfectly fine to place -ss and -to AFTER -i. It will seek through the file. For browser WASM, since the file is in memory/memfs, seeking is actually very fast even if it decodes, but with `-c copy` it doesn't decode!
    
    commandArgs.push('-ss', trimRange[0].toString());
    commandArgs.push('-to', trimRange[1].toString());
    commandArgs.push('-c', 'copy');

    processMedia(commandArgs, outputExt, mimeType, "trimmed_video");
  };

  const faqs = [
    {
      question: "Will trimming reduce my video quality?",
      answer: "No! Fileinator uses 'Stream Copy' technology whenever possible. This means we cut the video without re-encoding it, preserving 100% of the original quality.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All trimming is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    },
    {
      question: "Why is the trimmed duration slightly different than my selection?",
      answer: "To process instantly without re-encoding, we cut at the nearest 'Keyframe'. This might shift the cut by a fraction of a second but saves you minutes of waiting.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Video Trimmer"
          subtitle="Cut, trim, and extract the best moments from your videos instantly. 100% secure local browser processing."
          icon={<Scissors className="w-6 h-6 text-blue-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="MP4, MOV, AVI, MKV, WEBM"
            accept="video/*"
            maxSizeMB={1000}
            onFileSelect={onFileSelectWrapper}
            multiple={false}
            error={uploadError}
            onErrorClear={clearUploadError}
          />
        )}

        {!result && fileInfo && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            <MediaProgressIndicator state={processingState} />

            <div className="mb-8">
               <MediaMetadataCard file={fileInfo.file} metadata={metadata} />
            </div>

            {metadata?.duration ? (
               <MediaTrimmerOptions 
                  file={fileInfo.file}
                  duration={metadata.duration}
                  onRangeChange={(start, end) => setTrimRange([start, end])}
                  mediaType="video"
               />
            ) : (
               <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-2xl text-slate-500">
                  Analyzing video duration...
               </div>
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
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                    onClick={handleStartTrim}
                    disabled={processingState.isProcessing || !metadata?.duration || trimRange[1] <= trimRange[0]}
                  >
                    Trim Video <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
            )}
            
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" onClick={clearAll} disabled={processingState.isProcessing} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                  Cancel & Remove File
               </Button>
            </div>
          </div>
        )}

        {result && (
          <MediaResultCard 
             result={result} 
             onDownload={() => handleDownload(result.url, result.filename)} 
             onReset={clearAll} 
             resetButtonText="Trim Another Video"
             downloadButtonText="Download Trimmed Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How Video Trimming Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Video", desc: "Drag and drop your file" },
              { step: 2, title: "Set Range", desc: "Use the slider to pick a scene" },
              { step: 3, title: "Instant Trim", desc: "We copy streams without re-encoding" },
              { step: 4, title: "Download", desc: "Save your perfect clip" }
            ].map(s => (
               <div key={s.step} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                     {s.step}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-500">{s.desc}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Why use Fileinator?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Browser Based", desc: "Trims videos directly using your device hardware." },
             { title: "Secure & Private", desc: "Your video files never leave your device. 100% private." },
             { title: "Instant Processing", desc: "We use stream copying to cut videos in seconds, not minutes." },
             { title: "No File Uploads", desc: "Because we process locally, you save bandwidth and time." },
             { title: "Interactive Slider", desc: "Preview your cuts perfectly with our interactive HTML5 player." },
             { title: "Free Forever", desc: "No watermarks, no hidden fees, and no account required." }
           ].map((f, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                 {f.title}
               </h4>
               <p className="text-sm text-slate-600">{f.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our Trimming Engine"
        content={
          <>
            <p>
              To provide incredibly fast video trimming, we utilize <strong>FFmpeg WebAssembly</strong> in a mode called <em>Stream Copying</em>.
            </p>
            <p>
              Traditional video editors re-encode the entire video when you trim it, which can take a long time and reduce visual quality. Our engine simply copies the data between your chosen start and end points directly into a new file container. This makes the trimming process virtually instantaneous and 100% lossless!
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
