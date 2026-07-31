"use client";

import React from "react";
import Link from "next/link";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, Presentation, Lock, AlertTriangle, FileText, ArrowRight, Save } from "lucide-react";
import { usePdfPpt } from "@/hooks/usePdfPpt";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";

export default function PptToPdfPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    processConversion
  } = usePdfPpt();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Are slide transitions and animations preserved?",
      answer: "No. PDF is a static document format. Our engine renders the final static state of every slide, ensuring all shapes and text are visible, but active animations are removed.",
    },
    {
      question: "Can I include speaker notes?",
      answer: "Yes, simply toggle 'Include Speaker Notes' in the options panel. The generated PDF will append your notes below each slide, just like printing directly from PowerPoint.",
    },
    {
      question: "How do handouts work?",
      answer: "If you select 2, 4, or 6 slides per page, we will arrange the slides into a grid on a standard A4 or Letter page, saving paper and making it easier to distribute.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="PowerPoint to PDF"
            subtitle="Convert presentations (.ppt, .pptx) into high-quality PDFs while preserving slide layouts and formatting."
            icon={<Presentation className="w-6 h-6 text-orange-600" />}
          />
          
          {!result && !fileInfo && (
            <UploadArea 
              acceptedFormats="PowerPoint (.ppt, .pptx)"
              accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              maxSizeMB={100}
              onFileSelect={handleFileSelect}
              multiple={false}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {!result && fileInfo && (
            <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
              
              {isProcessing && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center min-w-[300px]">
                     <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-6" />
                     <h3 className="text-lg font-bold text-slate-800 mb-2">Converting Presentation</h3>
                     <p className="text-sm font-medium text-orange-600 animate-pulse">{statusMessage || "Rendering slides..."}</p>
                   </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                 <Presentation className="w-16 h-16 text-orange-500 mb-4" />
                 <h3 className="text-xl font-bold text-slate-800 mb-2">{fileInfo.file.name}</h3>
                 <p className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 inline-block mb-6">
                   {formatFileSize(fileInfo.file.size)}
                 </p>
                 <p className="text-slate-600 max-w-md mx-auto">
                   Presentation ready. Choose your layout options on the right, then click Convert to generate your PDF.
                 </p>
              </div>
              
              <div className="mt-4 flex justify-end">
                 <Button variant="ghost" onClick={clearAll} disabled={isProcessing} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                    Cancel & Remove File
                 </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Presentation Converted</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Successfully converted <span className="font-bold text-slate-800">{result.slideCount}</span> slides into a high-quality PDF document.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left bg-white p-4 rounded-xl border border-orange-100">
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Original</p>
                    <p className="text-sm font-medium text-slate-700 truncate" title={fileInfo?.file.name}>{fileInfo?.file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(result.originalSize)}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Converted</p>
                    <p className="text-sm font-medium text-slate-700 truncate" title={result.filename}>{result.filename}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(result.processedSize)}</p>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Convert Another</Button>
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Settings / Actions */}
        <div className="lg:col-span-1">
          {!fileInfo ? (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center h-full flex flex-col items-center justify-center min-h-[300px]">
              <Presentation className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Conversion Settings</h3>
              <p className="text-sm text-slate-600">
                Upload a presentation to view layout and handout options.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Presentation Information</h3>
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">File Name</span>
                      <span className="text-sm font-bold text-slate-800 truncate max-w-[150px]" title={fileInfo.file.name}>{fileInfo.file.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">Total Slides</span>
                      <span className="text-sm font-bold text-slate-800">-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500 font-medium">File Size</span>
                      <span className="text-sm font-bold text-slate-800">{formatFileSize(fileInfo.file.size)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Button 
                    size="lg" 
                    className="w-full h-14 rounded-2xl text-base font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                    onClick={processConversion}
                    disabled={isProcessing || result !== null}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {statusMessage || "Converting..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Convert to PDF
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center leading-relaxed mt-4">
                    Slides are converted exactly as they appear in your presentation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About PowerPoint to PDF Conversion"
        content={
          <>
            <p>
              Converting your `.ppt` or `.pptx` files to PDF guarantees that your presentation will look exactly the same on any device. Fonts are embedded, charts are rasterized, and vector graphics are locked into place so your slides never break or reflow.
            </p>
            <p>
              Our conversion pipeline utilizes a high-fidelity rendering engine that handles complex SmartArt, background gradients, and table matrices, generating a print-ready document perfect for sharing, handouts, or archiving.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
