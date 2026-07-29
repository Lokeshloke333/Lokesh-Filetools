"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "./seo/JsonLd";
import { getFaqSchema } from "@/lib/seo/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function FAQ({ limit }: { limit?: number }) {
  const faqs = [
    {
      question: "Is Fileinator really free to use?",
      answer: "Yes! Our basic tools are completely free to use with generous daily limits. For heavy users and professionals, we offer premium plans with unlimited access and advanced features.",
    },
    {
      question: "Are my files safe and secure?",
      answer: "Absolutely. We use 256-bit TLS encryption for all file transfers. Your files are processed on secure servers and are automatically and permanently deleted within 2 hours of processing. We do not look at, copy, or analyze your files.",
    },
    {
      question: "What is the maximum file size limit?",
      answer: "Free users can upload files up to 100MB. Premium users enjoy upload limits up to 2GB depending on their specific subscription plan.",
    },
    {
      question: "Do I need to install any software?",
      answer: "No. Fileinator is 100% web-based. You don't need to install anything on your device. It works perfectly on Windows, Mac, Linux, iOS, and Android browsers.",
    },
    {
      question: "Can I use Fileinator on my mobile phone?",
      answer: "Yes! Our website is fully responsive and optimized for mobile devices, allowing you to convert and edit files on the go.",
    },
  ];

  const displayedFaqs = limit ? faqs.slice(0, limit) : faqs;
  const faqSchema = getFaqSchema(displayedFaqs);

  return (
    <section className="py-20 bg-white">
      <JsonLd data={faqSchema} />
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {displayedFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-800 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-base">
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
