"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, ArrowLeft, SearchX } from "lucide-react";
import { ToolDefinition } from "@/lib/tools";
import Link from "next/link";
import { useGlobalSearch } from "@/lib/hooks/useGlobalSearch";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearch({ isOpen, onClose }: MobileSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    searchResults,
    handleChange,
    handleSearchSubmit,
    handleKeyDown,
    handleItemClick,
  } = useGlobalSearch({
    variant: "mobile",
    onClose,
  });

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow animation to complete before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-slate-50 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Search"
        >
          {/* Header */}
          <div className="flex items-center px-4 py-3 bg-white border-b border-slate-200">
            <button
              onClick={onClose}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full"
              aria-label="Close search"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 relative ml-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-10 text-base focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500 text-slate-900"
                placeholder="Search tools..."
                aria-label="Search tools"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            {query.trim().length >= 2 ? (
              searchResults.length === 0 ? (
                <div className="px-4 py-16 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                    <SearchX className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-base font-medium text-slate-800">No tools found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search terms</p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-4 py-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Search Results
                    </span>
                  </div>
                  <ul className="flex flex-col bg-white border-y border-slate-200">
                    {searchResults.map((tool) => {
                      const isComingSoon = tool.status === "coming-soon";
                      const Icon = tool.icon;

                      return (
                        <li key={tool.id} className="border-b border-slate-100 last:border-0">
                          <Link
                            href={isComingSoon ? "#" : tool.href}
                            onClick={(e) => handleItemClick(e, tool)}
                            className={`flex items-center px-4 py-3.5 transition-all
                              ${isComingSoon ? "cursor-default opacity-60" : "cursor-pointer hover:bg-slate-50 active:bg-slate-100"}
                            `}
                          >
                            <div className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center mr-4 shadow-sm
                              ${isComingSoon ? "bg-slate-100 text-slate-400" : "bg-blue-50 " + tool.color}
                            `}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-grow min-w-0 pr-2">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h4 className={`text-base font-semibold truncate ${isComingSoon ? "text-slate-500" : "text-slate-900"}`}>
                                  {tool.title}
                                </h4>
                                {isComingSoon && (
                                  <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                    Soon
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 line-clamp-1">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            ) : (
              <div className="px-4 py-10 flex flex-col items-center justify-center text-center opacity-50">
                <Search className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500">Type at least 2 characters to search</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
