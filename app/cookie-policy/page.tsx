import { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Cookie } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how Fileinator uses cookies and local storage to deliver secure, browser-based file conversion, compression, and editing tools efficiently.",
  keywords: [
    "cookie policy",
    "cookies",
    "fileinator cookies",
    "browser storage",
    "tracking policy"
  ],
  alternates: {
    canonical: "/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy — Fileinator",
    description: "Learn how Fileinator uses cookies and local storage to deliver secure, browser-based file conversion, compression, and editing tools efficiently.",
    url: "/cookie-policy",
    siteName: "Fileinator",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy — Fileinator",
    description: "Learn how Fileinator uses cookies and local storage to deliver secure, browser-based file conversion, compression, and editing tools efficiently.",
    images: ["/og-image.png"],
  },
};

const sections = [
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "types-of-cookies", title: "Types of Cookies We Use" },
  { id: "cookies-we-do-not-use", title: "Cookies We Do NOT Use" },
  { id: "managing-cookies", title: "Managing Cookies" },
  { id: "third-party-services", title: "Third-Party Services" },
  { id: "changes", title: "Changes to This Policy" },
  { id: "contact", title: "Contact" },
];

export default function CookiePolicyPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Cookie Policy", item: "/cookie-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <LegalLayout
        title="Cookie Policy"
        description="This policy explains how Fileinator uses cookies and similar technologies to ensure our tools run securely and efficiently."
        icon={<Cookie className="w-8 h-8" />}
        lastUpdated="July 2026"
        sections={sections}
      >
        <h2 id="what-are-cookies">What Are Cookies?</h2>
        <p>
          Cookies are small text files placed on your computer, tablet, or mobile device when you visit a website. 
          Websites use cookies to ensure proper functionality, improve security, and understand how visitors interact with the platform.
        </p>

        <h2 id="types-of-cookies">Types of Cookies We Use</h2>
        <div className="overflow-x-auto my-8">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="p-4 font-semibold text-slate-800 w-1/4">Category</th>
                <th className="p-4 font-semibold text-slate-800 w-1/3">Purpose</th>
                <th className="p-4 font-semibold text-slate-800 w-1/6">Duration</th>
                <th className="p-4 font-semibold text-slate-800 w-1/4">Provider</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-4 font-medium text-slate-900">Essential Cookies</td>
                <td className="p-4 text-slate-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Site functionality</li>
                    <li>Security</li>
                    <li>Session management</li>
                    <li>Form protection</li>
                    <li>Performance required for the website to work</li>
                  </ul>
                </td>
                <td className="p-4 text-slate-600">Session / Persistent</td>
                <td className="p-4 text-slate-600">Fileinator / Hosting Provider</td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="p-4 font-medium text-slate-900">Analytics Cookies</td>
                <td className="p-4 text-slate-600">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Understand visitor behavior</li>
                    <li>Improve user experience</li>
                    <li>Measure traffic</li>
                    <li>Detect usability issues</li>
                    <li>Improve performance</li>
                  </ul>
                </td>
                <td className="p-4 text-slate-600">Persistent</td>
                <td className="p-4 text-slate-600">Google Analytics 4, Microsoft Clarity, Vercel Analytics</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Note:</strong> Analytics services may place cookies on your device depending on your browser settings and applicable privacy regulations.
        </p>

        <h2 id="cookies-we-do-not-use">Cookies We Do NOT Use</h2>
        <p>
          Fileinator respects your privacy and currently does <strong>NOT</strong> use:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li>Advertising cookies</li>
          <li>Remarketing cookies</li>
          <li>Third-party ad tracking</li>
          <li>Behavioral profiling cookies</li>
        </ul>
        <p>
          If advertising or promotional cookies are introduced in the future, this Cookie Policy will be updated accordingly to reflect those changes.
        </p>

        <h2 id="managing-cookies">Managing Cookies</h2>
        <p>
          You have full control over your cookie preferences. You can choose to:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li>Delete cookies directly from your device.</li>
          <li>Block cookies entirely.</li>
          <li>Control and customize cookie settings within your web browser.</li>
        </ul>
        <p>
          Please be aware that disabling <strong>Essential Cookies</strong> may affect core website functionality, potentially preventing certain file tools or secure forms from operating correctly.
        </p>

        <h2 id="third-party-services">Third-Party Services</h2>
        <p>
          To monitor platform stability and understand user behavior, Fileinator utilizes secure third-party analytics services. These services may operate under their own privacy and cookie policies, including:
        </p>
        <ul className="list-disc list-inside mb-4 pl-4 space-y-2">
          <li><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Analytics</a></li>
          <li><a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Clarity</a></li>
          <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel</a></li>
        </ul>

        <h2 id="changes">Changes to This Policy</h2>
        <p>
          Fileinator may update this Cookie Policy periodically as new technologies, tools, or services are introduced to the platform. We encourage you to review this page occasionally to stay informed about our use of cookies.
        </p>

        <h2 id="contact">Contact</h2>
        <p>
          If you have any questions or concerns regarding our Cookie Policy or privacy practices, please reach out to us via our <Link href="/contact" className="text-blue-600 hover:underline font-medium">Contact page</Link>.
        </p>
      </LegalLayout>
    </>
  );
}
