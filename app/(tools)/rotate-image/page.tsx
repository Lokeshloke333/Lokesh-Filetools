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
import { RotateCw, Wand2, Lightbulb, Loader2, FlipHorizontal, FlipVertical } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageProcessor } from "@/hooks/useImageProcessor";
import { useDownload } from "@/hooks/useDownload";
import { ResultCard } from "@/components/tool/ResultCard";
import { FILE_LIMITS } from "@/lib/config";
import { useImagePreview } from "@/hooks/useImagePreview";
import { ImagePreview } from "@/components/image/ImagePreview";
import { ImageInfoCard } from "@/components/image/ImageInfoCard";

export default function RotateImagePage() {
  const [rotationType, setRotationType] = useState("90");
  const [customAngle, setCustomAngle] = useState([0]);
  const [flip, setFlip] = useState("none");
  const [backgroundType, setBackgroundType] = useState("transparent");
  const [customBg, setCustomBg] = useState("#ffffff");
  const [format, setFormat] = useState("ORIGINAL");

  const { file, uploadError, handleFileSelect, clearFile, clearUploadError } = useImageUpload();
  const preview = useImagePreview(file ? { file } : null);
  const { isProcessing: isRotating, result, processImage: rotateImage, clearResult } = useImageProcessor("rotate");
  const { handleDownload } = useDownload();

  // Sync transform state for live preview
  const setTransform = preview.setTransform;
  React.useEffect(() => {
    let currentAngle = parseInt(rotationType, 10);
    if (rotationType === "custom") {
      currentAngle = customAngle[0];
    }
    
    setTransform({
      scale: 1,
      rotation: currentAngle || 0,
      flipX: flip === "horizontal",
      flipY: flip === "vertical",
    });
  }, [rotationType, customAngle, flip, setTransform]);

  const handleRotate = () => {
    if (!file) return;

    let finalAngle = parseInt(rotationType, 10);
    if (rotationType === "custom") {
      finalAngle = customAngle[0];
    }

    let finalBg = backgroundType;
    if (backgroundType === "custom") {
      finalBg = customBg;
    }

    rotateImage(file, {
      angle: finalAngle,
      flip,
      background: finalBg,
      format,
    });
  };

  const handleReset = () => {
    clearFile();
    clearResult();
  };

  const faqs = [
    {
      question: "Can I use custom angles?",
      answer: "Yes, you can rotate your image to any exact degree between 0 and 360 using the Custom Angle option.",
    },
    {
      question: "What happens to the empty corners if I rotate slightly?",
      answer: "When rotating an image by an angle that is not a multiple of 90 degrees, empty triangular spaces appear in the corners. You can choose whether these corners are transparent (default) or filled with a custom solid color.",
    },
    {
      question: "Does flipping reduce image quality?",
      answer: "No, flipping horizontally or vertically is completely lossless.",
    },
  ];

  return (
    <ToolLayout>
      
      {/* 2-Column Tool Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header & Upload */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Rotate Image"
            subtitle="Rotate or flip your images effortlessly while preserving quality"
            icon={<RotateCw className="w-6 h-6" />}
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
              {isRotating && (
                <div className="absolute inset-0 z-40 bg-white/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border border-white/40 shadow-sm">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center animate-pulse mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Processing your image...</h3>
                  <p className="text-slate-500 font-medium">Please wait a moment</p>
                </div>
              )}
              
              <ImagePreview 
                image={preview.image}
                zoom={preview.zoom}
                onZoomChange={preview.setZoom}
                onClear={handleReset}
                fileName={file.name}
                transform={preview.transform}
              />
              
              <ImageInfoCard 
                originalWidth={preview.originalWidth}
                originalHeight={preview.originalHeight}
                originalFormat={file.type.split('/')[1] || "JPEG"}
                originalSize={preview.originalSize}
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
              mode="rotate"
            />
          )}
        </div>

        {/* Right Side: Settings */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            {/* Rotation */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Rotation Angle</Label>
              <Select value={rotationType} onValueChange={setRotationType} disabled={isRotating || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select angle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90° Clockwise</SelectItem>
                  <SelectItem value="-90">-90° Counter-Clockwise</SelectItem>
                  <SelectItem value="180">180° Upside Down</SelectItem>
                  <SelectItem value="custom">Custom Angle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Angle Slider */}
            {rotationType === "custom" && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs text-slate-500 font-medium">Angle</Label>
                  <span className="text-blue-600 font-bold text-sm">{customAngle[0]}°</span>
                </div>
                <Slider 
                  value={customAngle} 
                  onValueChange={setCustomAngle} 
                  min={0} 
                  max={360} 
                  step={1} 
                  disabled={isRotating || result !== null}
                  className="py-2"
                />
              </div>
            )}

            {/* Flip */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Flip Image</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={flip === "none" ? "default" : "outline"} 
                  className={`h-11 rounded-xl ${flip === "none" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" : ""}`}
                  onClick={() => setFlip("none")}
                  disabled={isRotating || result !== null}
                >
                  None
                </Button>
                <Button 
                  variant={flip === "horizontal" ? "default" : "outline"} 
                  className={`h-11 rounded-xl ${flip === "horizontal" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" : ""}`}
                  onClick={() => setFlip("horizontal")}
                  disabled={isRotating || result !== null}
                >
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Horz
                </Button>
                <Button 
                  variant={flip === "vertical" ? "default" : "outline"} 
                  className={`h-11 rounded-xl ${flip === "vertical" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20" : ""}`}
                  onClick={() => setFlip("vertical")}
                  disabled={isRotating || result !== null}
                >
                  <FlipVertical className="w-4 h-4 mr-2" />
                  Vert
                </Button>
              </div>
            </div>

            {/* Background Color */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Background Color</Label>
              <Select value={backgroundType} onValueChange={setBackgroundType} disabled={isRotating || result !== null}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transparent">Transparent (Recommended)</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="custom">Custom Color</SelectItem>
                </SelectContent>
              </Select>
              
              {backgroundType === "custom" && (
                <div className="flex items-center gap-3 pt-2">
                  <div 
                    className="w-11 h-11 rounded-xl border border-slate-200 shadow-inner overflow-hidden cursor-pointer relative"
                    style={{ backgroundColor: customBg }}
                  >
                    <input 
                      type="color" 
                      value={customBg} 
                      onChange={(e) => setCustomBg(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isRotating || result !== null}
                    />
                  </div>
                  <div className="text-sm font-medium text-slate-600 uppercase tracking-wider">{customBg}</div>
                </div>
              )}
            </div>

            {/* Output Format */}
            <div className="space-y-3 pt-4">
              <Label className="text-slate-700 font-semibold">Output Format</Label>
              <Select value={format} onValueChange={setFormat} disabled={isRotating || result !== null}>
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
                onClick={handleRotate}
                disabled={!file || isRotating || result !== null}
              >
                {isRotating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Rotate Image
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> If you select a custom angle, save your output as PNG or WEBP to preserve the transparent background corners.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Rotate Image"
        content={
          <>
            <p>
              Our Rotate Image tool allows you to fix upside-down photos or create perfectly angled layouts in seconds. Use quick presets for 90-degree turns or precise custom sliders for slight leveling adjustments.
            </p>
            <p>
              Like all our tools, processing is done securely. Your images are encrypted, never stored permanently, and automatically deleted.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
