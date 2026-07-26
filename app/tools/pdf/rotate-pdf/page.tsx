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
import { Loader2, Lightbulb, RotateCw, Lock, AlertTriangle, ShieldAlert, ArrowRight } from "lucide-react";
import { usePdfRotate } from "@/hooks/usePdfRotate";
import { PdfRotatePreview } from "@/components/tool/PdfRotatePreview";
import { PdfRotateOptions } from "@/components/tool/PdfRotateOptions";
import { PdfUnlockResultCard } from "@/components/tool/PdfUnlockResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function RotatePdfPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    rotateFile,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    degrees,
    setDegrees,
    pageScope,
    setPageScope,
    pageSelection,
    setPageSelection,
  } = usePdfRotate();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Are the rotations permanent?",
      answer: "Yes, when you rotate a PDF and download it, the rotation is permanently applied to the file structure. It will open correctly in any PDF viewer.",
    },
    {
      question: "Can I rotate just one page?",
      answer: "Yes! Choose the 'Selected Pages' option. You can enter a single page number (e.g., '1'), multiple pages separated by commas (e.g., '1, 3, 5'), or a range of pages (e.g., '1-5'). Or you can just visually click the thumbnails to toggle them.",
    },
    {
      question: "Why do I get an error when I try to rotate my PDF?",
      answer: "If your PDF is password protected (user password required to open), we cannot rotate it until it is unlocked. You will be prompted to use our Unlock PDF tool first.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Rotate PDF"
            subtitle="Rotate your PDF pages 90°, 180°, or 270° easily and permanently."
            icon={<RotateCw className="w-6 h-6 text-amber-600" />}
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
                  This PDF requires a password to open. It must be unlocked before it can be rotated.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={clearAll}>Try Another File</Button>
                  <Link href="/tools/pdf/unlock">
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
            <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PdfRotatePreview 
                file={fileInfo.file} 
                degrees={degrees}
                pageScope={pageScope}
                pageSelection={pageSelection}
                onSelectionChange={setPageSelection}
                onScopeChange={setPageScope}
              />
              <div className="mt-4 flex justify-end">
                 <Button variant="ghost" onClick={clearAll} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                    Cancel & Remove File
                 </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCw className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">PDF Rotated Successfully</h3>
              <p className="text-slate-600 mb-6">
                Your rotated PDF ({formatFileSize(result.processedSize)}) is ready for download.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={clearAll}>Rotate Another PDF</Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                  Download Rotated PDF
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
                  <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Inspecting PDF</h3>
                  <p className="text-sm text-slate-600">Checking document structure...</p>
                </>
              ) : (
                <>
                  <RotateCw className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Rotation Settings</h3>
                  <p className="text-sm text-slate-600">
                    Upload a valid PDF to configure rotation options.
                  </p>
                </>
              )}
            </div>
          ) : (
            <ToolSettings>
              <PdfRotateOptions 
                degrees={degrees}
                setDegrees={setDegrees}
                pageScope={pageScope}
                setPageScope={setPageScope}
                pageSelection={pageSelection}
                setPageSelection={setPageSelection}
                disabled={isProcessing || result !== null}
              />

              {/* Action Button */}
              <div className="pt-6 pb-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                  onClick={rotateFile}
                  disabled={isProcessing || result !== null || (pageScope === 'selected' && !pageSelection.trim())}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {statusMessage || "Processing..."}
                    </>
                  ) : (
                    <>
                      <RotateCw className="w-5 h-5 mr-2" />
                      Rotate PDF
                    </>
                  )}
                </Button>
              </div>

              {/* Pro Tip */}
              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  <span className="font-bold">Pro Tip:</span> You can visually select the pages you want to rotate by clicking on the thumbnails in the preview grid!
                </p>
              </div>
            </ToolSettings>
          )}
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Rotate PDF"
        content={
          <>
            <p>
              Our Rotate PDF tool is designed for absolute ease of use. Whether your scanned document came out sideways, upside down, or just slightly off, you can visually select pages and permanently correct their orientation before saving.
            </p>
            <p>
              Every file is processed securely in memory and deleted instantly after rotation. No data is stored, and your sensitive documents remain completely private.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
