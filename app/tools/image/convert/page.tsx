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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FileDown, Wand2, Lightbulb, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImagePreview } from "@/components/image/ImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";

export default function ConvertImagePage() {
  const [stripMetadata, setStripMetadata] = useState(true);

  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const preview = useImagePreview(file ? { file } : null);
  const { isProcessing: isConverting, result, processImage: convertImage, clearResult } = useImageProcessor("convert");
  const { handleDownload } = useDownload();
  
  // Set default format to JPG if original is not JPG, else PNG
  React.useEffect(() => {
    if (file && preview.targetFormat === "ORIGINAL") {
      const type = file.type.split('/')[1]?.toUpperCase() || "JPG";
      preview.setTargetFormat(type === "JPG" || type === "JPEG" ? "PNG" : "JPG");
    }
  }, [file]);

  const handleConvert = () => {
    if (!file) return;
    convertImage(file, {
      targetFormat: preview.targetFormat,
      quality: preview.quality,
      stripMetadata,
    });
  };

  const handleReset = () => {
    clearFile();
    clearResult();
  };

  // Determine if quality slider should be shown
  const showQuality = ["JPG", "WEBP", "AVIF", "PNG"].includes(preview.targetFormat);

  // Auto-detect format text
  const originalFormatStr = file ? file.type.split('/')[1].toUpperCase() : "Auto-detect";

  const faqs = [
    {
      question: "Which formats are supported?",
      answer: "You can convert between all popular image formats including JPG, PNG, WEBP, AVIF, and GIF. For example, you can seamlessly convert a WEBP to JPG, or a PNG to AVIF.",
    },
    {
      question: "Does converting reduce image quality?",
      answer: "It depends on the format and your quality settings. Converting to a lossless format like PNG preserves all data. Converting to JPG or WEBP allows you to adjust the quality slider to balance between file size and visual fidelity.",
    },
    {
      question: "What is AVIF?",
      answer: "AVIF is a modern, highly efficient image format that provides vastly superior compression compared to JPG and WEBP while maintaining incredible quality. It is widely supported by modern browsers.",
    },
  ];

  return (
    <ToolLayout>
      
      {/* 2-Column Tool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Convert Image"
            subtitle="Convert images between popular formats while preserving quality"
            icon={<FileDown className="w-6 h-6" />}
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
              {isConverting && (
                <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/40 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center animate-pulse mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Converting your image...</h3>
                  <p className="text-slate-500 font-medium">Please wait a moment</p>
                </div>
              )}
              
              <ImagePreview 
                image={preview.image}
                zoom={preview.zoom}
                onZoomChange={preview.setZoom}
                onClear={handleReset}
                fileName={file.name}
                simulateFormat={preview.targetFormat.toLowerCase()}
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
              mode="convert"
            />
          )}
        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Convert From */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Convert From</Label>
              <div className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-3 text-sm text-slate-500 font-medium">
                {originalFormatStr}
              </div>
            </div>

            {/* Convert To */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Convert To</Label>
              <Select value={preview.targetFormat} onValueChange={preview.setTargetFormat} disabled={isConverting || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl border-blue-200 focus:ring-blue-500 bg-blue-50/50">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                  <SelectItem value="WEBP">WEBP</SelectItem>
                  <SelectItem value="AVIF">AVIF</SelectItem>
                  <SelectItem value="GIF">GIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Slider */}
            {showQuality && (
              <div className="space-y-4 pt-4">
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
                  disabled={isConverting || result !== null}
                />
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>Smaller File</span>
                  <span>Better Quality</span>
                </div>
              </div>
            )}

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-slate-100 mt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="metadata" className="text-slate-700 font-semibold cursor-pointer">Strip EXIF metadata</Label>
                <Switch 
                  id="metadata" 
                  checked={stripMetadata} 
                  onCheckedChange={setStripMetadata} 
                  disabled={isConverting || result !== null}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleConvert}
                disabled={!file || isConverting || result !== null}
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Convert Image
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> If you are uploading photos to a website, converting them to WEBP or AVIF will dramatically improve your page load speeds!
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Convert Image"
        content={
          <>
            <p>
              Our free image converter makes it easy to switch between JPG, PNG, WebP, AVIF, and GIF. Whether you need a transparent background or the smallest possible file size, we have you covered.
            </p>
            <p>
              By utilizing native server-side image processing algorithms, your photos are converted at lightning speed without installing any software.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
