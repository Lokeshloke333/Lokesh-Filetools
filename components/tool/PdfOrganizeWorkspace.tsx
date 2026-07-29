"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Trash2, RotateCw, RotateCcw, Maximize2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PageItem } from "@/hooks/usePdfOrganize";

interface PdfOrganizeWorkspaceProps {
  file: File;
  pages: PageItem[];
  onDragEnd: (newPages: PageItem[]) => void;
  onToggleSelection: (id: string) => void;
  onRotateIndividual: (id: string, direction: 'left' | 'right') => void;
}

export function PdfOrganizeWorkspace({
  file,
  pages,
  onDragEnd,
  onToggleSelection,
  onRotateIndividual
}: PdfOrganizeWorkspaceProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Drag and Drop State
  const [localPages, setLocalPages] = useState<PageItem[]>(pages);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Sync local state when parent prop changes (e.g., delete/reset/rotate)
  useEffect(() => {
    setLocalPages(pages);
  }, [pages]);

  // Load PDF once
  useEffect(() => {
    let active = true;

    async function loadPdf() {
      try {
        setLoading(true);
        setError(null);
        
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        if (active) setPdfDoc(doc);
      } catch (err) {
        if (active) setError("Failed to render PDF previews.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPdf();

    return () => {
      active = false;
      if (pdfDoc) pdfDoc.destroy().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Use a blank transparent image for the native drag ghost so we can optionally custom style it
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    // Swap instantly in local state
    const newItems = [...localPages];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    
    setLocalPages(newItems);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null) {
      onDragEnd(localPages); // Commit to parent state
      setDraggedIndex(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Extracting workspace pages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-center m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 p-4 sm:p-6 lg:p-8 min-h-[500px]">
      <Container className="!px-0">
        <div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6"
          onDragOver={(e) => e.preventDefault()} // Allow drop anywhere in grid
        >
          {localPages.map((page, index) => (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`
                relative transition-all duration-200 transform
                ${draggedIndex === index ? 'opacity-30 scale-95 z-0' : 'opacity-100 scale-100 z-10'}
              `}
            >
              <Thumbnail 
                pdfDoc={pdfDoc}
                page={page}
                onToggle={() => onToggleSelection(page.id)}
                onRotateLeft={(e) => { e.stopPropagation(); onRotateIndividual(page.id, 'left'); }}
                onRotateRight={(e) => { e.stopPropagation(); onRotateIndividual(page.id, 'right'); }}
              />
            </div>
          ))}
        </div>

        {localPages.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <Trash2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p>All pages deleted. Reset to restore.</p>
          </div>
        )}
      </Container>
    </div>
  );
}

function Thumbnail({ 
  pdfDoc, 
  page,
  onToggle,
  onRotateLeft,
  onRotateRight
}: { 
  pdfDoc: any; 
  page: PageItem;
  onToggle: () => void;
  onRotateLeft: (e: React.MouseEvent) => void;
  onRotateRight: (e: React.MouseEvent) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { rootMargin: '250px' } 
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    async function renderPage() {
      if (!isVisible || !canvasRef.current || !pdfDoc || isRendered) return;
      
      try {
        const pdfPage = await pdfDoc.getPage(page.originalPageNum);
        if (!active) return;

        const viewport = pdfPage.getViewport({ scale: 0.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: context, viewport: viewport };
        renderTask = pdfPage.render(renderContext);
        await renderTask.promise;
        
        if (active) setIsRendered(true);
      } catch (err: any) {
        // Handle unmount cancellation
      }
    }

    renderPage();
    return () => { active = false; if (renderTask) renderTask.cancel(); };
  }, [pdfDoc, page.originalPageNum, isVisible, isRendered]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing group"
      onClick={onToggle}
    >
      <div className={`
        relative w-full aspect-[3/4] bg-white rounded-xl shadow-sm transition-all duration-300
        flex items-center justify-center overflow-hidden
        ${page.isSelected ? 'ring-4 ring-blue-500 shadow-md shadow-blue-500/20' : 'ring-1 ring-slate-200 group-hover:ring-blue-300 group-hover:shadow-md'}
      `}>
        
        {!isVisible && !isRendered && (
          <Loader2 className="w-5 h-5 text-slate-300 animate-spin absolute" />
        )}
        
        <canvas 
          ref={canvasRef} 
          className={`
            max-w-full max-h-full object-contain transition-all duration-300
            ${isRendered ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ transform: `rotate(${page.rotation}deg)` }}
        />
        
        {/* Hover Actions overlay */}
        <div className={`
          absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200
          flex flex-col items-center justify-center gap-3
        `}>
          <div className="flex items-center gap-2">
            <button 
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-sm transition-colors"
              onClick={onRotateLeft}
              title="Rotate Left"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-full shadow-sm transition-colors"
              onClick={onRotateRight}
              title="Rotate Right"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all cursor-move">
             <Maximize2 className="w-4 h-4 rotate-45" />
          </div>
        </div>

        {/* Selected Checkbox Overlay */}
        {page.isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-sm border-2 border-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
        
      </div>
      
      <div className="flex items-center justify-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md">
        <span className="text-xs font-semibold text-slate-600">
          Page {page.originalPageNum}
        </span>
      </div>
    </div>
  );
}
