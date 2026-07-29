"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Container } from "@/components/ui/Container";

interface ToolLayoutProps {
  children: React.ReactNode;
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Breadcrumb Area */}
        <div className="border-b border-slate-200 bg-white mb-6">
          <Container className="py-3">
            <Breadcrumb />
          </Container>
        </div>

        {/* Main Tool Content */}
        <Container className="pb-16">
          <div className="max-w-6xl mx-auto flex flex-col gap-10 lg:gap-12 w-full">
            {children}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
