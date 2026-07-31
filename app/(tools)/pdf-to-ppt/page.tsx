"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, Presentation, Lock, AlertTriangle, FileText, ArrowRight, Save, Wand2 } from "lucide-react";
import { usePdfToPpt } from "@/hooks/usePdfToPpt";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";
import Link from "next/link";

export default function PdfToPptPage() {
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
  } = usePdfToPpt();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Will the text in my PowerPoint be editable?",
      answer: "Yes. Our conversion engine extracts text layers from the PDF and creates true PowerPoint text boxes. You can edit, delete, or reformat the text immediately after opening the PPTX.",
    },
    {
      question: "Why did it fail on my scanned document?",
      answer: "If a PDF was generated from a scanner, it is essentially a flat image without selectable text. Our engine currently requires text layers to rebuild the presentation.",
    },
    {
      question: "Will my fonts look exactly the same?",
      answer: "Because we cannot legally embed proprietary PDF fonts into a generic PowerPoint file, we map the text to standard system fonts (like Arial or Calibri) while preserving the layout and font sizes as accurately as possible.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <ToolHeader 
          title="PDF to PowerPoint"
          subtitle="Convert static PDF documents into editable PowerPoint (.pptx) presentations instantly."
          icon={<Presentation className="w-6 h-6 text-orange-500" />}
        />
        
        {!result && !fileInfo && (
          <UploadArea 
            acceptedFormats="PDF (.pdf)"
            accept="application/pdf"
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
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Reconstructing Slides</h3>
                   <p className="text-sm font-medium text-orange-600 animate-pulse">{statusMessage || "Analyzing..."}</p>
                 </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
               <div className="relative">
                 <FileText className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                 <Wand2 className="w-8 h-8 text-orange-500 absolute -bottom-2 -right-2" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">{fileInfo.file.name}</h3>
               <p className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 inline-block mb-6">
                 {formatFileSize(fileInfo.file.size)}
               </p>
               
               {uploadError && uploadError.includes("password protected") ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mb-6">
                     <Lock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-amber-600" />
                     <div>
                       <p className="font-semibold text-sm mb-1">Protected PDF Detected</p>
                       <p className="text-sm opacity-90 mb-3">This file requires a password before we can reconstruct it into slides.</p>
                       <Link href="/unlock-pdf">
                          <Button size="sm" variant="outline" className="bg-white hover:bg-amber-100 text-amber-700 border-amber-300">
                             Go to Unlock PDF
                          </Button>
                       </Link>
                     </div>
                  </div>
               ) : uploadError && uploadError.includes("scanned") ? (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mb-6">
                     <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
                     <div>
                       <p className="font-semibold text-sm mb-1">Scanned PDF Detected</p>
                       <p className="text-sm opacity-90">{uploadError.replace(`${fileInfo.file.name}: `, '')}</p>
                     </div>
                  </div>
               ) : uploadError ? (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mb-6">
                     <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                     <p className="text-sm">{uploadError.replace(`${fileInfo.file.name}: `, '')}</p>
                  </div>
               ) : (
                  <div className="space-y-4 max-w-md mx-auto">
                    <Button 
                      size="lg" 
                      className="w-full h-14 rounded-2xl text-base font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20 transition-all"
                      onClick={processConversion}
                      disabled={isProcessing}
                    >
                      Convert to PowerPoint <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-slate-500">
                      Our engine will attempt to locate text and reconstruct editable slides.
                    </p>
                  </div>
               )}
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
              <Presentation className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Presentation Ready</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Successfully reconstructed <span className="font-bold text-slate-800">{result.slideCount}</span> slides into an editable presentation.
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
              <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Convert Another PDF</Button>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                Download PowerPoint
              </Button>
            </div>
          </div>
        )}
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About PDF to PowerPoint Reconstruction"
        content={
          <>
            <p>
              Transforming a static PDF into an editable PowerPoint presentation is a highly complex process. A PDF is essentially a flat canvas with letters drawn at specific absolute coordinates, whereas PowerPoint uses structured text boxes and relative layouts.
            </p>
            <p>
              Our conversion engine utilizes advanced spatial heuristics. It scans the PDF for text characters, groups them into logical paragraphs or sentences, calculates the relative X and Y positions, and then programmatically generates brand new PowerPoint slides containing editable text boxes matching those coordinates.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
