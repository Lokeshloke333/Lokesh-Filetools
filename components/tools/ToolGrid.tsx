import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolDefinition } from "@/lib/tools";

interface ToolGridProps {
  tools: ToolDefinition[];
}

const getCategoryColors = (category: string) => {
  switch (category.toLowerCase()) {
    case 'image':
      return {
        iconGradient: "from-purple-500 to-purple-600",
        iconGlow: "shadow-purple-500/25",
        borderHover: "hover:border-purple-300",
        shadowHover: "hover:shadow-purple-500/10",
        textHover: "group-hover:text-purple-600",
        pillBg: "bg-purple-50 text-purple-700",
      };
    case 'pdf':
      return {
        iconGradient: "from-red-500 to-red-600",
        iconGlow: "shadow-red-500/25",
        borderHover: "hover:border-red-300",
        shadowHover: "hover:shadow-red-500/10",
        textHover: "group-hover:text-red-600",
        pillBg: "bg-red-50 text-red-700",
      };
    case 'video':
      return {
        iconGradient: "from-blue-500 to-blue-600",
        iconGlow: "shadow-blue-500/25",
        borderHover: "hover:border-blue-300",
        shadowHover: "hover:shadow-blue-500/10",
        textHover: "group-hover:text-blue-600",
        pillBg: "bg-blue-50 text-blue-700",
      };
    case 'audio':
      return {
        iconGradient: "from-emerald-500 to-emerald-600",
        iconGlow: "shadow-emerald-500/25",
        borderHover: "hover:border-emerald-300",
        shadowHover: "hover:shadow-emerald-500/10",
        textHover: "group-hover:text-emerald-600",
        pillBg: "bg-emerald-50 text-emerald-700",
      };
    case 'utilities':
    default:
      return {
        iconGradient: "from-teal-500 to-teal-600",
        iconGlow: "shadow-teal-500/25",
        borderHover: "hover:border-teal-300",
        shadowHover: "hover:shadow-teal-500/10",
        textHover: "group-hover:text-teal-600",
        pillBg: "bg-teal-50 text-teal-700",
      };
  }
};

export function ToolGrid({ tools }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">No tools found</h3>
        <p className="text-slate-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isComingSoon = tool.status === "coming-soon";
        const colors = getCategoryColors(tool.category);

        const cardContent = (
          <div className="flex flex-col h-full">
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-6">
                {/* Icon Area */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${isComingSoon ? "bg-slate-100 text-slate-400" : `bg-gradient-to-br ${colors.iconGradient} text-white shadow-lg ${colors.iconGlow}`}`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                
                {/* Header Badges */}
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${colors.pillBg}`}>
                    {tool.category}
                  </span>
                  {isComingSoon && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full border border-slate-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Soon
                    </span>
                  )}
                </div>
              </div>
              
              {/* Typography */}
              <h3 className={`text-xl font-bold mb-2 tracking-tight ${isComingSoon ? "text-slate-600" : `text-slate-900 ${colors.textHover} transition-colors duration-300`}`}>
                {tool.title}
              </h3>
              <p className="text-sm text-slate-500 flex-grow line-clamp-2 leading-relaxed">
                {tool.description}
              </p>
            </div>
            
            {/* Divider & Footer */}
            <div className="border-t border-slate-100/80 p-4 px-6 bg-slate-50/50 rounded-b-2xl flex justify-between items-center transition-colors duration-300 group-hover:bg-slate-50">
              <span className={`text-sm font-semibold ${isComingSoon ? "text-slate-400" : `text-slate-600 ${colors.textHover} transition-colors duration-300`}`}>
                {isComingSoon ? "Coming Soon" : "Open Tool"}
              </span>
              <ArrowRight className={`w-4 h-4 ${isComingSoon ? "text-slate-300" : `text-slate-400 ${colors.textHover} group-hover:translate-x-1 transition-all duration-300`}`} />
            </div>
          </div>
        );

        if (isComingSoon) {
          return (
            <div
              key={tool.id}
              className="bg-white border border-slate-200/60 rounded-2xl opacity-70 cursor-not-allowed shadow-sm"
            >
              {cardContent}
            </div>
          );
        }

        return (
          <Link
            key={tool.id}
            href={tool.href}
            className={`group bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-xl ${colors.borderHover} ${colors.shadowHover} transition-all duration-300 block`}
          >
            {cardContent}
          </Link>
        );
      })}
    </div>
  );
}
