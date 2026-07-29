"use client";

import React from "react";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Marketing Director",
      image: "https://api.dicebear.com/7.x/micah/svg?seed=Sarah&backgroundColor=b6e3f4",
      quote: "Fileinator has completely transformed our workflow. What used to take hours of converting and formatting is now done in literally seconds. The UI is incredibly intuitive.",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Freelance Designer",
      image: "https://api.dicebear.com/7.x/micah/svg?seed=Michael&backgroundColor=c0aede",
      quote: "As a designer, I'm constantly dealing with huge image and video files. The compression tools here are unmatched—zero noticeable quality loss but massive size reductions.",
      stars: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Legal Consultant",
      image: "https://api.dicebear.com/7.x/micah/svg?seed=Emily&backgroundColor=ffdfbf",
      quote: "The PDF security features are a lifesaver. Being able to easily lock, unlock, and sign documents securely from my browser without installing clunky software is amazing.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-slate-600 text-lg">
            Don't just take our word for it. Here's what professionals think about Fileinator.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 italic leading-relaxed mb-8 flex-grow">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
