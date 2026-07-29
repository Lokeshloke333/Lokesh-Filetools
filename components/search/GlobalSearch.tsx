/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { TOOLS, ToolDefinition } from "@/lib/tools";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchVariant = "navbar" | "hero" | "filterBar";

interface GlobalSearchProps {
  variant?: SearchVariant;
  initialValue?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export function GlobalSearch({
  variant = "navbar",
  initialValue = "",
  onSearchChange,
  className,
  inputRef,
}: GlobalSearchProps) {
  const [query, setQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync initialValue changes (e.g. from URL or chips)
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Filter tools based on query
  const searchResults = useMemo(() => {
    if (query.trim().length < 2) return [];

    const lowerQuery = query.toLowerCase();

    return TOOLS.filter((tool) => {
      const matchTitle = tool.title.toLowerCase().includes(lowerQuery);
      const matchDesc = tool.description.toLowerCase().includes(lowerQuery);
      const matchCat = tool.category.toLowerCase().includes(lowerQuery);
      const matchKeywords = tool.keywords.some(k => k.toLowerCase().includes(lowerQuery));

      return matchTitle || matchDesc || matchCat || matchKeywords;
    });
  }, [query]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Control dropdown visibility
  useEffect(() => {
    if (variant === "filterBar") {
      setIsOpen(false);
      return;
    }
    if (query.trim().length < 2) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
    setActiveIndex(-1);
  }, [query, variant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/tools?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If dropdown is disabled or not open
    if (!isOpen || variant === "filterBar") {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearchSubmit();
      } else if ((e.key === "ArrowDown") && query.trim().length >= 2 && variant !== "filterBar") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        // Navigate to the selected suggestion
        const selected = searchResults[activeIndex];
        if (selected.status === "active") {
          setIsOpen(false);
          router.push(selected.href);
          // Don't clear query immediately so it feels snappy, but can if desired
        }
      } else if (searchResults.length === 1) {
        // Exactly one match, navigate directly
        const selected = searchResults[0];
        if (selected.status === "active") {
          setIsOpen(false);
          router.push(selected.href);
        }
      } else {
        // No suggestion selected, just submit the search to /tools
        handleSearchSubmit();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const handleItemClick = (e: React.MouseEvent, tool: ToolDefinition) => {
    if (tool.status === "coming-soon") {
      e.preventDefault();
      return;
    }
    setIsOpen(false);
    // Don't clear query; it will navigate away anyway
  };

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <div className={cn(
        "relative w-full",
        variant === "hero" ? "shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl group transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-blue-200/40 focus-within:shadow-[0_8px_40px_rgba(59,130,246,0.2)]" : ""
      )}>
        <div className={cn(
          "absolute inset-y-0 left-0 flex items-center pointer-events-none z-10",
          variant === "hero" ? "pl-5" : "pl-3.5"
        )}>
          <Search className={cn(
            variant === "hero" ? "w-5 h-5 2xl:w-6 2xl:h-6 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 group-focus-within:text-blue-600 group-focus-within:scale-110 transition-all duration-300" : "w-4 h-4 text-slate-400"
          )} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "block w-full text-slate-900 border border-slate-200 outline-none transition-all placeholder:text-slate-400",
            variant === "hero"
              ? "p-4 pl-12 md:p-5 md:pl-12 2xl:p-6 2xl:pl-14 text-sm md:text-base 2xl:text-lg rounded-2xl bg-white/95 focus:bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 backdrop-blur-sm"
              : "py-2.5 pl-10 pr-4 text-sm rounded-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            variant === "navbar" ? "bg-slate-50 shadow-inner" : "",
            variant === "filterBar" ? "bg-white" : ""
          )}
          placeholder={variant === "hero" ? "Search 100+ file tools..." : (variant === "navbar" ? "Search 100+ tools..." : "Search tools...")}
          aria-label="Search tools"
        />
        {variant === "hero" && (
          <button
            onClick={handleSearchSubmit}
            className="absolute inset-y-2 right-2 px-4 md:px-6 2xl:px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
        )}
      </div>

      {isOpen && searchResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-[100] max-h-[400px] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Search Results
            </span>
          </div>

          <div className="overflow-y-auto py-2">
            {searchResults.length === 0 ? (
              <div className="px-4 py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <SearchX className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">No tools found</p>
                <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms</p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {searchResults.map((tool, index) => {
                  const isActive = index === activeIndex;
                  const isComingSoon = tool.status === "coming-soon";
                  const Icon = tool.icon;

                  return (
                    <li key={tool.id}>
                      <Link
                        href={isComingSoon ? "#" : tool.href}
                        onClick={(e) => handleItemClick(e, tool)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-center px-4 py-3 border-l-2 transition-all duration-150
                          ${isComingSoon ? "cursor-default" : "cursor-pointer"}
                          ${isActive && !isComingSoon ? "bg-blue-50/50 border-blue-500" : "border-transparent"}
                          ${isActive && isComingSoon ? "bg-slate-50 border-slate-300" : ""}
                          ${!isActive ? "hover:bg-slate-50/50" : ""}
                        `}
                      >
                        <div className={`w-10 h-10 rounded-lg flex flex-shrink-0 items-center justify-center mr-3 
                          ${isComingSoon ? "bg-slate-100/50 text-slate-400" : isActive ? "bg-blue-100 " + tool.color : "bg-slate-50 " + tool.color}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-grow min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-semibold truncate ${isComingSoon ? "text-slate-500" : "text-slate-900"}`}>
                              {tool.title}
                            </h4>
                            {isComingSoon && (
                              <span className="text-[9px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                        <div className="hidden sm:flex flex-shrink-0">
                          <span className="text-[10px] font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                            {tool.category}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer keyboard hints */}
          <div className="hidden sm:flex px-4 py-2 bg-slate-50 border-t border-slate-100 items-center justify-between text-[10px] text-slate-400 font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm">↓</kbd>
                <kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm">↑</kbd> to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm">↵</kbd> to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm">esc</kbd> to dismiss
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
