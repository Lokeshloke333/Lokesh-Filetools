"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { Zap, Shield, Sparkles, Cloud, Lock, Clock } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Lightning Fast",
      description: "Our distributed cloud infrastructure ensures your files are processed in seconds, not minutes.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      bg: "bg-amber-50",
    },
    {
      title: "Bank-grade Security",
      description: "All files are encrypted during transfer (TLS) and automatically deleted from our servers after 2 hours.",
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      title: "High Quality",
      description: "We use the best open-source and custom software to make sure the quality of your files is preserved.",
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-50",
    },
    {
      title: "Cloud Integrated",
      description: "Directly import and export your files to Google Drive, Dropbox, and OneDrive with one click.",
      icon: <Cloud className="w-6 h-6 text-cyan-500" />,
      bg: "bg-cyan-50",
    },
    {
      title: "Privacy First",
      description: "We don't look at your files. No one does. Your data remains strictly yours, forever.",
      icon: <Lock className="w-6 h-6 text-rose-500" />,
      bg: "bg-rose-50",
    },
    {
      title: "24/7 Availability",
      description: "Access our tools anytime, anywhere, on any device. We guarantee 99.9% uptime for all services.",
      icon: <Clock className="w-6 h-6 text-indigo-500" />,
      bg: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Why Choose Fileinator?
          </h2>
          <p className="text-slate-600 text-lg">
            We've built the most reliable, secure, and fastest file processing platform on the web.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
