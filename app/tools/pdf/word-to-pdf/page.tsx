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
import { Loader2, Lightbulb, FileText, Wand2 } from "lucide-react";
import { useWordToPdf } from "@/hooks/useWordToPdf";
import { useDocumentPreview } from "@/hooks/useDocumentPreview";
import { PreviewContainer } from "@/components/tool/Preview/PreviewContainer";
import { WordReorderList } from "@/components/tool/WordReorderList";
import { PdfResultCard } from "@/components/tool/PdfResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function WordToPdfPage() {
  const {
    files,
    setFiles,
    options,
    setOptions,
    handleFilesSelect,
    removeFile,
    clearAll,
    generatePdf,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
  } = useWordToPdf();
  
  const previewState = useDocumentPreview(files, options);

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "How do I convert Word to PDF?",
      answer: "Drag and drop your DOC or DOCX files into the upload area above, configure your page size and orientation if desired, and click 'Convert to PDF'. Your document will be converted instantly.",
    },
    {
      question: "Is it free to convert Word to PDF?",
      answer: "Yes! Fileinator's Word to PDF converter is 100% free with no sign-ups, trial limits, or hidden fees.",
    },
    {
      question: "Are my files stored on your server?",
      answer: "No. Your privacy and security are our top priorities. Files are processed automatically in memory and deleted immediately after conversion. We never store or view your documents.",
    },
    {
      question: "Does formatting stay the same?",
      answer: "Yes. Our conversion engine preserves document text, fonts, headings, tables, bullet points, headers, footers, and images as closely as possible to the original Word document.",
    },
    {
      question: "Can I convert both DOC and DOCX files?",
      answer: "Yes. Both Microsoft Word legacy (.doc) and modern XML-based (.docx) document formats are fully supported.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Document List */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Word to PDF"
            subtitle="Convert DOC and DOCX files to PDF online for free while preserving formatting."
            icon={<FileText className="w-6 h-6 text-blue-600" />}
          />
          
          {!result && (
            <div className="space-y-6 mt-2">
              <PreviewContainer
                previewUrl={previewState.previewUrl}
                isLoading={previewState.isLoading}
                error={previewState.error}
                currentPage={previewState.currentPage}
                totalPages={previewState.totalPages}
                onPageChange={previewState.setCurrentPage}
              />
              
              <UploadArea 
                acceptedFormats="DOCX, DOC"
                maxSizeMB={FILE_LIMITS.WORD_MAX_SIZE_MB}
                onFilesSelect={handleFilesSelect}
                multiple={true}
                error={uploadError}
                onErrorClear={clearUploadError}
              />

              {files.length > 0 && (
                <WordReorderList 
                  files={files} 
                  onReorder={setFiles} 
                  onRemove={removeFile}
                  onClearAll={clearAll}
                />
              )}
            </div>
          )}

          {result && (
            <PdfResultCard 
              result={result} 
              onDownload={() => handleDownload(result.url, result.filename)} 
              onReset={clearAll} 
              title="Converted Successfully"
              successMessage="Your converted PDF is ready!"
              sizeLabel="PDF Size"
              resetButtonText="Convert Another Document"
            />
          )}
        </div>

        {/* Right Side: Options & Action Button */}
        <div>
          {!result ? (
            <ToolSettings title="Conversion Options">
              <div className="space-y-6">
                
                {/* Page Size */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">
                    Page Size
                  </label>
                  <RadioGroup
                    value={options.pageSize}
                    onValueChange={(val: "A4" | "Letter") => setOptions({ ...options, pageSize: val })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="A4" id="size-a4" className="peer sr-only" />
                      <Label
                        htmlFor="size-a4"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        A4 Standard
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="Letter" id="size-letter" className="peer sr-only" />
                      <Label
                        htmlFor="size-letter"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        US Letter
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Page Orientation */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">
                    Orientation
                  </label>
                  <RadioGroup
                    value={options.orientation}
                    onValueChange={(val: "portrait" | "landscape") => setOptions({ ...options, orientation: val })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="portrait" id="orient-portrait" className="peer sr-only" />
                      <Label
                        htmlFor="orient-portrait"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        Portrait
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="landscape" id="orient-landscape" className="peer sr-only" />
                      <Label
                        htmlFor="orient-landscape"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        Landscape
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Margins */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">
                    Margins
                  </label>
                  <RadioGroup
                    value={options.margins}
                    onValueChange={(val: "normal" | "compact" | "wide") => setOptions({ ...options, margins: val })}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="normal" id="margin-normal" className="peer sr-only" />
                      <Label
                        htmlFor="margin-normal"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-2.5 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-xs font-medium cursor-pointer transition-all"
                      >
                        Normal
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="compact" id="margin-compact" className="peer sr-only" />
                      <Label
                        htmlFor="margin-compact"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-2.5 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-xs font-medium cursor-pointer transition-all"
                      >
                        Compact
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="wide" id="margin-wide" className="peer sr-only" />
                      <Label
                        htmlFor="margin-wide"
                        className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-2.5 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50/50 peer-data-[state=checked]:text-blue-600 text-xs font-medium cursor-pointer transition-all"
                      >
                        Wide
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-semibold gap-2 py-6"
                  onClick={generatePdf}
                  disabled={files.length === 0 || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{statusMessage || "Converting..."}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Convert to PDF</span>
                    </>
                  )}
                </Button>

                {/* Security Note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your Word files are encrypted and processed securely. Files are automatically deleted immediately after conversion.
                  </span>
                </div>

              </div>
            </ToolSettings>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <h3 className="font-semibold text-slate-900 mb-2">Need More Options?</h3>
              <p className="text-sm text-slate-600 mb-4">
                You can compress or merge your converted PDF using our other free tools.
              </p>
              <Button onClick={clearAll} variant="outline" className="w-full rounded-xl">
                Convert Another Document
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* About Section */}
      <div className="mt-16">
        <AboutTool 
          title="About Word to PDF Converter"
          content={
            <div className="space-y-4">
              <p>
                Fileinator's Word to PDF converter turns Microsoft Word documents (.doc and .docx) into professional, high-quality PDF files online. Perfect for resumes, business reports, contracts, and academic papers.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fast, high-fidelity conversion preserving text, tables, and headings</li>
                <li>Support for DOC and DOCX file extensions</li>
                <li>Batch conversion support for multiple Word files</li>
                <li>Custom page size, margin, and orientation controls</li>
                <li>100% free with browser-based security and no file storage</li>
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
