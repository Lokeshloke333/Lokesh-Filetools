"use client";

import React from "react";
import { DocumentViewer } from "./DocumentViewer";
import { PreviewToolbar } from "./PreviewToolbar";
import { PreviewSkeleton } from "./PreviewSkeleton";
import { PreviewError } from "./PreviewError";
import { Eye, FileText } from "lucide-react";

interface PreviewContainerProps {
  previewUrl: string | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PreviewContainer({
  previewUrl,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: PreviewContainerProps) {
  
  return (
    <div className="w-full bg-slate-50 rounded-3xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center border border-purple-200">
          <Eye className="w-5 h-5 text-purple-700" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Live Document Preview</h3>
          <p className="text-xs text-slate-500">Automatically updates as settings change.</p>
        </div>
      </div>

      <div className="w-full max-w-[400px] mx-auto">
        {!previewUrl && !isLoading && !error ? (
          <div className="w-full aspect-[1/1.414] bg-white rounded-xl flex flex-col items-center justify-center border border-slate-200 border-dashed p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-slate-600 font-medium text-sm max-w-[200px]">
              Upload a Word document to preview how it will appear before conversion.
            </p>
          </div>
        ) : error ? (
          <PreviewError message={error} />
        ) : isLoading || !previewUrl ? (
          <PreviewSkeleton />
        ) : (
          <DocumentViewer pdfUrl={previewUrl} pageNumber={currentPage} />
        )}
      </div>

      <PreviewToolbar 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={onPageChange}
        disabled={isLoading || !!error}
      />
    </div>
  );
}
