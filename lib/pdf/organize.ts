import { PDFDocument, degrees } from 'pdf-lib';

export type OrganizeOperation = {
  originalPageNum: number; // 1-indexed page number from the original file
  rotation: number; // cumulative rotation to apply (0, 90, 180, 270)
};

/**
 * Organizes PDF pages by extracting them in a specific order and applying rotations.
 * Returns the modified PDF as a Uint8Array.
 */
export async function organizePdfPages(file: File, operations: OrganizeOperation[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the original document
  const originalDoc = await PDFDocument.load(arrayBuffer);
  
  // Create a brand new empty document
  const newPdf = await PDFDocument.create();

  // Convert operations to 0-indexed indices for extraction
  const indicesToCopy = operations.map(op => op.originalPageNum - 1);
  
  // Copy all required pages in one batch (highly efficient)
  const copiedPages = await newPdf.copyPages(originalDoc, indicesToCopy);
  
  // Add them to the new document and apply rotations
  for (let i = 0; i < copiedPages.length; i++) {
    const page = copiedPages[i];
    const op = operations[i];
    
    // Calculate new rotation by combining existing rotation with requested rotation
    const currentRotation = page.getRotation().angle;
    const addedRotation = op.rotation || 0;
    const finalRotation = (currentRotation + addedRotation) % 360;
    
    page.setRotation(degrees(finalRotation));
    newPdf.addPage(page);
  }

  return await newPdf.save();
}
