"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Marketing Director",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "Fileinator reduced our workflow from minutes to seconds. The UI is incredibly intuitive and practically flawless.",
      stars: 5,
      color: "from-blue-500/10 to-transparent",
      shadow: "hover:shadow-blue-500/15",
      starGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      avatarColor: "from-blue-500 to-indigo-600",
      initials: "PS",
    },
    {
      name: "Rahul Desai",
      role: "Freelance Designer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "As a designer, I'm constantly dealing with huge image files. The compression tools here are unmatched—zero quality loss.",
      stars: 5,
      color: "from-purple-500/10 to-transparent",
      shadow: "hover:shadow-purple-500/15",
      starGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      avatarColor: "from-purple-500 to-fuchsia-600",
      initials: "RD",
    },
    {
      name: "Anjali Gupta",
      role: "Legal Consultant",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The PDF security features are a lifesaver. Being able to easily lock and sign documents securely from my browser is amazing.",
      stars: 5,
      color: "from-green-500/10 to-transparent",
      shadow: "hover:shadow-green-500/15",
      starGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      avatarColor: "from-green-500 to-emerald-600",
      initials: "AG",
    },
    {
      name: "Marcus Chen",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      quote: "The best browser-based file tools I've ever used. Lightning fast, secure, and the batch processing saves me hours.",
      stars: 5,
      color: "from-orange-500/10 to-transparent",
      shadow: "hover:shadow-orange-500/15",
      starGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      avatarColor: "from-orange-500 to-amber-600",
      initials: "MC",
    },
    {
      name: "Elena Rodriguez",
      role: "Content Creator",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      quote: "Converting massive video files for social media used to take hours. Now it's done instantly. Highly recommended!",
      stars: 5,
      color: "from-pink-500/10 to-transparent",
      shadow: "hover:shadow-pink-500/15",
      starGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      avatarColor: "from-pink-500 to-rose-600",
      initials: "ER",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - visibleCount + 1));
  }, [visibleCount, testimonials.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - visibleCount : prev - 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <section className="py-16 md:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-100/40 rounded-full blur-[100px] pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeader
          eyebrow="💬 TESTIMONIALS"
          title="What Our Users Say"
          description="Don't just take our word for it. Here's what professionals think about Fileinator."
        />

        <div 
          className="relative max-w-[1200px] mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Controls */}
          <div className="flex justify-end gap-3 mb-4 pr-4">
            <button onClick={prevSlide} className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all disabled:opacity-50" disabled={currentIndex === 0}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all disabled:opacity-50" disabled={currentIndex === testimonials.length - visibleCount}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-hidden -mx-3 pb-12 pt-4">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
            >
              {testimonials.map((t, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  <div className={`group relative bg-white/70 backdrop-blur-xl p-6 rounded-[20px] border border-slate-200/60 flex flex-col h-full shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] ${t.shadow} hover:-translate-y-1.5 transition-all duration-500 overflow-hidden`}>
                    {/* Glass gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <Quote className="absolute top-6 right-8 w-10 h-10 text-slate-100 group-hover:text-slate-200 transition-colors -z-10" />

                    <div className="flex gap-1 mb-6 relative z-10">
                      {[...Array(t.stars)].map((_, j) => (
                        <Star key={j} className={`w-5 h-5 fill-amber-400 text-amber-400 ${t.starGlow}`} />
                      ))}
                    </div>
                    
                    <div className="relative mb-8 flex-grow">
                      <p className="text-slate-700 font-medium leading-relaxed text-[16px] line-clamp-3 relative z-10">
                        "{t.quote}"
                      </p>
                      {/* Optional fade for overflowing text */}
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/70 to-transparent pointer-events-none z-20"></div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full shadow-sm ring-2 ring-white flex items-center justify-center bg-gradient-to-br ${t.avatarColor} text-white font-bold tracking-wider`}>
                          {t.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {t.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-2">
            {[...Array(testimonials.length - visibleCount + 1)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? "bg-slate-800 w-8" : "bg-slate-300 hover:bg-slate-400 w-2"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
