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
import { Scissors, Loader2, Lightbulb, FileText } from "lucide-react";
import { usePdfSplit } from "@/hooks/usePdfSplit";
import { PdfSplitPreview } from "@/components/tool/PdfSplitPreview";
import { PdfSplitOptions } from "@/components/tool/PdfSplitOptions";
import { PdfSplitResultCard } from "@/components/tool/PdfSplitResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";

export default function SplitPdfPage() {
  const {
    fileInfo,
    mode,
    setMode,
    ranges,
    setRanges,
    extract,
    setExtract,
    handleFileSelect,
    clearAll,
    splitFiles,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = usePdfSplit();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "How do I split every page into a separate PDF?",
      answer: "Simply upload your PDF, select 'Split Every Page' from the options, and click 'Split PDF'. We will generate a ZIP file containing every page as a separate document.",
    },
    {
      question: "Can I extract specific pages?",
      answer: "Yes, you can use the 'Extract Selected Pages' option. Just enter the page numbers separated by commas (e.g., 1, 3, 5), and we will create a single PDF containing only those pages.",
    },
    {
      question: "Are my files secure?",
      answer: "Yes! Your files are transmitted securely, processed automatically on our servers, and immediately deleted after splitting. We do not store or read your documents.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Split PDF"
            subtitle="Extract pages or split your PDF into multiple documents instantly."
            icon={<Scissors className="w-6 h-6" />}
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
                Document to Split
              </h3>
              <PdfSplitPreview 
                fileInfo={fileInfo} 
                onRemove={clearAll} 
              />
            </div>
          )}

          {result && (
            <PdfSplitResultCard 
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
                  <Scissors className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Split Options</h3>
                  <p className="text-sm text-slate-500">Choose how to split</p>
                </div>
              </div>
              
              <PdfSplitOptions 
                mode={mode}
                setMode={setMode}
                ranges={ranges}
                setRanges={setRanges}
                extract={extract}
                setExtract={setExtract}
                disabled={isProcessing || result !== null || !fileInfo}
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={splitFiles}
                disabled={!fileInfo || isProcessing || result !== null}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {statusMessage || "Processing..."}
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Split PDF
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> All split files are packaged into a single ZIP archive for fast downloading.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Split PDF"
        content={
          <>
            <p>
              Our Split PDF tool provides flexible options to break down large documents into exactly what you need. Whether you want every page as a standalone file, or just want to extract a specific chapter using page ranges, you can do it with a few clicks.
            </p>
            <p>
              We process everything securely on our servers without storing your files. Once your ZIP file is generated, the original PDF is immediately discarded, ensuring your data remains private and protected.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
