export interface PdfFileInfo {
  file: File;
  id: string; // Unique ID for reordering list
  pageCount?: number;
  error?: string;
}

export interface PdfMergeResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalPageCount: number;
}

export type PdfSplitMode = "every_page" | "ranges" | "extract";

export interface PdfSplitResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalGeneratedFiles: number;
}

export type PdfCompressionLevel = "low" | "medium" | "high";

export interface PdfCompressResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
}

export interface PdfUnlockResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
}

export interface PdfRotateResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalPageCount: number;
}

export interface PdfDeleteResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  totalDeleted: number;
  totalRemaining: number;
}

export interface PdfOrganizeResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  originalPageCount: number;
  finalPageCount: number;
}

export interface PdfWatermarkResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  pagesAffected: number;
  watermarkType: string;
}

export interface PdfExcelResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  worksheetCount: number;
}

export interface PdfToExcelResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  worksheetCount: number;
  tablesDetected: number;
}

export interface PdfPptResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  slideCount: number;
}

export interface PdfToPptResult {
  url: string;
  filename: string;
  originalSize: number;
  processedSize: number;
  slideCount: number;
}

