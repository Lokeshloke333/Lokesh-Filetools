"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolWorkspace({ children, className }: ToolWorkspaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let previousHeight = containerRef.current.offsetHeight;
    let scrollTimeout: NodeJS.Timeout;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        
        // If the workspace height shrinks significantly (e.g., UI collapsing into a smaller progress indicator)
        if (previousHeight - newHeight > 150) {
          const rect = containerRef.current!.getBoundingClientRect();
          
          // If the top of the workspace is pushed above the viewport (meaning the user is looking at the bottom of the page)
          if (rect.top < 80) {
             const scrollTarget = window.scrollY + rect.top - 120; // 120px offset for navbar breathing room
             
             // Clear any pending scroll
             clearTimeout(scrollTimeout);
             
             // Smoothly scroll back to the top of the workspace so the progress UI is visible
             scrollTimeout = setTimeout(() => {
                window.scrollTo({ top: Math.max(0, scrollTarget), behavior: "smooth" });
             }, 10);
          }
        }
        previousHeight = newHeight;
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "bg-white/95 backdrop-blur-xl rounded-[28px] border border-slate-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 md:p-8 lg:p-10 max-w-[1280px] mx-auto w-full transition-all duration-300",
        className
      )}
    >
      <div className="w-full flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}
