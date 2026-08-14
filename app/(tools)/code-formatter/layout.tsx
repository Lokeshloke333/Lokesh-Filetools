import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Free Code Formatter Online - Validate, Minify & Beautify",
  description: "Professional Code Formatter. Format, minify, and parse HTML, XML, CSS, JS, JSON, Python, and PHP instantly. Clean code and find errors.",
  keywords: [
    "code formatter",
    "json formatter",
    "html formatter",
    "xml formatter",
    "css formatter",
    "js formatter",
    "python formatter",
    "php formatter",
    "code validator",
    "minify code",
    "beautify code"
  ],
  alternates: {
    canonical: "/code-formatter",
  },
  openGraph: {
    title: "Code Formatter | Fileinator",
    description: "Format, minify, and validate HTML, XML, CSS, JS, JSON, Python, and PHP instantly.",
    url: "/code-formatter",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function CodeFormatterLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Utilities", item: "/tools" },
    { name: "Code Formatter", item: "/code-formatter" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "Code Formatter",
    description: "Format, minify, and parse HTML, XML, CSS, JS, JSON, Python, and PHP instantly.",
    url: "/code-formatter",
    featureList: [
      "Multi-language Formatting and Minification",
      "Real-time Syntax Validation",
      "Client-side processing (Privacy first)",
      "File Upload/Download Support"
    ],
  });

  return (
    <>
      <JsonLd data={[breadcrumbs, softwareApp]} />
      {children}
    </>
  );
}
