import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs/promises";
import path from "path";

export type PptToPdfOptions = {
  pageSize: 'A4' | 'Letter' | 'Match Slide Size';
  orientation: 'Portrait' | 'Landscape' | 'Auto';
  slidesPerPage: '1' | '2' | '4' | '6';
  includeNotes: boolean;
};

export class PptExtractionError extends Error {
  constructor(message: string, public code: 'CORRUPTED' | 'ENCRYPTED' | 'UNKNOWN') {
    super(message);
    this.name = 'PptExtractionError';
  }
}

/**
 * Mocks the PPT to PDF conversion for V1.
 * In a real production environment, this would proxy the file buffer to an external 
 * microservice (like Gotenberg or CloudConvert) and stream back the PDF binary.
 * 
 * For now, this parses the configuration, creates a valid PDF document matching
 * the requested layout options, and returns it.
 */
export async function convertPptToPdf(
  fileBuffer: Buffer,
  filename: string,
  options: PptToPdfOptions
): Promise<{ pdfBytes: Uint8Array; slideCount: number }> {
  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFontBytes = await fs.readFile(path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf"));
    const font = await pdfDoc.embedFont(regularFontBytes);

    // Layout math (Points)
    let pageW = 841.89; // Default A4 Landscape width
    let pageH = 595.28; // Default A4 Landscape height

    if (options.pageSize === 'Letter') {
      pageW = 792;
      pageH = 612;
    }

    if (options.orientation === 'Portrait') {
      const temp = pageW;
      pageW = pageH;
      pageH = temp;
    }

    // Mock extraction of slides (we'll just pretend there are 12 slides)
    const simulatedSlideCount = Math.min(12, Math.max(1, Math.floor(fileBuffer.length / 50000) || 4));
    
    const slidesPerPage = parseInt(options.slidesPerPage, 10);
    const totalPages = Math.ceil(simulatedSlideCount / slidesPerPage);

    for (let p = 0; p < totalPages; p++) {
      const page = pdfDoc.addPage([pageW, pageH]);
      
      page.drawText(`[Simulated PPT Conversion via Headless Microservice]`, {
        x: 40,
        y: pageH - 40,
        size: 14,
        font,
        color: rgb(0.2, 0.4, 0.8),
      });

      page.drawText(`Original File: ${filename}`, {
        x: 40,
        y: pageH - 70,
        size: 10,
        font,
      });

      page.drawText(`Layout: ${options.pageSize} - ${options.orientation}`, {
        x: 40,
        y: pageH - 90,
        size: 10,
        font,
      });

      page.drawText(`Slides Per Page: ${options.slidesPerPage}`, {
        x: 40,
        y: pageH - 110,
        size: 10,
        font,
      });

      page.drawText(`Speaker Notes: ${options.includeNotes ? 'Included' : 'Excluded'}`, {
        x: 40,
        y: pageH - 130,
        size: 10,
        font,
      });

      page.drawText(`Slides on this page: ${Math.min(slidesPerPage, simulatedSlideCount - (p * slidesPerPage))}`, {
        x: 40,
        y: pageH - 160,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Draw a box to represent the slide
      page.drawRectangle({
        x: 40,
        y: 40,
        width: pageW - 80,
        height: pageH - 220,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 1,
      });
      
      page.drawText(`Page ${p + 1} of ${totalPages}`, {
        x: pageW - 100,
        y: 20,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const pdfBytes = await pdfDoc.save();
    return { 
      pdfBytes, 
      slideCount: simulatedSlideCount
    };
  } catch (err) {
    throw new PptExtractionError("Failed to convert presentation. It may be corrupted.", 'CORRUPTED');
  }
}
