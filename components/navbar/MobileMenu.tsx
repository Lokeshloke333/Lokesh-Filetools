"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronRight, ArrowRight } from "lucide-react";
import { navigationData, Category } from "@/lib/navigation";
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
          className="lg:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[rgba(255,255,255,0.85)] backdrop-blur-[18px] border border-white/60 shadow-xl shadow-slate-200/50 z-40 overflow-hidden rounded-2xl"
        >
          <div className="flex flex-col px-6 py-6 max-h-[80vh] overflow-y-auto">
            
            {/* Category Accordions */}
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
              {navigationData.map((category) => (
                <MobileCategoryItem 
                  key={category.title} 
                  category={category} 
                  isOpen={openCategory === category.title}
                  onToggle={() => toggleCategory(category.title)}
                  onClose={onClose}
                />
              ))}
            </div>

            {/* Other Links */}
            <Link href="/tools" onClick={onClose} className="border-b border-slate-100 py-4 text-lg font-medium text-slate-800 hover:text-blue-600 transition-colors">
              Browse Tools
            </Link>

            {/* CTA */}
            <div className="pt-8 pb-4">
              <Button asChild size="lg" className="w-full rounded-full text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 border border-white/20">
                <Link href="/contact" onClick={onClose}>Contact</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileCategoryItem({ 
  category, 
  isOpen, 
  onToggle, 
  onClose 
}: { 
  category: Category, 
  isOpen: boolean, 
  onToggle: () => void, 
  onClose: () => void 
}) {
  const Icon = category.icon;
  const hasConversions = category.conversionItems && category.conversionItems.length > 0;
  
  const [toolsOpen, setToolsOpen] = useState(true);
  const [conversionsOpen, setConversionsOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left py-3 text-lg font-medium text-slate-800"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-500" />
          {category.title.split(' ')[0]}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-1 pb-4 pl-4 border-l-2 border-slate-100 ml-2 mt-1">
              
              {/* Tools Accordion */}
              <div className="flex flex-col">
                <button 
                  onClick={() => setToolsOpen(!toolsOpen)} 
                  className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700 w-full text-left hover:text-blue-600 transition-colors"
                >
                  {toolsOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  {category.title.split(' ')[0]} Tools
                </button>
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1.5 pl-6 pb-2 pt-1">
                        {category.items.length > 0 ? (
                          category.items.map(item => (
                            <Link 
                              key={item.label} 
                              href={item.comingSoon ? '#' : item.href}
                              onClick={item.comingSoon ? undefined : onClose}
                              className={`py-1.5 transition-colors text-sm ${item.comingSoon ? 'text-slate-400 cursor-default' : 'text-slate-600 hover:text-blue-600'}`}
                            >
                              {item.label}
                              {item.comingSoon && (
                                <span className="ml-2 text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
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

              {/* Separator */}
              {hasConversions && <div className="h-px bg-slate-100 my-2 ml-6 mr-4" />}

              {/* Conversions Accordion */}
              {hasConversions && (
                <div className="flex flex-col">
                  <button 
                    onClick={() => setConversionsOpen(!conversionsOpen)} 
                    className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700 w-full text-left hover:text-blue-600 transition-colors"
                  >
                    {conversionsOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    Popular Conversions
                  </button>
                  <AnimatePresence>
                    {conversionsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-1.5 pl-6 pb-2 pt-1">
                          {category.conversionItems!.map(item => (
                            <Link 
                              key={item.label} 
                              href={item.comingSoon ? '#' : item.href}
                              onClick={item.comingSoon ? undefined : onClose}
                              className={`py-1.5 transition-colors text-sm ${item.comingSoon ? 'text-slate-400 cursor-default' : 'text-slate-600 hover:text-blue-600'}`}
                            >
                              {item.label}
                            </Link>
                          ))}
                          
                          <Link 
                            href={`/tools?category=${category.title.split(' ')[0].toLowerCase()}`}
                            onClick={onClose}
                            className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700 mt-2 py-1.5"
                          >
                            View All {category.title} <ArrowRight className="w-3 h-3" />
                          </Link>
                          <div className="text-xs text-slate-400 mt-1 font-medium pl-0.5">
                            30+ Supported Formats
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
