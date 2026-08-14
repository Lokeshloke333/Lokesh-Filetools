"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Crop, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { InteractiveVideoCropPreview } from "@/components/tool/media/InteractiveVideoCropPreview";
import { MediaCropOptions } from "@/components/tool/media/MediaCropOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function CropVideoClient() {
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
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [cropParams, setCropParams] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // When file changes, reset
  useEffect(() => {
    if (fileInfo?.file) {
      getBasicMediaMetadata(fileInfo.file).then((data) => {
        setMetadata(data);
      });
      // Attach a preview URL so InteractiveVideoCropPreview can render it
      if (!fileInfo.file.hasOwnProperty('preview')) {
        const previewUrl = URL.createObjectURL(fileInfo.file);
        Object.assign(fileInfo.file, { preview: previewUrl });
      }
    } else {
      setMetadata(null);
      setCropParams(null);
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
    setCropParams(null);
    clearProcessor();
  };

  const onFileSelectWrapper = (file: File) => {
    handleFileSelect(file, {
      maxSizeMB: 1000,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', 'video/']
    });
  };

  const handleStartCrop = () => {
    if (!cropParams || cropParams.width === 0 || cropParams.height === 0) {
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

    // FFmpeg video filter: crop=w:h:x:y
    commandArgs.push('-vf', `crop=${cropParams.width}:${cropParams.height}:${cropParams.x}:${cropParams.y}`);
    
    // Attempt to copy audio to save time and preserve audio quality
    commandArgs.push('-c:a', 'copy');

    // Video codec options
    if (outputExt === 'mp4' || outputExt === 'mov' || outputExt === 'mkv') {
       commandArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28');
    } else if (outputExt === 'webm') {
       commandArgs.push('-c:v', 'libvpx-vp9', '-row-mt', '1', '-deadline', 'realtime', '-cpu-used', '8', '-crf', '30', '-b:v', '0');
    }

    processMedia(commandArgs, outputExt, mimeType, "cropped_video");
  };

  const faqs = [
    {
      question: "Will cropping reduce my video quality?",
      answer: "Cropping requires the video to be re-encoded, which can slightly affect quality depending on the format. We use high-quality presets (libx264 CRF 23) to ensure the visual difference is virtually unnoticeable while maintaining reasonable file sizes.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All cropping and processing is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    },
    {
      question: "Can I crop to a custom dimension?",
      answer: "Yes! By default the Free aspect ratio is selected, allowing you to drag the crop handles to any specific dimension you want.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Crop Video"
          subtitle="Crop videos to any aspect ratio or custom dimensions instantly. Secure local browser processing."
          icon={<Crop className="w-6 h-6 text-blue-500" />}
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

            <InteractiveVideoCropPreview
              file={fileInfo.file as any}
              onClear={clearAll}
              aspectRatio={aspectRatio}
              onCropChange={setCropParams}
            />

            <MediaCropOptions 
              onAspectRatioChange={setAspectRatio}
              onReset={() => setAspectRatio(undefined)}
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
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                    onClick={handleStartCrop}
                    disabled={processingState.isProcessing || !cropParams}
                  >
                    Crop Video <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Crop Another Video"
             downloadButtonText="Download Cropped Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How Video Cropping Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Video", desc: "Drag and drop your file" },
              { step: 2, title: "Adjust Frame", desc: "Use the handles to crop your video" },
              { step: 3, title: "Process", desc: "We re-encode the video locally" },
              { step: 4, title: "Download", desc: "Save your freshly cropped video" }
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

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our Video Engine"
        content={
          <>
            <p>
              To provide incredibly secure and fast video editing, we utilize <strong>FFmpeg WebAssembly</strong>.
            </p>
            <p>
              When you crop a video, the visual track must be re-encoded to the new dimensions. We process this entirely inside your browser's memory without uploading a single byte to our servers. We preserve your audio track intact via stream-copying to ensure optimal speed and quality.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
