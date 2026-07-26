import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface PdfRotateOptionsProps {
  degrees: 90 | 180 | 270;
  setDegrees: (val: 90 | 180 | 270) => void;
  pageScope: "all" | "selected";
  setPageScope: (val: "all" | "selected") => void;
  pageSelection: string;
  setPageSelection: (val: string) => void;
  disabled?: boolean;
}

export function PdfRotateOptions({
  degrees,
  setDegrees,
  pageScope,
  setPageScope,
  pageSelection,
  setPageSelection,
  disabled
}: PdfRotateOptionsProps) {
  return (
    <div className="space-y-6">
      
      {/* Global Rotation Angle */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-slate-700">Rotation Angle</Label>
        <RadioGroup 
          disabled={disabled}
          value={degrees.toString()} 
          onValueChange={(val) => setDegrees(parseInt(val, 10) as 90 | 180 | 270)}
          className="grid grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 transition-colors has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50 cursor-pointer">
            <RadioGroupItem value="90" id="deg-90" />
            <Label htmlFor="deg-90" className="cursor-pointer font-medium text-sm">90° CW</Label>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 transition-colors has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50 cursor-pointer">
            <RadioGroupItem value="180" id="deg-180" />
            <Label htmlFor="deg-180" className="cursor-pointer font-medium text-sm">180°</Label>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 transition-colors has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50 cursor-pointer">
            <RadioGroupItem value="270" id="deg-270" />
            <Label htmlFor="deg-270" className="cursor-pointer font-medium text-sm">270° CW</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Rotation Scope */}
      <div className="space-y-3">
        <Label className="text-sm font-bold text-slate-700">Pages to Rotate</Label>
        <RadioGroup 
          disabled={disabled}
          value={pageScope} 
          onValueChange={(val) => setPageScope(val as "all" | "selected")}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 transition-colors has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50 cursor-pointer">
            <RadioGroupItem value="all" id="scope-all" />
            <Label htmlFor="scope-all" className="cursor-pointer font-medium text-sm">All Pages</Label>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-indigo-300 transition-colors has-[[data-state=checked]]:border-indigo-500 has-[[data-state=checked]]:bg-indigo-50/50 cursor-pointer">
            <RadioGroupItem value="selected" id="scope-selected" />
            <Label htmlFor="scope-selected" className="cursor-pointer font-medium text-sm">Selected Pages</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Page Selection Input */}
      {pageScope === "selected" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Label className="text-xs text-slate-500">Enter pages or ranges (e.g., 1, 3, 5-8)</Label>
          <Input 
            disabled={disabled}
            placeholder="1, 3, 5-8"
            value={pageSelection}
            onChange={(e) => setPageSelection(e.target.value)}
            className="rounded-xl border-slate-200 h-11"
          />
        </div>
      )}

    </div>
  );
}
