"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight, Check, Globe, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";

export function CTA() {
  const floatingChips = [
    { label: "PDF", top: "-5%", left: "10%", delay: 0 },
    { label: "PNG", top: "20%", left: "-2%", delay: 1 },
    { label: "MP4", top: "60%", left: "-4%", delay: 2 },
    { label: "DOCX", bottom: "10%", left: "15%", delay: 3 },
    { label: "JPG", top: "-4%", right: "15%", delay: 0.5 },
    { label: "ZIP", top: "30%", right: "-3%", delay: 1.5 },
    { label: "WEBP", bottom: "20%", right: "-1%", delay: 2.5 },
    { label: "SVG", bottom: "-2%", right: "10%", delay: 3.5 },
    { label: "AI", top: "10%", left: "50%", delay: 4 },
  ];

  const badges = [
    { text: "Browser-Based", icon: Globe },
    { text: "No Signup", icon: Zap },
    { text: "256-bit Secure", icon: Shield },
    { text: "Free Forever", icon: Check },
  ];

  return (
    <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
      <Container className="relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[32px] overflow-hidden bg-[#0a0a0f] text-center shadow-[0_20px_60px_-15px_rgba(37,99,235,0.4)] border border-white/[0.08] hover:shadow-[0_30px_80px_-20px_rgba(37,99,235,0.5)] transition-shadow duration-700 z-10"
        >
          {/* Animated Mesh Gradient Background */}
          <div className="absolute inset-0 -z-10">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#1e1b4b] to-purple-950 opacity-90" />
            
            {/* Animated Blobs */}
            <motion.div 
              animate={{ 
                x: [0, 50, 0, -50, 0],
                y: [0, -50, 50, 50, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[30%] -left-[10%] w-[60%] h-[70%] rounded-full bg-blue-600/40 blur-[100px] mix-blend-screen"
            />
            <motion.div 
              animate={{ 
                x: [0, -50, 50, 0],
                y: [0, 50, -50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[80%] rounded-full bg-purple-600/40 blur-[120px] mix-blend-screen"
            />
            
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          </div>

          {/* Floating Chips */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {floatingChips.map((chip, i) => (
              <motion.div
                key={i}
                className="absolute hidden md:flex font-black text-white/[0.04] text-5xl blur-[2px] select-none"
                style={{ top: chip.top, bottom: chip.bottom, left: chip.left, right: chip.right }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 8, -8, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: chip.delay
                }}
              >
                {chip.label}
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-16">
            <SectionHeader
              eyebrow="🚀 GET STARTED"
              title={<>Ready to simplify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 whitespace-nowrap">your workflow?</span></>}
              description="Everything you need to convert, compress, and optimize files in one place. Fast, secure, and browser-based."
              theme="dark"
              className="!mb-8 md:!mb-10 !max-w-[850px]"
            />
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="group relative bg-white text-blue-700 hover:bg-slate-50 hover:text-blue-800 rounded-full px-8 w-full sm:w-auto h-[56px] text-[17px] font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all duration-300 overflow-hidden" asChild>
                <Link href="/alltools">
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/50 to-blue-100/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-0" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40 hover:text-white rounded-full px-8 w-full sm:w-auto h-[56px] text-[17px] font-bold backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300" asChild>
                <Link href="/alltools">
                  Explore Tools
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
              {badges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-[13px] md:text-sm font-semibold text-blue-100 hover:bg-white/[0.08] hover:border-white/[0.15] hover:-translate-y-0.5 transition-all duration-300 shadow-sm cursor-default group">
                    <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                    {badge.text}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
