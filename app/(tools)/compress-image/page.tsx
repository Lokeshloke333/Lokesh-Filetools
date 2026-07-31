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
import { Minimize2, Wand2, Lightbulb, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImagePreview } from "@/components/image/ImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";

export default function CompressImagePage() {
  const [stripMetadata, setStripMetadata] = useState(true);
  const [progressive, setProgressive] = useState(true);

  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const preview = useImagePreview(file ? { file } : null);
  const { isProcessing: isCompressing, result, processImage: compressImage, clearResult } = useImageProcessor("compress");
  const { handleDownload } = useDownload();

  const handleCompress = () => {
    if (!file) return;
    compressImage(file, {
      quality: preview.quality,
      format: preview.targetFormat,
      stripMetadata,
      progressive,
    });
  };

  const handleReset = () => {
    clearFile();
    clearResult();
  };

  const faqs = [
    {
      question: "What file formats does Compress Image support?",
      answer: "We support all major image formats including JPG, PNG, WebP, GIF, and AVIF. You can upload any of these formats and choose your desired output format.",
    },
    {
      question: "How large can my files be?",
      answer: "For free users, the maximum file size is 50MB per image. Premium users can upload images up to 200MB.",
    },
    {
      question: "Are my files stored after processing?",
      answer: "No. All files are automatically and permanently deleted from our servers within 2 hours of processing. We respect your privacy and never store or look at your files.",
    },
    {
      question: "Is the quality loss noticeable?",
      answer: "We use advanced compression algorithms (like MozJPEG and UPNG) to minimize quality loss. At the default 80% setting, the quality difference is virtually imperceptible to the human eye, but the file size is drastically reduced.",
    },
  ];

  return (
    <ToolLayout>
      
      {/* 2-Column Tool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Compress Image"
            subtitle="Reduce image size without quality loss"
            icon={<Minimize2 className="w-6 h-6" />}
          />
          
          {!file && !result && (
            <UploadArea 
              acceptedFormats="JPG/JPEG, PNG, WebP, GIF, AVIF"
              maxSizeMB={FILE_LIMITS.IMAGE_MAX_SIZE_MB}
              onFileSelect={handleFileSelect}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {file && !result && (
            <div className="relative">
              {isCompressing && (
                <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/40 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center animate-pulse mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Compressing your image...</h3>
                  <p className="text-slate-500 font-medium">Please wait a moment</p>
                </div>
              )}
              
              <ImagePreview 
                image={preview.image}
                zoom={preview.zoom}
                onZoomChange={preview.setZoom}
                onClear={handleReset}
                fileName={file.name}
              />
              
              <ImageInfoCard 
                originalWidth={preview.originalWidth}
                originalHeight={preview.originalHeight}
                originalFormat={file.type.split('/')[1] || "JPEG"}
                originalSize={preview.originalSize}
                previewFormat={preview.targetFormat === "ORIGINAL" ? file.type.split('/')[1] : preview.targetFormat}
                estimatedSize={preview.estimatedSize}
              />
            </div>
          )}

          {result && file && (
            <ResultCard 
              result={result} 
              originalFile={file} 
              onDownload={() => handleDownload(result.preview, result.filename)} 
              onReset={handleReset} 
              mode="compress"
            />
          )}
        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Quality Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-slate-700 font-semibold">Quality</Label>
                <span className="text-blue-600 font-bold text-sm">{preview.quality}%</span>
              </div>
              <Slider 
                value={[preview.quality]} 
                onValueChange={(val) => preview.setQuality(val[0])} 
                max={100} 
                step={1} 
                className="py-2"
                disabled={isCompressing || result !== null}
              />
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Smaller</span>
                <span>Higher quality</span>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-3 pt-2">
              <Label className="text-slate-700 font-semibold">Output Format</Label>
              <Select value={preview.targetFormat} onValueChange={preview.setTargetFormat} disabled={isCompressing || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBP">WEBP</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                  <SelectItem value="AVIF">AVIF</SelectItem>
                  <SelectItem value="ORIGINAL">Keep original</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="metadata" className="text-slate-700 font-semibold cursor-pointer">Strip metadata</Label>
                <Switch 
                  id="metadata" 
                  checked={stripMetadata} 
                  onCheckedChange={setStripMetadata} 
                  disabled={isCompressing || result !== null}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="progressive" className="text-slate-700 font-semibold cursor-pointer">Progressive encoding</Label>
                <Switch 
                  id="progressive" 
                  checked={progressive} 
                  onCheckedChange={setProgressive} 
                  disabled={isCompressing || result !== null}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleCompress}
                disabled={!file || isCompressing || result !== null}
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Compress Image
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> WebP typically produces 25-35% smaller files than JPG at equivalent quality. Great for web use.
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
              Our compress image tool is built for speed, quality, and ease of use. Whether you're a designer, developer, or content creator, compressing and converting images online has never been simpler.
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
