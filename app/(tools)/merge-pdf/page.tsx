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
import { FileDown, Loader2, Lightbulb, FileText } from "lucide-react";
import { usePdfMerge } from "@/hooks/usePdfMerge";
import { PdfReorderList } from "@/components/tool/PdfReorderList";
import { PdfResultCard } from "@/components/tool/PdfResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";

export default function MergePdfPage() {
  const {
    files,
    setFiles,
    handleFilesSelect,
    removeFile,
    clearAll,
    mergeFiles,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = usePdfMerge();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "How do I reorder the PDF files?",
      answer: "After uploading your files, you can drag and drop them using the handle on the left side of each file in the list. They will be merged in the exact order shown from top to bottom.",
    },
    {
      question: "Is there a limit to how many files I can merge?",
      answer: "While there is no strict limit on the number of files, merging extremely large files might take a little longer. We recommend keeping the total file size reasonable for the best experience.",
    },
    {
      question: "Are my files secure?",
      answer: "Yes! Your files are transmitted securely, processed automatically on our servers, and immediately deleted after merging. We do not store or read your documents.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Merge PDF"
            subtitle="Combine multiple PDF documents into a single file easily and securely."
            icon={<FileDown className="w-6 h-6" />}
          />
          
          {!result && (
            <UploadArea 
              acceptedFormats="PDF"
              maxSizeMB={FILE_LIMITS.PDF_MAX_SIZE_MB}
              onFilesSelect={handleFilesSelect}
              multiple={true}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {!result && files.length > 0 && (
            <div className="mt-4">
              <PdfReorderList 
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
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Merge Settings</h3>
                  <p className="text-sm text-slate-500">Order and combine files</p>
                </div>
              </div>
              
              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p>1. Upload two or more PDF files.</p>
                <p>2. Drag the handles to rearrange the order.</p>
                <p>3. Click the button below to merge them.</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-6 pb-2">
              <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                onClick={mergeFiles}
                disabled={files.length < 2 || isProcessing || result !== null}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {statusMessage || "Processing..."}
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5 mr-2" />
                    Merge PDFs
                  </>
                )}
              </Button>
            </div>

            {/* Pro Tip */}
            <div className="mt-auto bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 leading-relaxed font-medium">
                <span className="font-bold">Pro Tip:</span> The file at the top of the list will be the first pages of your merged PDF document.
              </p>
            </div>

          </ToolSettings>
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Merge PDF"
        content={
          <>
            <p>
              Our Merge PDF tool makes it incredibly easy to combine multiple PDF files into a single, organized document. Whether you're assembling a report from multiple sources, combining invoices, or merging scanned pages, our tool handles it seamlessly.
            </p>
            <p>
              We prioritize your privacy and security. The merge process is fully automated on our secure servers, and all files (both original and merged) are permanently deleted from our systems shortly after processing. We never look at your content or share it with third parties.
            </p>
          </>
        }
      />

    </ToolLayout>
  );
}
