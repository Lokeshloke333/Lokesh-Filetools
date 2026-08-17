"use client";

import React, { useState, useRef, useMemo } from "react";
import { Button } from "./ui/button";
import { Search, ArrowRight, Check } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobalSearch } from "./search/GlobalSearch";
import { HeroBackground } from "./HeroBackground";
import { CATEGORY_DATA } from "@/components/tools/FeaturedCategories";
import { TOOLS } from "@/lib/tools";

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOLS.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Cache rect to avoid layout reflows on every mousemove
  const sectionRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  React.useEffect(() => {
    const updateRect = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        sectionRectRef.current = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
      }
    };
    
    updateRect();
    window.addEventListener("resize", updateRect);
    return () => window.removeEventListener("resize", updateRect);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !sectionRectRef.current) return;
    const rect = sectionRectRef.current;
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
      className="relative overflow-hidden bg-white pt-[150px] pb-10 md:pb-14 flex justify-center items-center min-h-0"
    >
      {/* Decorative blurred gradient blobs behind everything in the hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-[5%] top-[10%] w-[35%] h-[50%] bg-blue-600/[0.05] rounded-full blur-[140px] will-change-transform [transform:translateZ(0)]"></div>
        <div className="absolute left-[25%] top-[15%] w-[25%] h-[40%] bg-purple-600/[0.04] rounded-full blur-[150px] will-change-transform [transform:translateZ(0)]"></div>
        <div className="absolute right-[20%] top-[0%] w-[30%] h-[45%] bg-cyan-600/[0.06] rounded-full blur-[130px] will-change-transform [transform:translateZ(0)]"></div>
        <div className="absolute -right-[5%] top-[20%] w-[40%] h-[40%] bg-pink-600/[0.05] rounded-full blur-[160px] will-change-transform [transform:translateZ(0)]"></div>
      </div>
      {/* Interactive Background Canvas & CSS Layers */}
      <HeroBackground smoothMouseX={smoothMouseX} smoothMouseY={smoothMouseY} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1000px] mx-auto w-full px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
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

          <h1 className="text-4xl md:text-5xl lg:text-[clamp(2.5rem,3.8vw,4rem)] 2xl:text-6xl font-semibold text-slate-900 leading-[1.05] md:leading-[1.1] tracking-tight w-full">
            One Platform.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 relative whitespace-nowrap">
              Every File Tool.
            </span>
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-base md:text-lg 2xl:text-xl text-slate-600 mb-8 max-w-[740px] leading-relaxed"
        >
          Convert, compress, edit, optimize and transform PDFs, images, videos, audio and Office files — all securely in your browser.
        </motion.p>

        {/* Search */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[780px] mb-4 z-50 relative group mx-auto"
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
          className="flex flex-wrap justify-center gap-[10px] mb-2"
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

        {/* Category Cards */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[1240px] mt-4 flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 px-4 md:px-0 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-6 md:pb-0 hide-scrollbar"
        >
          {CATEGORY_DATA.map((cat) => {
            const count = toolCounts[cat.id] || 0;
            const Icon = cat.icon;
            const style = getCardStyle(cat.id);
            return (
              <Link
                key={cat.id}
                href={`/alltools?category=${cat.id.toLowerCase()}`}
                className={`group relative flex flex-col justify-between w-[180px] md:w-auto lg:w-[190px] shrink-0 h-[105px] md:h-[110px] rounded-[20px] ${style.bg} border ${style.border} backdrop-blur-md shadow-sm ${style.hover} transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] snap-start overflow-hidden`}
              >
                <div className="flex items-center gap-2.5 p-3.5 pb-0">
                  <div className={`flex shrink-0 items-center justify-center w-[42px] h-[42px] md:w-[46px] md:h-[46px] rounded-[14px] ${style.iconBg} group-hover:bg-white transition-colors duration-300 shadow-sm`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${style.iconColor} group-hover:rotate-[4deg] transition-transform duration-300`} />
                  </div>
                  <span className={`text-[15px] md:text-[17px] font-bold ${style.text} leading-tight tracking-tight`}>
                    {cat.title}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3.5 pt-0 mt-auto">
                  <span className={`text-[10px] md:text-[11px] font-bold ${style.pillBg} ${style.pillText} px-2.5 py-1 rounded-full`}>
                    {count}+ Tools
                  </span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm group-hover:translate-x-1 transition-transform duration-300`}>
                    <ArrowRight className={`w-3 h-3 ${style.iconColor}`} />
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>

        </motion.div>
    </section>
  );
}

const getCardStyle = (id: string) => {
  switch (id) {
    case "Image":
      return {
        bg: "bg-purple-50/80",
        border: "border-purple-200/60",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        hover: "hover:border-purple-300 hover:shadow-[0_8px_24px_-6px_rgba(168,85,247,0.25)]",
        text: "text-purple-950",
        pillBg: "bg-purple-100/80",
        pillText: "text-purple-700",
      };
    case "PDF":
      return {
        bg: "bg-red-50/80",
        border: "border-red-200/60",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        hover: "hover:border-red-300 hover:shadow-[0_8px_24px_-6px_rgba(239,68,68,0.25)]",
        text: "text-red-950",
        pillBg: "bg-red-100/80",
        pillText: "text-red-700",
      };
    case "Video":
      return {
        bg: "bg-blue-50/80",
        border: "border-blue-200/60",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        hover: "hover:border-blue-300 hover:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.25)]",
        text: "text-blue-950",
        pillBg: "bg-blue-100/80",
        pillText: "text-blue-700",
      };
    case "Audio":
      return {
        bg: "bg-orange-50/80",
        border: "border-orange-200/60",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        hover: "hover:border-orange-300 hover:shadow-[0_8px_24px_-6px_rgba(249,115,22,0.25)]",
        text: "text-orange-950",
        pillBg: "bg-orange-100/80",
        pillText: "text-orange-700",
      };
    case "Utilities":
      return {
        bg: "bg-emerald-50/80",
        border: "border-emerald-200/60",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        hover: "hover:border-emerald-300 hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.25)]",
        text: "text-emerald-950",
        pillBg: "bg-emerald-100/80",
        pillText: "text-emerald-700",
      };
    case "AI":
      return {
        bg: "bg-fuchsia-50/80",
        border: "border-fuchsia-200/60",
        iconBg: "bg-fuchsia-100",
        iconColor: "text-fuchsia-600",
        hover: "hover:border-fuchsia-300 hover:shadow-[0_8px_24px_-6px_rgba(217,70,239,0.25)]",
        text: "text-fuchsia-950",
        pillBg: "bg-fuchsia-100/80",
        pillText: "text-fuchsia-700",
      };
    default:
      return {
        bg: "bg-slate-50/80",
        border: "border-slate-200/60",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        hover: "hover:border-slate-300 hover:shadow-[0_8px_24px_-6px_rgba(100,116,139,0.25)]",
        text: "text-slate-950",
        pillBg: "bg-slate-100/80",
        pillText: "text-slate-700",
      };
  }
};
