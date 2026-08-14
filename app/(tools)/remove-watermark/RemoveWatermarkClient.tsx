"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Wand2, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { InteractiveWatermarkEditor, Region } from "@/components/tool/media/InteractiveWatermarkEditor";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function RemoveWatermarkClient() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll: clearProcessor,
    processingState,
    result,
    uploadError,
    clearUploadError,
    processMedia
  } = useMediaProcessor();

  const { handleDownload } = useDownload();

  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  // When file changes, reset
  useEffect(() => {
    if (fileInfo?.file) {
      getBasicMediaMetadata(fileInfo.file).then((data) => {
        setMetadata(data);
      });
      if (!fileInfo.file.hasOwnProperty('preview')) {
        const previewUrl = URL.createObjectURL(fileInfo.file);
        Object.assign(fileInfo.file, { preview: previewUrl });
      }
    } else {
      setMetadata(null);
      setRegions([]);
    }
    
    return () => {
      if (fileInfo?.file && (fileInfo.file as any).preview) {
        URL.revokeObjectURL((fileInfo.file as any).preview);
      }
    };
  }, [fileInfo]);

  const clearAll = () => {
    if (fileInfo?.file && (fileInfo.file as any).preview) {
      URL.revokeObjectURL((fileInfo.file as any).preview);
    }
    setRegions([]);
    clearProcessor();
  };

  const onFileSelectWrapper = (file: File) => {
    handleFileSelect(file, {
      maxSizeMB: 1000,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', 'video/']
    });
  };

  const handleStartRemoval = () => {
    if (regions.length === 0 || !metadata || !metadata.width || !metadata.height) {
      return;
    }

    const commandArgs: string[] = [];

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

    // Build FFmpeg delogo filter chain
    // delogo expects exact pixel coordinates.
    // Our regions are percentages [0-100].
    const filters = regions.map(r => {
      // Convert % to pixels
      const pxX = Math.round((r.x / 100) * metadata.width!);
      const pxY = Math.round((r.y / 100) * metadata.height!);
      const pxW = Math.round((r.width / 100) * metadata.width!);
      const pxH = Math.round((r.height / 100) * metadata.height!);

      // Safe constraints to ensure we don't exceed video boundaries
      const safeX = Math.max(0, pxX);
      const safeY = Math.max(0, pxY);
      const safeW = Math.min(pxW, metadata.width! - safeX);
      const safeH = Math.min(pxH, metadata.height! - safeY);

      return `delogo=x=${safeX}:y=${safeY}:w=${safeW}:h=${safeH}`;
    });

    commandArgs.push('-vf', filters.join(','));
    commandArgs.push('-c:a', 'copy');

    // Fast encode settings suitable for browser
    if (outputExt === 'mp4' || outputExt === 'mov' || outputExt === 'mkv') {
       commandArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28');
    } else if (outputExt === 'webm') {
       commandArgs.push('-c:v', 'libvpx-vp9', '-row-mt', '1', '-deadline', 'realtime', '-cpu-used', '8', '-crf', '30', '-b:v', '0');
    }

    processMedia(commandArgs, outputExt, mimeType, "clean_video");
  };

  const faqs = [
    {
      question: "How does the watermark removal work?",
      answer: "We use FFmpeg's advanced spatial interpolation algorithm. It mathematically analyzes the pixels bordering your selection and smoothly interpolates them inwards to reconstruct what the background should look like.",
    },
    {
      question: "Are my videos uploaded anywhere?",
      answer: "No. Your video is processed entirely within your browser utilizing WebAssembly. It never leaves your computer, ensuring maximum privacy and zero upload times.",
    },
    {
      question: "Can I remove multiple logos at once?",
      answer: "Yes! Simply click 'Add Area' multiple times to draw several boxes over all the watermarks you wish to remove.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Remove Video Watermark"
          subtitle="Professionally remove unwanted logos, text, and watermarks from videos using spatial interpolation."
          icon={<Wand2 className="w-6 h-6 text-purple-500" />}
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

            <div className="mb-8 hidden md:block">
               <MediaMetadataCard file={fileInfo.file} metadata={metadata} />
            </div>

            <InteractiveWatermarkEditor
              file={fileInfo.file as any}
              regions={regions}
              onChange={setRegions}
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
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all"
                    onClick={handleStartRemoval}
                    disabled={processingState.isProcessing || regions.length === 0}
                  >
                    Remove Watermark <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Remove Another Watermark"
             downloadButtonText="Download Clean Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How It Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Upload", desc: "Drag and drop your video" },
              { step: 2, title: "Add Area", desc: "Click 'Add Area' and draw a box over the logo" },
              { step: 3, title: "Process", desc: "We use interpolation to reconstruct the background" },
              { step: 4, title: "Download", desc: "Save your watermark-free video" }
            ].map(s => (
               <div key={s.step} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                     {s.step}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-500">{s.desc}</p>
               </div>
            ))}
         </div>
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our Removal Engine"
        content={
          <>
            <p>
              To provide a professional experience similar to a desktop video editor, we built a custom multi-region selection workspace.
            </p>
            <p>
              During export, we leverage <strong>FFmpeg WebAssembly</strong> and the <code>delogo</code> interpolation algorithm. This algorithm examines the pixels bordering your selection and mathematically blends them inwards to seamlessly fill the missing area, allowing for highly realistic logo removal—all done locally in your browser for maximum privacy.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
