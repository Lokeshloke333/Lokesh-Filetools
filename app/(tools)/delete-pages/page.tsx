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
import { Loader2, Lightbulb, Scissors, Lock, AlertTriangle, ShieldAlert, ArrowRight, Trash2 } from "lucide-react";
import { usePdfDelete } from "@/hooks/usePdfDelete";
import { PdfDeletePreview } from "@/components/tool/PdfDeletePreview";
import { PdfDeleteOptions } from "@/components/tool/PdfDeleteOptions";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function DeletePdfPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    deleteSelectedPages,
    securityState,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    selectedPages,
    setSelectedPages,
    handleSelectAll,
    handleDeselectAll,
    handleInvertSelection
  } = usePdfDelete();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Is it safe to delete pages from my PDF here?",
      answer: "Yes, absolutely. We use secure memory processing and your files are immediately deleted from our temporary storage right after you download the result. We do not store or read your documents.",
    },
    {
      question: "Can I delete multiple pages at once?",
      answer: "Yes! You can click on multiple page thumbnails to select them for deletion. You can also use the 'Select All' or 'Invert' buttons to quickly select a large number of pages.",
    },
    {
      question: "Why can't I delete all the pages?",
      answer: "A valid PDF document must contain at least one page. The tool will prevent you from deleting every single page to ensure the resulting file isn't corrupted.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Delete PDF Pages"
            subtitle="Remove unwanted pages from your PDF quickly and easily."
            icon={<Scissors className="w-6 h-6 text-red-600" />}
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
                  This PDF is password protected. Please unlock it before deleting pages.
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
            <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PdfDeletePreview 
                file={fileInfo.file} 
                selectedPages={selectedPages}
                onSelectionChange={setSelectedPages}
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
                <Trash2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Pages Deleted Successfully</h3>
              <p className="text-slate-600 mb-2">
                We successfully removed <span className="font-bold">{result.totalDeleted}</span> pages from your document.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Remaining pages: {result.totalRemaining} &bull; New size: {formatFileSize(result.processedSize)}
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={clearAll}>Delete More Pages</Button>
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
                  <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Inspecting PDF</h3>
                  <p className="text-sm text-slate-600">Checking document structure...</p>
                </>
              ) : (
                <>
                  <Scissors className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-2">Deletion Settings</h3>
                  <p className="text-sm text-slate-600">
                    Upload a valid PDF to view and select pages to delete.
                  </p>
                </>
              )}
            </div>
          ) : (
            <ToolSettings>
              <PdfDeleteOptions 
                totalPages={fileInfo.pageCount || 0}
                selectedPages={selectedPages}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onInvertSelection={handleInvertSelection}
                disabled={isProcessing || result !== null || !fileInfo.pageCount}
              />

              {/* Action Button */}
              <div className="pt-6 pb-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                  onClick={deleteSelectedPages}
                  disabled={isProcessing || result !== null || selectedPages.size === 0 || selectedPages.size >= (fileInfo.pageCount || 1)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {statusMessage || "Processing..."}
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Selected Pages
                    </>
                  )}
                </Button>
              </div>

              {/* Pro Tip */}
              <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 leading-relaxed font-medium">
                  <span className="font-bold">Pro Tip:</span> Selected pages will be marked with a <Trash2 className="w-3 h-3 inline-block -mt-1 mx-0.5" /> icon and a red border. They will be entirely removed from the final file.
                </p>
              </div>
            </ToolSettings>
          )}
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Delete PDF Pages"
        content={
          <>
            <p>
              Sometimes a PDF has extra blank pages, cover sheets you don't need, or sensitive pages you want to remove before sharing. Our Delete PDF Pages tool allows you to visually select the pages you want to eliminate.
            </p>
            <p>
              This tool utilizes client-side rendering with lazy-loading, meaning even massive 500-page documents will load their thumbnails efficiently without freezing your browser. Your final PDF is securely processed in memory and never stored on our servers.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
