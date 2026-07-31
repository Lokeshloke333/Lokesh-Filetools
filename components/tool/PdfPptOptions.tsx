"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
export interface PptToPdfOptions {
  pageSize: "Match Slide Size" | "A4" | "Letter";
  orientation: "Landscape" | "Portrait" | "Auto";
  slidesPerPage: "1" | "2" | "4" | "6";
  includeNotes: boolean;
}
import { Presentation, LayoutTemplate, Copy, MessageSquare } from "lucide-react";

interface PdfPptOptionsProps {
  options: PptToPdfOptions;
  updateOptions: (updates: Partial<PptToPdfOptions>) => void;
  disabled?: boolean;
}

export function PdfPptOptions({
  options,
  updateOptions,
  disabled
}: PdfPptOptionsProps) {
  
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
           <Presentation className="w-4 h-4 text-orange-600" /> Document Layout
        </h4>
        
        <div className="space-y-3">
          <Label className="text-slate-600">Page Size</Label>
          <Select 
            disabled={disabled} 
            value={options.pageSize} 
            onValueChange={(val: any) => updateOptions({ pageSize: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Match Slide Size">Match Slide Size (Recommended)</SelectItem>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="Letter">US Letter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-slate-600 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4" /> Orientation
          </Label>
          <Select 
            disabled={disabled} 
            value={options.orientation} 
            onValueChange={(val: any) => updateOptions({ orientation: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Landscape">Landscape (Standard)</SelectItem>
              <SelectItem value="Portrait">Portrait</SelectItem>
              <SelectItem value="Auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
           <Copy className="w-4 h-4 text-orange-600" /> Handouts & Notes
        </h4>

        <div className="space-y-3">
          <Label className="text-slate-600">Slides Per Page</Label>
          <Select 
            disabled={disabled} 
            value={options.slidesPerPage} 
            onValueChange={(val: any) => updateOptions({ slidesPerPage: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Slide (Full Page)</SelectItem>
              <SelectItem value="2">2 Slides (Handout)</SelectItem>
              <SelectItem value="4">4 Slides</SelectItem>
              <SelectItem value="6">6 Slides</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <Label className="text-slate-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Include Speaker Notes
            </Label>
          </div>
          <Switch 
            disabled={disabled || options.slidesPerPage !== '1'}
            checked={options.includeNotes}
            onCheckedChange={(val) => updateOptions({ includeNotes: val })}
          />
        </div>
        {options.slidesPerPage !== '1' && (
          <p className="text-xs text-slate-400">Speaker notes can only be included when printing 1 slide per page.</p>
        )}
      </div>

    </div>
  );
}
