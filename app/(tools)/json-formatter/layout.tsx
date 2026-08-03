import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getSoftwareAppSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Free JSON Formatter Online - Validate, Minify & Viewer",
  description: "Professional JSON Formatter and Validator. Format, minify, and parse JSON instantly. Features include tree view, syntax highlighting, and error detection.",
  keywords: [
    "json formatter",
    "json validator",
    "json minify",
    "json tree view",
    "json viewer",
    "format json online"
  ],
  alternates: {
    canonical: "/json-formatter",
  },
  openGraph: {
    title: "JSON Formatter & Validator | Fileinator",
    description: "Format, minify, and parse JSON instantly. Advanced error highlighting and tree viewer.",
    url: "/json-formatter",
    siteName: "Fileinator",
    type: "website",
  }
};

export default function JSONFormatterLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Utilities", item: "/tools" },
    { name: "JSON Formatter", item: "/json-formatter" },
  ]);

  const softwareApp = getSoftwareAppSchema({
    name: "JSON Formatter & Validator",
    description: "Format, minify, and parse JSON instantly with advanced error highlighting and tree viewer.",
    url: "/json-formatter",
    featureList: [
      "JSON Formatting and Minification",
      "Real-time Syntax Validation",
      "Interactive Tree Viewer",
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
