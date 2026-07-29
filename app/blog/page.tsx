import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CTA } from "@/components/CTA";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Fileinator",
  description: "Read tutorials, guides, and tips about PDF tools, image tools, document conversion, and file management.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | Fileinator",
    description: "Read tutorials, guides, and tips about PDF tools, image tools, document conversion, and file management.",
    url: "/blog",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Fileinator",
    description: "Read tutorials, guides, and tips about PDF tools, image tools, document conversion, and file management.",
    images: ["/og-image.png"],
  },
};

export default function BlogPage() {
  const posts = [
    {
      category: "Guides",
      date: "Oct 12, 2023",
      title: "How to compress PDF files without losing quality",
      imageColor: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      category: "News",
      date: "Oct 05, 2023",
      title: "Introducing our new AI-powered document translator",
      imageColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      category: "Tips",
      date: "Sep 28, 2023",
      title: "Top 5 ways to secure your confidential files online",
      imageColor: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      
      {/* Script for BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://fileinator.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://fileinator.com/blog"
              }
            ]
          }),
        }}
      />

      <PageHero 
        title="Blog" 
        description="Latest guides, tutorials, tips, and updates from Fileinator."
      />

      <div className="flex-grow pt-12 pb-20">
        <Container>

          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Link key={i} href="#" className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300">
                {/* Fake Image Placeholder */}
                <div className={`h-48 w-full ${post.imageColor} flex items-center justify-center relative overflow-hidden`}>
                  <ImageIcon className={`w-12 h-12 ${post.iconColor} opacity-50`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {post.category}
                    </span>
                    <span className="text-sm text-slate-400 font-medium">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center text-blue-600 font-medium text-sm">
                    Read article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </div>

      <CTA />
      <Footer />
    </main>
  );
}
