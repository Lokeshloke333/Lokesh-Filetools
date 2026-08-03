"use client";

import React, { useState, useEffect } from "react";
import { ColorWorkspace } from "./ColorWorkspace";
import { ColorDetails } from "./ColorDetails";
import { PaletteDisplay } from "./PaletteDisplay";
import { RecentColors } from "./RecentColors";
import { ColorInfo, generateColorInfo } from "./types";

export function ColorPickerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState<string | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null);

  useEffect(() => {
    // Load recent colors from local storage
    const saved = localStorage.getItem("fileinator_recent_colors");
    if (saved) {
      try {
        setRecentColors(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleColorSelect = (hex: string) => {
    setSelectedHex(hex);
    setColorInfo(generateColorInfo(hex));

    // Update recent colors
    setRecentColors(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== hex.toLowerCase());
      const newRecent = [hex.toUpperCase(), ...filtered].slice(0, 10);
      localStorage.setItem("fileinator_recent_colors", JSON.stringify(newRecent));
      return newRecent;
    });
  };

  const handleClear = () => {
    setImageSrc(null);
    setSelectedHex(null);
    setColorInfo(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <ColorWorkspace 
          imageSrc={imageSrc} 
          onImageUpload={setImageSrc} 
          onColorSelect={handleColorSelect} 
          onClear={handleClear}
        />
      </div>
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ColorDetails colorInfo={colorInfo} />
        {imageSrc && (
          <PaletteDisplay imageSrc={imageSrc} onColorSelect={handleColorSelect} />
        )}
        <RecentColors colors={recentColors} onColorSelect={handleColorSelect} />
      </div>
    </div>
  );
}
