"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

import { Container } from "@/components/ui/Container";
import { ToolWorkspace } from "./ToolWorkspace";

interface ToolLayoutProps {
  children: React.ReactNode;
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow flex flex-col pt-[88px] lg:pt-[104px] relative z-10">
        {/* Main Tool Content */}
        <Container className="pb-16 pt-2 lg:pt-4">
          <ToolWorkspace>
            {children}
          </ToolWorkspace>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
