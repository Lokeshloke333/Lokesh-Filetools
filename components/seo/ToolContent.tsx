import React from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { Shield, Zap, Lock, CheckCircle2, ChevronRight } from "lucide-react";

interface ToolContentProps {
  toolId: string;
  title: string;
  description: string;
  features?: string[];
  howToSteps?: string[];
  faqs?: { question: string, answer: string }[];
}

export function ToolContent({ toolId, title, description, features, howToSteps, faqs }: ToolContentProps) {
  const currentTool = TOOLS.find((t) => t.id === toolId);
  const relatedTools = currentTool?.relatedToolIds
    ? currentTool.relatedToolIds.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean)
    : [];

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Overview Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
          Everything you need to {title.toLowerCase()}
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          {description} Fileinator provides the most advanced, secure, and lightning-fast solution for all your file manipulation needs. Process files directly in your browser without uploading to external servers.
        </p>
      </section>

      {/* How it Works Section */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to {title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(howToSteps || [
            "Select or drag & drop your file into the tool.",
            "Adjust your settings and click the action button.",
            "Download your processed file instantly.",
          ]).map((step, idx) => (
            <div key={idx} className="relative p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl mb-4">
                {idx + 1}
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Step {idx + 1}</h4>
              <p className="text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="bg-slate-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-10 text-center">Why use Fileinator for {title}?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Maximum Privacy</h4>
                <p className="text-slate-600">Your files never leave your device. All processing happens locally in your browser using WebAssembly.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Lightning Fast</h4>
                <p className="text-slate-600">Zero upload times and zero queue times. Get your results instantly, no matter the file size.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">100% Secure</h4>
                <p className="text-slate-600">No data retention. Once you close the tab, your data is gone forever. Completely secure by design.</p>
              </div>
            </div>
            {features?.map((feature, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Premium Feature</h4>
                  <p className="text-slate-600">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Related Tools</h3>
            <Link href="/tools" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((t) => {
              if (!t) return null;
              const Icon = t.icon;
              return (
                <Link
                  key={t.id}
                  href={t.href}
                  className="group flex flex-col p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 mb-4 ${t.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-1">{t.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{t.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
