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
import { Loader2, Lightbulb, Image as ImageIcon, Settings2, FileText, Download, CheckCircle, RefreshCcw } from "lucide-react";
import { usePdfToImage } from "@/hooks/usePdfToImage";
import { PdfToImageOptions } from "@/components/tool/PdfToImageOptions";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function PdfToImagePage() {
  const {
    fileInfo,
    options,
    setOptions,
    handleFileSelect,
    clearAll,
    convertFile,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = usePdfToImage();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Which image formats are supported?",
      answer: "We support exporting your PDF pages to highly compressed JPGs or lossless PNGs.",
    },
    {
      question: "Can I extract only specific pages?",
      answer: "Yes, you can choose to extract all pages, just the first page, or enter a custom range (e.g., 1-5, 7, 9-12) to extract only the pages you need.",
    },
    {
      question: "What DPI setting should I use?",
      answer: "72 DPI is best for web use and small file sizes. 150 DPI is a good standard balance, and 300 DPI should be used if you intend to print the exported images.",
    },
    {
      question: "Are my documents secure?",
      answer: "Absolutely. All processing happens on our secure servers, and your files (both the original PDF and the generated ZIP) are permanently deleted shortly after processing. We do not store, view, or share your data.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="PDF to Image"
            subtitle="Convert PDF documents to high-quality JPG or PNG images."
            icon={<ImageIcon className="w-6 h-6" />}
          />
          
          {!result && !fileInfo && (
            <UploadArea 
              acceptedFormats="PDF"
              maxSizeMB={FILE_LIMITS.PDF_MAX_SIZE_MB}
              onFileSelect={handleFileSelect}
              error={uploadError}
              onErrorClear={clearUploadError}
              multiple={false}
            />
          )}

          {!result && fileInfo && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[400px]">
                    {fileInfo.file.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span>{formatFileSize(fileInfo.file.size)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>
                      {fileInfo.pageCount !== undefined ? (
                        `${fileInfo.pageCount} page${fileInfo.pageCount === 1 ? "" : "s"}`
                      ) : (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Counting...
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAll}
                className="text-slate-500 hover:text-red-600 rounded-xl"
              >
                Change File
              </Button>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
              
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Images Ready</h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                Your PDF was successfully converted. We've packaged the images into a convenient ZIP archive.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Images Generated</span>
                  <span className="text-lg font-bold text-slate-700">{result.imageCount}</span>
                </div>
                <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ZIP Size</span>
                  <span className="text-lg font-bold text-slate-700">{formatFileSize(result.processedSize)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  size="lg" 
                  onClick={() => handleDownload(result.url, result.filename)}
                  className="w-full sm:w-auto px-8 h-12 rounded-xl text-base font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download ZIP
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-8 h-12 rounded-xl text-base font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCcw className="w-5 h-5 mr-2" />
                  Convert Another
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Settings / Actions */}
        <div className="lg:col-span-1">
          <ToolSettings>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Settings2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Export Settings</h3>
                  <p className="text-sm text-slate-500">Choose your output format and pages.</p>
                </div>
              </div>
              
              <PdfToImageOptions 
                options={options}
                onChange={setOptions}
                disabled={isProcessing || result !== null || !fileInfo}
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={convertFile}
                disabled={!fileInfo || isProcessing || result !== null}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Extracting Images...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Extract Images
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> If you only need a few pages, use the "Custom Range" setting to save processing time and download smaller ZIP files.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About PDF to Image"
        content={
          <>
            <p>
              The PDF to Image tool allows you to accurately convert document pages into highly compatible JPG or PNG images. Whether you need to share a specific page on social media or embed a document in a presentation, this tool provides you with the flexibility you need.
            </p>
            <p>
              By offering customizable DPI settings, you can ensure your images are perfectly sized for their destination—lightweight for the web, or high-resolution for printing. Plus, with page range selection, you can extract exactly what you need without downloading a massive ZIP file containing hundreds of unnecessary pages.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
