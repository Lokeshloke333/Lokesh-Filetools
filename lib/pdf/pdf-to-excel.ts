import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import ExcelJS from 'exceljs';

export class PdfExtractionError extends Error {
  constructor(message: string, public code: 'SCANNED_PDF' | 'NO_TABLES' | 'CORRUPTED' | 'UNKNOWN') {
    super(message);
    this.name = 'PdfExtractionError';
  }
}

type TextItemInfo = {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Y-tolerance for considering items in the same row
const ROW_TOLERANCE = 4;
// X-tolerance for considering items in the same column
const COL_TOLERANCE = 10;

export async function convertPdfToExcel(
  fileBuffer: Buffer
): Promise<{ excelBytes: Uint8Array; worksheetCount: number; tablesDetected: number }> {
  try {
    const uint8Array = new Uint8Array(fileBuffer);
    const pdfDocument = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    const numPages = pdfDocument.numPages;

    const workbook = new ExcelJS.Workbook();
    let tablesDetected = 0;
    let worksheetsCreated = 0;
    let totalTextItems = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const items: TextItemInfo[] = [];

      for (const item of textContent.items) {
        if ('str' in item && item.str.trim() !== '') {
          items.push({
            str: item.str.trim(),
            x: item.transform[4],
            y: item.transform[5],
            width: item.width,
            height: item.height,
          });
        }
      }

      totalTextItems += items.length;

      if (items.length < 5) {
         continue; // Likely an empty page or fully scanned page image
      }

      // 1. Group by Rows (Y coordinate)
      // PDF coordinates usually have (0,0) at bottom-left, so higher Y is higher on page.
      items.sort((a, b) => b.y - a.y);

      const rows: TextItemInfo[][] = [];
      let currentRow: TextItemInfo[] = [];
      let currentY = items[0].y;

      for (const item of items) {
        if (Math.abs(item.y - currentY) <= ROW_TOLERANCE) {
          currentRow.push(item);
        } else {
          // New row
          rows.push(currentRow);
          currentRow = [item];
          currentY = item.y;
        }
      }
      if (currentRow.length > 0) rows.push(currentRow);

      // We only care about rows that look like table rows (e.g. at least 2 items spread horizontally)
      const potentialTableRows = rows.filter(row => row.length > 1);

      if (potentialTableRows.length > 2) {
        tablesDetected++;
        worksheetsCreated++;
        const worksheet = workbook.addWorksheet(`Page ${pageNum}`);

        // Sort items in each row by X coordinate
        potentialTableRows.forEach(row => row.sort((a, b) => a.x - b.x));

        // Attempt to align columns
        // We'll collect all X coordinates to define global column boundaries
        const allX = potentialTableRows.flatMap(row => row.map(item => item.x));
        allX.sort((a, b) => a - b);

        const columnsX: number[] = [];
        let lastX = -999;
        for (const x of allX) {
          if (x - lastX > COL_TOLERANCE) {
            columnsX.push(x);
            lastX = x;
          }
        }

        // Build the grid
        for (let rIdx = 0; rIdx < potentialTableRows.length; rIdx++) {
          const rowItems = potentialTableRows[rIdx];
          const excelRow = worksheet.getRow(rIdx + 1);
          
          for (const item of rowItems) {
            // Find closest column index
            let bestColIdx = 0;
            let minDiff = Infinity;
            for (let cIdx = 0; cIdx < columnsX.length; cIdx++) {
              const diff = Math.abs(item.x - columnsX[cIdx]);
              if (diff < minDiff) {
                minDiff = diff;
                bestColIdx = cIdx;
              }
            }
            
            // Excel is 1-indexed
            const cell = excelRow.getCell(bestColIdx + 1);
            
            // Heuristic data casting
            const numVal = Number(item.str.replace(/,/g, ''));
            if (!isNaN(numVal) && item.str.trim() !== '') {
               cell.value = numVal;
               cell.alignment = { horizontal: 'right' };
            } else {
               cell.value = item.str;
            }
          }
          excelRow.commit();
        }

        // Auto-fit columns roughly
        worksheet.columns.forEach(column => {
          let maxLength = 0;
          column.eachCell!({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) maxLength = columnLength;
          });
          column.width = maxLength < 10 ? 10 : maxLength + 2;
        });
      }
    }

    if (totalTextItems < 15 && numPages > 0) {
       throw new PdfExtractionError(
         "This PDF appears to contain scanned pages or images without selectable text. OCR support is coming soon.", 
         'SCANNED_PDF'
       );
    }

    if (worksheetsCreated === 0) {
       throw new PdfExtractionError(
         "No structured tables were detected in this document. The heuristic engine requires aligned text rows to extract data.", 
         'NO_TABLES'
       );
    }

    const excelBuffer = await workbook.xlsx.writeBuffer();

    return { 
      excelBytes: new Uint8Array(excelBuffer), 
      worksheetCount: worksheetsCreated,
      tablesDetected 
    };
  } catch (err: any) {
    if (err instanceof PdfExtractionError) {
      throw err;
    }
    throw new PdfExtractionError("Failed to parse PDF document. It may be corrupted or encrypted.", 'CORRUPTED');
  }
}
