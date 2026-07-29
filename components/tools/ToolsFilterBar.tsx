"use client";

import React from "react";
import { GlobalSearch } from "../search/GlobalSearch";
import { Container } from "@/components/ui/Container";

interface ToolsFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ToolsFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: ToolsFilterBarProps) {

  return (
    <div className="sticky top-16 lg:top-20 z-40 py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm px-4 md:px-6 w-full">
      <Container className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between  w-full">
        
        {/* Search */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <GlobalSearch 
            variant="filterBar" 
            initialValue={searchQuery} 
            onSearchChange={onSearchChange} 
          />
        </div>

        {/* Categories Scrollable Row */}
        <div className="flex-grow overflow-x-auto pb-2 lg:pb-0 hide-scrollbar w-full">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

      </Container>
    </div>
  );
}
