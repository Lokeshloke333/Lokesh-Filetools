import { PDFDocument } from 'pdf-lib';

/**
 * Deletes specified pages from a PDF file.
 * Returns the modified PDF as a Uint8Array.
 */
export async function deletePdfPages(file: File, pagesToDelete: Set<number>): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const maxPages = pdfDoc.getPageCount();

  if (pagesToDelete.size >= maxPages) {
    throw new Error("A PDF must contain at least one page.");
  }

  // Sort page indices in descending order so removing pages doesn't shift indices of remaining targets
  const sortedPagesToDelete = Array.from(pagesToDelete).sort((a, b) => b - a);

  for (const pageIndex of sortedPagesToDelete) {
    if (pageIndex >= 0 && pageIndex < maxPages) {
      pdfDoc.removePage(pageIndex);
    }
  }

  return await pdfDoc.save();
}
