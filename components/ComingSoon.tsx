"use client";

import React from "react";
import { TOOLS } from "@/lib/tools";
import { Container } from "@/components/ui/Container";

export function ComingSoon() {
  // Use up to 8 tools that are coming soon
  const comingSoonTools = TOOLS.filter(t => t.status === "coming-soon").slice(0, 8);

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            More Tools Coming Soon
          </h2>
          <p className="text-slate-500">
            We are constantly working on new features. Here is a sneak peek of what's next.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {comingSoonTools.map((tool, i) => {
            const Icon = tool.icon;
            return (
            <div 
              key={i} 
              className="flex flex-col items-center justify-center p-6 border border-slate-100 border-dashed rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors opacity-70 cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                <Icon className={`w-5 h-5 ${tool.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 text-center mb-2">{tool.title}</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                Coming Soon
              </span>
            </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
