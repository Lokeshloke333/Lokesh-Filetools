"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { FileVideo, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { VideoCompressionOptionsPanel, VideoCompressionOptions } from "@/components/tool/media/VideoCompressionOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function CompressVideoClient() {
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

  const [options, setOptions] = useState<VideoCompressionOptions>({
    preset: "balanced",
    resolution: "original",
    frameRate: "original",
    muteAudio: false,
    customCrf: "auto",
    videoBitrate: "auto"
  });

  const [metadata, setMetadata] = useState<MediaMetadata | null>(null);

  useEffect(() => {
    if (fileInfo?.file) {
      getBasicMediaMetadata(fileInfo.file).then((data) => setMetadata(data));
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

  const handleStartCompression = () => {
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
    }

    // Video Codec & Encoding Preset
    if (outputExt === 'webm') {
      // Use VP8 with realtime speed settings for WEBM
      commandArgs.push('-vcodec', 'libvpx', '-quality', 'realtime', '-cpu-used', '8');
    } else {
      // H.264 with ultrafast preset & yuv420p for standard browser compatibility
      commandArgs.push(
        '-vcodec', 'libx264',
        '-preset', 'ultrafast',
        '-pix_fmt', 'yuv420p'
      );
    }

    // CRF (Quality)
    if (options.customCrf !== "auto") {
      commandArgs.push('-crf', options.customCrf);
    } else {
      let crf = '28'; // balanced
      if (options.preset === 'light') crf = '23';
      if (options.preset === 'max') crf = '32';
      commandArgs.push('-crf', crf);
    }

    // Max Bitrate
    if (options.videoBitrate !== "auto") {
      commandArgs.push('-b:v', options.videoBitrate);
      commandArgs.push('-maxrate', options.videoBitrate);
      commandArgs.push('-bufsize', String(parseInt(options.videoBitrate.replace('k', '')) * 2) + 'k');
    }

    // Smart Resolution Scaling (Auto-cap >1080p if original is selected to prevent WASM OOM and slow encode)
    if (options.resolution !== 'original') {
      if (options.resolution === '1080p') commandArgs.push('-vf', 'scale=-2:1080');
      else if (options.resolution === '720p') commandArgs.push('-vf', 'scale=-2:720');
      else if (options.resolution === '480p') commandArgs.push('-vf', 'scale=-2:480');
      else if (options.resolution === '360p') commandArgs.push('-vf', 'scale=-2:360');
    } else if (metadata?.width && metadata?.height && (metadata.width > 1920 || metadata.height > 1080)) {
      // Auto-cap 4K/2K videos to 1080p for browser performance
      commandArgs.push('-vf', 'scale=-2:1080');
    }

    // Frame Rate Cap (Auto-cap >30fps to 30fps if original is selected)
    if (options.frameRate !== 'original') {
      commandArgs.push('-r', options.frameRate);
    } else if (metadata?.fps && metadata.fps > 30) {
      commandArgs.push('-r', '30');
    }

    // Audio
    if (options.muteAudio) {
      commandArgs.push('-an');
    } else {
      if (outputExt === 'webm') {
        commandArgs.push('-acodec', 'libvorbis', '-b:a', '96k');
      } else {
        let audioBitrate = '128k';
        if (options.preset === 'light') audioBitrate = '192k';
        if (options.preset === 'max') audioBitrate = '64k';
        commandArgs.push('-acodec', 'aac', '-b:a', audioBitrate);
      }
    }

    processMedia(commandArgs, outputExt, mimeType, "compressed_video");
  };

  const faqs = [
    {
      question: "Will compression ruin my video quality?",
      answer: "No. Our 'Light' and 'Balanced' presets use smart encoding algorithms to remove redundant data while preserving visual quality. The 'Maximum' preset will reduce quality more noticeably to achieve the smallest file size possible.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All compression is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, you can compress video files up to 1GB. Processing happens entirely locally in your browser.",
    },
    {
      question: "What is CRF?",
      answer: "CRF (Constant Rate Factor) is a quality setting. A lower CRF value (e.g., 18) means higher quality and larger file size, while a higher CRF value (e.g., 35) means lower quality and smaller file size.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Video Compressor"
          subtitle="Reduce the file size of your MP4, MOV, and WEBM videos without sacrificing quality. 100% secure local processing."
          icon={<FileVideo className="w-6 h-6 text-blue-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="MP4, MOV, AVI, MKV, WEBM, FLV, WMV"
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

            <VideoCompressionOptionsPanel 
              options={options} 
              onChange={setOptions}
              originalSize={fileInfo.file.size}
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
                    onClick={handleStartCompression}
                    disabled={processingState.isProcessing}
                  >
                    Compress Video <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Compress Another Video"
             downloadButtonText="Download Compressed Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How Video Compression Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Video", desc: "Drag and drop your file" },
              { step: 2, title: "Choose Level", desc: "Select compression preset" },
              { step: 3, title: "Processing", desc: "100% local encoding" },
              { step: 4, title: "Download", desc: "Save reduced video" }
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
        title="About our Compression Engine"
        content={
          <>
            <p>
              To provide incredibly flexible and fast video compression, we utilize <strong>FFmpeg WebAssembly</strong>. Instead of uploading your massive video files to a cloud server to compress them, our tool downloads a lightweight engine directly into your browser.
            </p>
            <p>
              This means your media is processed locally using your device's CPU. Not only does this guarantee absolute privacy since the files never leave your machine, but it also allows you to perform heavy tasks without being bottlenecked by slow internet upload speeds.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
