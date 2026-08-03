"use client";

import React from "react";
import { BarcodeSettings, BARCODE_FORMATS } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, ScanBarcode, PaintBucket, Type } from "lucide-react";

interface BarcodeSettingsPanelProps {
  settings: BarcodeSettings;
  onChange: (settings: BarcodeSettings) => void;
}

export function BarcodeSettingsPanel({ settings, onChange }: BarcodeSettingsPanelProps) {
  
  const updateSetting = <K extends keyof BarcodeSettings>(key: K, value: BarcodeSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden h-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
          <ScanBarcode className="w-5 h-5" />
        </div>
        <h2 className="font-semibold text-slate-800">Barcode Configuration</h2>
      </div>

      <div className="p-5 overflow-y-auto custom-scrollbar" style={{ maxHeight: "calc(100vh - 250px)" }}>
        
        {/* Value Input */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-slate-700">Barcode Value</Label>
          <Input 
            value={settings.value}
            onChange={(e) => updateSetting("value", e.target.value)}
            placeholder="Enter barcode text/number..."
            className="h-12 border-slate-200 focus-visible:ring-blue-500 rounded-xl"
          />
        </div>

        {/* Format Selector */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-slate-700">Barcode Format</Label>
          <Select 
            value={settings.format} 
            onValueChange={(val) => updateSetting("format", val)}
          >
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent className="max-h-60 rounded-xl">
              {BARCODE_FORMATS.map((fmt) => (
                <SelectItem key={fmt.value} value={fmt.value}>{fmt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible defaultValue="dimensions" className="w-full">
          {/* Dimensions */}
          <AccordionItem value="dimensions" className="border-slate-100">
            <AccordionTrigger className="hover:no-underline text-slate-700 py-4 group">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                Dimensions & Margins
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-6">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-slate-600">Bar Width</Label>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.width}px</span>
                </div>
                <Slider
                  value={[settings.width]}
                  min={1}
                  max={4}
                  step={1}
                  onValueChange={([val]) => updateSetting("width", val)}
                  className="py-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-slate-600">Height</Label>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.height}px</span>
                </div>
                <Slider
                  value={[settings.height]}
                  min={10}
                  max={300}
                  step={5}
                  onValueChange={([val]) => updateSetting("height", val)}
                  className="py-1"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-slate-600">Margin</Label>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.margin}px</span>
                </div>
                <Slider
                  value={[settings.margin]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([val]) => updateSetting("margin", val)}
                  className="py-1"
                />
              </div>

            </AccordionContent>
          </AccordionItem>

          {/* Text Settings */}
          <AccordionItem value="text" className="border-slate-100">
            <AccordionTrigger className="hover:no-underline text-slate-700 py-4 group">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                Text Options
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-6">
              
              <div className="flex items-center justify-between">
                <Label className="text-sm text-slate-600 cursor-pointer" htmlFor="displayValue">Show Text</Label>
                <Switch 
                  id="displayValue"
                  checked={settings.displayValue} 
                  onCheckedChange={(checked) => updateSetting("displayValue", checked)}
                />
              </div>

              {settings.displayValue && (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-slate-600">Font Size</Label>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.fontSize}px</span>
                    </div>
                    <Slider
                      value={[settings.fontSize]}
                      min={8}
                      max={48}
                      step={1}
                      onValueChange={([val]) => updateSetting("fontSize", val)}
                      className="py-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm text-slate-600">Text Margin</Label>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{settings.textMargin}px</span>
                    </div>
                    <Slider
                      value={[settings.textMargin]}
                      min={-15}
                      max={40}
                      step={1}
                      onValueChange={([val]) => updateSetting("textMargin", val)}
                      className="py-1"
                    />
                  </div>
                </>
              )}

            </AccordionContent>
          </AccordionItem>

          {/* Colors */}
          <AccordionItem value="colors" className="border-slate-100">
            <AccordionTrigger className="hover:no-underline text-slate-700 py-4 group">
              <div className="flex items-center gap-2">
                <PaintBucket className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                Colors
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-sm text-slate-600">Barcode Color</Label>
                <div className="flex gap-3">
                  <Input 
                    type="color" 
                    value={settings.lineColor}
                    onChange={(e) => updateSetting("lineColor", e.target.value)}
                    className="w-12 h-12 p-1 rounded-xl cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={settings.lineColor}
                    onChange={(e) => updateSetting("lineColor", e.target.value)}
                    className="flex-1 h-12 uppercase rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm text-slate-600">Background Color</Label>
                <div className="flex gap-3">
                  <Input 
                    type="color" 
                    value={settings.background}
                    onChange={(e) => updateSetting("background", e.target.value)}
                    className="w-12 h-12 p-1 rounded-xl cursor-pointer"
                  />
                  <Input 
                    type="text" 
                    value={settings.background}
                    onChange={(e) => updateSetting("background", e.target.value)}
                    className="flex-1 h-12 uppercase rounded-xl"
                  />
                </div>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
