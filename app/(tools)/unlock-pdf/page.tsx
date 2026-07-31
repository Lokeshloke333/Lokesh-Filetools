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
import { Loader2, Lightbulb, Unlock, Shield, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { usePdfUnlock } from "@/hooks/usePdfUnlock";
import { PdfUnlockPreview } from "@/components/tool/PdfUnlockPreview";
import { PdfUnlockOptions } from "@/components/tool/PdfUnlockOptions";
import { PdfUnlockResultCard } from "@/components/tool/PdfUnlockResultCard";
import { useDownload } from "@/hooks/useDownload";
import { FILE_LIMITS } from "@/lib/config";

export default function UnlockPdfPage() {
  const {
    fileInfo,
    password,
    setPassword,
    handleFileSelect,
    clearAll,
    unlockFile,
    unlockState,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    passwordError,
  } = usePdfUnlock();

  const { handleDownload } = useDownload();

  const faqs = [
    {
      question: "Can this tool hack or bypass a PDF password?",
      answer: "No. This tool requires you to know and provide the correct password to unlock the document. It does not attempt to hack, guess, or brute-force passwords.",
    },
    {
      question: "Will my password be saved or logged?",
      answer: "Absolutely not. Your password is only used in memory for the exact moment of unlocking the PDF and is immediately discarded. We never log or store it.",
    },
    {
      question: "Are my files secure?",
      answer: "Yes! Your files are transmitted securely, processed immediately, and instantly deleted after unlocking. We do not store or read your documents.",
    },
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Unlock PDF"
            subtitle="Remove password protection securely by providing the correct password."
            icon={<Unlock className="w-6 h-6 text-green-600" />}
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

          {!result && fileInfo && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 px-1">
                {unlockState === 'inspecting' ? 'Inspecting Document...' : 'Document Status'}
              </h3>
              <PdfUnlockPreview 
                fileInfo={fileInfo} 
                unlockState={unlockState}
                onRemove={clearAll} 
              />
            </div>
          )}

          {result && (
            <PdfUnlockResultCard 
              result={result} 
              onDownload={() => handleDownload(result.url, result.filename)} 
              onReset={clearAll} 
            />
          )}
        </div>

        {/* Right Side: Settings / Actions based on State */}
        <div className="lg:col-span-1">
          {(!fileInfo || unlockState === 'idle') && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center h-full flex flex-col justify-center">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Upload a Document</h3>
              <p className="text-sm text-slate-600">
                Upload a PDF to inspect its security and remove password protection.
              </p>
            </div>
          )}

          {unlockState === 'inspecting' && (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center h-full flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Checking Security</h3>
              <p className="text-sm text-slate-600">
                Inspecting document encryption...
              </p>
            </div>
          )}

          {unlockState === 'notProtected' && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-green-900 mb-2">Already Unlocked</h3>
              <p className="text-sm text-green-700 mb-6">
                This PDF is not password protected. There is nothing to unlock!
              </p>
              <Button onClick={clearAll} variant="outline" className="w-full bg-white border-green-200 hover:bg-green-100 text-green-700">
                Upload Another PDF
              </Button>
            </div>
          )}

          {unlockState === 'permissionOnly' && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Unlock className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-amber-900 mb-2">Permission Restricted</h3>
              <p className="text-sm text-amber-700 mb-6">
                This PDF has editing restrictions but does not require a password to open.
              </p>
              <Button onClick={clearAll} variant="outline" className="w-full bg-white border-amber-200 hover:bg-amber-100 text-amber-700">
                Upload Another PDF
              </Button>
            </div>
          )}

          {unlockState === 'corrupted' && (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-900 mb-2">Corrupted Document</h3>
              <p className="text-sm text-red-700 mb-6">
                This PDF appears to be corrupted or unreadable.
              </p>
              <Button onClick={clearAll} variant="outline" className="w-full bg-white border-red-200 hover:bg-red-100 text-red-700">
                Try Another File
              </Button>
            </div>
          )}

          {unlockState === 'unsupported' && (
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200 text-center h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-orange-900 mb-2">Unsupported Encryption</h3>
              <p className="text-sm text-orange-700 mb-6">
                This PDF uses an unsupported encryption method that cannot be decrypted in the browser.
              </p>
              <Button onClick={clearAll} variant="outline" className="w-full bg-white border-orange-200 hover:bg-orange-100 text-orange-700">
                Try Another File
              </Button>
            </div>
          )}

          {(unlockState === 'protected' || unlockState === 'unlocking' || unlockState === 'success') && (
            <ToolSettings>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Security</h3>
                    <p className="text-sm text-slate-500">Enter Document Password</p>
                  </div>
                </div>
                
                <PdfUnlockOptions 
                  password={password}
                  setPassword={setPassword}
                  error={passwordError}
                  disabled={unlockState !== 'protected' || result !== null}
                />
              </div>

              {/* Action Button */}
              <div className="pt-2 pb-2">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 transition-all disabled:opacity-70 disabled:shadow-none"
                  onClick={unlockFile}
                  disabled={!fileInfo || unlockState !== 'protected' || result !== null}
                >
                  {unlockState === 'unlocking' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {statusMessage || "Processing..."}
                    </>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5 mr-2" />
                      Unlock PDF
                    </>
                  )}
                </Button>
              </div>

              {/* Pro Tip */}
              <div className="mt-auto bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800 leading-relaxed font-medium">
                  <span className="font-bold">Pro Tip:</span> This tool removes the password permanently so you don't have to enter it every time you open the document.
                </p>
              </div>
            </ToolSettings>
          )}

        </div>

      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About Unlock PDF"
        content={
          <>
            <p>
              Our Unlock PDF tool automatically inspects your documents securely inside your browser to determine its exact security state before you even click a button. 
            </p>
            <p>
              If a document is fully password protected, we securely remove the password from a protected PDF document. We process everything securely without storing your files or passwords. Your password is only used in memory to decrypt the file during processing.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
