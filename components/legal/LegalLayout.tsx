"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { Container } from "@/components/ui/Container";

export interface LegalSection {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  lastUpdated: string;
  sections: LegalSection[];
  children: React.ReactNode;
}

export function LegalLayout({
  title,
  description,
  icon,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section.id;
          }
        }
      }
      if (current) {
        setActiveSection(current);
      } else if (window.scrollY === 0 && sections.length > 0) {
        setActiveSection(sections[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow flex flex-col">
        {/* Hero Area */}
        <PageHero 
          title={title} 
          description={description}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 border border-slate-200/60 shadow-sm text-sm font-semibold text-slate-600">
            Last Updated: {lastUpdated}
          </div>
        </PageHero>

        {/* Main Content Area */}
        <Container className="py-16">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            
            {/* Sidebar Navigation (Hidden on Mobile) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm shadow-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 px-2">
                  On this Page
                </h4>
                <nav className="flex flex-col space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Document Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm shadow-slate-200/50 prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-3xl prose-h2:text-slate-800 prose-h3:text-2xl prose-h3:text-slate-800 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                {children}
              </div>
            </div>

          </div>
        </Container>

        {/* Bottom CTA Section */}
        <Container className="pb-24">
          <div className="bg-slate-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Need Help?
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                If you have any questions about our policies or need assistance with our tools, our support team is always here to help you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
                <Link href="/">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 rounded-2xl text-base font-bold bg-white text-slate-800 hover:bg-slate-50 border border-slate-200">
                    <LayoutGrid className="w-5 h-5 mr-2" />
                    Browse Tools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>

      </main>

      <Footer />
    </div>
  );
}
