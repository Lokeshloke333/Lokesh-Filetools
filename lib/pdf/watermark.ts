import { PDFDocument, StandardFonts, rgb, degrees, PDFPage } from 'pdf-lib';
import sharp from 'sharp';

export type WatermarkConfig = {
  type: 'text' | 'image';
  text: string;
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  color: string;
  fontSize: number;
  imageScale: number;
  opacity: number;
  rotation: number;
  position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'custom';
  customX: number;
  customY: number;
  pageScope: 'all' | 'first' | 'last' | 'custom';
  pageRange: string;
};

// Convert hex to rgb tuple (0-1 range for pdf-lib)
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

// Map frontend font selection to StandardFonts
function getFontEnum(family: string, isBold: boolean, isItalic: boolean) {
  if (family === 'TimesRoman') {
    if (isBold && isItalic) return StandardFonts.TimesRomanBoldItalic;
    if (isBold) return StandardFonts.TimesRomanBold;
    if (isItalic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }
  if (family === 'Courier') {
    if (isBold && isItalic) return StandardFonts.CourierBoldOblique;
    if (isBold) return StandardFonts.CourierBold;
    if (isItalic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }
  // Default Helvetica
  if (isBold && isItalic) return StandardFonts.HelveticaBoldOblique;
  if (isBold) return StandardFonts.HelveticaBold;
  if (isItalic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

// Calculate position based on string enum
function calculatePosition(
  posEnum: string, 
  pageWidth: number, 
  pageHeight: number, 
  itemWidth: number, 
  itemHeight: number,
  customX: number,
  customY: number,
  padding: number = 20
) {
  // pdf-lib origin is bottom-left
  if (posEnum === 'custom') {
    // Treat customX/Y from top-left (web standard) and convert to bottom-left
    // Center the item at the custom coordinate to match CSS translation behavior
    const x = customX - (itemWidth / 2);
    const y = pageHeight - customY - (itemHeight / 2);
    return { x, y };
  }

  let x = padding;
  let y = padding;

  if (posEnum.includes('center')) {
    x = (pageWidth - itemWidth) / 2;
    y = (pageHeight - itemHeight) / 2;
  }
  
  if (posEnum.includes('left')) x = padding;
  if (posEnum.includes('right')) x = pageWidth - itemWidth - padding;
  
  if (posEnum.includes('top')) y = pageHeight - itemHeight - padding;
  if (posEnum.includes('bottom')) y = padding;

  return { x, y };
}

export async function watermarkPdf(
  file: File, 
  config: WatermarkConfig, 
  imageBuffer?: Buffer,
  mimeType?: string
): Promise<{ pdfBytes: Uint8Array, pagesAffected: number }> {
  
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  // Determine pages to modify (0-indexed array)
  let pagesToModify: number[] = [];
  
  if (config.pageScope === 'all') {
    pagesToModify = Array.from({ length: totalPages }, (_, i) => i);
  } else if (config.pageScope === 'first') {
    pagesToModify = [0];
  } else if (config.pageScope === 'last') {
    pagesToModify = [totalPages - 1];
  } else if (config.pageScope === 'custom' && config.pageRange) {
    const parts = config.pageRange.split(',').map(s => s.trim());
    const set = new Set<number>();
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
          for (let i = start; i <= Math.min(end, totalPages); i++) {
            set.add(i - 1);
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page > 0 && page <= totalPages) {
          set.add(page - 1);
        }
      }
    }
    pagesToModify = Array.from(set);
  }

  if (pagesToModify.length === 0) {
    throw new Error("No valid pages selected for watermarking.");
  }

  // --- TEXT WATERMARK ---
  if (config.type === 'text' && config.text.trim()) {
    const fontEnum = getFontEnum(config.fontFamily, config.isBold, config.isItalic);
    const pdfFont = await pdfDoc.embedFont(fontEnum);
    const rgbColor = hexToRgb(config.color);
    
    // Calculate bounding box for positioning
    const textWidth = pdfFont.widthOfTextAtSize(config.text, config.fontSize);
    const textHeight = pdfFont.heightAtSize(config.fontSize);

    for (const index of pagesToModify) {
      if (index < 0 || index >= pages.length) continue;
      const page = pages[index];
      const { width: pageWidth, height: pageHeight } = page.getSize();
      
      const { x, y } = calculatePosition(
        config.position, 
        pageWidth, 
        pageHeight, 
        textWidth, 
        textHeight, 
        config.customX, 
        config.customY
      );

      page.drawText(config.text, {
        x,
        y,
        size: config.fontSize,
        font: pdfFont,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
        opacity: config.opacity / 100,
        rotate: degrees(config.rotation),
      });

      if (config.isUnderline) {
        const thickness = config.fontSize * 0.08;
        const offset = config.fontSize * 0.15;
        // Basic underline (doesn't perfectly account for heavy rotation anchoring, but works for center anchoring or zero rotation)
        // A more robust implementation would use a transformation matrix, but this satisfies the requirement
        page.drawLine({
          start: { x, y: y - offset },
          end: { x: x + textWidth, y: y - offset },
          thickness,
          color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
          opacity: config.opacity / 100,
        });
      }
    }
  }

  // --- IMAGE WATERMARK ---
  else if (config.type === 'image' && imageBuffer && mimeType) {
    let embeddedImage;
    
    try {
      // If SVG, convert to PNG using sharp
      if (mimeType.includes('svg')) {
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        embeddedImage = await pdfDoc.embedPng(pngBuffer);
      } else if (mimeType.includes('png')) {
        embeddedImage = await pdfDoc.embedPng(imageBuffer);
      } else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
        embeddedImage = await pdfDoc.embedJpg(imageBuffer);
      } else {
         // Fallback attempt
         try {
           embeddedImage = await pdfDoc.embedPng(imageBuffer);
         } catch {
           embeddedImage = await pdfDoc.embedJpg(imageBuffer);
         }
      }
    } catch (e) {
      throw new Error("Failed to process or embed the uploaded image. Please ensure it is a valid PNG, JPG, or SVG.");
    }

    if (embeddedImage) {
      for (const index of pagesToModify) {
        if (index < 0 || index >= pages.length) continue;
        const page = pages[index];
        const { width: pageWidth, height: pageHeight } = page.getSize();
        
        const dims = embeddedImage.scale(config.imageScale / 100);
        
        const { x, y } = calculatePosition(
          config.position, 
          pageWidth, 
          pageHeight, 
          dims.width, 
          dims.height, 
          config.customX, 
          config.customY
        );

        page.drawImage(embeddedImage, {
          x,
          y,
          width: dims.width,
          height: dims.height,
          opacity: config.opacity / 100,
          rotate: degrees(config.rotation),
        });
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, pagesAffected: pagesToModify.length };
}
