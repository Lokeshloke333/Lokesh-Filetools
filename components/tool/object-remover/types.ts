export type ToolMode = 'brush' | 'erase' | 'pan';

export interface Point {
  x: number;
  y: number;
}

export interface BrushStroke {
  points: Point[];
  size: number;
  mode: 'brush' | 'erase';
}

export interface ImageItem {
  id: string;
  file: File;
  originalSrc: string;
  name: string;
}

export interface MaskState {
  strokes: BrushStroke[];
  // Used for undo/redo stack
}
