"use client";

import React from "react";
import { GlobalSearch } from "../search/GlobalSearch";
import { Container } from "@/components/ui/Container";
import { 
  LayoutGrid, 
  Image as ImageIcon, 
  FileText, 
  Video, 
  Music, 
  Wrench,
  Sparkles
} from "lucide-react";

interface ToolsFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryIcon = ({ category, className }: { category: string, className?: string }) => {
  switch (category) {
    case "All Tools": return <LayoutGrid className={className} />;
    case "Image": return <ImageIcon className={className} />;
    case "PDF": return <FileText className={className} />;
    case "Video": return <Video className={className} />;
    case "Audio": return <Music className={className} />;
    case "AI": return <Sparkles className={className} />;
    case "Utilities": return <Wrench className={className} />;
    default: return null;
  }
};

export function ToolsFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: ToolsFilterBarProps) {

  return (
    <div className="sticky top-[88px] lg:top-[100px] z-40 w-full mb-2 pointer-events-none">
      <Container className="pointer-events-auto">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between w-full bg-[rgba(255,255,255,0.58)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.45)] shadow-[0_4px_16px_rgba(0,0,0,0.02)] rounded-2xl md:rounded-[24px] p-2">
          
          {/* Search */}
          <div className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <GlobalSearch 
              variant="filterBar" 
              initialValue={searchQuery} 
              onSearchChange={onSearchChange} 
            />
          </div>

          {/* Categories Scrollable Row */}
          <div className="flex-grow overflow-x-auto hide-scrollbar w-full -my-3 -mr-3">
            <div className="flex gap-1.5 min-w-max py-3 pr-3 pl-1">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                        : "bg-white/60 text-slate-600 border border-transparent hover:bg-white hover:text-slate-900 shadow-sm"
                    }`}
                  >
                    <CategoryIcon category={category} className={`w-4 h-4 mr-2 ${isActive ? "text-white" : "text-slate-500"}`} />
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
