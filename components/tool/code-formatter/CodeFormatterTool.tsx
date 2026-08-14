"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CodeActionBar } from "./CodeActionBar";
import { CodeEditor, CodeLanguage } from "./CodeEditor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import prettier from "prettier/standalone";
import htmlPlugin from "prettier/plugins/html";
import cssPlugin from "prettier/plugins/postcss";
import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import xmlFormat from "xml-formatter";
import initRuff, { format as formatPython } from "@wasm-fmt/ruff_fmt/web";
import initMago, { format as formatPhp } from "@wasm-fmt/mago_fmt/web";

const EXAMPLES: Record<CodeLanguage, string> = {
  json: `{"name":"John Doe","age":30,"city":"New York","skills":["React","Next.js","TypeScript"],"isEmployed":true}`,
  html: `<div class="container"><header><h1>Welcome</h1></header><main><p>This is a paragraph.</p></main><footer><p>&copy; 2026</p></footer></div>`,
  css: `.container{margin:0;padding:20px;display:flex;flex-direction:column;}.container header h1{font-size:2rem;color:#333;}.container main p{line-height:1.6;color:#666;}`,
  javascript: `function greet(name){if(!name){return"Hello, World!";}return"Hello, "+name+"!";}const msg=greet("Alice");console.log(msg);`,
  xml: `<?xml version="1.0" encoding="UTF-8"?><library><book id="1"><title>1984</title><author>George Orwell</author><year>1949</year></book><book id="2"><title>Brave New World</title><author>Aldous Huxley</author><year>1932</year></book></library>`,
  python: `def hello_world(name):
    if name:
        print("Hello, " + name)
    else:
        print("Hello, World!")
hello_world("Alice")`,
  php: `<?php
function greet($name) {
if(empty($name)) {
echo "Hello, World!";
} else {
echo "Hello, " . $name . "!";
}
}
greet("Alice");
?>`
};

const EXTENSIONS: Record<CodeLanguage, string> = {
  json: ".json",
  html: ".html",
  css: ".css",
  javascript: ".js",
  xml: ".xml",
  python: ".py",
  php: ".php"
};

const EXTENSION_MAP: Record<string, CodeLanguage> = {
  html: "html", htm: "html",
  xml: "xml",
  css: "css",
  js: "javascript", mjs: "javascript",
  json: "json",
  py: "python",
  php: "php"
};

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB client-side limit

export interface CodeFormatterToolProps {
  initialLanguage?: CodeLanguage;
  initialAction?: "format" | "minify" | "validate";
}

export function CodeFormatterTool({ initialLanguage = "json", initialAction = "format" }: CodeFormatterToolProps = {}) {
  const [activeTab, setActiveTab] = useState<CodeLanguage>(initialLanguage);
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  // Sync activeTab when initialLanguage prop changes from soft navigation
  useEffect(() => {
    setActiveTab(initialLanguage);
  }, [initialLanguage]);

  // Parse query params for initial tab
  useEffect(() => {
    initRuff().catch(console.error);
    initMago().catch(console.error);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && Object.keys(EXAMPLES).includes(tab as string)) {
        setActiveTab(tab as CodeLanguage);
      }
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as CodeLanguage);
    setInputCode("");
    setOutputCode("");
    setError(null);
    setSuccessMsg(null);
    
    // Navigate to dedicated SEO-friendly route
    // Map the value directly to the formatter route (e.g. html -> /html-formatter)
    router.push(`/${value}-formatter`);
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return;
    }
    const extMatch = file.name.match(/\.([a-z0-9]+)$/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "";
    if (!EXTENSION_MAP[ext]) {
      setError("Unsupported file type. Please upload HTML, XML, CSS, JavaScript, JSON, Python, or PHP.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content.trim()) {
        setError("The uploaded file is empty.");
        return;
      }
      setActiveTab(EXTENSION_MAP[ext]);
      setInputCode(content);
      setOutputCode("");
      setError(null);
      setSuccessMsg(null);
      setUploadedFileName(file.name);
    };
    reader.onerror = () => setError("Failed to read the file.");
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const processCode = async (action: "format" | "minify" | "validate") => {
    if (!inputCode.trim()) {
      setError("Paste or enter some code to get started.");
      return;
    }
    setError(null);
    try {
      let result = "";
      if (activeTab === "json") {
        const parsed = JSON.parse(inputCode);
        if (action === "format") {
          result = JSON.stringify(parsed, null, 2);
        } else if (action === "minify") {
          result = JSON.stringify(parsed);
        } else if (action === "validate") {
          result = JSON.stringify(parsed, null, 2);
          showSuccess("JSON is valid!");
        }
      } else if (activeTab === "xml") {
        const parser = new DOMParser();
        const dom = parser.parseFromString(inputCode, "application/xml");
        const parseError = dom.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
          throw new Error("Invalid XML structure. " + parseError[0].textContent);
        }
        if (action === "format") {
          result = xmlFormat(inputCode, { collapseContent: true });
        } else if (action === "minify") {
          result = inputCode.replace(/>\s+</g, "><").trim();
        } else if (action === "validate") {
          result = xmlFormat(inputCode, { collapseContent: true });
          showSuccess("XML is valid!");
        }
      } else if (activeTab === "python") {
        if (action === "minify") throw new Error("Minification is not supported for Python.");
        if (action === "format" || action === "validate") {
          result = formatPython(inputCode, "main.py");
          if (action === "validate") showSuccess("PYTHON is valid!");
        }
      } else if (activeTab === "php") {
        if (action === "minify") throw new Error("Minification is not supported for PHP.");
        if (action === "format" || action === "validate") {
          result = formatPhp(inputCode, "main.php");
          if (action === "validate") showSuccess("PHP is valid!");
        }
      } else {
        // Prettier for HTML, CSS, JS
        let parserName = activeTab === "javascript" ? "babel" : activeTab;
        let plugins = activeTab === "javascript" ? [babelPlugin, estreePlugin] : activeTab === "css" ? [cssPlugin] : [htmlPlugin];
        
        if (action === "format") {
          result = await prettier.format(inputCode, {
            parser: parserName,
            plugins: plugins,
          });
        } else if (action === "minify") {
          // Prettier doesn't minify, so we do basic minification or just format compactly
          if (activeTab === "css") {
            result = inputCode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([\{\}\:\;\,])\s*/g, '$1').trim();
          } else if (activeTab === "html") {
            result = inputCode.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
          } else if (activeTab === "javascript") {
             // Basic safe minification or fallback to formatting if unsafe
             result = inputCode.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').trim();
          }
        } else if (action === "validate") {
          result = await prettier.format(inputCode, {
            parser: parserName,
            plugins: plugins,
          });
          showSuccess(`${activeTab.toUpperCase()} is valid!`);
        }
      }

      if (action !== "validate") {
        setOutputCode(result);
        showSuccess(action === "format" ? "Formatted successfully" : "Minified successfully");
      } else {
        setOutputCode(result); // Show formatted on validate too
      }
    } catch (e: any) {
      console.error(`Formatter error (${activeTab}):`, e);
      if (activeTab === "json") {
        setError("Invalid JSON: " + e.message);
      } else if (activeTab === "xml") {
        setError(e.message || "Invalid XML structure.");
      } else {
        setError(`Unable to parse ${activeTab.toUpperCase()}. Please check the syntax and try again.`);
      }
      setOutputCode("");
    }
  };

  const handleCopy = () => {
    if (outputCode) {
      navigator.clipboard.writeText(outputCode);
      showSuccess("Copied!");
    }
  };

  const handleDownload = () => {
    if (outputCode) {
      const blob = new Blob([outputCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formatted${EXTENSIONS[activeTab]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClear = () => {
    setInputCode("");
    setOutputCode("");
    setError(null);
    setSuccessMsg(null);
    setUploadedFileName(null);
  };

  const handleLoadExample = () => {
    setInputCode(EXAMPLES[activeTab]);
    setOutputCode("");
    setError(null);
    setUploadedFileName(null);
  };

  return (
    <div className="w-full space-y-4">
      
      <div className="flex justify-center w-full mb-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-3xl overflow-x-auto">
          <TabsList className="w-full flex">
            <TabsTrigger value="html" className="flex-1">HTML</TabsTrigger>
            <TabsTrigger value="xml" className="flex-1">XML</TabsTrigger>
            <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
            <TabsTrigger value="javascript" className="flex-1">JavaScript</TabsTrigger>
            <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
            <TabsTrigger value="python" className="flex-1">Python</TabsTrigger>
            <TabsTrigger value="php" className="flex-1">PHP</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CodeActionBar
        onFormat={() => processCode("format")}
        onMinify={() => processCode("minify")}
        onValidate={() => processCode("validate")}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onClear={handleClear}
        onLoadExample={handleLoadExample}
        onUpload={handleFileUpload}
        hasData={inputCode.trim().length > 0}
        hasOutput={outputCode.trim().length > 0}
        successMessage={successMsg}
        showMinify={activeTab !== "python" && activeTab !== "php"}
        primaryAction={initialAction}
      />

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200 text-sm font-medium flex items-start animate-in fade-in">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px] lg:h-[700px]">
        <div 
          className={`flex flex-col h-full rounded-xl transition-colors min-w-0 overflow-hidden ${isDragging ? "ring-2 ring-blue-500 bg-blue-50/30" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Input {activeTab}</span>
            {uploadedFileName && (
              <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]" title={uploadedFileName}>
                Uploaded: {uploadedFileName}
              </span>
            )}
          </div>
          <div className="flex-1 overflow-hidden relative min-w-0">
            {isDragging && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/80 backdrop-blur-[2px] rounded-lg border-2 border-dashed border-blue-400">
                <span className="text-blue-600 font-medium text-lg shadow-sm">Drop your code file here</span>
              </div>
            )}
            <CodeEditor 
              value={inputCode} 
              onChange={setInputCode} 
              language={activeTab} 
            />
          </div>
        </div>

        <div className="flex flex-col h-full min-w-0 overflow-hidden">
          <div className="text-sm font-semibold text-slate-600 mb-2 px-1 uppercase tracking-wider shrink-0">Formatted Output</div>
          <div className="flex-1 overflow-hidden min-w-0">
            <CodeEditor 
              value={outputCode} 
              language={activeTab} 
              readOnly 
            />
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-slate-500 pt-4">
        Your code stays in your browser. Nothing is uploaded.
      </div>
    </div>
  );
}
