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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Maximize, Wand2, Lightbulb, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImagePreview } from "@/components/image/ImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";

export default function ResizeImagePage() {
  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const { isProcessing: isResizing, result, processImage: resizeImage, clearResult } = useImageProcessor("resize");
  const { handleDownload } = useDownload();
  
  const [fit, setFit] = useState("inside");

  const preview = useImagePreview(file ? { file } : null);

  const handleResize = () => {
    if (!file) return;
    resizeImage(file, {
      width: preview.targetWidth ? preview.targetWidth : "",
      height: preview.targetHeight ? preview.targetHeight : "",
      maintainAspectRatio: preview.maintainAspectRatio,
      fit,
      format: preview.targetFormat,
    });
  };

  const handleReset = () => {
    clearFile();
    clearResult();
  };

  const faqs = [
    {
      question: "Will resizing my image reduce its quality?",
      answer: "We use advanced resampling algorithms to ensure the highest possible quality when enlarging or shrinking your images.",
    },
    {
      question: "What is Maintain Aspect Ratio?",
      answer: "When this is enabled, the image will preserve its original proportions so it won't look stretched or squished.",
    },
    {
      question: "Are my files stored after processing?",
      answer: "No. All files are automatically and permanently deleted from our servers within 2 hours of processing. We respect your privacy and never store or look at your files.",
    },
  ];

  const inputClasses = "flex h-11 w-full rounded-xl border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <ToolLayout>
      
      {/* 2-Column Tool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Resize Image"
            subtitle="Resize images to any dimensions while maintaining excellent quality"
            icon={<Maximize className="w-6 h-6" />}
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
              {isResizing && (
                <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/40 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center animate-pulse mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Resizing your image...</h3>
                  <p className="text-slate-500 font-medium">Please wait a moment</p>
                </div>
              )}
              
              <ImagePreview 
                image={preview.image}
                zoom={preview.zoom}
                onZoomChange={preview.setZoom}
                onClear={handleReset}
                fileName={file.name}
                targetWidth={preview.targetWidth || undefined}
                targetHeight={preview.targetHeight || undefined}
              />
              
              <ImageInfoCard 
                originalWidth={preview.originalWidth}
                originalHeight={preview.originalHeight}
                originalFormat={file.type.split('/')[1] || "JPEG"}
                originalSize={preview.originalSize}
                previewWidth={preview.targetWidth || preview.originalWidth}
                previewHeight={preview.targetHeight || preview.originalHeight}
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
              mode="resize"
            />
          )}
        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Dimensions */}
            <div className="space-y-4">
              <Label className="text-slate-700 font-semibold">Dimensions</Label>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs text-slate-500 font-medium">Width (px)</Label>
                  <input 
                    type="number"
                    value={preview.targetWidth || ""}
                    onChange={(e) => preview.handleWidthChange(parseInt(e.target.value) || 0)}
                    placeholder="Auto"
                    className={inputClasses}
                    disabled={isResizing || result !== null}
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label className="text-xs text-slate-500 font-medium">Height (px)</Label>
                  <input 
                    type="number"
                    value={preview.targetHeight || ""}
                    onChange={(e) => preview.handleHeightChange(parseInt(e.target.value) || 0)}
                    placeholder="Auto"
                    className={inputClasses}
                    disabled={isResizing || result !== null}
                  />
                </div>
              </div>
            </div>

            {/* Resize Mode */}
            <div className="space-y-3 pt-2">
              <Label className="text-slate-700 font-semibold">Resize Mode</Label>
              <Select value={fit} onValueChange={setFit} disabled={isResizing || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inside">Inside (Fit without cropping)</SelectItem>
                  <SelectItem value="outside">Outside (Fill covering bounding box)</SelectItem>
                  <SelectItem value="cover">Cover (Crop to fit)</SelectItem>
                  <SelectItem value="contain">Contain (Letterbox to fit)</SelectItem>
                  <SelectItem value="fill">Fill (Stretch to fit)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Output Format */}
            <div className="space-y-3 pt-2">
              <Label className="text-slate-700 font-semibold">Output Format</Label>
              <Select value={preview.targetFormat} onValueChange={preview.setTargetFormat} disabled={isResizing || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORIGINAL">Keep original</SelectItem>
                  <SelectItem value="WEBP">WEBP</SelectItem>
                  <SelectItem value="JPG">JPG</SelectItem>
                  <SelectItem value="PNG">PNG</SelectItem>
                  <SelectItem value="AVIF">AVIF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="aspect" className="text-slate-700 font-semibold cursor-pointer">Maintain Aspect Ratio</Label>
                <Switch 
                  id="aspect" 
                  checked={preview.maintainAspectRatio} 
                  onCheckedChange={preview.setMaintainAspectRatio} 
                  disabled={isResizing || result !== null}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleResize}
                disabled={!file || isResizing || result !== null || (!preview.targetWidth && !preview.targetHeight)}
              >
                {isResizing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Resizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Resize Image
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> Leave one dimension blank and turn on Maintain Aspect Ratio to automatically calculate the correct size!
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Resize Image"
        content={
          <>
            <p>
              Our resize image tool gives you pixel-perfect control over your pictures. Easily change dimensions for social media, print, or web performance.
            </p>
            <p>
              Files are processed entirely on our servers using fast native image manipulation libraries. Your uploads are encrypted in transit and deleted automatically — we never store your content.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
