"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ImagePreview } from "@/components/image/ImagePreview";

export interface InteractiveCropPreviewProps {
  file: File & { preview?: string };
  onClear: () => void;
  aspectRatio: number | undefined; // undefined = free crop
  onCropChange: (crop: { x: number; y: number; width: number; height: number } | null) => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function InteractiveCropPreview({ file, onClear, aspectRatio, onCropChange }: InteractiveCropPreviewProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  // When aspect ratio changes, re-center crop
  useEffect(() => {
    if (imgRef.current && aspectRatio) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, aspectRatio);
      setCrop(newCrop);
      // We don't have completedCrop yet, it will trigger onComplete
    }
  }, [aspectRatio]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspectRatio) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  };

  // Convert rendered crop to actual image pixel crop
  useEffect(() => {
    if (completedCrop && imgRef.current) {
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const actualCrop = {
        x: Math.round(completedCrop.x * scaleX),
        y: Math.round(completedCrop.y * scaleY),
        width: Math.round(completedCrop.width * scaleX),
        height: Math.round(completedCrop.height * scaleY),
      };

      // Only fire if valid
      if (actualCrop.width > 0 && actualCrop.height > 0) {
        onCropChange(actualCrop);
      } else {
        onCropChange(null);
      }
    } else {
      onCropChange(null);
    }
  }, [completedCrop, onCropChange]);

  const handleReset = () => {
    setScale(1);
    if (imgRef.current) {
      if (aspectRatio) {
        setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, aspectRatio));
      } else {
        setCrop(undefined);
        setCompletedCrop(undefined);
      }
    }
  };

  return (
    <ImagePreview 
      image={file.preview || null}
      onClear={onClear}
      zoom={scale}
      onZoomChange={setScale}
      fileName={file.name}
    >
      {file.preview && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          className="max-w-full max-h-full"
        >
          <img
            ref={imgRef}
            alt="Crop preview boundary"
            src={file.preview}
            onLoad={onImageLoad}
            className="max-w-full max-h-full object-contain opacity-0 pointer-events-none select-none"
            style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
          />
        </ReactCrop>
      )}
    </ImagePreview>
  );
}
