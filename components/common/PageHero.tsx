"use client";

import React from "react";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { FileText, Image as ImageIcon, FolderOpen, File as FileIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHero({ title, description, children }: PageHeroProps) {
  return (
    <div className="relative w-full overflow-hidden bg-white border-b border-slate-200 min-h-[190px] md:min-h-[220px] lg:min-h-[260px] flex items-center pt-16 pb-12 md:pt-20 md:pb-16">
      
      {/* 1. Soft Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-purple-50/50 to-cyan-50/40 pointer-events-none"></div>
      
      {/* 2. Abstract Decorative Elements (Blurred Glows) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-400/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-96 h-96 bg-purple-400/10 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-96 h-96 bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none"></div>

      {/* 3. Very light grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

      {/* 4. Large Translucent Illustrations (Floating) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Top Left PDF/Document */}
        <motion.div 
          className="absolute -top-10 -left-10 md:top-10 md:left-10 text-blue-600/5 blur-[2px]"
          animate={{ y: [0, -15, 0], rotate: [-15, -12, -15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText size={240} strokeWidth={1} />
        </motion.div>

        {/* Top Right Image */}
        <motion.div 
          className="absolute -top-16 -right-12 md:top-4 md:-right-8 text-purple-600/5 blur-[3px]"
          animate={{ y: [0, 20, 0], rotate: [20, 25, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <ImageIcon size={320} strokeWidth={1} />
        </motion.div>

        {/* Bottom Left Folder (Hidden on Mobile for cleanliness) */}
        <motion.div 
          className="hidden md:block absolute -bottom-24 left-1/4 text-cyan-600/5 blur-[2px]"
          animate={{ y: [0, -25, 0], rotate: [-5, 0, -5] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <FolderOpen size={280} strokeWidth={1} />
        </motion.div>

        {/* Bottom Right Generic File */}
        <motion.div 
          className="hidden lg:block absolute -bottom-16 right-1/4 text-slate-600/5 blur-[4px]"
          animate={{ y: [0, 15, 0], rotate: [10, 5, 10] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <FileIcon size={200} strokeWidth={1} />
        </motion.div>
      </div>

      {/* 5. Gentle fade toward the page background at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>

      {/* 6. Main Content */}
      <Container className="relative z-10  flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
        
        {/* Breadcrumb */}
        <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
          <Breadcrumb />
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight drop-shadow-sm">
          {title}
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        
        {/* Last Updated Badge / Children */}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </Container>
    </div>
  );
}
