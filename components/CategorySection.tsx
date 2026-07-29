"use client";

import React, { useMemo } from "react";
import { CATEGORY_DATA } from "@/components/tools/FeaturedCategories";
import { CategoryCard } from "@/components/tools/CategoryCard";
import { TOOLS } from "@/lib/tools";
import { Container } from "@/components/ui/Container";

export function CategorySection() {
  const toolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOLS.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            Browse by Category
          </h2>
          <p className="text-slate-600 text-lg">
            Find the perfect tool for your file format. Over 100+ utilities to help you work faster.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORY_DATA.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              toolCount={toolCounts[cat.id] || 0}
              href={cat.status === "active" ? `/tools?search=${cat.id}` : "#"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
