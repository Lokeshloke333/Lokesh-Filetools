import React, { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { WatermarkConfig } from "@/lib/pdf/watermark";

interface PdfWatermarkPreviewProps {
  file: File;
  config: WatermarkConfig;
  imagePreviewUrl: string | null;
}

export function PdfWatermarkPreview({ file, config, imagePreviewUrl }: PdfWatermarkPreviewProps) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF once
  useEffect(() => {
    let active = true;
    async function loadPdf() {
      try {
        setLoading(true);
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (active) setPdfDoc(doc);
      } catch (err) {
        console.error("Preview load error", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPdf();
    return () => { active = false; if (pdfDoc) pdfDoc.destroy().catch(() => {}); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Render First Page
  useEffect(() => {
    let renderTask: any = null;
    let active = true;

    async function renderPage() {
      if (!pdfDoc || !canvasRef.current || !containerRef.current) return;
      try {
        const page = await pdfDoc.getPage(1); // Always preview page 1
        if (!active) return;
        
        // Render at full size, let CSS scale it down
        const viewport = page.getViewport({ scale: 1.0 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = { canvasContext: context, viewport: viewport };
        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        // Ignored
      }
    }

    renderPage();
    return () => { active = false; if (renderTask) renderTask.cancel(); };
  }, [pdfDoc]);

  // Determine flex alignment based on position
  let justify = "center";
  let align = "center";

  if (config.position.includes('left')) justify = "flex-start";
  if (config.position.includes('right')) justify = "flex-end";
  
  if (config.position.includes('top')) align = "flex-start";
  if (config.position.includes('bottom')) align = "flex-end";

  // For custom positioning, we use absolute padding offsets (mocking real coordinates)
  const isCustom = config.position === 'custom';

  return (
    <div className="w-full bg-slate-50/50 rounded-2xl border border-slate-200 overflow-hidden min-h-[500px] flex items-center justify-center p-6 relative">
      {loading ? (
        <div className="flex flex-col items-center gap-4 text-slate-500">
           <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
           <p className="font-medium">Generating Live Preview...</p>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="relative shadow-xl shadow-slate-900/10 rounded overflow-hidden max-w-full max-h-[70vh] flex items-center justify-center bg-white"
          style={{ aspectRatio: canvasRef.current ? `${canvasRef.current.width}/${canvasRef.current.height}` : 'auto' }}
        >
          {/* PDF Canvas */}
          <canvas ref={canvasRef} className="w-full h-full object-contain" />

          {/* Watermark Overlay Layer */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
               display: 'flex',
               padding: '20px', // Represents default padding in PDF
               justifyContent: isCustom ? 'flex-start' : justify,
               alignItems: isCustom ? 'flex-start' : align,
            }}
          >
            <div 
              style={{
                opacity: config.opacity / 100,
                transform: `rotate(${config.rotation}deg)`,
                transformOrigin: 'center',
                transition: 'all 0.1s ease-out',
                marginTop: isCustom ? `${config.customY}px` : 0,
                marginLeft: isCustom ? `${config.customX}px` : 0,
              }}
            >
              {config.type === 'text' ? (
                <div
                  style={{
                    color: config.color,
                    fontSize: `${config.fontSize}px`,
                    fontFamily: config.fontFamily === 'TimesRoman' ? '"Times New Roman", Times, serif' : 
                                config.fontFamily === 'Courier' ? '"Courier New", Courier, monospace' : 
                                'Arial, Helvetica, sans-serif',
                    fontWeight: config.isBold ? 'bold' : 'normal',
                    fontStyle: config.isItalic ? 'italic' : 'normal',
                    textDecoration: config.isUnderline ? 'underline' : 'none',
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    textShadow: '0px 0px 2px rgba(255,255,255,0.8)' // Subtle halo for visibility against dark PDFs
                  }}
                >
                  {config.text}
                </div>
              ) : (
                config.type === 'image' && imagePreviewUrl ? (
                  <img 
                    src={imagePreviewUrl} 
                    alt="Watermark Preview" 
                    style={{
                      transform: `scale(${config.imageScale / 100})`,
                      transformOrigin: 'center',
                      maxWidth: '500px', // Prevent massive images from breaking layout completely
                    }}
                  />
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
