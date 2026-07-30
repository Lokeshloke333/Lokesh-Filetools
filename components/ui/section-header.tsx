import React from "react";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center" | "right";
  theme?: "light" | "dark";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  eyebrowIcon: Icon,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}: SectionHeaderProps) {
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  };

  const isDark = theme === "dark";

  return (
    <div className={`flex flex-col mb-12 md:mb-14 max-w-[700px] ${alignmentClasses[align]} ${className}`}>
      {eyebrow && (
        <div className={`flex items-center gap-4 mb-3 ${align === "center" ? "justify-center" : "justify-start"}`}>
          {align === "center" && (
            <div className={`h-[1px] w-8 md:w-12 bg-gradient-to-r ${isDark ? "from-transparent to-blue-400/50" : "from-transparent to-blue-500/30"}`} />
          )}
          <span className={`text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r ${isDark ? "from-blue-400 to-purple-400" : "from-blue-600 to-purple-600"} whitespace-nowrap`}>
            {eyebrow.replace(/[^a-zA-Z\s]/g, '').trim()}
          </span>
          <div className={`h-[1px] w-8 md:w-12 bg-gradient-to-l ${isDark ? "from-transparent to-purple-400/50" : "from-transparent to-purple-500/30"}`} />
        </div>
      )}

      <h2
        className={`text-4xl md:text-[44px] lg:text-[48px] font-bold leading-[1.15] tracking-[-0.03em] mb-3 md:mb-3.5 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`text-lg leading-relaxed ${
            isDark ? "text-slate-300 font-medium" : "text-slate-500 font-normal"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
