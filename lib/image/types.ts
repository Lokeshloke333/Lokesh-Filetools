/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProcessImageParams<T = any> {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  settings: T;
}

export interface ImageProcessingResult {
  buffer: Buffer;
  width: number;
  height: number;
  outputFormat: string;
  filename: string;
  message?: string;
}

export interface CompressSettings {
  quality: number;
  format: string; // 'WEBP', 'JPG', 'PNG', 'AVIF', 'ORIGINAL'
  stripMetadata: boolean;
  progressive: boolean;
}

// Scaffolding for future tools
export interface ResizeSettings {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  fit: "contain" | "cover" | "fill" | "inside" | "outside";
  format: string; // 'WEBP', 'JPG', 'PNG', 'AVIF', 'ORIGINAL'
}

export interface CropSettings {
  width: number;
  height: number;
  x: number;
  y: number;
  format: string; // 'WEBP', 'JPG', 'PNG', 'AVIF', 'ORIGINAL'
}

export interface RotateSettings {
  angle: number;
  background?: string;
  flip?: "horizontal" | "vertical" | "none";
  format: string;
}

export interface ConvertSettings {
  targetFormat: string;
  quality: number;
  stripMetadata: boolean;
}
