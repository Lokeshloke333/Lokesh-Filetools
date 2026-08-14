"use client";

import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";
import { html } from "@codemirror/lang-html";
import { xml } from "@codemirror/lang-xml";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";

export type CodeLanguage = "html" | "xml" | "css" | "javascript" | "json" | "python" | "php";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  height?: string;
  readOnly?: boolean;
  language: CodeLanguage;
}

export function CodeEditor({ value, onChange, height = "100%", readOnly = false, language }: CodeEditorProps) {
  const extensions = useMemo(() => {
    // Inject strict internal sizing so CodeMirror never expands its parent
    const editorConstraints = EditorView.theme({
      "&": { 
        width: "100%", 
        maxWidth: "100%", 
        height: "100%", 
        maxHeight: "100%" 
      },
      ".cm-scroller": { 
        overflowX: "auto", 
        overflowY: "auto" 
      }
    });

    const baseExtensions = [editorConstraints];

    switch (language) {
      case "html": return [...baseExtensions, html()];
      case "xml": return [...baseExtensions, xml()];
      case "css": return [...baseExtensions, css()];
      case "javascript": return [...baseExtensions, javascript()];
      case "json": return [...baseExtensions, json()];
      case "python": return [...baseExtensions, python()];
      case "php": return [...baseExtensions, php()];
      default: return baseExtensions;
    }
  }, [language]);

  return (
    <div className={`w-full h-full min-h-[400px] border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col min-w-0 min-h-0 overflow-hidden ${readOnly ? 'bg-slate-50 opacity-90' : ''}`}>
      <CodeMirror
        value={value}
        height="100%"
        extensions={extensions}
        onChange={onChange}
        readOnly={readOnly}
        theme="light"
        className="flex-1 w-full min-w-0 min-h-0 overflow-hidden text-sm font-mono"
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
