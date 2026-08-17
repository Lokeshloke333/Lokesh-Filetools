import React, { useState, useEffect, useRef } from "react";
import { X, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssistantInput } from "./AssistantInput";
import { AssistantMessage } from "./AssistantMessage";
import { matchTool } from "@/lib/assistant/toolMatcher";
import { ToolDefinition } from "@/lib/tools";

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
  suggestions?: string[];
};

const INITIAL_SUGGESTIONS = [
  "📄 PDF Tools",
  "🖼️ Image Tools",
  "🎬 Video Tools",
  "🎵 Audio Tools",
  "🔍 Find a Tool"
];

export function AssistantWindow({ isOpen, onClose }: AssistantWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSend = (text: string) => {
    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: "user", text }]);

    // Add typing indicator
    const typingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: typingId, role: "assistant", isTyping: true }]);

    // Process intent
    setTimeout(() => {
      const match = matchTool(text);
      
      setMessages(prev => {
        const newMessages = prev.filter(m => m.id !== typingId); // Remove typing
        
        if (match.isConfident && match.tools.length > 0) {
          const suggestions = match.tools[0].category === "Image" 
            ? ["Compress image", "Resize image", "More image tools"]
            : match.tools[0].category === "PDF"
            ? ["Compress another PDF", "Merge PDFs", "PDF tools"]
            : ["More tools"];

          newMessages.push({
            id: Date.now().toString(),
            role: "assistant",
            text: match.tools.length > 1 
              ? "I can help with that. Which tool do you need?" 
              : "Got it! I think this tool will help:",
            tools: match.tools,
            suggestions
          });
        } else {
          newMessages.push({
            id: Date.now().toString(),
            role: "assistant",
            text: "I'm not completely sure which tool you need. What are you trying to do?",
            suggestions: ["PDF", "Image", "Video", "Audio", "Utilities", "AI"]
          });
        }
        
        return newMessages;
      });
    }, 600); // Artificial delay for typing feel
  };

  if (!isOpen) return null;

  return (
    <div 
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
            onSuggestionClick={handleSend}
          />
        ))}
      </div>

      {/* Input Area */}
      <div ref={inputContainerRef}>
        <AssistantInput 
          onSend={handleSend} 
          disabled={messages.some(m => m.isTyping)}
        />
      </div>
    </div>
  );
}
