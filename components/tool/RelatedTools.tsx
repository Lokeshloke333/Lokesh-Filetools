"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/lib/tools";

interface RelatedToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function RelatedToolCard({ title, description, icon, href }: RelatedToolCardProps) {
  return (
    <Link 
      href={href}
      className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-lg transition-all duration-300 relative"
    >
      <div className="w-12 h-12 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors text-lg">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-grow">
        {description}
      </p>
    </Link>
  );
}

export function RelatedTools() {
  const pathname = usePathname();

  const relatedToolsToDisplay = useMemo(() => {
    if (!pathname) return [];
    
    // Normalize pathname to avoid trailing slash mismatches
    const normalizedPath = pathname.replace(/\/$/, "");
    
    const currentTool = TOOLS.find(t => t.href === normalizedPath);
    const otherTools = TOOLS.filter(t => t.href !== normalizedPath);
    
    if (currentTool) {
      if (currentTool.relatedToolIds && currentTool.relatedToolIds.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exactMatches = currentTool.relatedToolIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as any[];
        if (exactMatches.length > 0) return exactMatches;
      }
      
      // Get all tools from the same category
      const categoryTools = otherTools.filter(t => t.category === currentTool.category);
      
      // Return up to 6 tools. If < 4, it returns all available in the category.
      return categoryTools.slice(0, 6);
    }
    
    // Fallback if not matching any tool
    return otherTools.slice(0, 4);
  }, [pathname]);

  if (relatedToolsToDisplay.length === 0) {
    return null;
  }

  // Determine grid layout based on number of items to make it look good
  const itemCount = relatedToolsToDisplay.length;
  const gridClasses = 
    itemCount === 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
    itemCount === 2 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
    itemCount === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"; // 4, 5, 6 items

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Related Tools</h2>
      <div className={`grid gap-4 md:gap-6 ${gridClasses}`}>
        {relatedToolsToDisplay.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <RelatedToolCard 
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={<IconComponent className="w-6 h-6" />}
              href={tool.href}
            />
          );
        })}
      </div>
    </div>
  );
}
