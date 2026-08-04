"use client";

import React, { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import { BarcodeSettings } from "./types";
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileType, FileText, AlertCircle, Printer } from "lucide-react";
import { toast } from "sonner";

interface BarcodePreviewProps {
  settings: BarcodeSettings;
}

export function BarcodePreview({ settings }: BarcodePreviewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous SVG content to avoid artifacts
    svgRef.current.innerHTML = "";

    try {
      JsBarcode(svgRef.current, settings.value || " ", {
        format: settings.format,
        width: settings.width,
        height: settings.height,
        displayValue: settings.displayValue,
        fontOptions: settings.fontOptions,
        font: settings.font,
        textAlign: settings.textAlign,
        textPosition: settings.textPosition,
        textMargin: settings.textMargin,
        fontSize: settings.fontSize,
        background: settings.background,
        lineColor: settings.lineColor,
        margin: settings.margin,
        valid: (valid) => {
          if (!valid) {
            setError(`Invalid data for format ${settings.format}`);
          }
        }
      });
      setError(null);
    } catch (e: any) {
      setError(e.message || "Error generating barcode");
    }
  }, [settings]);

  const downloadSVG = () => {
    if (!svgRef.current || error) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `barcode-${settings.format.toLowerCase()}.svg`);
  };

  const getCanvas = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      if (!svgRef.current || error) return reject("No SVG or error present");
      
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Add extra padding to canvas just in case, but jsbarcode already adds margin
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas);
        } else {
          reject("No 2d context");
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        reject("Failed to load SVG into Image");
        URL.revokeObjectURL(url);
      };
      img.src = url;
    });
  };

  const downloadPNG = async () => {
    try {
      const canvas = await getCanvas();
      const url = canvas.toDataURL("image/png");
      triggerDownload(url, `barcode-${settings.format.toLowerCase()}.png`);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadPDF = async () => {
    try {
      const canvas = await getCanvas();
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width + 40, canvas.height + 40]
      });

      pdf.addImage(imgData, "PNG", 20, 20, canvas.width, canvas.height);
      pdf.save(`barcode-${settings.format.toLowerCase()}.pdf`);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!svgRef.current || error) return;
    
    // Show helper message before opening print dialog
    toast.info("For the cleanest print, disable 'Headers and Footers' in your browser's print settings.", {
      duration: 5000,
      position: "top-center"
    });
    
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Get SVG and remove explicit width/height to let CSS handle the scaling while preserving aspect ratio
    const svgClone = svgRef.current.cloneNode(true) as SVGSVGElement;
    svgClone.removeAttribute("width");
    svgClone.removeAttribute("height");
    const svgData = new XMLSerializer().serializeToString(svgClone);

    const doc = iframe.contentWindow?.document;
    
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Barcode - Fileinator</title>
            <style>
              @page {
                size: auto;
                margin: 12mm;
              }
              html, body {
                margin: 0;
                padding: 0;
                background: white;
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .barcode-container {
                width: 75vw;
                max-width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              svg {
                width: 100%;
                height: auto;
                max-height: 80vh;
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              ${svgData}
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-8 relative overflow-hidden custom-scrollbar">
        
        {/* Print Button */}
        <div className="absolute top-4 right-4 z-10 print:hidden">
          <Button 
            variant="outline" 
            className="h-10 rounded-xl bg-white/80 backdrop-blur border-slate-200 text-slate-700 hover:bg-white shadow-sm transition-all"
            onClick={handlePrint}
            disabled={!!error}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10 bg-[length:20px_20px] print:hidden" />
        
        <div 
          id="barcode-print-area"
          className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-w-[200px] min-h-[150px] relative"
        >
          <svg ref={svgRef} className={error ? "opacity-20" : ""} />
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}
        </div>

      </div>

      <div className="p-5 border-t border-slate-100 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button 
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={downloadPNG}
            disabled={!!error}
          >
            <FileImage className="w-4 h-4 mr-2" />
            Download PNG
          </Button>
          
          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={downloadSVG}
            disabled={!!error}
          >
            <FileType className="w-4 h-4 mr-2" />
            Download SVG
          </Button>

          <Button 
            variant="outline"
            className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
            onClick={downloadPDF}
            disabled={!!error}
          >
            <FileText className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
