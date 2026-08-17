import React from "react";
import { cn } from "@/lib/utils";
import { Bot, User, ArrowRight } from "lucide-react";
import { ToolDefinition } from "@/lib/tools";
import Link from "next/link";

export interface AssistantMessageProps {
  role: "user" | "assistant";
  text?: string;
  isTyping?: boolean;
  tools?: ToolDefinition[];
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function AssistantMessage({
  role,
  text,
  isTyping,
  tools,
  suggestions,
  onSuggestionClick,
}: AssistantMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2", isAssistant ? "justify-start" : "justify-end")}>
      <div className={cn("flex max-w-[85%] gap-2", isAssistant ? "flex-row" : "flex-row-reverse")}>
        
        {/* Avatar */}
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto", 
          isAssistant ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
        )}>
          {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Content Box */}
        <div className="flex flex-col gap-2 min-w-0">
          {(text || isTyping) && (
            <div className={cn("px-4 py-2.5 rounded-2xl text-sm leading-relaxed", 
              isAssistant 
                ? "bg-slate-100 text-slate-800 rounded-bl-sm" 
                : "bg-blue-600 text-white rounded-br-sm"
            )}>
              {isTyping ? (
                <div className="flex items-center gap-1 h-5 px-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap break-words">{text}</p>
              )}
            </div>
          )}

          {/* Recommended Tools */}
          {tools && tools.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              {tools.map(tool => (
                <Link 
                  key={tool.id} 
                  href={tool.href}
                  className="flex flex-col bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                  onClick={() => {
                    // Optional: we could close the chat here if we wanted
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("p-1.5 rounded-lg bg-slate-50", tool.color)}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{tool.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug line-clamp-2 mb-2">
                    {tool.description}
                  </p>
                  <div className="flex items-center text-xs font-semibold text-blue-600 mt-auto">
                    Open Tool <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
