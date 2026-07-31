import React from "react";
import { AlertCircle } from "lucide-react";

interface PreviewErrorProps {
  message?: string;
}

export function PreviewError({ message }: PreviewErrorProps) {
  return (
    <div className="w-full aspect-[1/1.414] bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-200 p-6 text-center">
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <p className="text-slate-600 font-medium text-sm">
        {message || "Preview unavailable. Your document can still be converted successfully."}
      </p>
    </div>
  );
}
