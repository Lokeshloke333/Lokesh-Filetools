"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/lib/navigation";

interface NavDropdownProps {
  category: Category;
}

export function NavDropdown({ category }: NavDropdownProps) {
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

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % elementsArray.length;
      elementsArray[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex <= 0 ? elementsArray.length - 1 : currentIndex - 1;
      elementsArray[prevIndex]?.focus();
    }
  };

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
        className={`flex items-center gap-1 text-sm font-medium py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md px-1 ${
          isActiveCategory ? "text-blue-600" : "text-slate-600 hover:text-blue-600"
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
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-blue-900/10 ring-1 ring-slate-100 overflow-hidden z-50 p-3"
            role="menu"
          >
            <div className="flex items-center gap-2 mb-3 px-3 pt-2 pb-2 border-b border-slate-50">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-800">
                {category.title}
              </h3>
            </div>

            {category.items.length > 0 ? (
              <ul className="flex flex-col gap-0.5 max-h-[350px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
                {category.items.map((item) => {
                  const isItemActive = pathname === item.href;
                  return (
                    <li key={item.label} role="none">
                      <Link
                        href={item.comingSoon ? '#' : item.href}
                        role="menuitem"
                        className={`text-sm py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                          item.comingSoon 
                            ? 'cursor-default text-slate-400' 
                            : isItemActive 
                              ? 'text-blue-700 bg-blue-50 font-semibold' 
                              : 'text-slate-600 font-medium hover:text-blue-600 hover:bg-slate-50'
                        }`}
                        tabIndex={0}
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="truncate pr-2">{item.label}</span>
                        {!item.comingSoon && (
                          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isItemActive ? 'text-blue-600 opacity-100 translate-x-0' : 'text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        )}
                        {item.comingSoon && (
                          <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 transition-colors group-hover:bg-slate-200">
                            Soon
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-sm text-slate-400 italic px-3 py-2">
                Features in development
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
