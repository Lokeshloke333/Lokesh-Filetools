import { PDFDocument, degrees } from 'pdf-lib';

export interface RotateOptions {
  degrees: number;
  pageScope: 'all' | 'selected';
  pageSelection?: string; // e.g. "1,3,5-8"
}

/**
 * Parses a page selection string like "1,3,5-8" into an array of 0-indexed page numbers.
 * @param selection The selection string
 * @param maxPages The total number of pages in the PDF
 * @returns Set of 0-indexed page numbers to rotate
 */
export function parsePageSelection(selection: string, maxPages: number): Set<number> {
  const selectedPages = new Set<number>();
  
  if (!selection || !selection.trim()) {
    return selectedPages;
  }

  const parts = selection.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
        for (let i = start; i <= Math.min(end, maxPages); i++) {
          selectedPages.add(i - 1); // 0-indexed
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page > 0 && page <= maxPages) {
        selectedPages.add(page - 1); // 0-indexed
      }
    }
  }

  return selectedPages;
}

/**
 * Rotates pages in a PDF file.
 * Returns the rotated PDF as a Uint8Array.
 */
export async function rotatePdf(file: File, options: RotateOptions): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const maxPages = pages.length;

  let pagesToRotate: Set<number>;
  
  if (options.pageScope === 'all') {
    pagesToRotate = new Set(Array.from({ length: maxPages }, (_, i) => i));
  } else {
    pagesToRotate = parsePageSelection(options.pageSelection || "", maxPages);
    if (pagesToRotate.size === 0) {
      throw new Error("No valid pages selected for rotation.");
    }
  }

  for (const pageIndex of Array.from(pagesToRotate)) {
    if (pageIndex >= 0 && pageIndex < maxPages) {
      const page = pages[pageIndex];
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + options.degrees));
    }
  }

  return await pdfDoc.save();
}
