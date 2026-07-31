"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface DocumentViewerProps {
  pdfUrl: string;
  pageNumber: number;
}

export function DocumentViewer({ pdfUrl, pageNumber }: DocumentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    let renderTask: any = null;
    let isMounted = true;

    const renderPage = async () => {
      try {
        setIsRendering(true);
        setRenderError(false);

        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
        const pdf = await loadingTask.promise;
        
        // Ensure page number is valid
        const validPageNum = Math.min(Math.max(1, pageNumber), pdf.numPages);
        const page = await pdf.getPage(validPageNum);

        if (!isMounted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Base scale, will be responsive via CSS
        const viewport = page.getViewport({ scale: 2.0 });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Set white background
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext: any = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;

        if (isMounted) {
          setIsRendering(false);
        }
      } catch (err: any) {
        if (err?.name === 'RenderingCancelledException') return;
        console.error("Error rendering PDF page:", err);
        if (isMounted) setRenderError(true);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfUrl, pageNumber]);

  return (
    <div className="relative w-full aspect-[1/1.414] bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
      {isRendering && !renderError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 z-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <span className="text-slate-500 font-medium text-sm">Rendering...</span>
        </div>
      )}
      
      {renderError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 p-6 text-center">
          <span className="text-red-500 font-medium text-sm">Failed to render preview</span>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className={`w-full h-full object-contain transition-opacity duration-500 ${isRendering ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
