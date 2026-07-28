import React from "react";
import { Settings } from "lucide-react";

interface AIOptionsPanelProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AIOptionsPanel({ 
  title = "AI Options", 
  description = "Configure AI processing settings",
  children 
}: AIOptionsPanelProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <Settings className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500 font-medium">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
