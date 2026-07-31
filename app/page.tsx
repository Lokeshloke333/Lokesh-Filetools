import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { PopularTools } from "@/components/PopularTools";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Statistics } from "@/components/Statistics";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSoftwareAppSchema, getFaqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: {
    absolute: "All-in-One File Toolkit: PDF, Image, Video & Audio | Fileinator",
  },
  description: "Fileinator is a comprehensive online file toolkit that lets you compress, convert, merge, split, edit, and optimize PDFs, images, videos, audio, and Office files securely in your browser.",
  keywords: [
    "free online file tools",
    "online pdf tools",
    "online image tools",
    "online video tools",
    "online audio tools",
    "compress pdf",
    "convert video",
    "edit audio",
    "browser file utilities"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "All-in-One File Toolkit: PDF, Image, Video & Audio | Fileinator",
    description: "Use Fileinator to compress, convert, merge, split, edit, and optimize PDFs, images, videos, audio, and Office files online. Secure, fast, and browser-based.",
    url: "/",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "All-in-One File Toolkit: PDF, Image, Video & Audio | Fileinator",
    description: "Use Fileinator to compress, convert, merge, split, edit, and optimize PDFs, images, videos, audio, and Office files online. Secure, fast, and browser-based.",
    images: ["/og-image.png"],
  },
};

export default function Home() {
  const softwareApp = getSoftwareAppSchema({
    name: "Fileinator",
    description: "Fileinator is a comprehensive online file toolkit that lets you compress, convert, merge, split, edit, and optimize files securely in your browser.",
    url: "/",
    featureList: [
      "Compress & Convert PDFs",
      "Optimize & Convert Images",
      "Process Video & Audio",
      "Secure Local Browser Processing",
      "No File Uploads Required"
    ],
  });

  const faqs = getFaqSchema([
    {
      question: "Are my files secure?",
      answer: "Yes. Almost all processing happens securely on your device inside your browser using WebAssembly. For tools that require server-side rendering, files are deleted immediately."
    },
    {
      question: "Is Fileinator really free?",
      answer: "Yes, Fileinator is 100% free to use. There are no hidden fees or strict limitations on basic tools."
    },
    {
      question: "Do I need to install any software?",
      answer: "No installation is required. Everything runs directly inside your web browser (Chrome, Safari, Firefox, Edge)."
    }
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative">
      <JsonLd data={[softwareApp, faqs]} />
      <div className="relative z-10 flex flex-col">
        <Navbar />
        <Hero />
        <PopularTools />
        <CategorySection />
        <HowItWorks />
        <Features />
        <Statistics />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
