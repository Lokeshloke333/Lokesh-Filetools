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
import { FileDown, Loader2, Lightbulb, FileText, Minimize } from "lucide-react";
import { usePdfCompress } from "@/hooks/usePdfCompress";
import { PdfCompressPreview } from "@/components/tool/PdfCompressPreview";
import { PdfCompressOptions } from "@/components/tool/PdfCompressOptions";
import { PdfCompressResultCard } from "@/components/tool/PdfCompressResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";

export default function CompressPdfPage() {
  const {
    fileInfo,
    level,
    setLevel,
    handleFileSelect,
    clearAll,
    compressFile,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = usePdfCompress();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Which compression level should I choose?",
      answer: "We recommend 'Medium Compression' for most use cases, as it provides a great balance between file size reduction and image quality. Choose 'Low Compression' if you need to print the document, and 'High Compression' if you need the absolute smallest file size for web uploads.",
    },
    {
      question: "Will compression ruin my PDF's quality?",
      answer: "Text and vector graphics generally remain sharp regardless of the compression level. The quality changes mostly affect embedded images and photos.",
    },
    {
      question: "Are my files secure?",
      answer: "Yes! Your files are transmitted securely, processed automatically on our servers, and immediately deleted after compressing. We do not store or read your documents.",
    },
  ];

  return (
    <ToolLayout>
      <div className={`grid grid-cols-1 ${result ? '' : 'lg:grid-cols-3'} gap-8`}>
        
        {/* Left Side: Header, Upload & Preview (or Full Width Result) */}
        <div className={`${result ? 'w-full max-w-4xl mx-auto' : 'lg:col-span-2'} flex flex-col gap-6`}>
          <ToolHeader 
            title="Compress PDF"
            subtitle="Reduce your PDF file size instantly while maintaining the best possible quality."
            icon={<Minimize className="w-6 h-6" />}
          />
          
          {!result && !fileInfo && (
            <UploadArea 
              acceptedFormats="PDF"
              maxSizeMB={FILE_LIMITS.PDF_MAX_SIZE_MB}
              onFileSelect={handleFileSelect}
              multiple={false}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {!result && fileInfo && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 px-1">
                Document to Compress
              </h3>
              <PdfCompressPreview 
                fileInfo={fileInfo} 
                onRemove={clearAll} 
              />
            </div>
          )}

          {result && (
            <PdfCompressResultCard 
              result={result} 
              onDownload={() => handleDownload(result.url, result.filename)} 
              onReset={clearAll} 
            />
          )}
        </div>

        {/* Right Side: Settings / Actions (Hidden after compression) */}
        {!result && (
          <div className="lg:col-span-1">
            <ToolSettings>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                    <Minimize className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Compression Settings</h3>
                    <p className="text-sm text-slate-500">Choose optimization level</p>
                  </div>
                </div>
                
                <PdfCompressOptions 
                  level={level}
                  setLevel={setLevel}
                  disabled={isProcessing || !fileInfo}
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 pb-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                  onClick={compressFile}
                  disabled={!fileInfo || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {statusMessage || "Processing..."}
                    </>
                  ) : (
                    <>
                      <Minimize className="w-5 h-5 mr-2" />
                      Compress PDF
                    </>
                  )}
                </Button>
              </div>



            </ToolSettings>
          </div>
        )}

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Compress PDF"
        content={
          <>
            <p>
              Our Compress PDF tool allows you to dramatically reduce the file size of your documents without losing visual clarity. This makes sharing files over email, uploading to web portals, or storing on your device much faster and more efficient.
            </p>
            <p>
              We process everything securely on our servers without storing your files. Once your compressed file is generated, the original PDF is immediately discarded, ensuring your data remains private and protected.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
