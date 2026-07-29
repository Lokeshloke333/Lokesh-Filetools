"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, Image as ImageIcon, Wand2 } from "lucide-react";
import { useImageToPdf } from "@/hooks/useImageToPdf";
import { ImageReorderList } from "@/components/tool/ImageReorderList";
import { ImageToPdfOptions } from "@/components/tool/ImageToPdfOptions";
import { PdfResultCard } from "@/components/tool/PdfResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";

export default function ImageToPdfPage() {
  const {
    files,
    setFiles,
    options,
    setOptions,
    handleFilesSelect,
    removeFile,
    clearAll,
    generatePdf,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = useImageToPdf();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Which image formats are supported?",
      answer: "You can upload JPG/JPEG, PNG, WEBP, and AVIF images. All formats will be converted and embedded securely into a high-quality PDF document.",
    },
    {
      question: "Will my images lose quality?",
      answer: "No. We ensure that your images are preserved in their highest quality during the generation of the PDF. WEBP and AVIF files are seamlessly converted to high-quality JPEGs in the background to guarantee compatibility with all PDF viewers.",
    },
    {
      question: "Can I adjust the margins and page size?",
      answer: "Yes! You can choose standard page sizes like A4 or US Letter, select Portrait or Landscape orientation, and customize the margins to get the perfect print layout.",
    },
    {
      question: "Are my images secure?",
      answer: "Absolutely. All processing happens automatically on our secure servers, and your files are permanently deleted shortly after processing. We do not store, view, or share your data.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Image to PDF"
            subtitle="Convert multiple JPG/JPEG, PNG, and WEBP images into a single PDF document."
            icon={<ImageIcon className="w-6 h-6" />}
          />
          
          {!result && (
            <UploadArea 
              acceptedFormats="JPG/JPEG, PNG, WebP, AVIF"
              maxSizeMB={FILE_LIMITS.IMAGE_MAX_SIZE_MB}
              onFilesSelect={handleFilesSelect}
              multiple={true}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {!result && files.length > 0 && (
            <div className="mt-4">
              <ImageReorderList 
                files={files} 
                onReorder={setFiles} 
                onRemove={removeFile} 
              />
            </div>
          )}

          {result && (
            <PdfResultCard 
              result={result} 
              onDownload={() => handleDownload(result.url, result.filename)} 
              onReset={clearAll} 
            />
          )}
        </div>

        {/* Right Side: Settings / Actions */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Wand2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">PDF Settings</h3>
                  <p className="text-sm text-slate-500">Configure page layout</p>
                </div>
              </div>
              
              <ImageToPdfOptions 
                options={options}
                onChange={setOptions}
                disabled={isProcessing || result !== null || files.length === 0}
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={generatePdf}
                disabled={files.length === 0 || isProcessing || result !== null}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {statusMessage || "Processing..."}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Generate PDF
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> Reorder your images by dragging the handles. They will appear in the PDF in the exact order shown.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Image to PDF"
        content={
          <>
            <p>
              Our Image to PDF tool provides a quick and effortless way to consolidate your photos, scans, and graphics into a single, highly-portable PDF document. You can easily adjust the page size, apply margins, and tweak the orientation to ensure your final document looks professional and print-ready.
            </p>
            <p>
              By converting complex formats like WEBP and AVIF internally, we ensure maximum compatibility for your resulting PDF across all devices. We value your privacy, ensuring all files are encrypted during upload and securely deleted from our servers right after processing.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
