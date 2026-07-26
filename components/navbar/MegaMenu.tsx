"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navigationData } from "@/lib/navigation";

export function MegaMenu() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2">
        Tools
        <motion.span
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[min(1400px,calc(100vw-32px))] bg-[#F8FBFF] rounded-2xl shadow-2xl shadow-blue-900/10 ring-1 ring-slate-100 overflow-hidden z-50 p-6 xl:p-8"
          >
            <div 
              className="grid gap-x-3 md:gap-x-4 gap-y-8"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
            >
              {navigationData.map((category) => {
                const Icon = category.icon;
                const isPdfTools = category.title === "PDF Tools";
                
                return (
                  <div key={category.title} className="flex flex-col gap-3 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-blue-900/5 hover:shadow-md hover:shadow-blue-900/10 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-blue-50 p-2 rounded-full text-blue-600 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        {category.title}
                      </h3>
                    </div>
                    
                    {category.items.length > 0 ? (
                      <ul className={`grid gap-y-1 grid-cols-1 ${isPdfTools ? 'max-h-[420px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300' : ''}`}>
                        {category.items.map((item) => (
                          <li key={item.label}>
                            <Link 
                              href={item.comingSoon ? '#' : item.href}
                              className={`text-sm py-1.5 px-2 -mx-2 rounded-lg transition-all duration-200 flex items-center justify-between group ${item.comingSoon ? 'cursor-default text-slate-400' : 'text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 hover:pl-3'}`}
                            >
                              <span className="pr-2">{item.label}</span>
                              {!item.comingSoon && (
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600 shrink-0" />
                              )}
                              {item.comingSoon && (
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 transition-colors group-hover:bg-slate-200">
                                  Soon
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-slate-400 italic px-2">
                        Features in development
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
