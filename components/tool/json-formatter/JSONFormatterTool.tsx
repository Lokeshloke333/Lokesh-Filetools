"use client";

import React, { useState, useEffect, useCallback } from "react";
import { JSONActionBar } from "./JSONActionBar";
import { JSONEditor } from "./JSONEditor";
import { JSONTreeView } from "./JSONTreeView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Network } from "lucide-react";

export function JSONFormatterTool() {
  const [inputJson, setInputJson] = useState<string>("");
  const [parsedJson, setParsedJson] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("editor");

  const validateJson = useCallback((val: string) => {
    if (!val.trim()) {
      setParsedJson(null);
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      setParsedJson(parsed);
      setError(null);
    } catch (e: any) {
      setParsedJson(null);
      setError(e.message || "Invalid JSON");
    }
  }, []);

  const handleChange = (val: string) => {
    setInputJson(val);
    setSuccessMsg(null);
    validateJson(val);
  };

  const handleFormat = () => {
    if (parsedJson) {
      setInputJson(JSON.stringify(parsedJson, null, 2));
      setSuccessMsg("Formatted");
      setTimeout(() => setSuccessMsg(null), 2000);
    }
  };

  const handleMinify = () => {
    if (parsedJson) {
      setInputJson(JSON.stringify(parsedJson));
      setSuccessMsg("Minified");
      setTimeout(() => setSuccessMsg(null), 2000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    setSuccessMsg("Copied!");
    setTimeout(() => setSuccessMsg(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInputJson("");
    setParsedJson(null);
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="w-full">
      <JSONActionBar 
        onFormat={handleFormat}
        onMinify={handleMinify}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={handleChange}
        onClear={handleClear}
        hasData={inputJson.trim().length > 0}
        error={error}
        successMessage={successMsg}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl">
            <TabsTrigger value="editor" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Code2 className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="tree" disabled={!parsedJson} className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Network className="w-4 h-4 mr-2" />
              Tree View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="editor" className="mt-0 h-[600px]">
          <JSONEditor value={inputJson} onChange={handleChange} />
        </TabsContent>

        <TabsContent value="tree" className="mt-0 h-[600px]">
          <JSONTreeView data={parsedJson} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
