"use client";

import React from "react";
import { ImageItem } from "./types";
import { Trash2 } from "lucide-react";

interface BatchCarouselProps {
  images: ImageItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
}

export function BatchCarousel({ images, currentIndex, onSelect, onRemove }: BatchCarouselProps) {
  if (images.length <= 1) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-x-auto flex gap-3 mt-6 custom-scrollbar">
      {images.map((img, index) => (
        <div 
          key={img.id}
          className={`relative shrink-0 w-24 h-24 rounded-xl border-2 transition-all cursor-pointer group ${
            index === currentIndex ? 'border-blue-500 shadow-md shadow-blue-500/20' : 'border-transparent hover:border-slate-300'
          }`}
          onClick={() => onSelect(index)}
        >
          <img 
            src={img.originalSrc} 
            alt={img.name} 
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            className="absolute top-1 right-1 bg-red-500/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(img.id);
            }}
            title="Remove Image"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
