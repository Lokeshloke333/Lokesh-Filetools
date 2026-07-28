"use client";

import React from "react";
import { Image as ImageIcon, FileText, Video, Music, Sparkles, Wrench } from "lucide-react";

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
  toolCounts: Record<string, number>;
}

import { CategoryData, CategoryCard } from "./CategoryCard";

export const CATEGORY_DATA: CategoryData[] = [
  {
    id: "Image",
    title: "Image Tools",
    description: "Compress, resize, crop, rotate and convert images.",
    icon: ImageIcon,
    gradient: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20",
    status: "active",
  },
  {
    id: "PDF",
    title: "PDF Tools",
    description: "Merge, split, compress, unlock and convert PDF files.",
    icon: FileText,
    gradient: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/20",
    status: "active",
  },

  {
    id: "Video",
    title: "Video Tools",
    description: "Compress, convert and edit video files.",
    icon: Video,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    status: "coming-soon",
  },
  {
    id: "Audio",
    title: "Audio Tools",
    description: "Convert, trim and optimize audio files.",
    icon: Music,
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
    status: "active",
  },
  {
    id: "Utilities",
    title: "Utilities",
    description: "QR Code Generator, Color Picker, JSON Formatter and more.",
    icon: Wrench,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    status: "coming-soon",
  },
];

export function FeaturedCategories({ onSelectCategory, toolCounts }: FeaturedCategoriesProps) {

  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(categoryId);
  };

  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Featured Categories</h2>
        <p className="text-slate-500 mt-1">Jump directly to a tool category.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {CATEGORY_DATA.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            toolCount={toolCounts[cat.id] || 0}
            onClick={() => handleCategoryClick(cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
