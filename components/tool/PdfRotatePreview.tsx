"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { Loader2, RotateCw } from "lucide-react";

interface PdfRotatePreviewProps {
  file: File;
  degrees: number; // 90 | 180 | 270
  pageScope: "all" | "selected";
  pageSelection: string;
  onSelectionChange: (selection: string) => void;
  onScopeChange: (scope: "all" | "selected") => void;
}

export function PdfRotatePreview({
  file,
  degrees,
  pageScope,
  pageSelection,
  onSelectionChange,
  onScopeChange
}: PdfRotatePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);
        
        // Dynamically import to prevent SSR issues
        const pdfjsLib = await import("pdfjs-dist");
        
        // Use CDN for worker to avoid complex Webpack config
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        
        const doc = await loadingTask.promise;
        if (active) {
          setPdfDoc(doc);
          setNumPages(doc.numPages);
        }
      } catch (err) {
        if (active) {
          console.error("Failed to load PDF thumbnails:", err);
          setError("Failed to generate page previews.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPdf();

    return () => {
      active = false;
      if (pdfDoc) {
        pdfDoc.destroy().catch(() => {});
      }
    };
  }, [file]);

  // Parse current selection string to a Set of 1-indexed pages
  const selectedPagesSet = useMemo(() => {
    const set = new Set<number>();
    if (pageScope === 'all' || !pageSelection.trim()) return set;
    
    const parts = pageSelection.split(',').map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          for (let i = start; i <= Math.min(end, numPages); i++) {
            set.add(i);
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page > 0 && page <= numPages) {
          set.add(page);
        }
      }
    }
    return set;
  }, [pageSelection, pageScope, numPages]);

  const handlePageClick = (pageNumber: number) => {
    if (pageScope === 'all') {
      // If clicking a page while 'all' is selected, switch to 'selected' mode
      // and select just that page, or select all except that one?
      // Usually better to start fresh with just that page.
      onScopeChange('selected');
      onSelectionChange(pageNumber.toString());
      return;
    }

    const newSet = new Set(selectedPagesSet);
    if (newSet.has(pageNumber)) {
      newSet.delete(pageNumber);
    } else {
      newSet.add(pageNumber);
    }

    // Convert Set back to a sorted comma-separated string
    const sorted = Array.from(newSet).sort((a, b) => a - b);
    onSelectionChange(sorted.join(", "));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Generating page previews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Page Preview ({numPages} Pages)
        </h3>
        {pageScope === 'selected' && (
          <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
            {selectedPagesSet.size} Selected
          </span>
        )}
      </div>
      
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
            const isSelected = pageScope === 'all' || selectedPagesSet.has(pageNum);
            const displayRotation = isSelected ? degrees : 0;
            
            return (
              <Thumbnail 
                key={pageNum}
                pdfDoc={pdfDoc}
                pageNum={pageNum}
                isSelected={isSelected}
                rotation={displayRotation}
                onClick={() => handlePageClick(pageNum)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Separate component for individual thumbnail to handle canvas rendering
function Thumbnail({ 
  pdfDoc, 
  pageNum, 
  isSelected, 
  rotation,
  onClick 
}: { 
  pdfDoc: any; 
  pageNum: number; 
  isSelected: boolean; 
  rotation: number;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    async function renderPage() {
      if (!canvasRef.current || !pdfDoc) return;
      
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (!active) return;

        // Render at small scale for thumbnail
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        
        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name === "RenderingCancelledException") {
          // Expected on unmount
        } else {
          console.error(`Error rendering page ${pageNum}:`, err);
          if (active) setRenderError(true);
        }
      }
    }

    renderPage();

    return () => {
      active = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDoc, pageNum]);

  return (
    <div 
      className={`
        relative flex flex-col items-center gap-2 cursor-pointer group transition-all
        ${isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80'}
      `}
      onClick={onClick}
    >
      <div className={`
        relative w-full aspect-[3/4] bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all
        flex items-center justify-center
        ${isSelected ? 'border-indigo-500 shadow-md shadow-indigo-100 ring-2 ring-indigo-500/20 ring-offset-2' : 'border-slate-200'}
      `}>
        {renderError ? (
          <div className="text-xs text-slate-400 text-center p-2">Page {pageNum}</div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className="max-w-full max-h-full object-contain transition-transform duration-300 ease-in-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        )}
        
        {isSelected && (
          <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <RotateCw className="w-3 h-3" />
          </div>
        )}
      </div>
      <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
        Page {pageNum}
      </span>
    </div>
  );
}
