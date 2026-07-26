"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { UploadArea } from "@/components/tool/UploadArea";
import { ToolSettings } from "@/components/tool/ToolSettings";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb, Lock, FileText, Trash2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { usePdfProtect } from "@/hooks/usePdfProtect";
import { PdfResultCard } from "@/components/tool/PdfResultCard";
import { useDownload } from "@/hooks/useDownload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/lib/utils/image";

export default function ProtectPdfPage() {
  const {
    file,
    options,
    setOptions,
    confirmPassword,
    setConfirmPassword,
    handleFileSelect,
    clearFile,
    protectDocument,
    isProcessing,
    statusMessage,
    result,
    uploadError,
    clearUploadError,
    getPasswordStrength,
  } = usePdfProtect();

  const { handleDownload } = useDownload();
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(options.password || "");

  const faqs = [
    {
      question: "Is my password stored?",
      answer: "No. We never log or store your passwords. Your password is used purely in memory to encrypt the document and is discarded immediately after processing."
    },
    {
      question: "Which encryption method is used?",
      answer: "We support standard 128-bit RC4 encryption as well as military-grade 256-bit AES encryption. AES-256 is the default and provides the highest level of security available for PDF documents."
    },
    {
      question: "Can I remove the password later?",
      answer: "Yes, you can easily remove the password using our free Unlock PDF tool, provided you still know the password."
    },
    {
      question: "Are my files deleted after processing?",
      answer: "Yes. Your files are encrypted during transfer and processed securely. They are never stored on our servers and are deleted immediately after encryption."
    },
    {
      question: "Is this free?",
      answer: "Yes! Fileinator's Protect PDF tool is completely free to use with no hidden fees, subscriptions, or watermarks."
    }
  ];

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Header, Upload & File Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ToolHeader 
            title="Protect PDF"
            subtitle="Encrypt your PDF files with a password online for free. Secure sensitive documents using AES encryption."
            icon={<Lock className="w-6 h-6 text-indigo-600" />}
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
              <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100">
                  <FileText className="w-6 h-6 text-indigo-500" />
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
              title="PDF Protected Successfully"
              successMessage="Your password-protected PDF is ready."
              sizeLabel="File Size"
              resetButtonText="Protect Another PDF"
            />
          )}
        </div>

        {/* Right Side: Options & Action Button */}
        <div>
          {!result ? (
            <ToolSettings title="Protection Options">
              <div className="space-y-6">
                
                {/* Password Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-900 block mb-2">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={options.password}
                        onChange={(e) => setOptions({ ...options, password: e.target.value })}
                        className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                        placeholder="Enter password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Strength Meter */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex gap-1 flex-1 max-w-[120px]">
                        <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`}></div>
                        <div className={`h-1.5 flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`}></div>
                      </div>
                      <span className={`text-xs font-semibold ${strength.score > 0 ? strength.color.replace('bg-', 'text-') : 'text-slate-400'}`}>
                        {strength.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-900 block mb-2">Confirm Password</label>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>

                {/* Encryption Level */}
                <div className="border-t border-slate-100 pt-6">
                  <label className="text-sm font-semibold text-slate-900 block mb-3">Encryption Level</label>
                  <RadioGroup
                    value={options.algorithm}
                    onValueChange={(val: "AES-256" | "RC4") => setOptions({ ...options, algorithm: val })}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div>
                      <RadioGroupItem value="AES-256" id="algo-aes" className="peer sr-only" />
                      <Label
                        htmlFor="algo-aes"
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50/50 peer-data-[state=checked]:text-indigo-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        <span className="font-bold">256-bit AES</span>
                        <span className="text-[10px] opacity-70">(Default & Secure)</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="RC4" id="algo-rc4" className="peer sr-only" />
                      <Label
                        htmlFor="algo-rc4"
                        className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-200 bg-white p-3 hover:bg-slate-50 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50/50 peer-data-[state=checked]:text-indigo-600 text-sm font-medium cursor-pointer transition-all"
                      >
                        <span className="font-bold">128-bit RC4</span>
                        <span className="text-[10px] opacity-70">(Legacy Support)</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Permissions */}
                <div className="border-t border-slate-100 pt-6">
                  <label className="text-sm font-semibold text-slate-900 block mb-3">Permissions</label>
                  <div className="space-y-3">
                    {[
                      { key: "allowPrinting", label: "Allow Printing", desc: "User can print the document" },
                      { key: "allowCopying", label: "Allow Copying Text", desc: "User can copy text and graphics" },
                      { key: "allowModifying", label: "Allow Modifying", desc: "User can modify document contents" },
                      { key: "allowAnnotating", label: "Allow Commenting", desc: "User can add annotations" },
                      { key: "allowFillingForms", label: "Allow Form Filling", desc: "User can fill interactive forms" },
                      { key: "allowAssembly", label: "Allow Document Assembly", desc: "User can insert/rotate/delete pages" },
                    ].map((perm) => (
                      <label key={perm.key} className="flex items-start gap-3 cursor-pointer group">
                        <div className="mt-0.5 relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={options[perm.key as keyof typeof options] as boolean}
                            onChange={(e) => setOptions({ ...options, [perm.key]: e.target.checked })}
                            className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          />
                          <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                            <path d="M1 7L5 11L13 2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{perm.label}</p>
                          <p className="text-xs text-slate-500">{perm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button 
                    size="lg" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 font-semibold gap-2 py-6"
                    onClick={protectDocument}
                    disabled={!file || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{statusMessage || "Protecting..."}</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Protect PDF</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-500">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    Your passwords and files are strictly processed in-memory and automatically deleted after encryption.
                  </span>
                </div>

              </div>
            </ToolSettings>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-center">
              <h3 className="font-semibold text-slate-900 mb-2">Need More Options?</h3>
              <p className="text-sm text-slate-600 mb-4">
                You can try our other free tools to modify your PDF documents.
              </p>
              <Button onClick={clearFile} variant="outline" className="w-full rounded-xl">
                Protect Another PDF
              </Button>
            </div>
          )}
        </div>

      </div>

      {/* About Section */}
      <div className="mt-16">
        <AboutTool 
          title="About Protect PDF"
          content={
            <div className="space-y-4">
              <p>
                Fileinator's Protect PDF tool securely encrypts your PDF files with military-grade 256-bit AES encryption. It allows you to strictly control what others can do with your document by setting granular permissions.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Strong AES-256 encryption algorithm</li>
                <li>Set detailed permissions (Printing, Copying, Modifying)</li>
                <li>Instant, high-speed encryption process</li>
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
