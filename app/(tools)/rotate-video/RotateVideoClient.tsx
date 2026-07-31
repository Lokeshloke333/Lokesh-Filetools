"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { VideoRotationOptions, VideoRotation } from "@/components/tool/media/VideoRotationOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function RotateVideoClient() {
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
  const [rotation, setRotation] = useState<VideoRotation>("0");

  useEffect(() => {
    if (fileInfo?.file) {
      getBasicMediaMetadata(fileInfo.file).then((data) => setMetadata(data));
      setRotation("0");
    } else {
      setMetadata(null);
    }
  }, [fileInfo]);

  const onFileSelectWrapper = (file: File) => {
    handleFileSelect(file, {
      maxSizeMB: 1000,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', 'video/']
    });
  };

  const handleStartRotation = () => {
    if (rotation === "0") return;

    let outputExt = fileInfo?.file.name.split('.').pop() || 'mp4';
    let mimeType = `video/${outputExt === 'mov' ? 'quicktime' : outputExt}`;

    const commandArgs: string[] = [];

    // Metadata Rotation (Fast Path)
    if (["90", "-90", "180"].includes(rotation)) {
       let rotateVal = "0";
       if (rotation === "90") rotateVal = "90";
       if (rotation === "-90") rotateVal = "270"; // FFmpeg usually prefers positive degrees or 270 for left
       if (rotation === "180") rotateVal = "180";
       
       // Note: -metadata:s:v rotate works for MP4/MOV. WEBM/MKV might ignore it.
       commandArgs.push('-c', 'copy', '-metadata:s:v:0', `rotate=${rotateVal}`);
    } 
    // Filter Rotation (Slow Path - Re-encode)
    else {
       // Ensure output format is widely supported since we are re-encoding
       if (!["mp4", "webm"].includes(outputExt.toLowerCase())) {
          outputExt = 'mp4';
          mimeType = 'video/mp4';
       }

       if (rotation === "hflip") {
          commandArgs.push('-vf', 'hflip');
       } else if (rotation === "vflip") {
          commandArgs.push('-vf', 'vflip');
       }

       // Fast re-encode settings
       commandArgs.push('-c:a', 'copy'); // don't touch audio
       if (outputExt === 'webm') {
          commandArgs.push('-c:v', 'libvpx-vp9');
       } else {
          commandArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23');
       }
    }

    processMedia(commandArgs, outputExt, mimeType, "rotated_video");
  };

  const faqs = [
    {
      question: "Is video rotation instant?",
      answer: "Standard rotations (90°, 180°) are processed instantly using metadata updates. This means the video isn't re-encoded, preserving 100% of the original quality. Flips (horizontal/vertical) require re-encoding and take slightly longer.",
    },
    {
      question: "Will old video players support the instant rotation?",
      answer: "Most modern players (VLC, QuickTime, Web Browsers, Smartphones) perfectly support metadata rotation. However, some very old legacy players might ignore the metadata and play the video sideways.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All processing is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Video Rotator"
          subtitle="Change the orientation of your video or flip it horizontally/vertically in your browser."
          icon={<RefreshCw className="w-6 h-6 text-blue-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="MP4, MOV, AVI, MKV, WEBM, WMV"
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

            <VideoRotationOptions 
               file={fileInfo.file}
               value={rotation}
               onChange={setRotation}
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
                    onClick={handleStartRotation}
                    disabled={processingState.isProcessing || rotation === "0"}
                  >
                    Apply Rotation <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Rotate Another Video"
             downloadButtonText="Download Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How Video Rotation Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Video", desc: "Drag and drop your file" },
              { step: 2, title: "Choose Angle", desc: "Select 90°, 180° or Flip" },
              { step: 3, title: "Processing", desc: "100% secure local rotation" },
              { step: 4, title: "Download", desc: "Save the corrected video" }
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
        title="About our Rotation Engine"
        content={
          <>
            <p>
              To provide the absolute fastest experience, our Video Rotator utilizes <strong>FFmpeg WebAssembly</strong> to manipulate the internal metadata of your video container instead of performing a heavy re-encode.
            </p>
            <p>
              When you select a standard 90 or 180 degree rotation, we simply update a small text flag inside the video file. This means a 1GB video can be rotated in less than a second, and the original video quality remains 100% untouched!
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
