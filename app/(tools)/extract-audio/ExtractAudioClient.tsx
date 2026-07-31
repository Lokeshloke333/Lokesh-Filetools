"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Music, ArrowRight, AlertTriangle, FileAudio } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaMetadataCard } from "@/components/tool/media/MediaMetadataCard";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { AudioExtractionOptionsPanel, AudioExtractionOptions } from "@/components/tool/media/AudioExtractionOptions";
import { getBasicMediaMetadata, MediaMetadata } from "@/lib/utils/media";

export default function ExtractAudioClient() {
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

  const [options, setOptions] = useState<AudioExtractionOptions>({
    format: "mp3",
    quality: "high",
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
      maxSizeMB: 500,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v', '.flv', 'video/']
    });
  };

  const handleStartExtraction = () => {
    const commandArgs: string[] = [];
    
    // Quality mapping based on user selection and format
    let bitrate = 'auto';
    let sampleRate = 'auto';
    
    if (options.format === 'mp3' || options.format === 'aac' || options.format === 'ogg') {
      if (options.quality === 'high') bitrate = '320k';
      else if (options.quality === 'medium') bitrate = '192k';
      else if (options.quality === 'small') bitrate = '128k';
      
      commandArgs.push('-b:a', bitrate);
    }

    // Since we are extracting, we do not need the video stream
    commandArgs.push('-vn');

    // Extract audio using proper encoding/copying if possible, but normally it's safer to just encode to the chosen format
    // Map metadata to output
    commandArgs.push('-map_metadata', '0');

    // For extracting to the requested format, FFmpeg will automatically use the correct audio encoder based on the output extension
    // We just pass -vn (no video) and let it do its job to generate the output
    
    processMedia(commandArgs, options.format, `audio/${options.format}`, "extracted_audio");
  };

  const faqs = [
    {
      question: "Is this tool free?",
      answer: "Yes, our audio extraction tool is 100% free to use.",
    },
    {
      question: "Are my videos uploaded?",
      answer: "No, all processing happens entirely in your browser using FFmpeg WebAssembly. Your videos are never uploaded to any server, ensuring complete privacy.",
    },
    {
      question: "Can I convert directly to MP3?",
      answer: "Yes, you can extract the audio directly into MP3, WAV, AAC, FLAC, or OGG format.",
    },
    {
      question: "Does extraction reduce quality?",
      answer: "By default, we offer lossless formats like WAV or FLAC which perfectly preserve audio quality. For compressed formats like MP3, we offer high bitrates (320kbps) to ensure maximum quality.",
    },
    {
      question: "What video formats are supported?",
      answer: "We support a wide range of video formats including MP4, MOV, AVI, MKV, WEBM, M4V, and FLV.",
    },
    {
      question: "What happens if my video has no audio?",
      answer: "The extraction process will fail gracefully and notify you that no audio streams could be found in the video file.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <ToolHeader 
          title="Extract Audio from Video"
          subtitle="Extract audio tracks from your videos instantly using secure client-side processing. Your files never leave your browser."
          icon={<FileAudio className="w-6 h-6 text-blue-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="MP4, MOV, AVI, MKV, WEBM, M4V, FLV"
            accept="video/*"
            maxSizeMB={500}
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

            <AudioExtractionOptionsPanel 
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
                    onClick={handleStartExtraction}
                    disabled={processingState.isProcessing}
                  >
                    Extract to {options.format.toUpperCase()} <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Extract Another Video"
             downloadButtonText="Download Audio"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How It Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Upload Video", desc: "Drag and drop your file" },
              { step: 2, title: "Review", desc: "Check file metadata" },
              { step: 3, title: "Format", desc: "Select audio format" },
              { step: 4, title: "Extract", desc: "Instant local processing" },
              { step: 5, title: "Download", desc: "Save audio to device" }
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
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "Client-side processing", desc: "All processing happens in your browser using FFmpeg WebAssembly." },
             { title: "Secure & Private", desc: "Your video files never leave your device. 100% private." },
             { title: "Fast extraction", desc: "Utilizes your device's full CPU power for rapid extraction." },
             { title: "Multiple formats", desc: "Export to MP3, WAV, AAC, FLAC, and OGG easily." },
             { title: "High-quality audio", desc: "Preserve original quality or compress with high bitrates." },
             { title: "No uploads", desc: "Since files aren't uploaded, you save time and bandwidth." }
           ].map((f, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</div>
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
        title="About our Audio Extraction Engine"
        content={
          <>
            <p>
              To provide blazing-fast extraction for massive video files, we use <strong>FFmpeg WebAssembly</strong>. Instead of uploading your large videos to a remote server, our tool downloads a lightweight engine directly into your browser.
            </p>
            <p>
              This means your media is processed locally using your device's CPU. Not only does this guarantee absolute privacy, but it also allows you to extract audio instantly without waiting for slow internet uploads or downloads. It is essentially a powerful desktop app inside your web browser.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
