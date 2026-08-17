import React from "react";
import { CATEGORY_DATA } from "@/components/tools/FeaturedCategories";
import { CategoryCard } from "@/components/tools/CategoryCard";
import { TOOLS } from "@/lib/tools";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/section-header";

export function CategorySection() {
  const toolCounts: Record<string, number> = {};
  TOOLS.forEach((tool) => {
    toolCounts[tool.category] = (toolCounts[tool.category] || 0) + 1;
  });

  return (
    <section className="py-16 md:py-20 bg-white">
      <Container>
        <SectionHeader
          eyebrow="📂 TOOL CATEGORIES"
          title="Browse by Category"
          description="Find the perfect tool for your file format. Over 100+ utilities to help you work faster."
        />


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {CATEGORY_DATA.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              toolCount={toolCounts[cat.id] || 0}
              href={cat.status === "active" ? `/alltools?category=${cat.id}` : "#"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
