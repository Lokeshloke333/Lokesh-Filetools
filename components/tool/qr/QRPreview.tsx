"use client";

import React, { useRef, useState } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Copy, CheckCircle2, FileType2, Image as ImageIcon } from "lucide-react";
import { QRSettings } from "./types";
import { PDFDocument } from "pdf-lib";

interface QRPreviewProps {
  value: string;
  settings: QRSettings;
}

export function QRPreview({ value, settings }: QRPreviewProps) {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getQRProps = () => {
    let logoW = settings.logoSize * (settings.size / 100);
    let logoH = settings.logoSize * (settings.size / 100);

    if (settings.logoWidth && settings.logoHeight) {
      const aspect = settings.logoWidth / settings.logoHeight;
      if (aspect > 1) {
        logoH = logoW / aspect;
      } else {
        logoW = logoH * aspect;
      }
    }

    return {
      value: value || "https://fileinator.com",
      size: settings.size,
      fgColor: settings.fgColor,
      bgColor: settings.bgColor,
      level: settings.level,
      marginSize: settings.margin,
      imageSettings: settings.logo ? {
        src: settings.logo,
        width: logoW,
        height: logoH,
        excavate: true,
      } : undefined
    };
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const item = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([item]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPNG = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    downloadFile(url, "qrcode.png");
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, "qrcode.svg");
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    if (!canvasRef.current) return;
    try {
      const pngUrl = canvasRef.current.toDataURL("image/png");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([settings.size + 100, settings.size + 100]);
      const pngImage = await pdfDoc.embedPng(pngUrl);
      
      page.drawImage(pngImage, {
        x: 50,
        y: 50,
        width: settings.size,
        height: settings.size,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      downloadFile(url, "qrcode.pdf");
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center sticky top-24">
      <h2 className="text-lg font-bold text-slate-800 mb-6 w-full text-left">Preview</h2>
      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 relative group flex items-center justify-center">
        <QRCodeSVG 
          {...getQRProps()}
          ref={svgRef}
          className="w-full h-full max-w-[250px] max-h-[250px] aspect-square transition-all"
        />
        {/* Hidden canvas for PNG/PDF generation */}
        <div className="hidden">
          <QRCodeCanvas {...getQRProps()} ref={canvasRef} />
        </div>

        <button 
          onClick={handleCopy}
          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Copy Image"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <div className="w-full space-y-3">
        <Button 
          onClick={handleDownloadPNG} 
          className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20"
        >
          <ImageIcon className="w-4 h-4 mr-2" /> Download PNG
        </Button>
        <div className="flex gap-3">
          <Button 
            onClick={handleDownloadSVG} 
            variant="outline"
            className="flex-1 h-12 rounded-xl text-sm font-semibold bg-white border-slate-200"
          >
            <FileType2 className="w-4 h-4 mr-2" /> SVG
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            variant="outline"
            className="flex-1 h-12 rounded-xl text-sm font-semibold bg-white border-slate-200"
          >
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
