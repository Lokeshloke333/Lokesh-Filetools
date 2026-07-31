import React from "react";
import { Loader2 } from "lucide-react";

export function PreviewSkeleton() {
  return (
    <div className="w-full aspect-[1/1.414] bg-slate-100 rounded-lg animate-pulse flex flex-col items-center justify-center border border-slate-200">
      <Loader2 className="w-8 h-8 text-slate-300 animate-spin mb-4" />
      <span className="text-slate-400 font-medium text-sm">Generating Preview...</span>
    </div>
  );
}
