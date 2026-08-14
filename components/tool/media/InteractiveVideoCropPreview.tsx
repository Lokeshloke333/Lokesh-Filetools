"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X, Video } from "lucide-react";

export interface InteractiveVideoCropPreviewProps {
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

export function InteractiveVideoCropPreview({ file, onClear, aspectRatio, onCropChange }: InteractiveVideoCropPreviewProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Re-center crop when aspect ratio changes
  useEffect(() => {
    if (videoRef.current && isVideoLoaded && aspectRatio) {
      // Use the client/rendered dimensions for react-image-crop math, not intrinsic dimensions
      // because react-image-crop overlays the DOM element.
      const width = videoRef.current.clientWidth;
      const height = videoRef.current.clientHeight;
      if (width > 0 && height > 0) {
         const newCrop = centerAspectCrop(width, height, aspectRatio);
         setCrop(newCrop);
      }
    }
  }, [aspectRatio, isVideoLoaded]);

  const onVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setIsVideoLoaded(true);
    if (aspectRatio) {
      const width = e.currentTarget.clientWidth;
      const height = e.currentTarget.clientHeight;
      if (width > 0 && height > 0) {
         setCrop(centerAspectCrop(width, height, aspectRatio));
      }
    } else {
      // Default free crop: full area
      setCrop({
        unit: "%",
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
    }
  };

  // Convert rendered crop to actual video pixel crop
  useEffect(() => {
    if (completedCrop && videoRef.current) {
      const videoElement = videoRef.current;
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0 || videoElement.clientWidth === 0 || videoElement.clientHeight === 0) {
         return;
      }
      
      const scaleX = videoElement.videoWidth / videoElement.clientWidth;
      const scaleY = videoElement.videoHeight / videoElement.clientHeight;

      const actualCrop = {
        x: Math.max(0, Math.round(completedCrop.x * scaleX)),
        y: Math.max(0, Math.round(completedCrop.y * scaleY)),
        width: Math.max(2, Math.round(completedCrop.width * scaleX)),
        height: Math.max(2, Math.round(completedCrop.height * scaleY)),
      };

      // Force even numbers for width and height to prevent FFmpeg libx264 errors
      actualCrop.width = actualCrop.width % 2 !== 0 ? actualCrop.width - 1 : actualCrop.width;
      actualCrop.height = actualCrop.height % 2 !== 0 ? actualCrop.height - 1 : actualCrop.height;

      // Ensure we don't exceed video boundaries due to rounding
      actualCrop.width = Math.min(actualCrop.width, videoElement.videoWidth - actualCrop.x);
      actualCrop.height = Math.min(actualCrop.height, videoElement.videoHeight - actualCrop.y);

      onCropChange(actualCrop);
    } else {
      onCropChange(null);
    }
  }, [completedCrop, onCropChange]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col group">
      
      {/* Top Bar with Filename and Clear Button */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {file.name && (
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200/50 text-sm font-medium text-slate-700 pointer-events-auto max-w-[70%] truncate">
            {file.name}
          </div>
        )}
        <button 
          onClick={onClear}
          className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full shadow-sm backdrop-blur-md transition-colors text-slate-500 pointer-events-auto ml-auto"
          title="Remove Video"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 w-full relative overflow-hidden flex items-center justify-center bg-slate-900">
        {!file.preview ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Video className="w-16 h-16 mb-4 opacity-50" />
            <p className="font-medium">No video loaded</p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full max-h-full flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src={file.preview}
                onLoadedMetadata={onVideoLoad}
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="max-w-full max-h-full pointer-events-auto block"
                style={{ objectFit: 'contain' }}
              />
            </ReactCrop>
          </div>
        )}
      </div>
    </div>
  );
}
