"use client";

import React from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { CodeFormatterTool } from "@/components/tool/code-formatter/CodeFormatterTool";
import { Code, CheckCircle2, Minimize2 } from "lucide-react";
import { FormatterConfig } from "@/lib/formatters/formatterConversions";

export function CodeFormatterClient({ config }: { config: FormatterConfig }) {
  const isMinifier = config.initialAction === "minify";
  const isValidator = config.initialAction === "validate";
  
  const Icon = isMinifier ? <Minimize2 className="w-6 h-6" /> : isValidator ? <CheckCircle2 className="w-6 h-6" /> : <Code className="w-6 h-6" />;

  const faqs = config.faqs || [
    {
      question: "Is my code sent to any servers?",
      answer: "No. This tool is completely client-side. Your data is processed securely within your browser and never leaves your device. Nothing is uploaded."
    },
    {
      question: "How do I find errors in my code?",
      answer: "When you click Validate or Format, the tool checks your code for syntax errors. If there is a syntax error (like a missing comma or unclosed tag), an error message will appear detailing what went wrong."
    },
    {
      question: "What is the difference between Format and Minify?",
      answer: "Formatting (or Beautifying) adds spaces, indents, and line breaks to make the code human-readable. Minifying removes all unnecessary whitespace to make the file size as small as possible."
    }
  ];

  return (
    <ToolLayout>
      <ToolHeader 
        title={config.title}
        subtitle={config.description}
        icon={Icon}
      />

      <div className="mt-8 mb-16">
        <CodeFormatterTool 
          initialLanguage={config.initialLanguage} 
          initialAction={config.initialAction} 
        />
      </div>

      <RelatedTools />
      
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title={`About the ${config.title}`}
        content={
          <>
            <p>
              The Fileinator {config.title} is designed to be the fastest, most reliable tool for developers working with code payloads, scripts, and stylesheets. It provides a robust, professional-grade code editor right in your browser, complete with syntax highlighting, line numbers, and bracket matching.
            </p>
            <p>
              Security and privacy are our top priorities. Unlike other tools that send your data to a server for processing, this tool leverages modern Web APIs to parse and format everything client-side. Your sensitive API payloads and configuration files never leave your machine.
            </p>
          </>
        }
      />
    </ToolLayout>
  );
}
