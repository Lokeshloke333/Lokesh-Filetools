"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExcelToPdfOptions } from "@/lib/pdf/excel-to-pdf";
import { FileSpreadsheet, LayoutTemplate, Maximize, FileSymlink } from "lucide-react";

interface PdfExcelOptionsProps {
  options: ExcelToPdfOptions;
  updateOptions: (updates: Partial<ExcelToPdfOptions>) => void;
  disabled?: boolean;
}

export function PdfExcelOptions({
  options,
  updateOptions,
  disabled
}: PdfExcelOptionsProps) {
  
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
           <FileSpreadsheet className="w-4 h-4 text-green-600" /> Page Settings
        </h4>
        
        <div className="space-y-3">
          <Label className="text-slate-600">Paper Size</Label>
          <Select 
            disabled={disabled} 
            value={options.pageSize} 
            onValueChange={(val: any) => updateOptions({ pageSize: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4 (Standard)</SelectItem>
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
              <SelectItem value="auto">Auto (Portrait)</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
           <Maximize className="w-4 h-4 text-green-600" /> Scaling & Layout
        </h4>

        <div className="space-y-3">
          <Label className="text-slate-600">Scaling</Label>
          <Select 
            disabled={disabled} 
            value={options.scaling} 
            onValueChange={(val: any) => updateOptions({ scaling: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fit-width">Fit to width (Recommended)</SelectItem>
              <SelectItem value="fit-page">Fit to page</SelectItem>
              <SelectItem value="actual">Actual size</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500">Fit to width scales the columns to ensure they don't get cut off horizontally.</p>
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-slate-600 flex items-center gap-2">
            <FileSymlink className="w-4 h-4" /> Margins
          </Label>
          <Select 
            disabled={disabled} 
            value={options.margins} 
            onValueChange={(val: any) => updateOptions({ margins: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal (Recommended)</SelectItem>
              <SelectItem value="narrow">Narrow</SelectItem>
              <SelectItem value="wide">Wide</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  );
}
