import type { Metadata } from "next";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { ToolsDirectory } from "@/components/tools/ToolsDirectory";
import { ToolsHero } from "@/components/tools/ToolsHero";
import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse All Online File Tools",
  description: "Explore all free online image and PDF processing tools on Fileinator. Compress, convert, edit, and optimize your files fast and securely in your browser.",
  keywords: [
    "all file tools",
    "online file utilities",
    "image tools directory",
    "pdf tools directory",
    "free online tools"
  ],
  alternates: {
    canonical: "/alltools",
  },
  openGraph: {
    title: "Browse All Online File Tools | Fileinator",
    description: "Explore all free online image and PDF processing tools on Fileinator. Compress, convert, edit, and optimize your files fast in your browser.",
    url: "/alltools",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Online File Tools | Fileinator",
    description: "Explore all free online image and PDF processing tools on Fileinator. Compress, convert, edit, and optimize your files fast in your browser.",
    images: ["/og-image.png"],
  },
};

import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";

export default function ToolsPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Browse Tools", item: "/alltools" },
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative">
      <JsonLd data={breadcrumbs} />
      <Navbar />
      
      {/* Page Header / Hero Section */}
      <ToolsHero />


      {/* Main Directory Area */}
      <section className="pb-12">
        <React.Suspense fallback={<div className="h-96 flex items-center justify-center text-slate-500">Loading directory...</div>}>
          <ToolsDirectory />
        </React.Suspense>
      </section>

      {/* Reused Sections */}
      <div className="bg-white">
        <Features />
      </div>
      <CTA />
      
      <Footer />
    </main>
  );
}

