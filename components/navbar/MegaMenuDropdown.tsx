"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Category } from "@/lib/navigation";

interface MegaMenuDropdownProps {
  category: Category;
}

export function MegaMenuDropdown({ category }: MegaMenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const Icon = category.icon;

  // Determine if the current category is active based on the URL
  const isActiveCategory = pathname?.startsWith(`/tools/${category.title.split(' ')[0].toLowerCase()}`);

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  const handleClick = () => setIsOpen(!isOpen);

  // Close on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle arrow key navigation inside dropdown
  const handleDropdownKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    const focusableElements = dropdownRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]');
    if (!focusableElements || focusableElements.length === 0) return;

    const elementsArray = Array.from(focusableElements);
    const currentIndex = elementsArray.findIndex(el => el === document.activeElement);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % elementsArray.length;
      elementsArray[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = currentIndex <= 0 ? elementsArray.length - 1 : currentIndex - 1;
      elementsArray[prevIndex]?.focus();
    }
  };

  const hasConversions = category.conversionItems && category.conversionItems.length > 0;

  const getTheme = (title: string) => {
    if (title.startsWith("Image")) return {
      bg: "bg-gradient-to-b from-[#FAF7FF] to-white/40",
      text: "text-purple-600",
      hoverBg: "hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-purple-100",
      hoverText: "hover:text-purple-700",
      activeBg: "bg-white shadow-sm ring-1 ring-purple-100",
      activeText: "text-purple-700",
      focusRing: "focus:ring-purple-500/50"
    };
    if (title.startsWith("PDF")) return {
      bg: "bg-gradient-to-b from-[#FFF7F7] to-white/40",
      text: "text-red-600",
      hoverBg: "hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-red-100",
      hoverText: "hover:text-red-700",
      activeBg: "bg-white shadow-sm ring-1 ring-red-100",
      activeText: "text-red-700",
      focusRing: "focus:ring-red-500/50"
    };
    if (title.startsWith("Video")) return {
      bg: "bg-gradient-to-b from-[#F5FAFF] to-white/40",
      text: "text-blue-600",
      hoverBg: "hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-blue-100",
      hoverText: "hover:text-blue-700",
      activeBg: "bg-white shadow-sm ring-1 ring-blue-100",
      activeText: "text-blue-700",
      focusRing: "focus:ring-blue-500/50"
    };
    if (title.startsWith("Audio")) return {
      bg: "bg-gradient-to-b from-[#F6FFF8] to-white/40",
      text: "text-emerald-600",
      hoverBg: "hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-emerald-100",
      hoverText: "hover:text-emerald-700",
      activeBg: "bg-white shadow-sm ring-1 ring-emerald-100",
      activeText: "text-emerald-700",
      focusRing: "focus:ring-emerald-500/50"
    };
    return {
      bg: "bg-slate-50",
      text: "text-slate-600",
      hoverBg: "hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200",
      hoverText: "hover:text-slate-800",
      activeBg: "bg-white shadow-sm ring-1 ring-slate-200",
      activeText: "text-slate-800",
      focusRing: "focus:ring-slate-500/50"
    };
  };

  const theme = getTheme(category.title);

  return (
    <div
      ref={dropdownRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleDropdownKeyDown}
    >
      <button
        onClick={handleClick}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`flex items-center gap-1 text-sm font-semibold py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-2 ${
          isActiveCategory ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
        }`}
      >
        <span>{category.title.split(' ')[0]}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-4 h-4 ${isActiveCategory ? 'text-blue-600' : 'text-slate-400'}`} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[750px] bg-[rgba(255,255,255,0.92)] backdrop-blur-[36px] isolate rounded-3xl shadow-2xl shadow-slate-400/30 border border-white/60 overflow-hidden z-50 flex flex-col"
            role="menu"
          >
            {/* Mega Menu Content Grid */}
            <div className={`grid grid-cols-1 ${hasConversions ? 'md:grid-cols-2' : ''} p-4 md:p-6 gap-6 md:gap-8`}>
              
              {/* Column 1: Main Tools */}
              <div className="pt-2 pl-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {category.title}
                  </h3>
                </div>
                
                {category.items.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2 overflow-y-auto overscroll-contain pr-2 -mr-2 max-h-[calc(100vh-17rem)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                    {category.items.map((item) => {
                      const isItemActive = pathname === item.href;
                      const ItemIcon = item.icon;
                      return (
                        <li key={item.label} role="none">
                          <Link
                            href={item.comingSoon ? '#' : item.href}
                            role="menuitem"
                            className={`p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                              item.comingSoon 
                                ? 'cursor-default opacity-60' 
                                : isItemActive 
                                  ? 'bg-blue-50 ring-1 ring-blue-200' 
                                  : 'hover:bg-slate-50'
                            }`}
                            tabIndex={0}
                            onClick={() => setIsOpen(false)}
                          >
                            {ItemIcon && (
                              <div className={`mt-0.5 shrink-0 ${isItemActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`}>
                                <ItemIcon className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${isItemActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-600'}`}>
                                  {item.label}
                                </span>
                                {item.comingSoon && (
                                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                    Soon
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm text-slate-400 italic py-2">
                    Features in development
                  </div>
                )}
              </div>

              {/* Column 2: Conversions */}
              {hasConversions && (
                <div className={`rounded-2xl p-5 md:p-6 ring-1 ring-black/5 ${theme.bg}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className={`font-bold text-lg py-1 ${theme.text}`}>
                      Popular Conversions
                    </h3>
                  </div>
                  
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {category.conversionItems!.map((item) => {
                      const isItemActive = pathname === item.href;
                      return (
                        <li key={item.label} role="none">
                          <Link
                            href={item.comingSoon ? '#' : item.href}
                            role="menuitem"
                            className={`text-sm py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center justify-between group focus:outline-none ${theme.focusRing} ${
                              item.comingSoon 
                                ? 'cursor-default text-slate-400' 
                                : isItemActive 
                                  ? `${theme.activeText} ${theme.activeBg} font-semibold` 
                                  : `text-slate-700 font-medium ${theme.hoverText} ${theme.hoverBg}`
                            }`}
                            tabIndex={0}
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="truncate pr-2">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50/60 backdrop-blur-sm border-t border-slate-200/50 p-4 px-6 flex justify-between items-center">
              <span className="text-sm text-slate-500 font-medium">
                30+ Supported Formats
              </span>
              <Link 
                href={`/tools?category=${category.title.split(' ')[0].toLowerCase()}`}
                className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                View All {category.title} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
