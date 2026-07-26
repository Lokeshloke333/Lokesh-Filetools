"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface PdfDeletePreviewProps {
  file: File;
  selectedPages: Set<number>;
  onSelectionChange: (pages: Set<number>) => void;
}

export function PdfDeletePreview({
  file,
  selectedPages,
  onSelectionChange,
}: PdfDeletePreviewProps) {
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
        
        // Use CDN for worker
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

  const handlePageClick = (pageNumber: number) => {
    const newSet = new Set(selectedPages);
    if (newSet.has(pageNumber)) {
      newSet.delete(pageNumber);
    } else {
      newSet.add(pageNumber);
    }
    onSelectionChange(newSet);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
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
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          Page Selection ({numPages} Pages)
        </h3>
        {selectedPages.size > 0 && (
          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-full animate-in fade-in zoom-in duration-300">
            {selectedPages.size} Selected to Delete
          </span>
        )}
      </div>
      
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => {
            const isSelected = selectedPages.has(pageNum);
            
            return (
              <Thumbnail 
                key={pageNum}
                pdfDoc={pdfDoc}
                pageNum={pageNum}
                isSelected={isSelected}
                onClick={() => handlePageClick(pageNum)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Thumbnail({ 
  pdfDoc, 
  pageNum, 
  isSelected, 
  onClick 
}: { 
  pdfDoc: any; 
  pageNum: number; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  // Intersection Observer to detect visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to observe until first visible
        }
      },
      { rootMargin: '200px' } // Load slightly before it comes into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Actual PDF rendering logic
  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    async function renderPage() {
      // Don't render until visible or if already rendered
      if (!isVisible || !canvasRef.current || !pdfDoc || isRendered) return;
      
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
        
        if (active) setIsRendered(true);
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
  }, [pdfDoc, pageNum, isVisible, isRendered]);

  return (
    <div 
      ref={containerRef}
      className={`
        relative flex flex-col items-center gap-2 cursor-pointer group transition-all
        ${isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100 hover:-translate-y-1'}
      `}
      onClick={onClick}
    >
      <div className={`
        relative w-full aspect-[3/4] bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300
        flex items-center justify-center border-4
        ${isSelected 
          ? 'border-red-500 shadow-md shadow-red-500/20 opacity-50 grayscale scale-95' 
          : 'border-transparent ring-1 ring-slate-200 hover:ring-red-300'}
      `}>
        {!isVisible && !isRendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
             <Loader2 className="w-4 h-4 text-slate-300 animate-spin" />
          </div>
        )}
        
        {renderError ? (
          <div className="text-xs text-slate-400 text-center p-2">Page {pageNum}</div>
        ) : (
          <canvas 
            ref={canvasRef} 
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        
        {/* Trash Overlay */}
        <div className={`
          absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-[1px]
          transition-opacity duration-300 pointer-events-none
          ${isSelected ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="bg-red-500 text-white p-3 rounded-full shadow-lg transform scale-110">
            <Trash2 className="w-6 h-6" />
          </div>
        </div>
      </div>
      <span className={`text-sm font-bold ${isSelected ? 'text-red-600 line-through' : 'text-slate-600'}`}>
        Page {pageNum}
      </span>
    </div>
  );
}
