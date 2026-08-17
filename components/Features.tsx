import React from "react";
import { Container } from "@/components/ui/Container";
import { Zap, Shield, Sparkles, Cloud, Lock, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

export function Features() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Process files in seconds with our advanced browser-based technology.",
      icon: Zap,
      theme: {
        from: "from-orange-500/[0.04]",
        iconGrad: "from-orange-400 to-orange-500",
        iconShadow: "shadow-orange-500/20 group-hover:shadow-orange-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    },
    {
      title: "Bank-grade Security",
      description: "Military-grade encryption ensures your data remains strictly confidential.",
      icon: Shield,
      theme: {
        from: "from-emerald-500/[0.04]",
        iconGrad: "from-emerald-400 to-emerald-500",
        iconShadow: "shadow-emerald-500/20 group-hover:shadow-emerald-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-5",
    },
    {
      title: "High Quality",
      description: "Preserve original file quality perfectly with our advanced conversion engine.",
      icon: Sparkles,
      theme: {
        from: "from-blue-500/[0.04]",
        iconGrad: "from-blue-400 to-blue-500",
        iconShadow: "shadow-blue-500/20 group-hover:shadow-blue-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-3",
    },
    {
      title: "Cloud Integrated",
      description: "Import and export directly to Google Drive and Dropbox seamlessly.",
      icon: Cloud,
      theme: {
        from: "from-cyan-500/[0.04]",
        iconGrad: "from-cyan-400 to-cyan-500",
        iconShadow: "shadow-cyan-500/20 group-hover:shadow-cyan-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-3",
    },
    {
      title: "Privacy First",
      description: "We never inspect your files. Your data is deleted instantly after processing.",
      icon: Lock,
      theme: {
        from: "from-pink-500/[0.04]",
        iconGrad: "from-pink-400 to-pink-500",
        iconShadow: "shadow-pink-500/20 group-hover:shadow-pink-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    },
    {
      title: "24/7 Availability",
      description: "Access our tools anytime from any device with a 99.9% uptime guarantee.",
      icon: Clock,
      theme: {
        from: "from-purple-500/[0.04]",
        iconGrad: "from-purple-400 to-purple-500",
        iconShadow: "shadow-purple-500/20 group-hover:shadow-purple-500/40",
      },
      colSpan: "col-span-12 md:col-span-6 lg:col-span-5",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <SectionHeader
          eyebrow="⭐ WHY FILEINATOR"
          title="Why Choose Fileinator?"
          description="We've built the most reliable, secure, and fastest file processing platform on the web."
        />

        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
                <div
                  key={i}
                  className={`group flex flex-col p-5 rounded-[20px] bg-white border border-[#EEF2FF] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-[4px] hover:scale-[1.01] transition-all duration-300 ease-out cursor-pointer relative overflow-hidden ${feature.colSpan}`}
                >
                {/* Subtle background tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.theme.from} to-transparent z-0`} />

                <div className="relative z-10 flex flex-col h-full">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] flex items-center justify-center mb-4 bg-gradient-to-br ${feature.theme.iconGrad} shadow-md ${feature.theme.iconShadow} text-white transition-all duration-300`}
                  >
                    <Icon className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
                  </div>
                  <h3 className="text-[20px] font-bold text-slate-900 mb-1.5 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-[15px] leading-relaxed line-clamp-2 pr-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
