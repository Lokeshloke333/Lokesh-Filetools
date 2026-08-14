"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Trash2, Download, Wand2, Minimize2, CheckCircle2, Play } from "lucide-react";

interface CodeActionBarProps {
  onFormat: () => void;
  onMinify: () => void;
  onValidate: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  onLoadExample: () => void;
  onUpload?: (file: File) => void;
  hasData: boolean;
  hasOutput: boolean;
  successMessage?: string | null;
  showMinify?: boolean;
  primaryAction?: "format" | "minify" | "validate";
}

export function CodeActionBar({
  onFormat,
  onMinify,
  onValidate,
  onCopy,
  onDownload,
  onClear,
  onLoadExample,
  onUpload,
  hasData,
  hasOutput,
  successMessage,
  showMinify = true,
  primaryAction = "format"
}: CodeActionBarProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 text-sm font-medium animate-in fade-in flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={onFormat} 
            variant={primaryAction === "format" ? "default" : "secondary"} 
            className={`font-medium ${primaryAction === "format" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Format / Beautify
          </Button>
          {showMinify && (
            <Button 
              onClick={onMinify} 
              variant={primaryAction === "minify" ? "default" : "secondary"} 
              className={`font-medium ${primaryAction === "minify" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
            >
              <Minimize2 className="w-4 h-4 mr-2" />
              Minify
            </Button>
          )}
          <Button 
            onClick={onValidate} 
            variant={primaryAction === "validate" ? "default" : "outline"} 
            className={`font-medium ${primaryAction === "validate" ? "bg-blue-600 hover:bg-blue-700 text-white border-transparent" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Validate
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".html,.htm,.xml,.css,.js,.mjs,.json,.py,.php"
                aria-label="Upload code file"
              />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="text-slate-600 hover:text-slate-900 border-slate-200">
                Upload File
              </Button>
            </>
          )}
          <Button onClick={onLoadExample} variant="ghost" className="text-slate-500 hover:text-slate-900">
            <Play className="w-4 h-4 mr-2" />
            Example
          </Button>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <Button
            onClick={onCopy}
            variant="ghost"
            disabled={!hasOutput}
            className="text-slate-500 hover:text-slate-900"
            title="Copy Output"
          >
            <Copy className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>
          <Button
            onClick={onDownload}
            variant="ghost"
            disabled={!hasOutput}
            className="text-slate-500 hover:text-slate-900"
            title="Download Output"
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            onClick={onClear}
            variant="ghost"
            disabled={!hasData && !hasOutput}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            title="Clear All"
          >
            <Trash2 className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
