"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  LayoutGrid,
  Search,
  Wand2,
  Lock,
  Zap,
  ArrowRight,
  Folder
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export function ToolsHero() {
  return (
    <div className="relative overflow-hidden bg-white pt-24 lg:pt-36">
      {/* 
        Smooth transition to the white content below: 
        A gradient at the very bottom blending from the blue background to slate-50.
      */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-blue-100/50 to-slate-50 z-0 pointer-events-none" aria-hidden="true" />

      {/* Subtle dotted grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle at center, rgba(15,23,42,1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      {/* Blurred Glowing Orbs for Blue Mesh Effect */}
      <div className="absolute top-0 -left-64 w-[800px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] z-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-40 -right-32 w-[600px] h-[600px] bg-indigo-400/15 rounded-full blur-[100px] z-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[100px] z-0 pointer-events-none" aria-hidden="true" />

      {/* Tiny Sparkle Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              top: `${15 + (i * 12)}%`,
              left: `${10 + (i * 15)}%`,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Giant Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-[18vw] font-black text-blue-900/[0.03] z-0 pointer-events-none tracking-tighter select-none whitespace-nowrap" aria-hidden="true">
        FILEINATOR
      </div>



      <Container className="relative z-10 pb-16 md:pb-24 pt-8">



        {/* Hero Content */}
        <div className="flex flex-col xl:flex-row gap-16 xl:items-center justify-between">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100 shadow-sm shadow-blue-900/5"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Tool Directory
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-2xl opacity-50 z-0 rounded-full" aria-hidden="true" />
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1] relative z-10"
              >
                Browse All Tools
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl"
            >
              Discover powerful online tools to compress, convert, edit and optimize your files.
              Fast, secure and completely browser-based.
            </motion.p>
          </div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full xl:w-[480px] flex-shrink-0"
          >
            <div className="grid grid-cols-2 gap-4 md:gap-5">

              {/* Stat 1 */}
              <div className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-900/5 hover:-translate-y-1 hover:shadow-blue-500/15 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight relative z-10">50+</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Total Tools</p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-indigo-900/5 hover:-translate-y-1 hover:shadow-indigo-500/15 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Folder className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight relative z-10">6</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Categories</p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-emerald-900/5 hover:-translate-y-1 hover:shadow-blue-500/15 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight relative z-10">Free</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Forever</p>
              </div>

              {/* Stat 4 */}
              <div className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-xl shadow-rose-900/5 hover:-translate-y-1 hover:shadow-blue-500/15 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-1 tracking-tight relative z-10">256-bit</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest relative z-10">Secure</p>
              </div>

            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
