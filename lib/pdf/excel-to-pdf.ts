import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions, TableCell, Style, Content, Margins } from 'pdfmake/interfaces';
import path from 'path';

export type ExcelToPdfOptions = {
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape' | 'auto';
  scaling: 'fit-page' | 'actual' | 'fit-width';
  margins: 'normal' | 'narrow' | 'wide';
};

// pdfmake fonts definition
const fonts = {
  Roboto: {
    normal: path.join(process.cwd(), 'public/fonts/Roboto-Regular.ttf'),
    bold: path.join(process.cwd(), 'public/fonts/Roboto-Medium.ttf'),
    italics: path.join(process.cwd(), 'public/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(process.cwd(), 'public/fonts/Roboto-BoldItalic.ttf')
  }
};

const argbToHex = (argb: string): string => {
  if (!argb) return '#FFFFFF';
  // argb is usually FF000000 where FF is alpha. We just take the last 6 chars.
  if (argb.length === 8) {
    return `#${argb.substring(2)}`;
  }
  return `#${argb}`;
};

export async function convertExcelToPdf(
  file: File, 
  options: ExcelToPdfOptions
): Promise<{ pdfBytes: Uint8Array; worksheetCount: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);

  let pageSize = options.pageSize;
  let pageOrientation = options.orientation === 'auto' ? 'portrait' : options.orientation;
  
  const marginSizeMap: Record<string, Margins> = {
    normal: [40, 40, 40, 40],
    narrow: [20, 20, 20, 20],
    wide: [70, 70, 70, 70],
  };
  const pageMargins = marginSizeMap[options.margins] || marginSizeMap['normal'];

  const content: Content[] = [];
  const styles: Record<string, Style> = {
    defaultStyle: { fontSize: 10 }
  };

  const worksheets = workbook.worksheets;

  for (let wsIdx = 0; wsIdx < worksheets.length; wsIdx++) {
    const worksheet = worksheets[wsIdx];
    const rowCount = worksheet.rowCount;
    if (rowCount === 0) continue;

    // Add Worksheet Title
    content.push({
      text: worksheet.name,
      fontSize: 16,
      bold: true,
      margin: [0, 0, 0, 10],
      pageBreak: wsIdx > 0 ? 'before' : undefined
    });

    // Calculate Column Widths
    const tableWidths: (number | 'auto' | '*')[] = [];
    const numCols = worksheet.columnCount;
    
    // Total usable width in points (A4 portrait = 595.28, minus margins)
    const baseWidth = pageSize === 'A4' ? 595.28 : 612;
    const contentWidth = baseWidth - (pageMargins[0] as number) - (pageMargins[2] as number);

    for (let i = 1; i <= numCols; i++) {
      const col = worksheet.getColumn(i);
      // Excel width is approx characters, pdfmake points
      let width: number | 'auto' | '*' = 'auto';
      
      if (options.scaling === 'fit-width' || options.scaling === 'fit-page') {
         width = '*'; // let pdfmake distribute space
      } else if (col.width) {
         width = col.width * 6; // Rough conversion from excel char width to points
      }
      tableWidths.push(width);
    }

    // Build Table Body
    const tableBody: TableCell[][] = [];

    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      const rowCells: TableCell[] = [];
      
      for (let colNum = 1; colNum <= numCols; colNum++) {
        const cell = row.getCell(colNum);
        
        let cellText = '';
        if (cell.value !== null && cell.value !== undefined) {
           if (typeof cell.value === 'object' && 'formula' in cell.value) {
             cellText = (cell.value as any).result?.toString() || '';
           } else if (typeof cell.value === 'object' && 'richText' in cell.value) {
             cellText = (cell.value as any).richText.map((rt: any) => rt.text).join('');
           } else {
             cellText = cell.value.toString();
           }
        }

        // Handle basic styling
        let fillColor: string | undefined = undefined;
        if (cell.fill && cell.fill.type === 'pattern' && cell.fill.fgColor) {
           fillColor = argbToHex(cell.fill.fgColor.argb || '');
        }

        let isBold = false;
        let isItalic = false;
        let fontColor = '#000000';
        let fontSize = 10;

        if (cell.font) {
           isBold = !!cell.font.bold;
           isItalic = !!cell.font.italic;
           if (cell.font.color && cell.font.color.argb) fontColor = argbToHex(cell.font.color.argb);
           if (cell.font.size) fontSize = cell.font.size;
        }

        let alignment: 'left' | 'center' | 'right' | 'justify' = 'left';
        if (cell.alignment && cell.alignment.horizontal) {
           if (cell.alignment.horizontal === 'center') alignment = 'center';
           if (cell.alignment.horizontal === 'right') alignment = 'right';
           if (cell.alignment.horizontal === 'justify') alignment = 'justify';
        }

        rowCells.push({
           text: cellText,
           fillColor,
           bold: isBold,
           italics: isItalic,
           color: fontColor,
           fontSize: fontSize,
           alignment,
           // Basic borders - pdfmake defaults to drawing borders everywhere if not specified, which matches Excel's default "all borders" appearance when printed if gridlines are on.
        });
      }
      tableBody.push(rowCells);
    });

    if (tableBody.length > 0) {
      content.push({
        table: {
          widths: tableWidths,
          body: tableBody,
          dontBreakRows: true, // Try not to split a row across a page
        },
        layout: {
          // Subtle grey borders mimicking Excel gridlines
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#d3d3d3',
          vLineColor: () => '#d3d3d3',
          paddingLeft: () => 4,
          paddingRight: () => 4,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        }
      });
    }
  }

  if (content.length === 0) {
    throw new Error("No visible worksheets found or workbook is empty.");
  }

  const docDefinition: TDocumentDefinitions = {
    pageSize: pageSize as any,
    pageOrientation: pageOrientation as any,
    pageMargins: pageMargins,
    content: content,
    styles: styles,
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10
    }
  };

  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  // Buffer the stream
  const chunks: any[] = [];
  return new Promise((resolve, reject) => {
    pdfDoc.on('data', chunk => chunks.push(chunk));
    pdfDoc.on('end', () => {
      const result = Buffer.concat(chunks);
      resolve({ pdfBytes: new Uint8Array(result), worksheetCount: worksheets.length });
    });
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}
