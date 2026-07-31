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
import { Loader2, FileSpreadsheet, Lock, AlertTriangle, ShieldAlert, ArrowRight, Save, FileText } from "lucide-react";
import { usePdfExcel } from "@/hooks/usePdfExcel";
import { PdfExcelOptions } from "@/components/tool/PdfExcelOptions";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { formatFileSize } from "@/lib/utils/image";

export default function ExcelToPdfPage() {
  const {
    fileInfo,
    handleFileSelect,
    clearAll,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    options,
    updateOptions,
    processConversion
  } = usePdfExcel();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Are cell colors and fonts preserved?",
      answer: "Yes, our advanced conversion engine retains cell background colors, text colors, bold, and italic formatting from your original Excel spreadsheet.",
    },
    {
      question: "Will it convert all my tabs/worksheets?",
      answer: "Yes, every worksheet with data is converted into the PDF. Each worksheet starts on a fresh page with a bold header.",
    },
    {
      question: "What if my columns are too wide?",
      answer: "We recommend using the 'Fit to width' scaling option. It will automatically scale the PDF table columns to ensure they fit cleanly on your selected paper size.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Excel to PDF"
            subtitle="Convert Excel spreadsheets (.xlsx, .xls) to PDF while preserving formatting."
            icon={<FileSpreadsheet className="w-6 h-6 text-green-600" />}
          />
          
          {!result && !fileInfo && (
            <UploadArea 
              acceptedFormats="Excel (.xlsx, .xls)"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
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
                     <h3 className="text-lg font-bold text-slate-800 mb-2">Processing Excel</h3>
                     <p className="text-sm font-medium text-green-600 animate-pulse">{statusMessage || "Parsing worksheets..."}</p>
                   </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                 <FileSpreadsheet className="w-16 h-16 text-green-500 mb-4" />
                 <h3 className="text-xl font-bold text-slate-800 mb-2">{fileInfo.file.name}</h3>
                 <p className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 inline-block mb-6">
                   {formatFileSize(fileInfo.file.size)}
                 </p>
                 <p className="text-slate-600 max-w-md">
                   Ready to convert. Adjust your paper size and scaling options on the right, then click Convert.
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
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Excel Converted Successfully</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Successfully converted <span className="font-bold text-slate-800">{result.worksheetCount}</span> worksheet(s) into a high-quality PDF document.
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
                <Button variant="outline" size="lg" onClick={clearAll} className="bg-white">Convert Another Spreadsheet</Button>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20" onClick={() => handleDownload(result.url, result.filename)}>
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
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Conversion Settings</h3>
              <p className="text-sm text-slate-600">
                Upload an Excel file to view and configure layout options.
              </p>
            </div>
          ) : (
            <ToolSettings>
              <PdfExcelOptions 
                options={options}
                updateOptions={updateOptions}
                disabled={isProcessing || result !== null}
              />

              {/* Action Button */}
              <div className="pt-6 pb-2 border-t border-slate-200 mt-6">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
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
              </div>
            </ToolSettings>
          )}
        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Excel to PDF"
        content={
          <>
            <p>
              Converting spreadsheets to PDF format ensures that your data remains perfectly formatted when shared, printed, or viewed on different devices. It locks in cell dimensions, borders, and typography so your tables don't accidentally reflow or break.
            </p>
            <p>
              Our conversion engine deeply parses the `.xlsx` structure to extract not just raw values, but the underlying cell fills (background colors), bold/italic text styling, and text alignment. It then recalculates these properties into a precise, print-ready PDF document complete with automatic pagination.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
