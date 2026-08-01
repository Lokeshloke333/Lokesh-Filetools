"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, Layers } from "lucide-react";
import { useMultiMediaProcessor } from "@/hooks/useMultiMediaProcessor";
import { useDownload } from "@/hooks/useDownload";
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { MultiMediaList } from "@/components/tool/media/MultiMediaList";

export default function MergeVideoClient() {
  const {
    files,
    handleFilesSelect,
    removeFile,
    reorderFiles,
    clearAll,
    processingState,
    result,
    uploadError,
    clearUploadError,
    processMultipleMedia
  } = useMultiMediaProcessor();

  const { handleDownload } = useDownload();
  const [forceReencode, setForceReencode] = useState(false);

  const onFilesSelectWrapper = (selectedFiles: File[]) => {
    handleFilesSelect(selectedFiles, {
      maxSizeMB: 1000,
      maxFiles: 20,
      allowedTypes: ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv', '.wmv', '.m4v', '.3gp', '.ogv', '.mpeg', 'video/']
    });
  };

  const handleStartMerge = () => {
    if (files.length < 2) return;

    let outputExt = 'mp4';
    let mimeType = 'video/mp4';
    
    // If all are WEBM, output WEBM. Otherwise MP4.
    const allWebm = files.every(f => f.file.name.toLowerCase().endsWith('.webm'));
    if (allWebm) {
       outputExt = 'webm';
       mimeType = 'video/webm';
    }

    const commandArgs: string[] = [];
    const extraFiles: {name: string, data: string}[] = [];

    if (!forceReencode) {
       // Fast path: Stream Copy via concat demuxer
       // Generate list.txt
       let listContent = "";
       for (let i = 0; i < files.length; i++) {
          const ext = files[i].file.name.split('.').pop() || 'tmp';
          listContent += `file 'input_${i}.${ext}'\n`;
       }
       
       extraFiles.push({ name: 'list.txt', data: listContent });

       commandArgs.push('-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy');
    } else {
       // Slow path: Re-encode via concat filter
       let filterComplex = "";
       for (let i = 0; i < files.length; i++) {
          commandArgs.push('-i', `input_${i}.${files[i].file.name.split('.').pop() || 'tmp'}`);
          filterComplex += `[${i}:v][${i}:a]`;
       }
       filterComplex += `concat=n=${files.length}:v=1:a=1[v][a]`;

       commandArgs.push('-filter_complex', filterComplex, '-map', '[v]', '-map', '[a]', '-preset', 'ultrafast');
       if (outputExt === 'webm') {
          commandArgs.push('-c:v', 'libvpx-vp9', '-c:a', 'libvorbis');
       } else {
          commandArgs.push('-c:v', 'libx264', '-c:a', 'aac');
       }
    }

    processMultipleMedia(commandArgs, outputExt, mimeType, "merged_video", extraFiles);
  };

  const faqs = [
    {
      question: "How does the fast merge (Stream Copy) work?",
      answer: "If your videos have the same resolution and codecs, we can simply stitch them together without re-encoding. This takes seconds and preserves 100% of the original quality.",
    },
    {
      question: "Why would I need to force re-encoding?",
      answer: "If you merge videos with different sizes, frame rates, or codecs (e.g. merging an MP4 with a WEBM), a fast merge might result in a broken video. Forcing re-encoding ensures the final video plays perfectly everywhere, though it takes much longer to process.",
    },
    {
      question: "Are my video files uploaded to a server?",
      answer: "No. All merging is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Video Merger"
          subtitle="Combine multiple video clips into a single continuous video. Free, secure, and instant browser processing."
          icon={<Layers className="w-6 h-6 text-blue-500" />}
        />
        
        {!result && (
          <div className="space-y-6">
             {files.length > 0 && (
                <MultiMediaList 
                   files={files}
                   onRemove={removeFile}
                   onReorder={reorderFiles}
                   mediaType="video"
                />
             )}

             <UploadArea 
               acceptedFormats="MP4, MOV, AVI, MKV, WEBM"
               accept="video/*"
               maxSizeMB={1000}
               onFilesSelect={onFilesSelectWrapper}
               multiple={true}
               error={uploadError}
               onErrorClear={clearUploadError}
             />
          </div>
        )}

        {!result && files.length > 0 && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            <MediaProgressIndicator state={processingState} />

            {/* Merge Settings */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mt-6">
               <h3 className="text-lg font-bold text-slate-800 mb-4">Merge Options</h3>
               
               <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                     <input 
                        type="checkbox" 
                        className="peer sr-only"
                        checked={forceReencode}
                        onChange={(e) => setForceReencode(e.target.checked)}
                        disabled={processingState.isProcessing}
                     />
                     <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                     <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                  <div>
                     <span className="block text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                        Force Re-encoding (Compatibility Mode)
                     </span>
                     <span className="block text-xs text-slate-500 mt-1">
                        Check this if your videos have different dimensions or formats. Warning: This will make the merging process significantly slower.
                     </span>
                  </div>
               </label>
            </div>

            {files.length < 2 && !processingState.isProcessing && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mt-6">
                    <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Please select at least 2 videos to merge.</p>
                </div>
            )}

            {files.length >= 2 && !processingState.isProcessing && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                    onClick={handleStartMerge}
                  >
                    Merge {files.length} Videos <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
            )}
            
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" onClick={clearAll} disabled={processingState.isProcessing} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                  Cancel & Remove All
               </Button>
            </div>
          </div>
        )}

        {result && (
          <MediaResultCard 
             result={result} 
             onDownload={() => handleDownload(result.url, result.filename)} 
             onReset={clearAll} 
             resetButtonText="Merge Another Set"
             downloadButtonText="Download Merged Video"
             mediaType="video"
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How Video Merging Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Upload Files", desc: "Select 2 or more videos" },
              { step: 2, title: "Reorder", desc: "Drag and drop to arrange them" },
              { step: 3, title: "Merge", desc: "100% secure local browser joining" },
              { step: 4, title: "Download", desc: "Save your combined video clip" }
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
        title="About our Merging Engine"
        content={
          <>
            <p>
              Our video merging tool leverages <strong>FFmpeg WebAssembly</strong> to perform operations locally in your browser. It attempts to use the <em>Concat Demuxer</em> whenever possible. 
            </p>
            <p>
              This means if you shoot 5 video clips on your iPhone and want to join them into one, our tool simply stitches the raw data streams together. This takes just a few seconds and results in zero quality loss, unlike traditional cloud-based tools that force a complete re-encode of your footage.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
