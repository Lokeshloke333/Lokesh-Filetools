/* eslint-disable @typescript-eslint/no-explicit-any */
import { PDFDocument, rgb } from "pdf-lib";

export interface ImageToPdfOptions {
  pageSize: "A4" | "Letter" | "Legal" | "A3";
  orientation: "portrait" | "landscape";
  margins: "none" | "small" | "medium" | "large";
  imageFit: "fit" | "fill" | "original";
}

const PAGE_SIZES = {
  A4: [595.28, 841.89],
  Letter: [612.00, 792.00],
  Legal: [612.00, 1008.00],
  A3: [841.89, 1190.55],
};

const MARGIN_SIZES = {
  none: 0,
  small: 20,
  medium: 40,
  large: 72,
};

async function convertImageFileToJpegBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("Could not get canvas context"));
      }
      
      // Fill with white background (JPEG doesn't support transparency)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Use toBlob instead of toDataURL to avoid massive base64 strings and memory spikes
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          // Free canvas memory immediately
          canvas.width = 0;
          canvas.height = 0;
          if (!blob) return reject(new Error("Canvas to Blob conversion failed"));
          blob.arrayBuffer().then(resolve).catch(reject);
        },
        "image/jpeg",
        0.92
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion: " + file.name));
    };
    img.src = url;
  });
}

export async function convertImagesToPdf(
  files: File[],
  options: ImageToPdfOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Get base dimensions
  const baseSize = PAGE_SIZES[options.pageSize];
  const isLandscape = options.orientation === "landscape";
  const pageWidth = isLandscape ? baseSize[1] : baseSize[0];
  const pageHeight = isLandscape ? baseSize[0] : baseSize[1];
  const margin = MARGIN_SIZES[options.margins];

  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2;

  for (const file of files) {
    const type = file.type;
    let pdfImage;
    
    // First, try native pdf-lib embedding for supported formats
    if (type === "image/jpeg" || type === "image/jpg" || type === "image/png") {
      const arrayBuffer = await file.arrayBuffer();
      try {
        if (type === "image/png") {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }
      } catch (e) {
        // Fallback: If native embedding fails (e.g. malformed image), convert to JPEG via canvas
        console.warn(`Failed to natively embed ${file.name}, falling back to canvas conversion.`, e);
        const fallbackBuffer = await convertImageFileToJpegBuffer(file);
        pdfImage = await pdfDoc.embedJpg(fallbackBuffer);
      }
    } else {
      // For WebP, GIF, etc., convert directly to JPEG via canvas
      const convertedBuffer = await convertImageFileToJpegBuffer(file);
      pdfImage = await pdfDoc.embedJpg(convertedBuffer);
    }

    const imgDims = pdfImage.scale(1);
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    let drawWidth = imgDims.width;
    let drawHeight = imgDims.height;
    let drawX = margin;
    let drawY = margin;

    if (options.imageFit === "fit") {
      const scale = Math.min(
        availableWidth / imgDims.width,
        availableHeight / imgDims.height
      );
      drawWidth = imgDims.width * scale;
      drawHeight = imgDims.height * scale;
      drawX = margin + (availableWidth - drawWidth) / 2;
      drawY = margin + (availableHeight - drawHeight) / 2;
    } else if (options.imageFit === "fill") {
      const scale = Math.max(
        availableWidth / imgDims.width,
        availableHeight / imgDims.height
      );
      drawWidth = imgDims.width * scale;
      drawHeight = imgDims.height * scale;
      drawX = margin + (availableWidth - drawWidth) / 2;
      drawY = margin + (availableHeight - drawHeight) / 2;
    } else if (options.imageFit === "original") {
      drawX = margin + (availableWidth - drawWidth) / 2;
      drawY = margin + (availableHeight - drawHeight) / 2;
    }

    page.drawImage(pdfImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });

    // Mask for 'fill' and 'original' if they bleed into margins
    if (margin > 0 && (options.imageFit === "fill" || options.imageFit === "original")) {
      const bgColor = rgb(1, 1, 1);
      // Top margin
      page.drawRectangle({ x: 0, y: pageHeight - margin, width: pageWidth, height: margin, color: bgColor });
      // Bottom margin
      page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: margin, color: bgColor });
      // Left margin
      page.drawRectangle({ x: 0, y: margin, width: margin, height: pageHeight - 2 * margin, color: bgColor });
      // Right margin
      page.drawRectangle({ x: pageWidth - margin, y: margin, width: margin, height: pageHeight - 2 * margin, color: bgColor });
    }
  }

  return await pdfDoc.save();
}
