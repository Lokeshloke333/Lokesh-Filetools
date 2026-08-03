"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { JSONFormatterTool } from "@/components/tool/json-formatter/JSONFormatterTool";
import { Code } from "lucide-react";
import Head from "next/head";

export default function JSONFormatterPage() {
  const faqs = [
    {
      question: "Is my JSON data sent to any servers?",
      answer: "No. This JSON Formatter is completely client-side. Your data is processed securely within your browser and never leaves your device."
    },
    {
      question: "How do I find errors in my JSON?",
      answer: "As you type or paste your JSON into the editor, the tool automatically validates it. If there is a syntax error (like a missing comma or unquoted key), an error message will immediately appear at the top detailing what went wrong."
    },
    {
      question: "Can I view my JSON visually instead of as code?",
      answer: "Yes! Once you have valid JSON, click the 'Tree View' tab. This will render your JSON as an interactive, collapsible tree making it much easier to explore large nested structures."
    },
    {
      question: "What is the difference between Format and Minify?",
      answer: "Formatting (or Pretty Printing) adds spaces, indents, and line breaks to make the JSON human-readable. Minifying removes all unnecessary whitespace to make the file size as small as possible."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Fileinator JSON Formatter",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Format, minify, and parse JSON instantly with advanced error highlighting and an interactive tree viewer."
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
          title="JSON Formatter & Validator"
          subtitle="Clean, validate, minify, and explore JSON data instantly in your browser."
          icon={<Code className="w-6 h-6" />}
        />

        <div className="mt-8 mb-16">
          <JSONFormatterTool />
        </div>

        <RelatedTools />
        
        <FAQSection faqs={faqs} />
        
        <AboutTool 
          title="About the JSON Formatter"
          content={
            <>
              <p>
                The Fileinator JSON Formatter is designed to be the fastest, most reliable tool for developers and data analysts working with JSON payloads. It provides a robust, professional-grade code editor right in your browser, complete with syntax highlighting, line numbers, and bracket matching.
              </p>
              <p>
                Security and privacy are our top priorities. Unlike other formatters that send your data to a server for processing, this tool leverages modern Web APIs to parse and format everything client-side. Your sensitive API payloads and configuration files never leave your machine.
              </p>
              <p>
                Beyond basic formatting and minification, our interactive Tree View allows you to seamlessly explore massive, deeply-nested JSON structures by collapsing nodes and instantly viewing object sizes.
              </p>
            </>
          }
        />

      </ToolLayout>
    </>
  );
}
