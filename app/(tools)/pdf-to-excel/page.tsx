"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, FileSpreadsheet, Lock, AlertTriangle, FileText, ArrowRight, Save, Wand2 } from "lucide-react";
import { usePdfToExcel } from "@/hooks/usePdfToExcel";
import { useDownload } from "@/hooks/useDownload";
import { formatFileSize } from "@/lib/utils/image";
import Link from "next/link";

export default function PdfToExcelPage() {
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
  } = usePdfToExcel();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Will my tables be preserved accurately?",
      answer: "We use a spatial heuristic engine that analyzes the X/Y coordinates of every text character on the page to rebuild the grid. It works phenomenally well for clean digital PDFs (like invoices or financial reports).",
    },
    {
      question: "Why did it fail on my scanned document?",
      answer: "If a PDF was generated from a scanner, it is essentially a flat image. Since there is no actual text data embedded, our engine cannot extract the numbers. OCR support is coming soon.",
    },
    {
      question: "Are multiple tables merged together?",
      answer: "No. If multiple distinct pages contain tables, our engine intelligently creates multiple separate worksheets in the final Excel file, keeping your data perfectly organized.",
    },
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        <ToolHeader 
          title="PDF to Excel"
          subtitle="Extract tables and structured data from PDFs into editable Excel spreadsheets."
          icon={<FileSpreadsheet className="w-6 h-6 text-green-500" />}
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
                   <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-6" />
                   <h3 className="text-lg font-bold text-slate-800 mb-2">Extracting Data</h3>
                   <p className="text-sm font-medium text-green-600 animate-pulse">{statusMessage || "Analyzing..."}</p>
                 </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
               <div className="relative">
                 <FileText className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                 <Wand2 className="w-8 h-8 text-green-500 absolute -bottom-2 -right-2" />
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
                       <p className="text-sm opacity-90 mb-3">This file requires a password before we can extract tables from it.</p>
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
                      className="w-full h-14 rounded-2xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all"
                      onClick={processConversion}
                      disabled={isProcessing}
                    >
                      Extract to Excel <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <p className="text-xs text-slate-500">
                      Our engine will attempt to locate spatial tables and format them into Excel worksheets.
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSpreadsheet className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Excel File Ready</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Successfully extracted <span className="font-bold text-slate-800">{result.tablesDetected}</span> tables across <span className="font-bold text-slate-800">{result.worksheetCount}</span> worksheet(s).
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left bg-white p-4 rounded-xl border border-green-100">
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
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" onClick={() => handleDownload(result.url, result.filename)}>
                Download Excel
              </Button>
            </div>
          </div>
        )}
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About PDF to Excel Extraction"
        content={
          <>
            <p>
              Unlike simple word processing documents, PDFs do not natively contain "tables". A PDF is simply a collection of letters drawn at specific X and Y coordinates on a virtual canvas.
            </p>
            <p>
              Our conversion engine uses an advanced spatial heuristic to reconstruct tables. It scans the page, identifies rows of text that are horizontally aligned, and then groups them into columns based on their vertical positioning. It then automatically maps these structured grids into native Excel `.xlsx` spreadsheets. 
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
