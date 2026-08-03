"use client";

import React from "react";
import dynamic from "next/dynamic";

// Next.js dynamic import because react-json-view relies on window objects and breaks during SSR
const ReactJson = dynamic(() => import("@microlink/react-json-view"), { ssr: false });

interface JSONTreeViewProps {
  data: object | null;
}

export function JSONTreeView({ data }: JSONTreeViewProps) {
  if (!data) {
    return (
      <div className="w-full h-full min-h-[400px] border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 p-8 text-center">
        <p>Invalid JSON data. Cannot build tree view.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] max-h-[800px] overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm p-4 custom-scrollbar">
      <ReactJson 
        src={data} 
        theme="rjv-default"
        iconStyle="triangle"
        collapsed={2}
        enableClipboard={true}
        displayDataTypes={false}
        displayObjectSize={true}
        name={null}
        style={{ backgroundColor: "transparent", fontSize: "14px", fontFamily: "var(--font-geist-mono), monospace" }}
      />
    </div>
  );
}
