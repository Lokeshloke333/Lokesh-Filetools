import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { TransformState, calculateBoundDimension } from "@/lib/image/imageTransform";
import { estimateOutputSize } from "@/lib/image/preview";

export interface PreviewConfig {
  file: File & { preview?: string };
  originalWidth?: number;
  originalHeight?: number;
}

export function useImagePreview(rawConfig: PreviewConfig | null) {
  // Memoize config to prevent infinite loops if the caller passes a new object literal every render
  const config = useMemo(() => rawConfig, [rawConfig?.file, rawConfig?.originalWidth, rawConfig?.originalHeight]);

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loadedWidth, setLoadedWidth] = useState<number>(0);
  const [loadedHeight, setLoadedHeight] = useState<number>(0);
  
  // Transform State
  const [transform, setTransform] = useState<TransformState>({
    scale: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
  });

  // Viewport State (Zoom/Pan handled by UI overlay usually, but keeping global zoom here)
  const [zoom, setZoom] = useState(1);

  // Resize State
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // Format & Quality state for estimation
  const [targetFormat, setTargetFormat] = useState<string>("ORIGINAL");
  const [quality, setQuality] = useState<number>(80);

  // Load image object
  useEffect(() => {
    if (!config || !config.file.preview) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setImage(null);
      return;
    }
    
    const img = new Image();
    img.src = config.file.preview;
    img.onload = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setImage(img);
      const w = config.originalWidth || img.width;
      const h = config.originalHeight || img.height;
      setLoadedWidth(w);
      setLoadedHeight(h);
      setTargetWidth(w);
      setTargetHeight(h);
      // Determine original format
      const type = config.file.type || "image/jpeg";
      setTargetFormat(type.split("/")[1]?.toUpperCase() || "JPG");
    };
  }, [config]);

  // Dimension Two-Way Binding
  const handleWidthChange = useCallback((newWidth: number) => {
    setTargetWidth(newWidth);
    if (maintainAspectRatio && loadedWidth && loadedHeight) {
      setTargetHeight(calculateBoundDimension(newWidth, 'width', loadedWidth, loadedHeight));
    }
  }, [maintainAspectRatio, loadedWidth, loadedHeight]);

  const handleHeightChange = useCallback((newHeight: number) => {
    setTargetHeight(newHeight);
    if (maintainAspectRatio && loadedWidth && loadedHeight) {
      setTargetWidth(calculateBoundDimension(newHeight, 'height', loadedWidth, loadedHeight));
    }
  }, [maintainAspectRatio, loadedWidth, loadedHeight]);

  // Reset transforms
  const resetTransform = useCallback(() => {
    setTransform({ scale: 1, rotation: 0, flipX: false, flipY: false });
    setZoom(1);
  }, []);

  // Estimations
  const estimatedSize = useMemo(() => {
    if (!config) return 0;
    
    const actualFormat = targetFormat === "ORIGINAL" 
      ? config.file.type.split('/')[1] || "jpeg"
      : targetFormat.toLowerCase();

    return estimateOutputSize(
      config.file.size,
      loadedWidth,
      loadedHeight,
      targetWidth || loadedWidth,
      targetHeight || loadedHeight,
      actualFormat,
      quality
    );
  }, [config, loadedWidth, loadedHeight, targetWidth, targetHeight, targetFormat, quality]);

  // Debounced Simulation for Compression & Format
  const [simulatedImageUrl, setSimulatedImageUrl] = useState<string | null>(null);
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If it's a format/quality combination that requires simulation (like lossy formats), simulate it.
    if (!image || !config) return;

    const actualFormat = targetFormat === "ORIGINAL" ? config.file.type.split('/')[1]?.toLowerCase() : targetFormat.toLowerCase();
    
    // Only simulate formats supported natively by browser canvas (.toBlob)
    const isSimulatable = actualFormat === "jpeg" || actualFormat === "jpg" || actualFormat === "webp";
    if (!isSimulatable) {
      setSimulatedImageUrl(null);
      return;
    }

    if (simulationTimeoutRef.current) {
      clearTimeout(simulationTimeoutRef.current);
    }

    // Debounce 150ms
    simulationTimeoutRef.current = setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        
        // Downscale for simulation if extremely large to maintain UI responsiveness
        const MAX_SIM_SIZE = 1920;
        let simWidth = loadedWidth;
        let simHeight = loadedHeight;
        
        if (simWidth > MAX_SIM_SIZE || simHeight > MAX_SIM_SIZE) {
          const ratio = Math.min(MAX_SIM_SIZE / simWidth, MAX_SIM_SIZE / simHeight);
          simWidth = Math.floor(simWidth * ratio);
          simHeight = Math.floor(simHeight * ratio);
        }

        canvas.width = simWidth;
        canvas.height = simHeight;
        const ctx = canvas.getContext("2d");
        
        if (!ctx) return;
        
        if (actualFormat === "jpeg" || actualFormat === "jpg") {
          ctx.fillStyle = "#ffffff"; // Flatten transparency
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(image, 0, 0, simWidth, simHeight);
        
        const mimeType = `image/${actualFormat === "jpg" ? "jpeg" : actualFormat}`;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setSimulatedImageUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
          }
        }, mimeType, quality / 100);
      } catch (err) {
        console.warn("Simulation failed, falling back to original image", err);
      }
    }, 150);

    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
    };
  }, [image, config, targetFormat, quality, loadedWidth, loadedHeight]);

  // Clean up simulated URL on unmount
  useEffect(() => {
    return () => {
      if (simulatedImageUrl) {
        URL.revokeObjectURL(simulatedImageUrl);
      }
    };
  }, [simulatedImageUrl]);

  return {
    image: simulatedImageUrl || image,
    transform,
    setTransform,
    zoom,
    setZoom,
    targetWidth,
    targetHeight,
    handleWidthChange,
    handleHeightChange,
    maintainAspectRatio,
    setMaintainAspectRatio,
    targetFormat,
    setTargetFormat,
    quality,
    setQuality,
    resetTransform,
    estimatedSize,
    originalSize: config?.file.size || 0,
    originalWidth: loadedWidth,
    originalHeight: loadedHeight,
  };
}
