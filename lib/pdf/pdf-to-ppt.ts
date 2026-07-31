import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import PptxGenJS from 'pptxgenjs';

export class PdfToPptError extends Error {
  constructor(message: string, public code: 'CORRUPTED' | 'SCANNED' | 'UNKNOWN') {
    super(message);
    this.name = 'PdfToPptError';
  }
}

type TextItemInfo = {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
};

/**
 * Converts PDF bytes to PPTX bytes by mapping PDF text coordinates to PPTX slides.
 * This is a spatial reconstruction engine. It does not extract vector shapes/images yet.
 */
export async function convertPdfToPpt(
  fileBuffer: Buffer
): Promise<{ pptxBytes: Uint8Array; slideCount: number }> {
  try {
    const uint8Array = new Uint8Array(fileBuffer);
    const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    const numPages = pdfDocument.numPages;

    const pres = new PptxGenJS();
    let totalTextItems = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const viewport = page.getViewport({ scale: 1.0 });
      
      const slide = pres.addSlide();
      
      // PowerPoint standard layout is 10 x 5.625 inches (16:9)
      // PDF viewport dimensions are in points (72 points = 1 inch).
      // Let's set slide size dynamically based on PDF page.
      // But pptxgenjs only allows global slide layout, not per-slide.
      // We will scale X and Y relative to a standard 10x5.625 slide.
      const pptWidth = 10;
      const pptHeight = 5.625;
      
      const pdfWidth = viewport.width;
      const pdfHeight = viewport.height;
      
      const scaleX = pptWidth / pdfWidth;
      const scaleY = pptHeight / pdfHeight;

      const items: TextItemInfo[] = [];

      for (const item of textContent.items) {
        if ('str' in item && item.str.trim() !== '') {
          // In PDF, Y is measured from bottom up. pptxgenjs measures Y from top down.
          const x = item.transform[4];
          const y = pdfHeight - item.transform[5] - item.height; 
          
          items.push({
            str: item.str,
            x: x,
            y: y,
            width: item.width,
            height: item.height,
            fontSize: Math.abs(item.transform[0]),
            fontName: item.fontName
          });
        }
      }

      totalTextItems += items.length;

      // Render text boxes
      for (const item of items) {
         const pptX = item.x * scaleX;
         const pptY = item.y * scaleY;
         const pptW = Math.max(item.width * scaleX, 1);
         const pptH = Math.max(item.height * scaleY, 0.5);
         const pptFontSize = Math.max(item.fontSize * 0.75, 6); // Convert points relative
         
         slide.addText(item.str, {
            x: pptX,
            y: pptY,
            w: pptW,
            h: pptH,
            fontSize: pptFontSize,
            color: '000000', // Default color, as we don't extract color in this basic impl
            valign: 'top',
            margin: 0,
         });
      }
    }

    if (totalTextItems < Math.min(10, numPages * 2) && numPages > 0) {
       throw new PdfToPptError(
         "This PDF appears to be a scanned document (contains no text layers). True conversion requires OCR, which is coming soon.", 
         'SCANNED'
       );
    }

    // Write to buffer
    const pptxBuffer = await pres.write({ outputType: 'nodebuffer' }) as Buffer;

    return { 
      pptxBytes: new Uint8Array(pptxBuffer), 
      slideCount: numPages
    };
  } catch (err: any) {
    // DEVELOPMENT LOGGING
    console.error("================ PDF PARSER ERROR ================");
    console.error("Parser: pdfjs-dist (legacy/build/pdf.mjs)");
    console.error("File Size:", fileBuffer.byteLength, "bytes");
    console.error("First 10 bytes:", Array.from(fileBuffer.subarray(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' '));
    console.error("Exact Failing Line: pdfjsLib.getDocument({ data: uint8Array }).promise or page.getTextContent()");
    console.error("Original Error Stack:", err?.stack || err);
    console.error("==================================================");

    if (err instanceof PdfToPptError) {
      throw err;
    }
    throw new PdfToPptError("Failed to parse PDF document. It may be corrupted or encrypted.", 'CORRUPTED');
  }
}
