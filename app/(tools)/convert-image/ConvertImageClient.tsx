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
import { FileDown, Wand2, Lightbulb, Loader2, ArrowRight } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImagePreview } from "@/components/image/ImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";
import { groupedConversions } from "@/lib/image/imageConversions";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";

export interface ConvertImageClientProps {
  initialFromFormat?: string;
  initialToFormat?: string;
  title?: string;
  subtitle?: string;
  faqs?: { question: string; answer: string }[];
  aboutTitle?: string;
  aboutContent?: React.ReactNode;
}

export function ConvertImageClient({
  initialFromFormat,
  initialToFormat,
  title = "Convert Image",
  subtitle = "Convert images between popular formats while preserving quality",
  faqs = [
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
    }
  ],
  aboutTitle = "About Convert Image",
  aboutContent = (
    <>
      <p>
        Our free image converter makes it easy to switch between JPG, PNG, WebP, AVIF, and GIF. Whether you need a transparent background or the smallest possible file size, we have you covered.
      </p>
      <p>
        By utilizing native server-side image processing algorithms, your photos are converted at lightning speed without installing any software.
      </p>
    </>
  )
}: ConvertImageClientProps) {
  const [stripMetadata, setStripMetadata] = useState(true);

  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const preview = useImagePreview(file ? { file } : null);
  const { isProcessing: isConverting, result, processImage: convertImage, clearResult } = useImageProcessor("convert");
  const { handleDownload } = useDownload();
  
  // Set default format based on props or original file
  React.useEffect(() => {
    if (file && preview.targetFormat === "ORIGINAL") {
      const type = file.type.split('/')[1]?.toUpperCase() || "JPG";
      
      if (initialToFormat) {
        preview.setTargetFormat(initialToFormat.toUpperCase());
      } else {
        preview.setTargetFormat(type === "JPG" || type === "JPEG" ? "PNG" : "JPG");
      }
    }
  }, [file, initialToFormat, preview]);

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

  const showQuality = ["JPG", "WEBP", "AVIF", "PNG"].includes(preview.targetFormat);
  const originalFormatStr = file ? file.type.split('/')[1].toUpperCase() : (initialFromFormat || "Auto-detect");

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title={title}
            subtitle={subtitle}
            icon={<FileDown className="w-6 h-6" />}
          />
          
          {!file && !result && (
            <UploadArea 
              acceptedFormats={initialFromFormat ? initialFromFormat : "JPG/JPEG, PNG, WebP, GIF, AVIF"}
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

        <div className="lg:col-span-1">
          <ToolSettings>
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold">Convert From</Label>
              <div className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 flex items-center px-3 text-sm text-slate-500 font-medium">
                {originalFormatStr}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Convert To</Label>
              <Select value={preview.targetFormat === "ORIGINAL" ? "" : preview.targetFormat} onValueChange={preview.setTargetFormat} disabled={isConverting || result !== null}>
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

            <div className="pt-6 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={handleConvert}
                disabled={!file || isConverting || result !== null || preview.targetFormat === "ORIGINAL"}
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

            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> If you are uploading photos to a website, converting them to WEBP or AVIF will dramatically improve your page load speeds!
              </p>
            </div>
          </ToolSettings>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Popular Image Conversions</h2>
          <p className="text-slate-600">Quickly convert between the most popular image formats.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedConversions).map(([group, conversions]) => (
            <div key={group} className="flex flex-col gap-3">
              <h3 className="font-bold text-slate-800 text-lg mb-2">Convert from {group}</h3>
              {conversions.map((conv) => (
                <Link 
                  key={conv.slug} 
                  href={`/${conv.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all group"
                >
                  <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {conv.from} to {conv.to}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
