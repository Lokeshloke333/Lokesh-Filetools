import React, { useRef, useEffect } from "react";
import { renderToCanvas, RenderOptions } from "@/lib/image/canvasRenderer";
import { TransformState } from "@/lib/image/imageTransform";

interface ImageCanvasProps {
  image: HTMLImageElement | null;
  transform?: TransformState;
  targetWidth?: number;
  targetHeight?: number;
  simulateFormat?: string;
  filter?: string;
  className?: string;
  zoom?: number;
}

export const ImageCanvas = React.forwardRef<HTMLCanvasElement, ImageCanvasProps>(
  ({ image, transform, targetWidth, targetHeight, simulateFormat, filter, className = "", zoom = 1 }, ref) => {
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const canvasRef = (ref as React.MutableRefObject<HTMLCanvasElement | null>) || internalRef;

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !image) return;

      let animationFrameId: number;

      // Debounce the render loop with requestAnimationFrame
      const render = () => {
        renderToCanvas({
          canvas,
          image,
          transform,
          simulateFormat,
          targetWidth,
          targetHeight,
          filter,
        });
      };

      animationFrameId = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }, [image, transform, targetWidth, targetHeight, simulateFormat, filter, canvasRef]);

    if (!image) {
      return null;
    }

    return (
      <div 
        className={`relative overflow-hidden flex items-center justify-center ${className}`}
        style={{
          // The container handles zooming so the canvas itself doesn't need to be redrawn
          // purely for UI zoom scaling.
        }}
      >
        <div 
          className="relative transition-transform duration-100 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Checkerboard background for transparency */}
          <div className="absolute inset-0 opacity-20 pointer-events-none rounded-md overflow-hidden" 
               style={{ 
                 backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', 
                 backgroundSize: '20px 20px', 
                 backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' 
               }}
          />
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain relative z-10 drop-shadow-md rounded-md"
            style={{
              // Ensure canvas scales nicely within flex containers
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      </div>
    );
  }
);

ImageCanvas.displayName = "ImageCanvas";
