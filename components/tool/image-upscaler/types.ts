export type UpscaleFactor = 2 | 4;

export interface UpscaleSettings {
  scale: UpscaleFactor;
}

export interface ImageItem {
  id: string;
  file: File;
  originalSrc: string;
  name: string;
}

export interface UpscaleResult {
  id: string;
  resultSrc: string;
}
