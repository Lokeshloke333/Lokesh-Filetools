/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useRef } from "react";
import { Search, SearchX } from "lucide-react";
import { ToolDefinition } from "@/lib/tools";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useGlobalSearch } from "@/lib/hooks/useGlobalSearch";

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
  const {
    query,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    searchResults,
    handleChange,
    handleSearchSubmit,
    handleKeyDown,
    handleItemClick,
  } = useGlobalSearch({
    initialValue,
    variant,
    onSearchChange,
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <div className={cn(
        "relative w-full",
        variant === "hero" ? "shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[18px] group transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-blue-200/40 focus-within:shadow-[0_8px_40px_rgba(59,130,246,0.2)]" : ""
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
              ? "h-[64px] py-0 pl-12 pr-[160px] text-base leading-[64px] rounded-[18px] bg-white/95 focus:bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 backdrop-blur-sm m-0 transition-all"
              : "py-2.5 pl-10 pr-4 text-sm rounded-full",
            variant === "navbar" 
              ? "bg-slate-50/50 border border-slate-200/50 backdrop-blur-sm shadow-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white/80 transition-all duration-200" 
              : "",
            variant === "filterBar" 
              ? "bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
              : ""
          )}
          placeholder={variant === "hero" ? "Search 100+ file tools..." : (variant === "navbar" ? "Search 100+ tools..." : "Search tools...")}
          aria-label="Search tools"
        />
        {variant === "hero" && (
          <button
            onClick={handleSearchSubmit}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-[150px] h-[52px] rounded-[14px] text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center hover:scale-[1.02]"
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
