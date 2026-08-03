"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { ToolGrid } from "@/components/tools/ToolGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";
export function PopularTools() {

  return (
    <section className="py-16 md:py-20">
      <Container>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-4">
          <SectionHeader
            eyebrow="✨ FEATURED TOOLS"
            title="Featured Tools"
            description="The most used tools by our community."
            align="left"
            className="!mb-0"
          />
          <Link href="/alltools" className="text-blue-600 font-medium flex items-center hover:underline whitespace-nowrap pb-4">
            View all tools <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Content Area */}
        <div className="w-full">
          <ToolGrid tools={TOOLS} variant="compact" />
        </div>

      </Container>
    </section>
  );
}
