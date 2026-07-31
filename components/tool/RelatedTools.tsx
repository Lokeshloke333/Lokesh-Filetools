"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/tools/ToolGrid";


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

  return (
    <div className="mt-16 mb-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Related Tools</h2>
      <div className="w-full">
        <ToolGrid tools={relatedToolsToDisplay} variant="compact" />
      </div>
    </div>
  );
}
