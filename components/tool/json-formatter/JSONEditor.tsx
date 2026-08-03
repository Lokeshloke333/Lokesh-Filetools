"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
}

export function JSONEditor({ value, onChange, height = "100%", readOnly = false }: JSONEditorProps) {
  return (
    <div className="w-full h-full min-h-[400px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col custom-codemirror">
      <CodeMirror
        value={value}
        height={height}
        extensions={[json()]}
        onChange={onChange}
        readOnly={readOnly}
        theme="light"
        className="flex-1 text-sm font-mono"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          indentOnInput: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
