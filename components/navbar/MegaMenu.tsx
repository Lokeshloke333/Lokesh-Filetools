"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { navigationData } from "@/lib/navigation";

export function MegaMenu() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
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
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1100px] xl:w-[1200px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 p-8"
          >
            <div className="grid grid-cols-4 gap-x-8 gap-y-10 xl:gap-x-12">
              {navigationData.map((category) => {
                const Icon = category.icon;
                const isLargeCategory = category.title === "PDF Tools" && category.items?.length > 10;
                
                return (
                  <div key={category.title} className={`flex flex-col gap-3 ${isLargeCategory ? 'col-span-2' : 'col-span-1'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        {category.title}
                        {category.comingSoon && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                            Soon
                          </span>
                        )}
                      </h3>
                    </div>
                    
                    {!category.comingSoon ? (
                      <ul className={`grid gap-x-6 gap-y-1.5 ${isLargeCategory ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {category.items.map((item) => (
                          <li key={item.label}>
                            <Link 
                              href={item.href}
                              className="text-sm text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 block py-1.5 px-2 -mx-2 rounded-lg transition-colors"
                            >
                              {item.label}
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
