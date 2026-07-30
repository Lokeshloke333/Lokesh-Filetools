"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";
import { Users, Layers, ShieldCheck, Globe } from "lucide-react";

function Counter({ end, suffix = "", duration = 2, decimals = 0, isText = false, textValue = "" }: { end: number, suffix?: string, duration?: number, decimals?: number, isText?: boolean, textValue?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && !isText) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(easeProgress * end);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, duration, isText]);

  if (isText) {
    return <span ref={ref}>{textValue}{suffix}</span>;
  }

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

export function Statistics() {
  const stats = [
    { value: 10, suffix: "k+", label: "Happy Users", decimals: 0, icon: Users, color: "from-pink-500 to-rose-400", shadow: "shadow-pink-500/25" },
    { value: 50, suffix: "+", label: "File Tools", decimals: 0, icon: Layers, color: "from-blue-500 to-cyan-400", shadow: "shadow-blue-500/25" },
    { value: 256, suffix: "-bit", label: "Secure", decimals: 0, icon: ShieldCheck, color: "from-emerald-500 to-teal-400", shadow: "shadow-emerald-500/25" },
    { value: 10, suffix: "+", isText: true, textValue: "Global", label: "Worldwide", decimals: 0, icon: Globe, color: "from-purple-500 to-violet-400", shadow: "shadow-purple-500/25" },
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-indigo-950 via-[#1e1b4b] to-[#311042] relative overflow-hidden text-center">
      {/* Background Animated Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_15px_#60a5fa] animate-[ping_3s_ease-in-out_infinite]"></div>
        <div className="absolute right-1/4 bottom-1/3 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_#a78bfa] animate-[ping_4s_ease-in-out_infinite_1s]"></div>
        <div className="absolute right-1/3 top-1/4 w-1 h-1 bg-pink-400 rounded-full shadow-[0_0_15px_#f472b6] animate-[ping_2.5s_ease-in-out_infinite_0.5s]"></div>

        {/* Soft glowing orbs */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <Container className="relative z-10">
        <SectionHeader
          eyebrow="📈 TRUSTED WORLDWIDE"
          title="Trusted by Millions"
          description="Join the fastest growing community of professionals relying on our platform."
          theme="dark"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 50 }}
                className="group flex flex-col items-center justify-center p-5 md:p-6 rounded-[20px] bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] hover:-translate-y-1.5 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 backdrop-blur-md overflow-hidden relative min-h-[120px]"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>

                <div className="text-3xl md:text-[36px] font-black text-white mb-1.5 drop-shadow-sm tracking-tight">
                  <Counter end={stat.value} suffix={stat.suffix} decimals={stat.decimals} isText={stat.isText} textValue={stat.textValue} />
                </div>

                <p className="text-indigo-200/80 font-medium text-sm md:text-base tracking-wide">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
