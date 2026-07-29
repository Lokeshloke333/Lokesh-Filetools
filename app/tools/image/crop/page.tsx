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
import { Crop, Wand2, Lightbulb, Loader2 } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { InteractiveCropPreview } from "@/components/tool/InteractiveCropPreview";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";

export default function CropImagePage() {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [format, setFormat] = useState("ORIGINAL");
  const [cropData, setCropData] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const preview = useImagePreview(file ? { file } : null);
  const { isProcessing: isCropping, result, processImage: cropImage, clearResult } = useImageProcessor("crop");
  const { handleDownload } = useDownload();
  
  // Update the preview format when user changes format
  React.useEffect(() => {
    preview.setTargetFormat(format);
  }, [format]);

  // Update preview target dimensions based on crop
  React.useEffect(() => {
    if (cropData) {
      preview.handleWidthChange(cropData.width);
      preview.handleHeightChange(cropData.height);
    } else {
      preview.handleWidthChange(preview.originalWidth);
      preview.handleHeightChange(preview.originalHeight);
    }
  }, [cropData, preview.originalWidth, preview.originalHeight]);

  const handleCrop = () => {
    if (!file || !cropData) return;
    cropImage(file, {
      x: cropData.x,
      y: cropData.y,
      width: cropData.width,
      height: cropData.height,
      format,
    });
  };

  const handleReset = () => {
    clearFile();
    clearResult();
    setCropData(null);
  };

  const handleAspectChange = (val: string) => {
    if (val === "free") {
      setAspectRatio(undefined);
    } else {
      const [w, h] = val.split(":").map(Number);
      setAspectRatio(w / h);
    }
  };

  const faqs = [
    {
      question: "How do I crop an image precisely?",
      answer: "You can drag the crop box boundaries over your image. You can also lock the aspect ratio (like 1:1 for a square or 16:9 for a widescreen) to keep your dimensions perfectly proportional.",
    },
    {
      question: "Are my files stored after processing?",
      answer: "No. All files are automatically and permanently deleted from our servers within 2 hours of processing. We respect your privacy and never store or look at your files.",
    },
  ];

  return (
    <ToolLayout>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Crop Image"
            subtitle="Crop pictures quickly and precisely to get the exact frame you need"
            icon={<Crop className="w-6 h-6" />}
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
              {isCropping && (
                <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/40 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center animate-pulse mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Cropping your image...</h3>
                  <p className="text-slate-500 font-medium">Please wait a moment</p>
                </div>
              )}
              <InteractiveCropPreview 
                file={file} 
                onClear={handleReset} 
                aspectRatio={aspectRatio}
                onCropChange={setCropData}
              />
              <ImageInfoCard 
                originalWidth={preview.originalWidth}
                originalHeight={preview.originalHeight}
                originalFormat={file.type.split('/')[1] || "JPEG"}
                originalSize={preview.originalSize}
                previewWidth={cropData?.width || preview.originalWidth}
                previewHeight={cropData?.height || preview.originalHeight}
                previewFormat={format === "ORIGINAL" ? file.type.split('/')[1] : format}
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
              mode="crop"
            />
          )}
        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Aspect Ratio */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Aspect Ratio</Label>
              <Select defaultValue="free" onValueChange={handleAspectChange} disabled={isCropping || result !== null || !file}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select ratio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Custom Crop</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="3:2">3:2 (Classic Photo)</SelectItem>
                  <SelectItem value="9:16">9:16 (Story / Reel)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Output Format */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Output Format</Label>
              <Select value={format} onValueChange={setFormat} disabled={isCropping || result !== null || !file}>
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

            {/* Action Button */}
            <div className="pt-6 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleCrop}
                disabled={!file || isCropping || result !== null || !cropData}
              >
                {isCropping ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Cropping...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Crop Image
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> Select the 9:16 aspect ratio if you are cropping a photo specifically for an Instagram Story or TikTok.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Crop Image"
        content={
          <>
            <p>
              Our free crop image tool lets you perfectly frame your photos in seconds. Whether you need a square photo for a profile picture or a 16:9 banner, you can do it without losing quality.
            </p>
            <p>
              We process everything efficiently and securely. You don't need to download any heavy photo editing software. Just upload, crop, and download instantly.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
