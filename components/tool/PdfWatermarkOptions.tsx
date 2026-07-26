"use client";

import React, { useRef } from "react";
import { WatermarkConfig } from "@/lib/pdf/watermark";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignCenter, AlignLeft, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Image as ImageIcon, UploadCloud, X } from "lucide-react";

interface PdfWatermarkOptionsProps {
  config: WatermarkConfig;
  updateConfig: (updates: Partial<WatermarkConfig>) => void;
  imageFile: File | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  disabled?: boolean;
}

export function PdfWatermarkOptions({
  config,
  updateConfig,
  imageFile,
  onImageSelect,
  onImageRemove,
  disabled
}: PdfWatermarkOptionsProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const positionGrid = [
    { id: 'top-left', icon: <AlignLeft className="w-4 h-4 rotate-45" /> },
    { id: 'top-center', icon: <AlignVerticalJustifyStart className="w-4 h-4" /> },
    { id: 'top-right', icon: <AlignRight className="w-4 h-4 -rotate-45" /> },
    { id: 'center-left', icon: <AlignLeft className="w-4 h-4" /> },
    { id: 'center', icon: <AlignCenter className="w-4 h-4" /> },
    { id: 'center-right', icon: <AlignRight className="w-4 h-4" /> },
    { id: 'bottom-left', icon: <AlignLeft className="w-4 h-4 -rotate-45" /> },
    { id: 'bottom-center', icon: <AlignVerticalJustifyEnd className="w-4 h-4" /> },
    { id: 'bottom-right', icon: <AlignRight className="w-4 h-4 rotate-45" /> },
  ];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Type Toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl">
        <button
          disabled={disabled}
          onClick={() => updateConfig({ type: 'text' })}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${config.type === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Text Watermark
        </button>
        <button
          disabled={disabled}
          onClick={() => updateConfig({ type: 'image' })}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${config.type === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Image Watermark
        </button>
      </div>

      {config.type === 'text' ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Watermark Text</Label>
            <Input 
              value={config.text}
              onChange={(e) => updateConfig({ text: e.target.value })}
              placeholder="CONFIDENTIAL"
              disabled={disabled}
              className="text-lg font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label>Font Family</Label>
                <Select disabled={disabled} value={config.fontFamily} onValueChange={(val: any) => updateConfig({ fontFamily: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Helvetica">Helvetica (Sans)</SelectItem>
                    <SelectItem value="TimesRoman">Times Roman (Serif)</SelectItem>
                    <SelectItem value="Courier">Courier (Mono)</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-2 flex flex-col">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                   <Input 
                     type="color" 
                     value={config.color} 
                     onChange={(e) => updateConfig({ color: e.target.value })} 
                     disabled={disabled}
                     className="w-12 p-1 cursor-pointer h-10"
                   />
                   <Input 
                     value={config.color} 
                     onChange={(e) => updateConfig({ color: e.target.value })} 
                     disabled={disabled}
                     className="flex-1 font-mono uppercase"
                   />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <Label>Text Styling</Label>
            <div className="flex gap-2">
              <Button
                variant={config.isBold ? "default" : "outline"}
                className={config.isBold ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                onClick={() => updateConfig({ isBold: !config.isBold })}
                disabled={disabled}
                size="sm"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={config.isItalic ? "default" : "outline"}
                className={config.isItalic ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                onClick={() => updateConfig({ isItalic: !config.isItalic })}
                disabled={disabled}
                size="sm"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant={config.isUnderline ? "default" : "outline"}
                className={config.isUnderline ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                onClick={() => updateConfig({ isUnderline: !config.isUnderline })}
                disabled={disabled}
                size="sm"
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <Label>Font Size</Label>
               <span className="text-xs text-slate-500 font-medium w-8 text-right">{config.fontSize}px</span>
             </div>
             <Slider 
               disabled={disabled}
               value={[config.fontSize]}
               onValueChange={(val) => updateConfig({ fontSize: val[0] })}
               min={12} max={200} step={1}
             />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
             <Label>Watermark Image</Label>
             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/png, image/jpeg, image/svg+xml"
               onChange={(e) => {
                 if (e.target.files && e.target.files[0]) {
                   onImageSelect(e.target.files[0]);
                 }
               }}
             />
             
             {!imageFile ? (
               <div 
                 onClick={() => !disabled && fileInputRef.current?.click()}
                 className={`border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-slate-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50 hover:border-indigo-300'}`}
               >
                  <UploadCloud className="w-8 h-8 text-indigo-400" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">Click to upload image</p>
                    <p className="text-xs">PNG, JPG, SVG up to 10MB</p>
                  </div>
               </div>
             ) : (
               <div className="flex items-center gap-4 p-3 border border-indigo-200 bg-indigo-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-indigo-100 flex-shrink-0">
                    <ImageIcon className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{imageFile.name}</p>
                    <p className="text-xs text-slate-500">{(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onImageRemove} disabled={disabled} className="text-slate-400 hover:text-red-500 hover:bg-white">
                    <X className="w-4 h-4" />
                  </Button>
               </div>
             )}
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
               <Label>Image Scale</Label>
               <span className="text-xs text-slate-500 font-medium w-8 text-right">{config.imageScale}%</span>
             </div>
             <Slider 
               disabled={disabled || !imageFile}
               value={[config.imageScale]}
               onValueChange={(val) => updateConfig({ imageScale: val[0] })}
               min={10} max={200} step={1}
             />
          </div>
        </div>
      )}

      {/* Shared Controls */}
      <div className="pt-6 border-t border-slate-200 space-y-6">
        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <Label>Opacity</Label>
             <span className="text-xs text-slate-500 font-medium w-8 text-right">{config.opacity}%</span>
           </div>
           <Slider 
             disabled={disabled}
             value={[config.opacity]}
             onValueChange={(val) => updateConfig({ opacity: val[0] })}
             min={0} max={100} step={1}
           />
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center">
             <Label>Rotation</Label>
             <span className="text-xs text-slate-500 font-medium w-8 text-right">{config.rotation}°</span>
           </div>
           <Slider 
             disabled={disabled}
             value={[config.rotation]}
             onValueChange={(val) => updateConfig({ rotation: val[0] })}
             min={0} max={360} step={1}
           />
        </div>

        <div className="space-y-4">
          <Label>Position</Label>
          <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
            {positionGrid.map((pos) => (
              <Button
                key={pos.id}
                variant={config.position === pos.id ? "default" : "outline"}
                disabled={disabled || config.position === 'custom'}
                onClick={() => updateConfig({ position: pos.id as any })}
                className={`h-12 ${config.position === pos.id ? "bg-indigo-600 hover:bg-indigo-700" : "bg-white hover:bg-slate-100"}`}
              >
                {pos.icon}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Label className="flex items-center gap-2 cursor-pointer">
               <input 
                 type="checkbox" 
                 disabled={disabled}
                 checked={config.position === 'custom'}
                 onChange={(e) => updateConfig({ position: e.target.checked ? 'custom' : 'center' })}
                 className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
               />
               Use Custom Coordinates
            </Label>
          </div>

          {config.position === 'custom' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
               <div className="space-y-2">
                 <Label>Offset X (px)</Label>
                 <Input 
                   type="number"
                   value={config.customX}
                   onChange={(e) => updateConfig({ customX: parseInt(e.target.value) || 0 })}
                   disabled={disabled}
                 />
               </div>
               <div className="space-y-2">
                 <Label>Offset Y (px)</Label>
                 <Input 
                   type="number"
                   value={config.customY}
                   onChange={(e) => updateConfig({ customY: parseInt(e.target.value) || 0 })}
                   disabled={disabled}
                 />
               </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-200">
           <Label>Pages to Apply</Label>
           <Select disabled={disabled} value={config.pageScope} onValueChange={(val: any) => updateConfig({ pageScope: val })}>
             <SelectTrigger>
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Pages</SelectItem>
               <SelectItem value="first">First Page Only</SelectItem>
               <SelectItem value="last">Last Page Only</SelectItem>
               <SelectItem value="custom">Selected Pages...</SelectItem>
             </SelectContent>
           </Select>
           
           {config.pageScope === 'custom' && (
             <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
               <Label>Page Range</Label>
               <Input 
                 placeholder="e.g. 1-5, 8, 11-13" 
                 value={config.pageRange}
                 onChange={(e) => updateConfig({ pageRange: e.target.value })}
                 disabled={disabled}
               />
               <p className="text-xs text-slate-500">Comma-separated page numbers or ranges.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
