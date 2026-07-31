import { PDFDocument, PDFName, PDFRawStream, PDFNumber, PDFDict } from 'pdf-lib';
import { PdfCompressionLevel } from './types';

/**
 * Compresses an image byte array using the browser's native HTML5 Canvas API.
 * This is incredibly fast and hardware accelerated.
 */
async function compressImageWithCanvas(
  imageBytes: Uint8Array,
  quality: number
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([imageBytes as BlobPart], { type: 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error('Failed to get canvas context'));
      }
      
      ctx.drawImage(img, 0, 0);
      
      // Compress the image
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      
      // Convert base64 Data URL back to Uint8Array
      const base64Data = dataUrl.split(',')[1];
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      URL.revokeObjectURL(url);
      resolve(bytes);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };
    
    img.src = url;
  });
}

/**
 * Iterates through all PDF objects, extracts embedded JPEGs, compresses them via Canvas,
 * injects them back, and returns an optimized PDF.
 */
export async function compressPdfClient(
  file: File,
  level: PdfCompressionLevel,
  onProgress?: (msg: string) => void
): Promise<{ bytes: Uint8Array; originalSize: number; optimized: boolean }> {
  
  onProgress?.('Loading PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  let quality = 0.95; // High Quality (low compression)
  if (level === 'medium') quality = 0.75; // Balanced
  if (level === 'high') quality = 0.50; // Maximum Compression (low quality)

  let compressedImagesCount = 0;

  onProgress?.('Scanning for images...');
  const objects = pdfDoc.context.enumerateIndirectObjects();
  
  for (const [ref, obj] of objects) {
    if (obj instanceof PDFRawStream) {
      const subtype = obj.dict.lookup(PDFName.of('Subtype'));
      
      if (subtype === PDFName.of('Image')) {
        const filter = obj.dict.lookup(PDFName.of('Filter'));
        
        // We currently only target DCTDecode (JPEG) as they form the bulk of unoptimized PDFs.
        // Handling FlateDecode (PNG/lossless) in pure JS is extremely complex due to ColorSpaces.
        let isJpeg = false;
        
        if (filter === PDFName.of('DCTDecode')) {
          isJpeg = true;
        }

        if (isJpeg) {
          onProgress?.(`Compressing image ${compressedImagesCount + 1}...`);
          try {
            const originalBytes = obj.contents;
            const compressedBytes = await compressImageWithCanvas(originalBytes, quality);
            
            // Only replace if it genuinely reduced the size
            if (compressedBytes.length < originalBytes.length) {
              (obj as any).contents = compressedBytes;
              obj.dict.set(PDFName.of('Length'), PDFNumber.of(compressedBytes.length));
              compressedImagesCount++;
            }
          } catch (e) {
            console.warn('Failed to compress an embedded image, skipping...', e);
          }
        }
      }
    }
  }

  onProgress?.('Optimizing document structure...');
  const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
  
  const originalSize = file.size;
  const newSize = compressedBytes.length;
  
  // Minimum 1% size reduction required to be considered "optimized"
  const isOptimized = newSize < originalSize * 0.99;

  return {
    bytes: isOptimized ? compressedBytes : new Uint8Array(arrayBuffer),
    originalSize,
    optimized: isOptimized
  };
}
