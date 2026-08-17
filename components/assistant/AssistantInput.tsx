import React, { useState, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";

interface AssistantInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function AssistantInput({ onSend, disabled }: AssistantInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-slate-100 bg-white rounded-b-[20px] shrink-0">
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to do..."
          disabled={disabled}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400 min-w-0"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shrink-0"
          aria-label="Send message"
        >
          <SendHorizontal className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
