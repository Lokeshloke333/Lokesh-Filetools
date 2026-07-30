"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  User,
  FileText,
  MessageSquare,
  Lock,
  Zap,
  CheckCircle2,
  Loader2,
  FileIcon,
  Image as ImageIcon
} from "lucide-react";
import { PageHero } from "@/components/common/PageHero";

import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent successfully!");

        setTimeout(() => {
          setIsSuccess(false);
        }, 4000);
      } else {
        toast.error("Failed to send message. Please ensure SMTP credentials are set in .env.local");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background Decorators */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/20 to-white z-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-40 -left-64 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl z-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-40 -right-64 w-[500px] h-[500px] bg-purple-300/20 rounded-full blur-3xl z-0 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-cyan-200/10 rounded-full blur-3xl z-0 pointer-events-none" aria-hidden="true" />

      {/* Subtle dotted pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at center, #cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero Section */}
        <PageHero
          title="Contact Us"
          description="Need help or have feedback? We'd love to hear from you. Our support team is always ready to assist."
        />

        {/* Main Content */}
        <section className="py-16 md:py-24 flex-grow">
          <Container>
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-stretch">

              {/* Left: Support Info Card (Spans 2 cols) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2 flex flex-col justify-center relative"
              >
                {/* Floating SVGs */}
                <motion.div
                  animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -left-10 text-blue-200/50 hidden md:block"
                >
                  <FileIcon className="w-24 h-24" />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-10 right-0 text-purple-200/50 hidden md:block"
                >
                  <ImageIcon className="w-32 h-32" />
                </motion.div>

                <div className="bg-white/60 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-white/80 relative z-10 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-500/30">
                      <MessageSquare className="w-6 h-6" />
                    </div>

                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Need Help?</h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-10">
                      Whether you have a question about our tools, billing, or just want to say hi, our team is here for you.
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Email us at</p>
                          <a href="mailto:lokeshuiuxdesigner@gmail.com" className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            lokeshuiuxdesigner@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Response Time</p>
                          <p className="text-slate-900 font-semibold">Under 24 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Privacy</p>
                          <p className="text-slate-900 font-semibold">Secure & Encrypted</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Contact Form (Spans 3 cols) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3 bg-white/80 backdrop-blur-xl rounded-[32px] p-8 md:p-12 shadow-2xl shadow-slate-200/40 border border-white relative z-10"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Send us a message</h2>

                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-2 group">
                      <Label htmlFor="name" className="text-slate-700 font-semibold ml-1">Your Name</Label>
                      <div className="relative flex items-center group-focus-within:text-blue-600 transition-colors">
                        <User className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white hover:bg-slate-50 transition-all focus-visible:ring-blue-600 text-base"
                        />
                      </div>
                    </div>
                    {/* Email */}
                    <div className="space-y-2 group">
                      <Label htmlFor="email" className="text-slate-700 font-semibold ml-1">Email Address</Label>
                      <div className="relative flex items-center group-focus-within:text-blue-600 transition-colors">
                        <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white hover:bg-slate-50 transition-all focus-visible:ring-blue-600 text-base"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2 group">
                    <Label htmlFor="subject" className="text-slate-700 font-semibold ml-1">Subject</Label>
                    <div className="relative flex items-center group-focus-within:text-blue-600 transition-colors">
                      <FileText className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white hover:bg-slate-50 transition-all focus-visible:ring-blue-600 text-base"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 group">
                    <Label htmlFor="message" className="text-slate-700 font-semibold ml-1">Message</Label>
                    <div className="relative flex items-start group-focus-within:text-blue-600 transition-colors pt-1">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Provide as much detail as possible..."
                        className="w-full pl-12 rounded-2xl border border-slate-200 bg-slate-50/50 py-4 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white hover:bg-slate-50 transition-all resize-y min-h-[140px]"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`w-full h-14 text-lg rounded-2xl gap-2 font-bold shadow-lg transition-all ${isSuccess
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30"
                          : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/30"
                        }`}
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </motion.div>
                        ) : isSuccess ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            Message Sent!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="default"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2"
                          >
                            Send Message
                            <Send className="w-4 h-4 ml-1" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  {/* Trust Indicators */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Your information is kept private
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      Average response within 24 hours
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      We never share your email
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </main>
  );
}
