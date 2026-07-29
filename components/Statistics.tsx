"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";

function Counter({ end, suffix = "", duration = 2, decimals = 0 }: { end: number, suffix?: string, duration?: number, decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

        // Easing function (easeOutExpo)
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
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

export function Statistics() {
  const stats = [
    { value: 1, suffix: "M+", label: "Active Users", decimals: 0 },
    { value: 50, suffix: "+", label: "File Tools", decimals: 0 },
    { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
    { value: 10, suffix: "+", label: "Countries", decimals: 0 },
  ];

  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden text-center">
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <Container className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
          Trusted by Millions
        </h2>
        <p className="text-blue-100 text-lg mb-16 max-w-2xl mx-auto">
          Join the fastest growing community of professionals relying on our platform.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-blue-500/50">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center border-none!"
            >
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-sm">
                <Counter end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <p className="text-blue-100 font-medium text-sm md:text-base uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
