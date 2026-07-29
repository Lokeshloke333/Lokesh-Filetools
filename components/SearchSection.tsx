"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GlobalSearch } from "./search/GlobalSearch";
import { Container } from "@/components/ui/Container";

export function SearchSection() {
  const router = useRouter();

  const popularSearches = [
    "PDF to Word",
    "Merge PDF",
    "Image Resize",
    "Compress Video",
    "JPG to PNG",
  ];

  const handlePopularSearch = (term: string) => {
    // Actually search compress, merge etc. for a better user experience
    let query = term.toLowerCase();
    if (query === "pdf to word") query = "pdf to word";
    else if (query === "merge pdf") query = "merge pdf";
    else if (query === "image resize") query = "resize image";
    else if (query === "compress video") query = "compress video";
    else if (query === "jpg to png") query = "convert image";
    else query = term;

    router.push(`/tools?search=${encodeURIComponent(query)}`);
  };

  return (
    <section className="bg-white py-12 md:py-16">
      <Container>
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          
          {/* Search Bar */}
          <div className="w-full">
            <GlobalSearch variant="hero" />
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-sm font-medium text-slate-500 mr-2">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="text-xs md:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 px-3 py-1.5 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
}
