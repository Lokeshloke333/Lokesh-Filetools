"use client";

import React, { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";

interface UploadAreaProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  acceptedFormats?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  error?: string | null;
  onErrorClear?: () => void;
}

export function UploadArea({
  onFileSelect,
  onFilesSelect,
  acceptedFormats = "JPG, PNG, WebP, GIF, AVIF",
  accept,
  maxSizeMB = 100,
  multiple = false,
  error,
  onErrorClear,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    if (onErrorClear) onErrorClear();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (onErrorClear) onErrorClear();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        handleFiles(Array.from(e.dataTransfer.files));
      } else {
        handleFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onErrorClear) onErrorClear();
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        handleFiles(Array.from(e.target.files));
      } else {
        handleFile(e.target.files[0]);
      }
    }
  };

  const handleFile = (file: File) => {
    // Basic validation mock for frontend
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleFiles = (files: File[]) => {
    if (onFilesSelect) {
      onFilesSelect(files);
    }
  };

  return (
    <div
      className={`relative w-full h-[320px] rounded-3xl flex flex-col items-center justify-center p-8 transition-all duration-300 border-2 border-dashed
        ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 shadow-inner"
            : error
            ? "border-red-400 bg-red-50/30"
            : "border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-300"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        multiple={multiple}
        accept={accept || acceptedFormats.split(", ").map(f => `.${f.toLowerCase().trim()}`).join(",")}
      />
      
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 border ${error ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
        <UploadCloud className={`w-8 h-8 ${error ? 'text-red-500' : 'text-blue-600'}`} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">
        Drop your {multiple ? "files" : "file"} here or{" "}
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none"
        >
          browse
        </button>
      </h3>
      
      <p className="text-slate-500 text-sm text-center font-medium">
        Supports {acceptedFormats} • Up to {maxSizeMB} MB
      </p>

      {error && (
        <div className="mt-6 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-xl animate-in fade-in slide-in-from-bottom-2">
          {error}
        </div>
      )}

    </div>
  );
}
