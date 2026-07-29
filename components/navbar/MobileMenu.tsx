"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { navigationData } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (title: string) => {
    setOpenCategory(prev => prev === title ? null : title);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="lg:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl z-40 overflow-hidden"
        >
          <div className="flex flex-col px-6 py-6 max-h-[80vh] overflow-y-auto">
            
            {/* Category Accordions */}
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
              {navigationData.map((category) => {
                const Icon = category.icon;
                const isCatOpen = openCategory === category.title;
                
                return (
                  <div key={category.title} className="flex flex-col">
                    <button 
                      onClick={() => toggleCategory(category.title)}
                      className="flex items-center justify-between w-full text-left py-3 text-lg font-medium text-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-blue-500" />
                        {category.title.split(' ')[0]}
                      </div>
                      {isCatOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </button>
                    
                    <AnimatePresence>
                      {isCatOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2 pt-2 pb-4 pl-8">
                            {category.items.length > 0 ? (
                              category.items.map(item => (
                                <Link 
                                  key={item.label} 
                                  href={item.comingSoon ? '#' : item.href}
                                  onClick={item.comingSoon ? undefined : onClose}
                                  className={`py-1.5 transition-colors ${item.comingSoon ? 'text-slate-400 cursor-default' : 'text-slate-600 hover:text-blue-600'}`}
                                >
                                  {item.label}
                                  {item.comingSoon && (
                                    <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">
                                      Soon
                                    </span>
                                  )}
                                </Link>
                              ))
                            ) : (
                              <div className="text-sm text-slate-400 italic py-1.5">
                                Features in development
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Other Links */}
            <Link href="/tools" onClick={onClose} className="border-b border-slate-100 py-4 text-lg font-medium text-slate-800 hover:text-blue-600 transition-colors">
              Browse Tools
            </Link>

            {/* CTA */}
            <div className="pt-8 pb-4">
              <Button asChild size="lg" className="w-full rounded-full text-base font-bold shadow-md shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" onClick={onClose}>Contact</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
