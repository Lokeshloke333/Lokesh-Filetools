"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { CodeFormatterTool } from "@/components/tool/code-formatter/CodeFormatterTool";
import { Code } from "lucide-react";
import Head from "next/head";

export default function CodeFormatterPage() {
  const faqs = [
    {
      question: "Is my code sent to any servers?",
      answer: "No. This Code Formatter is completely client-side. Your data is processed securely within your browser and never leaves your device. Nothing is uploaded."
    },
    {
      question: "How do I find errors in my code?",
      answer: "When you click Format or Validate, the tool checks your code for syntax errors. If there is a syntax error (like a missing comma, unclosed tag, or unquoted key), an error message will appear detailing what went wrong."
    },
    {
      question: "What formats are supported?",
      answer: "Currently, we support HTML, XML, CSS, JavaScript, JSON, Python, and PHP formatting, minification, and validation."
    },
    {
      question: "What is the difference between Format and Minify?",
      answer: "Formatting (or Beautifying) adds spaces, indents, and line breaks to make the code human-readable. Minifying removes all unnecessary whitespace to make the file size as small as possible."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator Code Formatter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Format, beautify, minify, and validate HTML, XML, CSS, JavaScript, JSON, Python, and PHP instantly."
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <ToolLayout>
        
        <ToolHeader 
          title="Code Formatter"
          subtitle="Format, beautify, minify, validate, and clean your code instantly."
          icon={<Code className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <CodeFormatterTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the Code Formatter"
          content={
            <>
              <p>
                The Fileinator Code Formatter is designed to be the fastest, most reliable tool for developers working with code payloads, scripts, and stylesheets. It provides a robust, professional-grade code editor right in your browser, complete with syntax highlighting, line numbers, and bracket matching.
              </p>
              <p>
                Security and privacy are our top priorities. Unlike other formatters that send your data to a server for processing, this tool leverages modern Web APIs to parse and format everything client-side. Your sensitive API payloads and configuration files never leave your machine.
              </p>
              <p>
                We support the most popular web development languages including HTML, XML, CSS, JavaScript, JSON, Python, and PHP. You can easily switch between formatting to make code readable or minifying it to save space.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
