import React, { useState, useRef } from "react";
import { UploadCloud, Sparkles } from "lucide-react";

interface AIUploadZoneProps {
  onFileSelect?: (file: File) => void;
  acceptedFormats?: string;
  accept?: string;
  maxSizeMB?: number;
  error?: string | null;
  onErrorClear?: () => void;
  title?: string;
}

export function AIUploadZone({
  onFileSelect,
  acceptedFormats = "JPG/JPEG, PNG, WebP",
  accept = "image/jpeg, image/png, image/webp",
  maxSizeMB = 20,
  error,
  onErrorClear,
  title = "Drop your image here"
}: AIUploadZoneProps) {
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
      if (onFileSelect) onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onErrorClear) onErrorClear();
    if (e.target.files && e.target.files.length > 0) {
      if (onFileSelect) onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative w-full h-[320px] rounded-3xl flex flex-col items-center justify-center p-8 transition-all duration-300 border-2 border-dashed cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 overflow-hidden
        ${
          isDragging
            ? "border-purple-500 bg-purple-50/50 shadow-inner"
            : error
            ? "border-red-400 bg-red-50/30"
            : "border-slate-300 bg-white hover:bg-slate-50 hover:border-purple-300"
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInputRef.current?.click();
        }
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        className="hidden"
        accept={accept}
      />
      
      {/* Decorative AI background element */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${error ? 'bg-red-50 border-red-100' : 'bg-purple-50 border-purple-100'}`}>
        <UploadCloud className={`w-10 h-10 ${error ? 'text-red-500' : 'text-purple-600'}`} />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>
      
      <h3 className="relative z-10 text-xl font-bold text-slate-800 mb-2 text-center pointer-events-none">
        {title} or{" "}
        <span className="text-purple-600 hover:text-purple-700 hover:underline cursor-pointer pointer-events-auto">
          browse
        </span>
      </h3>
      
      <p className="relative z-10 text-slate-500 text-sm text-center font-medium">
        Supports {acceptedFormats} • Up to {maxSizeMB} MB
      </p>

      {error && (
        <div className="relative z-10 mt-6 px-4 py-2 bg-red-100 text-red-700 text-sm font-semibold rounded-xl animate-in fade-in slide-in-from-bottom-2">
          {error}
        </div>
      )}
    </div>
  );
}
