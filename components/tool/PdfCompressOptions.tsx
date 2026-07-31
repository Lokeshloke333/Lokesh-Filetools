import React from "react";
import { Zap } from "lucide-react";
import { PdfCompressionLevel } from "@/lib/pdf/types";

interface PdfCompressOptionsProps {
  level: PdfCompressionLevel;
  setLevel: (level: PdfCompressionLevel) => void;
  disabled: boolean;
}

export function PdfCompressOptions({
  disabled,
}: PdfCompressOptionsProps) {
  return (
    <div className="space-y-6">
      <div className={`p-5 rounded-xl border-2 border-blue-500 bg-blue-50/50 transition-all ${disabled ? "opacity-50 grayscale" : ""}`}>
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Smart Compression
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Automatically applies the best optimization for your PDF while preserving document quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
