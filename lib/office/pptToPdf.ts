import { convertOfficeToPdfLocal } from "./libreoffice";
import { PDFDocument } from "pdf-lib";

export class PptExtractionError extends Error {
  constructor(message: string, public code: 'CORRUPTED' | 'ENCRYPTED' | 'UNKNOWN') {
    super(message);
    this.name = 'PptExtractionError';
  }
}

/**
 * Converts a PowerPoint presentation to a PDF using local LibreOffice Headless.
 * Also parses the resulting PDF to extract the exact slide/page count.
 * 
 * @param fileBuffer The original PowerPoint file buffer
 * @param filename The original filename (e.g. presentation.pptx)
 * @returns The generated PDF buffer and the slide count
 */
export async function convertPptToPdfLocal(
  fileBuffer: Buffer,
  filename: string
): Promise<{ pdfBytes: Uint8Array; slideCount: number }> {
  try {
    // Generate the PDF using LibreOffice
    const pdfBuffer = await convertOfficeToPdfLocal(fileBuffer, filename);
    
    // Parse the resulting PDF purely to extract the exact slide/page count
    const pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const slideCount = pdfDoc.getPageCount();

    return { 
      pdfBytes: new Uint8Array(pdfBuffer), 
      slideCount 
    };
  } catch (err: any) {
    if (err.message?.includes("LibreOffice")) {
       throw new PptExtractionError(err.message, 'UNKNOWN');
    }
    throw new PptExtractionError("Failed to convert presentation. It may be corrupted or encrypted.", 'CORRUPTED');
  }
}
