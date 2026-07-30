"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { MegaMenuDropdown } from "./navbar/MegaMenuDropdown";
import { MobileMenu } from "./navbar/MobileMenu";
import { GlobalSearch } from "./search/GlobalSearch";
import { MobileSearch } from "./search/MobileSearch";
import { navigationData } from "@/lib/navigation";
import { Container } from "@/components/ui/Container";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for shadow and blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 w-full pt-4 lg:pt-6 z-50 pointer-events-none">
      <Container className="pointer-events-auto">
      <header 
        className={`relative w-full transition-all duration-300 rounded-2xl md:rounded-[24px] ${
          isScrolled 
            ? "shadow-[0_8px_32px_rgba(0,0,0,0.04)] py-0" 
            : "shadow-[0_4px_16px_rgba(0,0,0,0.02)] py-1"
        }`}
      >
        {/* Navbar Glass Background Layer (Isolated to prevent trapping child backdrop-filters) */}
        <div className="absolute inset-0 -z-10 bg-[rgba(255,255,255,0.58)] backdrop-blur-[24px] rounded-2xl md:rounded-[24px]" />
        {/* Premium Animated Gradient Border */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl md:rounded-[24px] z-20"
          style={{
            padding: '1px',
            background: 'linear-gradient(90deg, rgba(59,130,246,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2), rgba(59,130,246,0.2))',
            backgroundSize: '300% 100%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'border-pan 15s linear infinite'
          }}
        />
        <div className="w-full px-4 lg:px-6 h-14 lg:h-16 flex items-center justify-between gap-4 relative z-10">
        
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-6 flex-1 md:flex-none">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Fileinator Logo" className="w-[180px] h-auto" />
          </Link>
          
          {/* Desktop Search Bar */}
          <div className="hidden lg:flex relative ml-4 xl:ml-8">
            <GlobalSearch className="w-[240px] xl:w-[320px]" />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex items-center gap-1 xl:gap-2 px-2 py-1.5 rounded-full bg-slate-50/50 border border-slate-100/50">
            {navigationData.map((category) => (
              <MegaMenuDropdown key={category.title} category={category} />
            ))}
            
            <Link 
              href="/tools" 
              className="text-sm font-semibold text-slate-700 hover:text-blue-700 hover:bg-white hover:shadow-sm px-4 py-2 rounded-full transition-all duration-200 hover:-translate-y-[1px]"
            >
              Browse Tools
            </Link>
          </div>
        </nav>

        {/* CTA Button Desktop */}
        <div className="hidden lg:flex items-center flex-shrink-0">
          <Button asChild className="rounded-full px-7 py-2.5 h-auto text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Mobile Toggle & Mobile Search Icon */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="text-slate-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full p-1" 
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-1.5 text-slate-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-md transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      {/* Mobile Search Component */}
      <MobileSearch isOpen={isMobileSearchOpen} onClose={() => setIsMobileSearchOpen(false)} />
      </header>
      </Container>
    </div>
  );
}
