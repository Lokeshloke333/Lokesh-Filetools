"use client";

import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Palette, LayoutTemplate } from "lucide-react";
import { QRSettings } from "./types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface QRSettingsPanelProps {
  settings: QRSettings;
  onChange: (settings: Partial<QRSettings>) => void;
}

const COLORS = [
  "#000000", "#1e293b", "#334155", "#ef4444", "#f97316", "#eab308", 
  "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899"
];

export function QRSettingsPanel({ settings, onChange }: QRSettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          onChange({ 
            logo: result, 
            logoWidth: img.width, 
            logoHeight: img.height 
          });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="design" className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <AccordionItem value="design" className="border-b-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Palette className="w-5 h-5 text-blue-600" />
            Design & Settings
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Foreground Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.fgColor} 
                  onChange={(e) => onChange({ fgColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <div className="flex flex-wrap gap-1">
                  {COLORS.slice(0, 6).map(color => (
                    <button
                      key={color}
                      className="w-5 h-5 rounded-full border border-slate-200"
                      style={{ backgroundColor: color }}
                      onClick={() => onChange({ fgColor: color })}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-slate-700 font-semibold">Background Color</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={settings.bgColor} 
                  onChange={(e) => onChange({ bgColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onChange({ bgColor: "#ffffff" })}
                  className="h-9 px-3 text-xs"
                >
                  Reset White
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-700 font-semibold">Margin Size</Label>
              <span className="text-blue-600 font-bold text-sm">{settings.margin}</span>
            </div>
            <Slider 
              value={[settings.margin]} 
              onValueChange={(val) => onChange({ margin: val[0] })} 
              max={10} 
              step={1} 
              className="py-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-700 font-semibold">Error Correction</Label>
            </div>
            <Select value={settings.level} onValueChange={(val: any) => onChange({ level: val })}>
              <SelectTrigger className="w-full h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%) - Best for small data</SelectItem>
                <SelectItem value="M">Medium (15%) - Standard</SelectItem>
                <SelectItem value="Q">Quartile (25%) - Good for logos</SelectItem>
                <SelectItem value="H">High (30%) - Best for logos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-slate-700 font-semibold flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-slate-400" />
              Center Logo
            </Label>
            
            {settings.logo ? (
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <img src={settings.logo} alt="Logo" className="w-8 h-8 object-contain bg-white rounded shadow-sm p-0.5" />
                  <span className="text-sm font-medium text-slate-600">Custom Logo</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => onChange({ logo: null })} className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div 
                role="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer"
              >
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <UploadCloud className="w-6 h-6" />
                  <span className="text-sm font-medium">Upload logo image</span>
                </div>
              </div>
            )}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml, image/webp" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />

            {settings.logo && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <Label className="text-slate-500 text-xs font-semibold">Logo Size</Label>
                </div>
                <Slider 
                  value={[settings.logoSize]} 
                  onValueChange={(val) => onChange({ logoSize: val[0] })} 
                  min={10}
                  max={40} 
                  step={1} 
                  className="py-1"
                />
              </div>
            )}
          </div>

        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
