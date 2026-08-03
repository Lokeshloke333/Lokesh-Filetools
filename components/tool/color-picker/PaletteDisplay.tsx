"use client";

import React, { useEffect, useState, useRef } from "react";
import { getPaletteSync } from "colorthief";
import { rgbToHex } from "./types";
import { Button } from "@/components/ui/button";
import { Download, Palette } from "lucide-react";

interface PaletteDisplayProps {
  imageSrc: string | null;
  onColorSelect: (hex: string) => void;
}

export function PaletteDisplay({ imageSrc, onColorSelect }: PaletteDisplayProps) {
  const [palette, setPalette] = useState<string[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageSrc) {
      setPalette([]);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const colors = getPaletteSync(img, { colorCount: 6 });
        const hexPalette = colors ? colors.map(c => c.hex()) : [];
        setPalette(hexPalette);
      } catch (err) {
        console.error("Failed to extract palette", err);
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const downloadPalette = () => {
    if (palette.length === 0) return;
    
    // Create a canvas to draw the palette
    const canvas = document.createElement("canvas");
    const swatchSize = 100;
    canvas.width = palette.length * swatchSize;
    canvas.height = swatchSize + 40;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw swatches
    palette.forEach((hex, i) => {
      ctx.fillStyle = hex;
      ctx.fillRect(i * swatchSize, 0, swatchSize, swatchSize);
      
      // Draw hex text
      ctx.fillStyle = "#334155";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(hex, i * swatchSize + (swatchSize / 2), swatchSize + 25);
    });

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "color-palette.png";
    a.click();
  };

  if (palette.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-500" />
          Extracted Palette
        </h3>
        <Button variant="outline" size="sm" onClick={downloadPalette} className="h-8 text-xs font-semibold rounded-lg">
          <Download className="w-4 h-4 mr-1.5" />
          Download
        </Button>
      </div>

      <div className="flex h-24 rounded-xl overflow-hidden shadow-sm border border-slate-200">
        {palette.map((hex, i) => (
          <div 
            key={i} 
            className="flex-1 cursor-pointer hover:opacity-90 transition-opacity group relative"
            style={{ backgroundColor: hex }}
            onClick={() => onColorSelect(hex)}
            title={hex}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px] transition-all">
              <span className="text-white font-mono text-xs font-bold drop-shadow-md">{hex}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
