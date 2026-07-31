export async function getPdfPageCount(file: File): Promise<number | undefined> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { PDFDocument } = await import('pdf-lib');
    // Use ignoreEncryption to at least extract page counts from some encrypted files
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error("Error reading PDF page count:", error);
    return undefined;
  }
}

export function parsePageRanges(rangeStr: string, maxPages: number): number[] {
  const pages: Set<number> = new Set();
  const parts = rangeStr.split(",").map((p) => p.trim());

  for (const part of parts) {
    if (!part) continue;
    
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
      
      if (!isNaN(start) && !isNaN(end)) {
        if (start < 1) start = 1;
        if (end > maxPages) end = maxPages;
        if (start <= end) {
          for (let i = start; i <= end; i++) {
            pages.add(i);
          }
        }
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
