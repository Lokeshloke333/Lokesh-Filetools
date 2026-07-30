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
      className="relative overflow-hidden bg-white pt-[140px] md:pt-[160px] lg:pt-[180px] 2xl:pt-[200px] pb-16 lg:pb-20 2xl:pb-24 flex justify-center min-h-[min(100vh,800px)] 2xl:min-h-[80vh] items-center"
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
        {/* Top Badge */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, boxShadow: "0px 10px 20px rgba(0,0,0,0.05)" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium mb-3 2xl:mb-4 shadow-sm transition-all"
        >
          ⚡ Fast • 🔒 Secure
        </motion.div>

        {/* Headline */}
        <motion.div
          variants={itemVariants}
          className="relative mb-4 lg:mb-5 2xl:mb-6 group"
        >
          {/* Subtle glow behind heading reacting to hover */}
          <motion.div
            className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full -z-10 opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
            style={{
              x: useTransform(smoothMouseX, [-500, 500], [-10, 10]),
              y: useTransform(smoothMouseY, [-500, 500], [-10, 10])
            }}
          ></motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-[clamp(3rem,5vw,4.5rem)] 2xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
            All Your File Tools. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 relative inline-block">
              One Place.
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg 2xl:text-xl text-slate-600 mb-6 lg:mb-8 2xl:mb-10 max-w-2xl leading-relaxed"
        >
          Convert, compress, edit, optimize, and transform PDFs, images, videos, audio, and Office files — all in your browser with fast processing and privacy-first design.
        </motion.p>

        {/* Search */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-2xl mb-6 2xl:mb-8 z-50 relative group"
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
          className="flex flex-wrap justify-center gap-2 mb-8 2xl:mb-12"
        >
          {popularSearches.map((term) => (
            <button
              key={term}
              onClick={(e) => handleChipClick(e, term)}
              className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 hover:shadow-[0_4px_16px_rgba(59,130,246,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              {term}
            </button>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6 2xl:mb-8"
        >
          <Button size="lg" className="rounded-full px-8 gap-2 w-full sm:w-auto text-base group bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden" asChild>
            <Link href="/tools">
              <span className="relative z-10 flex items-center gap-2">
                Browse All Tools
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={innerStaggerVariants}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4"
        >
          {trustBadges.map((badge, i) => (
            <motion.div key={badge} variants={badgeVariants} className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-600" />
              </div>
              {badge}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
