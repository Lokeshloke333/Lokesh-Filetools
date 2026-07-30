import React from "react";
import { cn } from "@/lib/utils";

interface ToolWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export function ToolWorkspace({ children, className }: ToolWorkspaceProps) {
  return (
    <div 
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
