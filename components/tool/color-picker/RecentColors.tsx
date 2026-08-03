"use client";

import React from "react";
import { History } from "lucide-react";

interface RecentColorsProps {
  colors: string[];
  onColorSelect: (hex: string) => void;
}

export function RecentColors({ colors, onColorSelect }: RecentColorsProps) {
  if (colors.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-blue-500" />
        Recent Colors
      </h3>

      <div className="flex flex-wrap gap-2">
        {colors.map((hex, i) => (
          <button
            key={`${hex}-${i}`}
            className="w-10 h-10 rounded-xl shadow-sm border border-slate-200 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: hex }}
            onClick={() => onColorSelect(hex)}
            title={hex}
          />
        ))}
      </div>
    </div>
  );
}
