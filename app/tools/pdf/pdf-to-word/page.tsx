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
import { Loader2, Lightbulb, FileText, Wand2, Trash2 } from "lucide-react";
import { usePdfToWord } from "@/hooks/usePdfToWord";
import { PdfResultCard } from "@/components/tool/PdfResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/lib/utils/image";

export default function PdfToWordPage() {
  const {
    file,
    options,
    setOptions,
    handleFileSelect,
    clearFile,
    convertDocument,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = usePdfToWord();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "How do I convert a PDF to Word?",
      answer: "Drag and drop your PDF into the upload area. Choose your output format (DOCX) and click 'Convert to Word'. Your new, editable document will be generated instantly.",
    },
    {
      question: "Is this PDF to Word converter free?",
      answer: "Yes! Fileinator's PDF to Word converter is completely free to use with no hidden fees, subscriptions, or watermarks.",
    },
    {
      question: "Can I edit the converted Word document?",
      answer: "Absolutely. Our conversion engine extracts text and basic formatting from the PDF, resulting in a standard DOCX file that you can easily edit in Microsoft Word, Google Docs, or LibreOffice.",
    },
    {
      question: "Are my files secure?",
      answer: "Yes. Your files are encrypted during transfer and processed securely. They are never stored on our servers and are deleted immediately after conversion.",
    },
    {
      question: "Will the formatting look exactly the same?",
      answer: "PDFs do not natively store structural data like paragraphs and tables. We use advanced parsing to extract the text and reconstruct the basic layout. While perfect replication isn't always possible, we prioritize giving you an editable document.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & File Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="PDF to Word"
            subtitle="Convert PDF files into editable Word documents (DOCX) online for free."
            icon={<FileText className="w-6 h-6 text-blue-600" />}
          />
          
          {!result && !file && (
            <UploadArea 
              acceptedFormats="PDF"
              accept="application/pdf,.pdf"
              maxSizeMB={100}
              onFileSelect={(f) => handleFileSelect([f])}
              multiple={false}
              error={uploadError}
              onErrorClear={clearUploadError}
            />
          )}

          {!result && file && (
            <div className="mt-2">
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 border border-red-100">
                  <FileText className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {result && (
            <PdfResultCard 
              result={result} 
              onDownload={() => handleDownload(result.url, result.filename)} 
              onReset={clearFile} 
              title="Conversion Complete"
              successMessage="Your editable Word document is ready."
              sizeLabel="File Size"
              resetButtonText="Convert Another File"
              downloadButtonText="Download DOCX"
              icon={
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 border-2 border-blue-100 shadow-inner">
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
              }
            />
          )}
        </div>

        {/* Right Side: Options & Action Button */}
        <div>
          {!result ? (
            <ToolSettings title="Conversion Options">
              <div className="space-y-6">
                
                {/* Output Format */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">
                    Output Format
                  </label>
                  <RadioGroup
                    value={options.outputFormat}
                    onValueChange={(val: "DOCX") => setOptions({ ...options, outputFormat: val })}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="DOCX" id="format-docx" className="peer sr-only" />
                      <Label
                        htmlFor="format-docx"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        Word Document (.docx)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-semibold gap-2 py-6"
                  onClick={convertDocument}
                  disabled={!file || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{statusMessage || "Converting..."}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Convert to Word</span>
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your files are securely processed and automatically deleted immediately after conversion. We prioritize editable output over pixel-perfect layout preservation.
                  </span>
                </div>

              </div>
            </ToolSettings>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <h3 className="font-semibold text-slate-900 mb-2">Need More Options?</h3>
              <p className="text-sm text-slate-600 mb-4">
                You can try our other free tools to modify or protect your PDF documents.
              </p>
              <Button onClick={clearFile} variant="outline" className="w-full rounded-xl">
                Convert Another File
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* About Section */}
      <div className="mt-16">
        <AboutTool 
          title="About PDF to Word Converter"
          content={
            <div className="space-y-4">
              <p>
                Fileinator's PDF to Word converter extracts text from your PDF files and generates editable Microsoft Word (.docx) documents. Perfect for updating old reports, extracting text for re-use, and avoiding manual typing.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Prioritizes text extraction for maximum editability</li>
                <li>Instant, high-speed conversion process</li>
                <li>Generates universally compatible DOCX files</li>
                <li>100% free with top-tier browser security</li>
                <li>No watermarks, sign-ups, or hidden limits</li>
              </ul>
            </div>
          }
        />
      </div>

      {/* Related Tools */}
      <div className="mt-16">
        <RelatedTools />
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
