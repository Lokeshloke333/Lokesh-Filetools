"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Minimize2, Wand2, Lightbulb, Zap } from "lucide-react";
import { useBatchImageCompressor } from "@/hooks/useBatchImageCompressor";
import { useDownload } from "@/hooks/useDownload";
import { BatchResultCard } from "@/components/tool/BatchResultCard";
import { BatchSummaryCard } from "@/components/tool/BatchSummaryCard";
import { FILE_LIMITS } from "@/lib/config";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CompressImagePage() {
  const [quality, setQuality] = useState(80);
  const [targetFormat, setTargetFormat] = useState("ORIGINAL");
  const [stripMetadata, setStripMetadata] = useState(true);
  const [progressive, setProgressive] = useState(true);
  const [isZipping, setIsZipping] = useState(false);

  const {
    items,
    isProcessing,
    addFiles,
    removeFile,
    clearAll,
    processAll
  } = useBatchImageCompressor();

  const { handleDownload, handleBatchDownload } = useDownload();

  const handleStartCompression = () => {
    processAll({
      quality,
      format: targetFormat,
      stripMetadata,
      progressive,
    });
  };

  const handleDownloadAll = async () => {
    setIsZipping(true);
    const downloadItems = items
      .filter(i => i.status === "completed" && i.result)
      .map(i => ({
        url: i.result?.message === "Already Optimized ✓" || (i.result && i.result.processedSize >= i.result.originalSize) ? i.preview : (i.result?.preview as string),
        filename: i.result?.message === "Already Optimized ✓" || (i.result && i.result.processedSize >= i.result.originalSize) ? i.file.name : (i.result?.filename as string)
      }));
    
    await handleBatchDownload(downloadItems);
    setIsZipping(false);
  };

  const pendingItems = items.filter(i => i.status === "pending" || i.status === "error");
  const hasItems = items.length > 0;
  const allCompleted = hasItems && items.every(i => i.status === "completed");

  const faqs = [
    {
      question: "What file formats does Compress Image support?",
      answer: "We support all major image formats including JPG, PNG, WebP, GIF, and AVIF. You can upload any of these formats and compress them in batches.",
    },
    {
      question: "How does Smart Compression work?",
      answer: "Smart Compression analyzes your image and determines the optimal balance between file size and visual quality. It guarantees that the output will never be larger than your original file.",
    },
    {
      question: "Can I compress multiple images at once?",
      answer: "Yes! You can drag and drop multiple images or select multiple files from the upload dialog. We process them intelligently so your browser remains responsive.",
    },
    {
      question: "Are my files stored after processing?",
      answer: "No. All files are automatically and permanently deleted from our servers within 2 hours of processing. We respect your privacy and never store or look at your files.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Upload & Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Compress Image"
            subtitle="Smart, bulk image optimization without quality loss"
            icon={<Minimize2 className="w-6 h-6" />}
          />
          
          <UploadArea 
            acceptedFormats="JPG/JPEG, PNG, WebP, GIF, AVIF"
            maxSizeMB={FILE_LIMITS.IMAGE_MAX_SIZE_MB}
            onFilesSelect={addFiles}
            multiple={true}
          />

          {hasItems && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="font-bold text-slate-800 text-lg">
                  Files ({items.length})
                </h3>
                {pendingItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="text-slate-500 hover:text-red-600">
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <BatchResultCard 
                    key={item.id} 
                    item={item} 
                    onDownload={() => {
                      const url = item.result?.message === "Already Optimized ✓" || (item.result && item.result.processedSize >= item.result.originalSize) ? item.preview : item.result?.preview;
                      const name = item.result?.message === "Already Optimized ✓" || (item.result && item.result.processedSize >= item.result.originalSize) ? item.file.name : item.result?.filename;
                      handleDownload(url, name);
                    }}
                    onRemove={() => removeFile(item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {allCompleted && (
            <BatchSummaryCard 
              items={items}
              onDownloadAll={handleDownloadAll}
              onCompressMore={clearAll}
              isDownloading={isZipping}
            />
          )}

        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Smart Compression Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1.5">Smart Compression</h3>
              <p className="text-sm text-slate-600 font-medium">
                We'll automatically find the best balance of quality and file size.
              </p>
            </div>

            {/* Action Button */}
            <div className="pb-4">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleStartCompression}
                disabled={pendingItems.length === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Zap className="w-5 h-5 mr-2 animate-pulse" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Optimize Images
                  </>
                )}
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced" className="border-slate-100">
                <AccordionTrigger className="text-slate-700 font-bold hover:text-blue-600 hover:no-underline px-2 py-3">
                  Advanced Settings
                </AccordionTrigger>
                <AccordionContent className="px-2 pt-2 pb-4 space-y-6">
                  
                  {/* Quality Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-slate-700 font-semibold">Quality</Label>
                      <span className="text-blue-600 font-bold text-sm">{quality}%</span>
                    </div>
                    <Slider 
                      value={[quality]} 
                      onValueChange={(val) => setQuality(val[0])} 
                      max={100} 
                      step={1} 
                      className="py-2"
                      disabled={isProcessing}
                    />
                    <div className="flex justify-between text-xs font-medium text-slate-400">
                      <span>Smaller</span>
                      <span>Higher quality</span>
                    </div>
                  </div>

                  {/* Output Format */}
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold">Output Format</Label>
                    <Select value={targetFormat} onValueChange={setTargetFormat} disabled={isProcessing}>
                      <SelectTrigger className="w-full h-11 rounded-xl">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ORIGINAL">Keep original format</SelectItem>
                        <SelectItem value="WEBP">WEBP</SelectItem>
                        <SelectItem value="JPG">JPG</SelectItem>
                        <SelectItem value="PNG">PNG</SelectItem>
                        <SelectItem value="AVIF">AVIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metadata" className="text-slate-700 font-semibold cursor-pointer">Strip metadata</Label>
                      <Switch 
                        id="metadata" 
                        checked={stripMetadata} 
                        onCheckedChange={setStripMetadata} 
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="progressive" className="text-slate-700 font-semibold cursor-pointer">Progressive encoding</Label>
                      <Switch 
                        id="progressive" 
                        checked={progressive} 
                        onCheckedChange={setProgressive} 
                        disabled={isProcessing}
                      />
                    </div>
                  </div>

                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Pro Tip */}
            <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> Using the default <b>Smart Compression</b> is recommended for 99% of use cases.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Compress Image"
        content={
          <>
            <p>
              Our batch image compressor is built for speed, quality, and ease of use. Whether you're a designer, developer, or content creator, compressing and converting images online has never been simpler.
            </p>
            <p>
              Files are processed entirely on our servers using industry-leading algorithms like MozJPEG and libvips. Your uploads are encrypted in transit and deleted automatically — we never store or analyze your content.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
