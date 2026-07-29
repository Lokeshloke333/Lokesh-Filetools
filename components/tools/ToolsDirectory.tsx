/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useMemo } from "react";
import { FeaturedCategories, CATEGORY_DATA } from "./FeaturedCategories";
import { ToolsFilterBar } from "./ToolsFilterBar";
import { ToolGrid } from "./ToolGrid";
import { TOOLS } from "@/lib/tools";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

const CATEGORIES = ["All Tools", "Image", "PDF", "Video", "Audio", "Utilities"];
const POPULAR_SEARCHES = ["Compress Image", "Resize Image", "Crop Image", "PDF", "Convert", "PNG", "JPG", "WEBP"];

export function ToolsDirectory() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get("search") || "";
  
  const initialCategoryParam = searchParams.get("category");
  let initialCategory = "All Tools";
  if (initialCategoryParam) {
    const matchingCategory = CATEGORIES.find(c => c.toLowerCase() === initialCategoryParam.toLowerCase());
    if (matchingCategory) {
      initialCategory = matchingCategory;
    }
  }

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  // Sync state if URL changes (e.g. from GlobalSearch in Navbar while already on the page, or browser back/forward)
  React.useEffect(() => {
    const q = searchParams.get("search") || "";
    setSearchQuery(q);
    
    const cat = searchParams.get("category");
    if (cat) {
      const match = CATEGORIES.find(c => c.toLowerCase() === cat.toLowerCase());
      if (match) setSelectedCategory(match);
    } else {
      if (q) setSelectedCategory("All Tools");
      else setSelectedCategory("All Tools"); // Reset if no category in URL
    }
  }, [searchParams]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All Tools") {
      params.delete("category");
    } else {
      params.set("category", cat.toLowerCase());
    }
    // Delete search param if they switch categories explicitly? Or keep it? The user said "preserve search functionality" so maybe keep it.
    router.push(`/tools?${params.toString()}`, { scroll: false });
  };

  // Calculate counts for categories
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOLS.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let result = [...TOOLS];

    // Filter by Category
    if (selectedCategory !== "All Tools") {
      result = result.filter((tool) => tool.category === selectedCategory);
    }

    // Filter by Search
    if (searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((tool) => {
        return (
          tool.title.toLowerCase().includes(lowerQuery) ||
          tool.description.toLowerCase().includes(lowerQuery) ||
          tool.keywords.some((k) => k.toLowerCase().includes(lowerQuery)) ||
          tool.category.toLowerCase().includes(lowerQuery)
        );
      });
    }

    // Sort - Removed sortBy logic as requested by user, default sort by default order in TOOLS array
    return result;
  }, [selectedCategory, searchQuery]);

  const handlePopularSearch = (term: string) => {
    router.push(`/tools?search=${encodeURIComponent(term)}`);
    const toolsSection = document.getElementById("all-tools-grid");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. Sticky Search + Filter Bar */}
      <ToolsFilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Dynamic Categories Section */}
      <Container className="pt-10">
        <AnimatePresence mode="wait">
          {selectedCategory === "All Tools" && (
            <motion.div
              key="featured-categories"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FeaturedCategories onSelectCategory={handleSelectCategory} toolCounts={toolCounts} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div id="all-tools-grid" className="scroll-mt-40 mt-8 mb-16">
          
          {/* Section Heading with Dynamic Title and Clear Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory === "All Tools" ? "All Tools" : `${selectedCategory} Tools`}
              </h2>
              <p className="text-slate-500 mt-1 font-medium">
                {filteredAndSortedTools.length} {filteredAndSortedTools.length === 1 ? "tool" : "tools"} available
              </p>
            </div>
            
            {selectedCategory !== "All Tools" && (
              <button
                onClick={() => {
                  handleSelectCategory("All Tools");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors self-start sm:self-auto"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* 3. All Tools Grid with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchQuery}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ToolGrid tools={filteredAndSortedTools} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 4. Popular Searches */}
        <div className="border-t border-slate-200 pt-10 pb-16">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-slate-400" />
            Popular Searches
          </h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-full text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
