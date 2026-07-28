"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Video, ArrowRight, AlertTriangle } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { VideoConversionOptionsPanel, VideoConversionOptions } from "@/components/tool/media/VideoConversionOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function ConvertVideoClient() {
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

  const [options, setOptions] = useState<VideoConversionOptions>({
    format: "mp4",
    videoCodec: "h264",
    audioCodec: "copy",
    quality: "high",
    resolution: "original",
    frameRate: "original",
    muteAudio: false,
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

  const handleStartConversion = () => {
    const commandArgs: string[] = [];

    if (options.format === 'mp3') {
      // Just extract audio
      commandArgs.push('-vn'); // no video
      if (options.quality === 'high') commandArgs.push('-b:a', '320k');
      else if (options.quality === 'medium') commandArgs.push('-b:a', '192k');
      else if (options.quality === 'low') commandArgs.push('-b:a', '128k');
      commandArgs.push('-map_metadata', '0');
    } else if (options.format === 'gif') {
      // GIF conversion
      let fps = options.frameRate === 'original' ? '15' : options.frameRate;
      let scaleFilters = `fps=${fps}`;
      
      if (options.resolution !== 'original') {
        const height = options.resolution === '1080p' ? 1080 : (options.resolution === '720p' ? 720 : 480);
        scaleFilters += `,scale=-2:${height}:flags=lanczos`;
      }
      commandArgs.push('-vf', scaleFilters);
      commandArgs.push('-an'); // No audio in GIF
    } else {
      // Standard Video Conversion
      
      // Video Codec
      if (options.videoCodec === 'h264') commandArgs.push('-vcodec', 'libx264', '-preset', 'ultrafast');
      else if (options.videoCodec === 'h265') commandArgs.push('-vcodec', 'libx265', '-preset', 'ultrafast');
      else if (options.videoCodec === 'vp9') commandArgs.push('-vcodec', 'libvpx-vp9');
      else if (options.videoCodec === 'copy') commandArgs.push('-vcodec', 'copy');

      // Video Quality (CRF) - skip if copying video
      if (options.videoCodec !== 'copy') {
        let crf = '23'; // Default H.264 Medium
        if (options.videoCodec === 'h264') {
          crf = options.quality === 'high' ? '18' : (options.quality === 'medium' ? '23' : '28');
        } else if (options.videoCodec === 'h265') {
          crf = options.quality === 'high' ? '20' : (options.quality === 'medium' ? '25' : '30');
        } else if (options.videoCodec === 'vp9') {
          crf = options.quality === 'high' ? '15' : (options.quality === 'medium' ? '30' : '45');
        }
        commandArgs.push('-crf', crf);
      }

      // Video Filters (Resolution)
      if (options.videoCodec !== 'copy') {
        if (options.resolution === '1080p') commandArgs.push('-vf', 'scale=-2:1080');
        else if (options.resolution === '720p') commandArgs.push('-vf', 'scale=-2:720');
        else if (options.resolution === '480p') commandArgs.push('-vf', 'scale=-2:480');
      }

      // Frame Rate
      if (options.videoCodec !== 'copy' && options.frameRate !== 'original') {
        commandArgs.push('-r', options.frameRate);
      }

      // Audio Codec and Mute
      if (options.muteAudio) {
        commandArgs.push('-an');
      } else {
        if (options.format === 'webm') {
          commandArgs.push('-acodec', 'libvorbis');
        } else if (options.audioCodec === 'aac') commandArgs.push('-acodec', 'aac');
        else if (options.audioCodec === 'mp3') commandArgs.push('-acodec', 'libmp3lame');
        else if (options.audioCodec === 'copy') commandArgs.push('-acodec', 'copy');
      }
    }

    let mimeType = `video/${options.format}`;
    if (options.format === 'mp3') mimeType = 'audio/mp3';
    if (options.format === 'gif') mimeType = 'image/gif';
    if (options.format === 'mkv') mimeType = 'video/x-matroska';
    if (options.format === 'mov') mimeType = 'video/quicktime';

    processMedia(commandArgs, options.format, mimeType, "converted_video");
  };

  const faqs = [
    {
      question: "Is there a file size limit?",
      answer: "Yes, you can convert video files up to 1GB. Processing happens entirely locally in your browser.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All conversion is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    },
    {
      question: "Does conversion reduce video quality?",
      answer: "It depends on the quality settings you choose. Selecting 'High' will preserve most of the original visual quality, while 'Low' will compress the file more aggressively.",
    },
    {
      question: "Can I extract audio from a video?",
      answer: "Yes, just select the 'MP3' output format and the tool will automatically extract the audio track.",
    },
    {
      question: "What is H.265 (HEVC)?",
      answer: "H.265 is a modern video codec that offers superior compression compared to H.264, meaning you get better quality at a smaller file size, though it takes slightly longer to process.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Universal Video Converter"
          subtitle="Convert videos between MP4, MOV, MKV, and WEBM entirely in your browser without uploading."
          icon={<Video className="w-6 h-6 text-blue-500" />}
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

            <VideoConversionOptionsPanel 
              options={options} 
              onChange={setOptions} 
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
                    onClick={handleStartConversion}
                    disabled={processingState.isProcessing}
                  >
                    Convert Video <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Convert Another Video"
             downloadButtonText="Download Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How It Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Select Video", desc: "Drag and drop your file" },
              { step: 2, title: "Settings", desc: "Choose format & codec" },
              { step: 3, title: "Resolution", desc: "Scale if needed" },
              { step: 4, title: "Convert", desc: "100% local processing" },
              { step: 5, title: "Download", desc: "Save new video" }
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
             { title: "Browser Based", desc: "Converts videos directly using your device hardware." },
             { title: "Secure & Private", desc: "Your video files never leave your device. 100% private." },
             { title: "No Watermarks", desc: "We never add watermarks to your converted videos." },
             { title: "Multiple Codecs", desc: "Support for H.264, H.265 (HEVC), and VP9 encoding." },
             { title: "GIF Creation", desc: "Easily convert short video clips into animated GIFs." },
             { title: "High-quality output", desc: "Preserve original quality or compress to save space." }
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
        title="About our Video Conversion Engine"
        content={
          <>
            <p>
              To provide incredibly flexible video processing, we utilize <strong>FFmpeg WebAssembly</strong>. Instead of uploading your massive video files to a cloud server, our tool downloads a lightweight conversion engine directly into your browser.
            </p>
            <p>
              This means your media is processed locally using your device's CPU. Not only does this guarantee absolute privacy since the files never leave your machine, but it also allows you to perform heavy tasks like changing codecs (H.264, H.265, VP9), scaling resolution, and manipulating frame rates without being bottlenecked by slow internet upload speeds.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
