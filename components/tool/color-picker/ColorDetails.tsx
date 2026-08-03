"use client";

import React, { useState } from "react";
import { ColorInfo } from "./types";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";

interface ColorDetailsProps {
  colorInfo: ColorInfo | null;
}

export function ColorDetails({ colorInfo }: ColorDetailsProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!colorInfo) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[300px] text-slate-400">
        <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 mb-4" />
        <p className="font-medium">No color selected</p>
        <p className="text-sm">Upload an image and pick a color</p>
      </div>
    );
  }

  const formats = [
    { label: "HEX", value: colorInfo.hex, key: "hex" },
    { label: "RGB", value: colorInfo.rgb, key: "rgb" },
    { label: "RGBA", value: colorInfo.rgba, key: "rgba" },
    { label: "HSL", value: colorInfo.hsl, key: "hsl" },
    { label: "HSV", value: colorInfo.hsv, key: "hsv" },
    { label: "CMYK", value: colorInfo.cmyk, key: "cmyk" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-2xl shadow-sm border border-slate-200 shrink-0" 
          style={{ backgroundColor: colorInfo.hex }}
        />
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{colorInfo.hex}</h2>
          <p className="text-slate-500 font-medium text-sm">Selected Color</p>
        </div>
      </div>

      <div className="space-y-3">
        {formats.map(format => (
          <div key={format.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{format.label}</span>
              <span className="text-sm font-semibold text-slate-700 font-mono">{format.value}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-lg ${copiedKey === format.key ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-slate-200 hover:text-blue-600'}`}
              onClick={() => handleCopy(format.key, format.value)}
            >
              {copiedKey === format.key ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
