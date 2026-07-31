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
import { Loader2, Layers, Lock, AlertTriangle, ShieldAlert, ArrowRight, Save, LayoutGrid } from "lucide-react";
import { usePdfOrganize } from "@/hooks/usePdfOrganize";
import { PdfOrganizeWorkspace } from "@/components/tool/PdfOrganizeWorkspace";
import { PdfOrganizeToolbar } from "@/components/tool/PdfOrganizeToolbar";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function OrganizePdfPage() {
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
    pages,
    selectAll,
    deselectAll,
    invertSelection,
    toggleSelection,
    deleteSelected,
    rotateSelected,
    rotateIndividual,
    resetAll,
    handleDragEnd,
    processOrganization
  } = usePdfOrganize();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "How do I reorder pages?",
      answer: "Upload your PDF file, then simply click and hold a page thumbnail to drag it to a new position. The layout will automatically update to reflect your changes.",
    },
    {
      question: "Can I delete or rotate pages while organizing?",
      answer: "Yes! Hover over any page to rotate it using the quick actions. Or, select multiple pages by clicking them, and use the toolbar at the top to rotate or delete them simultaneously.",
    },
    {
      question: "Is it safe to organize my PDF here?",
      answer: "Absolutely. We use secure memory processing, meaning your files are processed dynamically and deleted from our temporary storage immediately after you download the organized document.",
    },
  ];

  const selectedCount = pages.filter(p => p.isSelected).length;

  return (
    <ToolLayout>
      
      {!fileInfo && (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <ToolHeader 
            title="Organize PDF Pages"
            subtitle="Sort, rearrange, delete, and rotate PDF pages in an intuitive visual workspace."
            icon={<Layers className="w-6 h-6 text-blue-600" />}
          />
          <UploadArea 
            acceptedFormats="PDF"
            accept="application/pdf,.pdf"
            maxSizeMB={FILE_LIMITS.PDF_MAX_SIZE_MB}
            onFileSelect={handleFileSelect}
            multiple={false}
            error={uploadError}
            onErrorClear={clearUploadError}
          />
        </div>
      )}

      {fileInfo && securityState === 'protected' && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Password Protected Document</h3>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            This PDF is encrypted with a password. Please unlock it before organizing pages.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={clearAll}>Try Another File</Button>
            <Link href="/unlock-pdf">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 group">
                Unlock PDF <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {fileInfo && securityState === 'corrupted' && (
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-bold text-red-800 mb-2">Corrupted Document</h3>
          <p className="text-red-700 mb-6">This PDF appears to be corrupted or unreadable.</p>
          <Button variant="outline" onClick={clearAll} className="border-red-200 hover:bg-red-100 text-red-700">Try Another File</Button>
        </div>
      )}

      {fileInfo && securityState === 'unsupported' && (
        <div className="max-w-2xl mx-auto bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
          <ShieldAlert className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h3 className="font-bold text-orange-800 mb-2">Unsupported Encryption</h3>
          <p className="text-orange-700 mb-6">This PDF uses an unsupported encryption method.</p>
          <Button variant="outline" onClick={clearAll} className="border-orange-200 hover:bg-orange-100 text-orange-700">Try Another File</Button>
        </div>
      )}

      {fileInfo && (securityState === 'notProtected' || securityState === 'permissionOnly') && !result && (
        <div className="w-full relative min-h-[500px]">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            
            {/* Toolbar */}
            <PdfOrganizeToolbar 
              selectedCount={selectedCount}
              totalCount={pages.length}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onInvertSelection={invertSelection}
              onDeleteSelected={deleteSelected}
              onRotateLeft={() => rotateSelected('left')}
              onRotateRight={() => rotateSelected('right')}
              onReset={resetAll}
              disabled={isProcessing}
            />

            {/* Workspace */}
            <div className="flex-1 overflow-y-auto">
              {isProcessing ? (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-b-2xl">
                   <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center min-w-[300px]">
                     <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                     <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Document</h3>
                     <p className="text-sm font-medium text-blue-600 animate-pulse">{statusMessage || "Organizing PDF..."}</p>
                   </div>
                </div>
              ) : (
                <PdfOrganizeWorkspace 
                  file={fileInfo.file}
                  pages={pages}
                  onToggleSelection={toggleSelection}
                  onRotateIndividual={rotateIndividual}
                  onDragEnd={handleDragEnd}
                />
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="bg-white border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-40">
              <Button variant="ghost" onClick={clearAll} disabled={isProcessing} className="text-slate-500 w-full sm:w-auto">
                Cancel
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="hidden md:flex text-sm font-medium text-slate-500 mr-2">
                   {pages.length} Pages Final
                 </div>
                 <Button 
                   size="lg" 
                   onClick={processOrganization} 
                   disabled={isProcessing || pages.length === 0}
                   className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20"
                 >
                   <Save className="w-5 h-5 mr-2" />
                   Generate PDF
                 </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {result && (
        <div className="max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">PDF Organized Successfully!</h3>
          <p className="text-slate-600 mb-4 max-w-lg mx-auto">
            Your document has been reordered, rotated, and processed based on your workspace setup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-slate-500 mb-8 bg-white/60 p-3 rounded-lg inline-flex">
            <span>Original: {result.originalPageCount} pages</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="text-green-700 font-bold">Final: {result.finalPageCount} pages</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span>{formatFileSize(result.processedSize)}</span>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Organize Another PDF</Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" onClick={() => handleDownload(result.url, result.filename)}>
              Download Organized PDF
            </Button>
          </div>
        </div>
      )}

      <div className="mt-20">
        <RelatedTools />
        <FAQSection faqs={faqs} />
        <AboutTool 
          title="About Organize PDF"
          content={
            <>
              <p>
                The Organize PDF tool is a powerful visual workspace that combines multiple operations into one seamless interface. Instead of using separate tools to delete, rotate, and reorder pages, you can do it all here.
              </p>
              <p>
                We engineered this workspace with performance in mind. Using advanced virtualization and Intersection Observers, even massive documents with hundreds of pages load their thumbnails instantly without crashing your browser. Your final PDF is securely processed exactly as you laid it out.
              </p>
            </>
          }
        />
      </div>

    </ToolLayout>
  );
}
