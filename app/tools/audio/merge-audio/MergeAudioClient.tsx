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
import { MediaProgressIndicator } from "@/components/tool/media/MediaProgressIndicator";
import { MediaResultCard } from "@/components/tool/media/MediaResultCard";
import { MultiMediaList } from "@/components/tool/media/MultiMediaList";
import { useDownload } from "@/hooks/useDownload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MergeAudioClient() {
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

  const [outputFormat, setOutputFormat] = useState<string>("keep");

  const onFilesSelectWrapper = (selectedFiles: File[]) => {
    handleFilesSelect(selectedFiles, {
      maxSizeMB: 500,
      maxFiles: 20,
      allowedTypes: ['.mp3', '.wav', '.aac', '.m4a', '.flac', '.ogg', '.opus', '.aiff', '.wma', 'audio/']
    });
  };

  const handleStartMerge = () => {
    if (files.length < 2) return;

    // Check if files share the same extension
    const allExtensions = files.map(f => {
       const ext = f.file.name.split('.').pop()?.toLowerCase();
       return ext || 'tmp';
    });
    
    const uniqueExtensions = new Set(allExtensions);
    const hasSameExtension = uniqueExtensions.size === 1;
    const commonExtension = allExtensions[0];
    
    let targetExt = outputFormat;
    
    // Determine the actual target extension if "keep" is selected
    if (outputFormat === "keep") {
       if (hasSameExtension) {
          targetExt = commonExtension;
       } else {
          // Fallback to mp3 if multiple formats are mixed and user chose "keep original"
          targetExt = "mp3";
       }
    }

    const commandArgs: string[] = [];
    const extraFiles: {name: string, data: string}[] = [];

    // We can only use Stream Copy if keeping original format AND all inputs have the same extension
    const canUseStreamCopy = (outputFormat === "keep" && hasSameExtension);

    if (canUseStreamCopy) {
       // Fast path: Stream Copy via concat demuxer
       let listContent = "";
       for (let i = 0; i < files.length; i++) {
          const ext = files[i].file.name.split('.').pop()?.toLowerCase() || 'tmp';
          listContent += `file 'input_${i}.${ext}'\n`;
       }
       
       extraFiles.push({ name: 'list.txt', data: listContent });
       commandArgs.push('-f', 'concat', '-safe', '0', '-i', 'list.txt', '-c', 'copy');
       
    } else {
       // Slow path: Re-encode via concat filter
       let filterComplex = "";
       for (let i = 0; i < files.length; i++) {
          commandArgs.push('-i', `input_${i}.${files[i].file.name.split('.').pop()?.toLowerCase() || 'tmp'}`);
          filterComplex += `[${i}:a]`;
       }
       filterComplex += `concat=n=${files.length}:v=0:a=1[a]`;

       commandArgs.push('-filter_complex', filterComplex, '-map', '[a]');
       
       // Codec selection based on targetExt
       if (targetExt === 'mp3') {
           commandArgs.push('-c:a', 'libmp3lame', '-q:a', '2');
       } else if (targetExt === 'ogg') {
           commandArgs.push('-c:a', 'libvorbis', '-q:a', '4');
       } else if (targetExt === 'wav') {
           commandArgs.push('-c:a', 'pcm_s16le');
       } else if (targetExt === 'aac' || targetExt === 'm4a') {
           commandArgs.push('-c:a', 'aac', '-b:a', '192k');
       } else if (targetExt === 'flac') {
           commandArgs.push('-c:a', 'flac');
       }
       // OPUS, AIFF, WMA can fallback to defaults if needed or be explicitly added,
       // but typically FFmpeg infers it well for other extensions.
    }

    let mimeType = `audio/${targetExt}`;
    if (targetExt === "mp3") mimeType = "audio/mpeg";
    if (targetExt === "m4a") mimeType = "audio/mp4";
    if (targetExt === "ogg") mimeType = "audio/ogg";

    processMultipleMedia(commandArgs, targetExt, mimeType, "merged_audio", extraFiles);
  };

  const faqs = [
    {
      question: "How does the fast merge (Stream Copy) work?",
      answer: "If all your uploaded audio files have the exact same format (like all MP3s or all WAVs), we can simply stitch them together without re-encoding. This takes seconds and preserves 100% of the original quality.",
    },
    {
      question: "What happens if I mix different formats?",
      answer: "If you upload a mix of different audio formats (e.g., an MP3 and a WAV) or choose a different output format, we will automatically re-encode the final merged file to ensure perfect compatibility.",
    },
    {
      question: "Are my audio files uploaded to a server?",
      answer: "No. All merging is done securely on your device using FFmpeg WebAssembly. Your files never leave your computer, ensuring total privacy.",
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-5xl mx-auto">
        <ToolHeader 
          title="Audio Merger"
          subtitle="Combine multiple audio files into a single continuous track. Free, secure, and instant browser processing."
          icon={<Layers className="w-6 h-6 text-slate-500" />}
        />
        
        {!result && (
          <div className="space-y-6">
             {files.length > 0 && (
                <MultiMediaList 
                   files={files}
                   onRemove={removeFile}
                   onReorder={reorderFiles}
                   mediaType="audio"
                />
             )}

             <UploadArea 
               acceptedFormats="MP3, WAV, AAC, M4A, FLAC, OGG, OPUS, AIFF, WMA"
               accept="audio/*"
               maxSizeMB={500}
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
               
               <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                     Output Format:
                  </label>
                  <Select 
                     value={outputFormat} 
                     onValueChange={setOutputFormat}
                     disabled={processingState.isProcessing}
                  >
                     <SelectTrigger className="w-full sm:w-[250px] bg-slate-50 h-10 border-slate-200">
                        <SelectValue placeholder="Select output format" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="keep">Keep Original (Fastest)</SelectItem>
                        <SelectItem value="mp3">MP3</SelectItem>
                        <SelectItem value="wav">WAV</SelectItem>
                        <SelectItem value="aac">AAC</SelectItem>
                        <SelectItem value="m4a">M4A</SelectItem>
                        <SelectItem value="flac">FLAC</SelectItem>
                        <SelectItem value="ogg">OGG</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               
               {outputFormat === "keep" && (
                  <p className="text-xs text-slate-500 mt-3 flex items-start">
                     <AlertTriangle className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-500 mt-0.5" />
                     If you upload a mix of different formats, they will be automatically re-encoded to MP3 to ensure they merge correctly.
                  </p>
               )}
            </div>

            {files.length < 2 && !processingState.isProcessing && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mt-6">
                    <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">Please select at least 2 audio files to merge.</p>
                </div>
            )}

            {files.length >= 2 && !processingState.isProcessing && (
                <div className="mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                    onClick={handleStartMerge}
                  >
                    Merge {files.length} Audio Files <ArrowRight className="w-5 h-5 ml-2" />
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
             resetButtonText="Merge More Audio"
             downloadButtonText="Download Merged Audio"
             mediaType="audio"
          />
        )}

        <div className="mt-16 space-y-16">
          <AboutTool 
            title="How to Merge Audio Files"
            content={
              <>
                <p>Our browser-based Audio Merger makes combining multiple audio files simple and fast.</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Upload 2 or more audio files you want to combine.</li>
                  <li>Drag and drop the files to rearrange them in the correct order.</li>
                  <li>Choose your output format (or select &apos;Keep Original&apos; for blazing fast processing without re-encoding).</li>
                  <li>Click &apos;Merge Audio Files&apos; and download your combined track instantly!</li>
                </ol>
              </>
            }
          />
          
          <FAQSection faqs={faqs} />
          
          <RelatedTools />
        </div>
      </div>
    </ToolLayout>
  );
}
