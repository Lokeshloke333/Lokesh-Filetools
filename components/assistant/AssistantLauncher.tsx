import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

export function AssistantLauncher({ isOpen, onClick }: AssistantLauncherProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 animate-float-icon",
        "w-[54px] h-[54px] md:w-[60px] md:h-[60px]",
        isOpen ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
      )}
      aria-label="Open Fileinator Assistant"
      aria-expanded={isOpen}
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}
