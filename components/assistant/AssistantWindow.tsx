import React, { useState, useEffect, useRef } from "react";
import { X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssistantInput } from "./AssistantInput";
import { AssistantMessage } from "./AssistantMessage";
import { matchTool } from "@/lib/assistant/toolMatcher";
import { TOOLS, ToolDefinition } from "@/lib/tools";

export type AssistantAction =
  | { type: "category"; category: string; label: string }
  | { type: "show-more-tools"; category: string; label: string }
  | { type: "send-message"; text: string };

interface AssistantWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  isTyping?: boolean;
  tools?: ToolDefinition[];
  suggestions?: AssistantAction[];
};

const INITIAL_SUGGESTIONS: AssistantAction[] = [
  { type: "category", category: "PDF", label: "📄 PDF Tools" },
  { type: "category", category: "Image", label: "🖼️ Image Tools" },
  { type: "category", category: "Video", label: "🎬 Video Tools" },
  { type: "category", category: "Audio", label: "🎵 Audio Tools" },
  { type: "category", category: "Utilities", label: "🔧 Utilities" },
  { type: "category", category: "AI", label: "✨ AI Tools" },
];

export function AssistantWindow({ isOpen, onClose }: AssistantWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking inside the window
      if (windowRef.current && windowRef.current.contains(event.target as Node)) {
        return;
      }
      
      // We also check if the click was on the launcher button.
      // Usually, clicking the launcher when open will trigger its own onClick,
      // but it's safe to just call onClose() here. 
      // If it interferes with the launcher toggle, we might need a class check.
      const target = event.target as Element;
      if (target.closest('[data-assistant-launcher]')) {
        return;
      }

      onClose();
    };

    if (isOpen) {
      // Small delay to prevent immediate close if opened via click
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Initialize chat
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      setHasInitialized(true);
      // Small delay for natural feel
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            role: "assistant",
            text: "Hi! 👋 I'm the Fileinator Assistant.\n\nTell me what you want to do and I'll help you find the right tool.",
            suggestions: INITIAL_SUGGESTIONS
          }
        ]);
      }, 300);
    }
  }, [isOpen, hasInitialized]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      const input = inputContainerRef.current?.querySelector('input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleAction = (action: AssistantAction) => {
    const actionTime = Date.now();
    
    if (action.type === "send-message") {
      // Normal natural language message
      const text = action.text;
      setMessages(prev => [...prev, { id: actionTime.toString(), role: "user", text }]);
      const typingId = (actionTime + 1).toString();
      setMessages(prev => [...prev, { id: typingId, role: "assistant", isTyping: true }]);

      setTimeout(() => {
        const match = matchTool(text);
        
        setMessages(prev => {
          const newMessages = prev.filter(m => m.id !== typingId);
          
          if (match.score >= 70 && match.tools.length > 0) {
            const topTool = match.tools[0];
            const topCategory = topTool.category;
            const suggestions: AssistantAction[] = [
              { type: "category", category: topCategory, label: `More ${topCategory} tools` }
            ];

            newMessages.push({
              id: Date.now().toString(),
              role: "assistant",
              text: "Got it! I think this tool will help:",
              tools: [topTool],
              suggestions
            });
          } else if (match.score >= 45 && match.tools.length > 0) {
            newMessages.push({
              id: Date.now().toString(),
              role: "assistant",
              text: "I can help with that. Which of these tools do you need?",
              tools: match.tools
            });
          } else {
            // Fallback
            const query = text.toLowerCase();
            let suggestions = INITIAL_SUGGESTIONS;
            let textMsg = "I'm not completely sure which tool you need. What are you trying to do?";
            
            if (query.includes("pdf")) {
              textMsg = "It sounds like you need to work with a PDF. Here are our PDF tools:";
              suggestions = [{ type: "category", category: "PDF", label: "📄 View all PDF tools" }];
            } else if (query.includes("image") || query.includes("photo") || query.includes("picture")) {
              textMsg = "It sounds like you need to edit an image. Here are our Image tools:";
              suggestions = [{ type: "category", category: "Image", label: "🖼️ View all Image tools" }];
            } else if (query.includes("video")) {
              textMsg = "It sounds like you want to edit a video. Here are our Video tools:";
              suggestions = [{ type: "category", category: "Video", label: "🎬 View all Video tools" }];
            }

            newMessages.push({
              id: Date.now().toString(),
              role: "assistant",
              text: textMsg,
              suggestions
            });
          }
          return newMessages;
        });
      }, 600);

    } else if (action.type === "category") {
      // Category explicit click
      setMessages(prev => [...prev, { id: actionTime.toString(), role: "user", text: action.label }]);
      const typingId = (actionTime + 1).toString();
      setMessages(prev => [...prev, { id: typingId, role: "assistant", isTyping: true }]);

      setTimeout(() => {
        setMessages(prev => {
          const newMessages = prev.filter(m => m.id !== typingId);
          const allCategoryTools = TOOLS.filter(t => t.category.toLowerCase() === action.category.toLowerCase());
          
          let displayTools = allCategoryTools;
          let suggestions: AssistantAction[] = [];
          
          if (allCategoryTools.length > 6) {
            displayTools = allCategoryTools.slice(0, 6);
            suggestions = [{ type: "show-more-tools", category: action.category, label: `More ${action.category} tools →` }];
          }

          let emoji = "🔧";
          if (action.category.toLowerCase() === "pdf") emoji = "📄";
          if (action.category.toLowerCase() === "image") emoji = "🖼️";
          if (action.category.toLowerCase() === "video") emoji = "🎬";
          if (action.category.toLowerCase() === "audio") emoji = "🎵";
          if (action.category.toLowerCase() === "ai") emoji = "✨";

          newMessages.push({
            id: Date.now().toString(),
            role: "assistant",
            text: `${emoji} Here are our ${action.category} tools. What would you like to do?`,
            tools: displayTools,
            suggestions
          });
          return newMessages;
        });
      }, 400);

    } else if (action.type === "show-more-tools") {
      // Show more tools (no user bubble)
      const typingId = actionTime.toString();
      setMessages(prev => [...prev, { id: typingId, role: "assistant", isTyping: true }]);

      setTimeout(() => {
        setMessages(prev => {
          const newMessages = prev.filter(m => m.id !== typingId);
          const allCategoryTools = TOOLS.filter(t => t.category.toLowerCase() === action.category.toLowerCase());
          const remainingTools = allCategoryTools.slice(6);
          
          newMessages.push({
            id: Date.now().toString(),
            role: "assistant",
            text: `Here are more ${action.category} tools:`,
            tools: remainingTools,
            suggestions: [
              { type: "category", category: action.category, label: `← Back to popular ${action.category} tools` }
            ]
          });
          return newMessages;
        });
      }, 400);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={windowRef}
      className={cn(
        "fixed z-50 bottom-6 right-3 md:right-6 flex flex-col bg-white shadow-2xl rounded-[22px] border border-slate-200 overflow-hidden transition-all duration-300 transform origin-bottom-right",
        "w-[calc(100vw-24px)] md:w-[380px] h-[520px] max-h-[calc(100vh-100px)]",
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      )}
      role="dialog"
      aria-label="Fileinator Assistant Chat"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1.5 rounded-full">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-none">Fileinator Assistant</span>
            <span className="text-[11px] text-white/80 mt-0.5">Find the right tool in seconds</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar flex flex-col gap-1"
      >
        {messages.map((msg) => (
          <AssistantMessage 
            key={msg.id}
            role={msg.role}
            text={msg.text}
            isTyping={msg.isTyping}
            tools={msg.tools}
            suggestions={msg.suggestions}
            onSuggestionClick={handleAction}
          />
        ))}
      </div>

      {/* Input Area */}
      <div ref={inputContainerRef}>
        <AssistantInput 
          onSend={(text) => handleAction({ type: "send-message", text })} 
          disabled={messages.some(m => m.isTyping)}
        />
      </div>
    </div>
  );
}
