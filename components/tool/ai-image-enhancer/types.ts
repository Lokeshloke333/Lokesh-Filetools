export interface EnhancerSettings {
  brightness: number; // 0 to 200 (100 is default)
  contrast: number;   // 0 to 200 (100 is default)
  saturation: number; // 0 to 200 (100 is default)
  vibrance: number;   // 0 to 100 (0 is default)
  sharpen: number;    // 0 to 100 (0 is default)
  denoise: number;    // 0 to 100 (0 is default)
}

export const DEFAULT_ENHANCER_SETTINGS: EnhancerSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  vibrance: 0,
  sharpen: 0,
  denoise: 0
};

export interface ImageItem {
  id: string;
  file: File;
  originalSrc: string;
  name: string;
}
