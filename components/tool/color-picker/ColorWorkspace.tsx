"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadArea } from "@/components/tool/UploadArea";
import { Button } from "@/components/ui/button";
import { Droplet, MousePointer2, X } from "lucide-react";
import { rgbToHex } from "./types";

interface ColorWorkspaceProps {
  imageSrc: string | null;
  onImageUpload: (src: string) => void;
  onColorSelect: (hex: string) => void;
  onClear: () => void;
}

export function ColorWorkspace({ imageSrc, onImageUpload, onColorSelect, onClear }: ColorWorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isEyeDropperSupported, setIsEyeDropperSupported] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  useEffect(() => {
    if ('EyeDropper' in window) {
      setIsEyeDropperSupported(true);
    }
  }, []);

  useEffect(() => {
    if (imageSrc && canvasRef.current && imageRef.current) {
      const img = imageRef.current;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
      };
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isPicking && isEyeDropperSupported) return;

    if (!canvasRef.current || !imageRef.current) return;
    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = img.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      onColorSelect(hex);
      if (!isEyeDropperSupported) {
        setIsPicking(false);
      }
    } catch (err) {
      console.error("Could not read pixel data, possibly due to CORS", err);
    }
  };

  const startEyeDropper = async () => {
    if (isEyeDropperSupported) {
      try {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        onColorSelect(result.sRGBHex);
      } catch (e) {
        console.log('EyeDropper cancelled or failed', e);
      }
    } else {
      setIsPicking(true);
    }
  };

  if (!imageSrc) {
    return (
      <UploadArea 
        acceptedFormats="JPG/JPEG, PNG, WebP"
        maxSizeMB={20}
        onFileSelect={(file) => {
          const reader = new FileReader();
          reader.onload = (e) => onImageUpload(e.target?.result as string);
          reader.readAsDataURL(file);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative h-full min-h-[400px]">
      <div className="relative flex-1 bg-slate-50 flex items-center justify-center p-4 overflow-hidden group">
        <img 
          ref={imageRef}
          src={imageSrc} 
          alt="Uploaded for color picking" 
          className={`max-w-full max-h-[500px] object-contain rounded-lg shadow-sm transition-all ${isPicking && !isEyeDropperSupported ? 'cursor-crosshair' : ''}`}
          onClick={handleImageClick}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Floating actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="secondary" size="icon" className="rounded-xl bg-white/90 backdrop-blur shadow-sm hover:bg-red-50 hover:text-red-600 text-slate-600" onClick={onClear}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <Button 
            size="lg" 
            className={`rounded-2xl shadow-lg transition-all ${isPicking && !isEyeDropperSupported ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
            onClick={startEyeDropper}
          >
            {isPicking && !isEyeDropperSupported ? (
              <>
                <MousePointer2 className="w-5 h-5 mr-2 animate-bounce" />
                Click image to pick color
              </>
            ) : (
              <>
                <Droplet className="w-5 h-5 mr-2" />
                Pick a Color
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
