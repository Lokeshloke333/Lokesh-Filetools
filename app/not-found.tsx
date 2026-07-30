"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileQuestion, 
  FileImage, 
  FileText, 
  Cloud, 
  Search,
  ImageDown,
  Maximize,
  Layers
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Navbar />
      
      {/* 404 Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-4 relative">
        
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-50/40 rounded-full blur-[100px] -z-10 pointer-events-none" />
        
        {/* Illustration Area */}
        <div className="relative w-full max-w-lg h-[280px] mb-8 flex items-center justify-center">
          
          {/* Huge 404 Background Text */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[160px] md:text-[220px] font-extrabold text-slate-100 select-none tracking-tighter leading-none"
          >
            404
          </motion.div>
          
          {/* Floating Elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-10 md:left-16 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 z-10"
          >
            <FileQuestion className="w-8 h-8 text-blue-500" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 right-12 md:right-20 p-4 bg-white rounded-2xl shadow-xl border border-slate-100 z-10"
          >
            <FileImage className="w-8 h-8 text-emerald-500" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-24 right-24 md:right-32 p-3 bg-white rounded-xl shadow-lg border border-slate-100 z-10"
          >
            <Search className="w-6 h-6 text-indigo-500" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-24 left-24 md:left-32 p-3 bg-white rounded-xl shadow-lg border border-slate-100 opacity-80 z-10"
          >
            <Cloud className="w-6 h-6 text-slate-400" />
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20"
          >
            <FileText className="w-12 h-12 text-rose-500" />
          </motion.div>

        </div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-md z-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Oops! Page Not Found</h1>
          <p className="text-slate-500 mb-8 text-lg">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="rounded-full px-8 w-full sm:w-auto h-12 text-base shadow-lg shadow-blue-500/20" asChild>
              <Link href="/">
                Go Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 w-full sm:w-auto h-12 text-base border-slate-200 hover:bg-slate-50 text-slate-900" asChild>
              <Link href="/tools">
                Browse All Tools
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Popular Tools Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-3xl z-10"
        >
          <div className="text-center mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Popular Tools</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/tools/image/compress" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-green-500 hover:shadow-md hover:shadow-green-500/10 transition-all group">
              <ImageDown className="w-4 h-4 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-green-700">Compress Image</span>
            </Link>
            <Link href="/tools/image/resize" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 transition-all group">
              <Maximize className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">Resize Image</span>
            </Link>
            <Link href="/tools/pdf/merge" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 transition-all group">
              <Layers className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-orange-700">Merge PDF</span>
            </Link>
            <Link href="/tools/pdf/image-to-pdf" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-rose-500 hover:shadow-md hover:shadow-rose-500/10 transition-all group">
              <FileImage className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-rose-700">Image to PDF</span>
            </Link>
            <Link href="/tools/pdf/pdf-to-image" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full hover:border-red-500 hover:shadow-md hover:shadow-red-500/10 transition-all group">
              <FileText className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-slate-700 group-hover:text-red-700">PDF to Image</span>
            </Link>
          </div>
        </motion.div>

      </div>

      <Footer />
    </main>
  );
}
