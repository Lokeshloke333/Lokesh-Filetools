import { CodeLanguage } from "@/components/tool/code-formatter/CodeEditor";

export interface FormatterConfig {
  slug: string;
  title: string;
  description: string;
  initialLanguage: CodeLanguage;
  initialAction: "format" | "minify" | "validate";
  faqs?: { question: string; answer: string }[];
}

export const formatterConversions: FormatterConfig[] = [
  {
    slug: "html-formatter",
    title: "HTML Formatter",
    description: "Format and beautify your HTML code instantly.",
    initialLanguage: "html",
    initialAction: "format"
  },
  {
    slug: "css-formatter",
    title: "CSS Formatter",
    description: "Format and beautify your CSS code instantly.",
    initialLanguage: "css",
    initialAction: "format"
  },
  {
    slug: "javascript-formatter",
    title: "JavaScript Formatter",
    description: "Format and beautify your JavaScript code instantly.",
    initialLanguage: "javascript",
    initialAction: "format"
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter",
    description: "Format and beautify your JSON data instantly.",
    initialLanguage: "json",
    initialAction: "format"
  },
  {
    slug: "xml-formatter",
    title: "XML Formatter",
    description: "Format and beautify your XML data instantly.",
    initialLanguage: "xml",
    initialAction: "format"
  },
  {
    slug: "python-formatter",
    title: "Python Formatter",
    description: "Format and beautify your Python code instantly.",
    initialLanguage: "python",
    initialAction: "format"
  },
  {
    slug: "php-formatter",
    title: "PHP Formatter",
    description: "Format and beautify your PHP code instantly.",
    initialLanguage: "php",
    initialAction: "format"
  }
];
