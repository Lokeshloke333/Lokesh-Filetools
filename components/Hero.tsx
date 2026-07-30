"use client";

import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Search, ArrowRight, Check } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobalSearch } from "./search/GlobalSearch";
import { HeroBackground } from "./HeroBackground";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleChipClick = (e: React.MouseEvent, term: string) => {
    e.preventDefault();
    setSearchQuery(term);

    // Focus and move cursor to end
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        const length = searchInputRef.current.value.length;
        searchInputRef.current.setSelectionRange(length, length);
      }
    }, 10);
  };

  const popularSearches = [
    "Compress PDF",
    "Merge PDF",
    "Resize Image",
    "Unlock PDF",
    "PDF to Image",
  ];

  const trustBadges = [
    "Browser-Based",
    "Secure Processing",
    "Files Not Stored",
    "Free to Use",
  ];

  // Advanced Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any }
    },
  };

  const innerStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 10 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-white pt-[100px] md:pt-[120px] lg:pt-[130px] 2xl:pt-[140px] pb-10 md:pb-14 flex justify-center items-center min-h-0"
    >
      {/* Decorative blurred gradient blobs behind everything in the hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-[5%] top-[10%] w-[35%] h-[50%] bg-blue-600/[0.05] rounded-full blur-[140px]"></div>
        <div className="absolute left-[25%] top-[15%] w-[25%] h-[40%] bg-purple-600/[0.04] rounded-full blur-[150px]"></div>
        <div className="absolute right-[20%] top-[0%] w-[30%] h-[45%] bg-cyan-600/[0.06] rounded-full blur-[130px]"></div>
        <div className="absolute -right-[5%] top-[20%] w-[40%] h-[40%] bg-pink-600/[0.05] rounded-full blur-[160px]"></div>
      </div>
      {/* Interactive Background Canvas & CSS Layers */}
      <HeroBackground smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[900px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
      >
        {/* Top Eyebrow */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-[14px] justify-center"
        >
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent to-blue-500/30"></div>
          <span className="text-[12px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 whitespace-nowrap">
            ALL-IN-ONE FILE PLATFORM
          </span>
          <div className="h-[1px] w-8 md:w-12 bg-gradient-to-l from-transparent to-purple-500/30"></div>
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={itemVariants}
          className="relative mb-[14px] group"
        >
          {/* Subtle glow behind heading reacting to hover */}
          <motion.div
            className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full -z-10 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            style={{
              x: useTransform(smoothMouseX, [-500, 500], [-10, 10]),
              y: useTransform(smoothMouseY, [-500, 500], [-10, 10])
            }}
          ></motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)] 2xl:text-7xl font-semibold text-slate-900 leading-[1.05] md:leading-[1.1] tracking-tight">
            Every File Tool. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 relative inline-block">
              One Powerful Platform.
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg 2xl:text-xl text-slate-600 mb-[20px] max-w-[740px] leading-relaxed"
        >
          Convert, compress, edit, optimize and transform PDFs, images, videos, audio and Office files — all securely in your browser.
        </motion.p>

        {/* Search */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[780px] mb-[14px] z-50 relative group mx-auto"
        >
          <GlobalSearch
            variant="hero"
            initialValue={searchQuery}
            onSearchChange={setSearchQuery}
            inputRef={searchInputRef}
          />
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-[10px]"
        >
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={(e) => handleChipClick(e, term)}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-[13.5px] font-medium text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {term}
            </button>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center mt-[32px] mb-[32px]"
        >
          <Link 
            href="/tools" 
            className="group inline-flex items-center gap-[8px] px-[24px] py-[12px] rounded-full bg-slate-900 shadow-md shadow-slate-900/10 text-[15px] font-semibold text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-[1px] transition-all duration-200"
          >
            Explore All Tools 
            <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        </motion.div>
    </section>
  );
}
