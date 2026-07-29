"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Container } from "@/components/ui/Container";

export function PopularTools() {

  return (
    <section className="py-16 md:py-24">
      <Container>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Featured Tools</h2>
            <p className="text-slate-500 mt-2">The most used tools by our community.</p>
          </div>
          <Link href="/tools" className="text-blue-600 font-medium flex items-center hover:underline">
            View all tools <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Content Area */}
        <div className="w-full">
          <ToolGrid tools={TOOLS} />
        </div>

      </Container>
    </section>
  );
}
