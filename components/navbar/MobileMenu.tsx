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
  const [isToolsOpen, setIsToolsOpen] = useState(false);

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
            {/* Tools Accordion */}
            <div className="border-b border-slate-100 py-3">
              <button 
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="flex items-center justify-between w-full text-left text-lg font-medium text-slate-800"
              >
                Tools
                {isToolsOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>
              
              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-6 pt-4 pb-2">
                      {navigationData.map((category) => {
                        const Icon = category.icon;
                        return (
                          <div key={category.title} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-slate-700 font-semibold text-base mb-1">
                              <Icon className="w-4 h-4 text-blue-500" />
                              {category.title}
                              {category.comingSoon && (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase">
                                  Soon
                                </span>
                              )}
                            </div>
                            
                            {!category.comingSoon && (
                              <div className="flex flex-col gap-2 pl-6">
                                {category.items.map(item => (
                                  <Link 
                                    key={item.label} 
                                    href={item.href}
                                    onClick={onClose}
                                    className="text-slate-500 hover:text-blue-600 py-1"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
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
