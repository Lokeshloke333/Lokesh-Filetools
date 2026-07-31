"use client";

import React from "react";
import Link from "next/link";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, Type, Lock, AlertTriangle, ShieldAlert, ArrowRight, Save, Stamp } from "lucide-react";
import { usePdfWatermark } from "@/hooks/usePdfWatermark";
import { PdfWatermarkPreview } from "@/components/tool/PdfWatermarkPreview";
import { PdfWatermarkOptions } from "@/components/tool/PdfWatermarkOptions";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function WatermarkPdfPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    config,
    updateConfig,
    imageFile,
    imagePreviewUrl,
    handleImageSelect,
    handleImageRemove,
    processWatermark
  } = usePdfWatermark();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Can I add an image as a watermark?",
      answer: "Yes, you can easily switch to 'Image Watermark' and upload a PNG, JPG, or SVG image. You can scale, rotate, and adjust the opacity of the image just like text.",
    },
    {
      question: "How do I watermark only specific pages?",
      answer: "In the watermark options under 'Pages to Apply', select 'Selected Pages'. Then, you can enter specific page numbers or ranges (e.g. 1-5, 8, 11-13) to only apply the watermark to those pages.",
    },
    {
      question: "Is my document secure?",
      answer: "Absolutely. We use secure memory processing. Your document is processed in real-time and deleted from our temporary storage immediately after you download the watermarked result.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Watermark PDF"
            subtitle="Add custom text or image watermarks to your PDF documents."
            icon={<Type className="w-6 h-6 text-indigo-600" />}
          />
          
          {!result && !fileInfo && (
            <UploadArea 
              acceptedFormats="PDF"
              accept="application/pdf,.pdf"
              maxSizeMB={FILE_LIMITS.PDF_MAX_SIZE_MB}
              onFileSelect={handleFileSelect}
              multiple={false}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {fileInfo && securityState === 'protected' && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Password Protected Document</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  This PDF is password protected. Please unlock it before adding a watermark.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={clearAll}>Try Another File</Button>
                  <Link href="/unlock-pdf">
                    <Button className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 group">
                      Unlock PDF <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
             </div>
          )}

          {fileInfo && securityState === 'corrupted' && (
             <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-bold text-red-800 mb-2">Corrupted Document</h3>
                <p className="text-red-700 mb-6">This PDF appears to be corrupted or unreadable.</p>
                <Button variant="outline" onClick={clearAll} className="border-red-200 hover:bg-red-100 text-red-700">Try Another File</Button>
             </div>
          )}

          {fileInfo && securityState === 'unsupported' && (
             <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                <ShieldAlert className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold text-orange-800 mb-2">Unsupported Encryption</h3>
                <p className="text-orange-700 mb-6">This PDF uses an unsupported encryption method.</p>
                <Button variant="outline" onClick={clearAll} className="border-orange-200 hover:bg-orange-100 text-orange-700">Try Another File</Button>
             </div>
          )}

          {!result && fileInfo && (securityState === 'notProtected' || securityState === 'permissionOnly') && (
            <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
              
              {isProcessing && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center min-w-[300px]">
                     <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
                     <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Document</h3>
                     <p className="text-sm font-medium text-indigo-600 animate-pulse">{statusMessage || "Applying watermark..."}</p>
                   </div>
                </div>
              )}

              <PdfWatermarkPreview 
                file={fileInfo.file} 
                config={config}
                imagePreviewUrl={imagePreviewUrl}
              />
              <div className="mt-4 flex justify-end">
                 <Button variant="ghost" onClick={clearAll} disabled={isProcessing} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                    Cancel & Remove File
                 </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stamp className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Watermark Added Successfully</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                We've successfully applied your {result.watermarkType} watermark to <span className="font-bold text-slate-800">{result.pagesAffected}</span> pages in the document.
              </p>
              <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-500 mb-8 bg-white/60 p-3 rounded-lg inline-flex">
                 <span>New size: {formatFileSize(result.processedSize)}</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Watermark Another PDF</Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Settings / Actions */}
        <div className="lg:col-span-1">
          {(!fileInfo || securityState === 'idle' || securityState === 'inspecting' || securityState === 'protected' || securityState === 'corrupted' || securityState === 'unsupported') ? (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
              {securityState === 'inspecting' ? (
                <>
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Inspecting PDF</h3>
                  <p className="text-sm text-slate-600">Checking document structure...</p>
                </>
              ) : (
                <>
                  <Stamp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Watermark Settings</h3>
                  <p className="text-sm text-slate-600">
                    Upload a valid PDF to view and configure watermark options.
                  </p>
                </>
              )}
            </div>
          ) : (
            <ToolSettings>
              <PdfWatermarkOptions 
                config={config}
                updateConfig={updateConfig}
                imageFile={imageFile}
                onImageSelect={handleImageSelect}
                onImageRemove={handleImageRemove}
                disabled={isProcessing || result !== null}
              />

              {/* Action Button */}
              <div className="pt-6 pb-2 border-t border-slate-200 mt-6">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                  onClick={processWatermark}
                  disabled={isProcessing || result !== null || (config.type === 'image' && !imageFile)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {statusMessage || "Processing..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Apply Watermark
                    </>
                  )}
                </Button>
              </div>
            </ToolSettings>
          )}
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Watermark PDF"
        content={
          <>
            <p>
              Watermarking is a crucial step for protecting your intellectual property, branding your business documents, or marking drafts before distribution. Our tool allows you to achieve professional-grade results directly in your browser.
            </p>
            <p>
              You can instantly toggle between highly customizable text strings or custom logo images (including scalable vector SVGs). Using the live preview layout engine, you can fine-tune opacities, precise rotation degrees, and exact grid placements to ensure your watermark sits perfectly on the document without obscuring critical content.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
