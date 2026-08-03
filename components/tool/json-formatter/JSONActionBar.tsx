"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Upload, AlignLeft, Minimize2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface JSONActionBarProps {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string) => void;
  onClear: () => void;
  hasData: boolean;
  error: string | null;
  successMessage: string | null;
}

export function JSONActionBar({
  onFormat,
  onMinify,
  onCopy,
  onDownload,
  onUpload,
  onClear,
  hasData,
  error,
  successMessage
}: JSONActionBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    }
    // Reset so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 shadow-sm">
      
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onFormat} disabled={!hasData} className="h-9 bg-white">
          <AlignLeft className="w-4 h-4 mr-2" />
          Format
        </Button>
        <Button variant="outline" size="sm" onClick={onMinify} disabled={!hasData} className="h-9 bg-white">
          <Minimize2 className="w-4 h-4 mr-2" />
          Minify
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-9 bg-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload File
        </Button>
        <input 
          type="file" 
          accept=".json,application/json" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload} 
        />
        <Button variant="outline" size="sm" onClick={onDownload} disabled={!hasData} className="h-9 bg-white">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={onCopy} disabled={!hasData} className="h-9 bg-white">
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        {error ? (
          <div className="flex items-center text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 max-w-[300px] truncate">
            <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        ) : successMessage ? (
          <div className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
            {successMessage}
          </div>
        ) : hasData ? (
          <div className="flex items-center text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
            Valid JSON
          </div>
        ) : null}

        <Button variant="ghost" size="sm" onClick={onClear} disabled={!hasData} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
}
