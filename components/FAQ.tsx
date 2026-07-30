"use client";

import React, { useState } from "react";
import { JsonLd } from "./seo/JsonLd";
import { getFaqSchema } from "@/lib/seo/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";

export function FAQ({ limit }: { limit?: number }) {
  const [activeCategory, setActiveCategory] = useState("General");

  const categories = ["General", "Security", "Uploads", "Privacy"];

  const faqs = [
    {
      category: "General",
      question: "Is Fileinator really free to use?",
      answer: "Yes! Our basic tools are completely free to use with generous daily limits. For heavy users and professionals, we offer premium plans with unlimited access and advanced features.",
    },
    {
      category: "General",
      question: "Do I need to install any software?",
      answer: "No. Fileinator is 100% web-based. You don't need to install anything on your device. It works perfectly on Windows, Mac, Linux, iOS, and Android browsers.",
    },
    {
      category: "Security",
      question: "Are my files safe and secure?",
      answer: "Absolutely. We use 256-bit TLS encryption for all file transfers. Your files are processed on secure servers and are automatically and permanently deleted within 2 hours of processing.",
    },
    {
      category: "Privacy",
      question: "Do you inspect or analyze my files?",
      answer: "We never inspect your files. Your data is deleted instantly after processing. We do not look at, copy, or analyze your files.",
    },
    {
      category: "Uploads",
      question: "What is the maximum file size limit?",
      answer: "Free users can upload files up to 100MB. Premium users enjoy upload limits up to 2GB depending on their specific subscription plan.",
    },
    {
      category: "General",
      question: "Can I use Fileinator on my mobile phone?",
      answer: "Yes! Our website is fully responsive and optimized for mobile devices, allowing you to convert and edit files on the go.",
    },
  ];

  const displayedFaqs = limit 
    ? faqs.slice(0, limit) 
    : faqs.filter(faq => faq.category === activeCategory);
    
  const faqSchema = getFaqSchema(limit ? faqs.slice(0, limit) : faqs);

  return (
    <section className="pt-16 md:pt-20 pb-8 md:pb-10 bg-slate-50/50 relative overflow-hidden">
      <JsonLd data={faqSchema} />
      
      {/* Abstract Background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-slate-100 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
        <SectionHeader
          eyebrow="❓ SUPPORT"
          title="Frequently Asked Questions"
          description="Everything you need to know about the product and billing."
          className="mb-8 md:mb-10"
        />
        
        {!limit && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 -translate-y-0.5" 
                  : "bg-white text-slate-600 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full flex flex-col gap-2.5">
            {displayedFaqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`item-${i}`}
                className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] data-[state=open]:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 data-[state=open]:border-blue-200 data-[state=open]:bg-white overflow-hidden"
              >
                <AccordionTrigger className="px-5 py-4 text-[17px] font-bold text-slate-800 hover:text-blue-600 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 pt-0 text-[15px] pl-[60px] text-slate-500 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
