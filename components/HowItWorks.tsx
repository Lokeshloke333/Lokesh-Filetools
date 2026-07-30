"use client";

import React from "react";
import { UploadCloud, Settings, DownloadCloud } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      title: "1. Upload",
      description: "Select or drag & drop your files into our secure platform.",
      icon: UploadCloud,
      chips: ["JPG", "PNG", "PDF", "MP4"],
      color: "from-blue-500 to-cyan-400",
      glow: "shadow-blue-500/25",
    },
    {
      title: "2. Process",
      description: "Our cloud servers process your request in just a few seconds.",
      icon: Settings,
      chips: ["Browser-Based", "Secure", "Fast"],
      color: "from-purple-500 to-fuchsia-400",
      glow: "shadow-purple-500/25",
    },
    {
      title: "3. Download",
      description: "Download your processed files instantly. Easy and fast.",
      icon: DownloadCloud,
      chips: ["Instant", "High Quality"],
      color: "from-emerald-500 to-teal-400",
      glow: "shadow-emerald-500/25",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#09090b] relative overflow-hidden">
      {/* Premium Dark Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute left-0 right-0 top-1/4 m-auto h-[400px] w-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 h-[400px] w-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
        <SectionHeader
          eyebrow="⚡ HOW IT WORKS"
          title="How It Works"
          description="Convert, edit, and compress your files in three simple steps. No software installation required."
          theme="dark"
        />

        <div className="relative">
          {/* Animated Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[85px] left-[15%] right-[15%] h-[2px] bg-white/[0.05] rounded-full z-0 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full w-[20%] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#60a5fa]"
              animate={{ left: ['-20%', '120%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div 
                  key={i} 
                  className="group relative flex flex-col p-6 rounded-[20px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50 backdrop-blur-md overflow-hidden min-h-[150px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${step.color} shadow-lg ${step.glow} group-hover:scale-110 transition-all duration-500 relative z-10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight relative z-10">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow relative z-10">
                    {step.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 relative z-10 mt-auto">
                    {step.chips.map((chip, j) => (
                      <span key={j} className="px-3 py-1 text-xs font-semibold text-slate-300 bg-white/[0.05] rounded-full border border-white/[0.05] shadow-sm">
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
