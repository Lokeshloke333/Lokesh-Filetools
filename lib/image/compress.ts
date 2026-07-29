import { CompressSettings, ImageProcessingResult, ProcessImageParams } from "./types";
import { initializeSharp, getMetadata } from "./sharp";
import { applyMetadataHandling } from "./metadata";

export async function processCompress(params: ProcessImageParams<CompressSettings>): Promise<ImageProcessingResult> {
  const { buffer, mimeType, originalName, settings } = params;
  
  let originalFormat = "webp";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) originalFormat = "jpeg";
  else if (mimeType.includes("png")) originalFormat = "png";
  else if (mimeType.includes("webp")) originalFormat = "webp";
  else if (mimeType.includes("avif")) originalFormat = "avif";
  else if (mimeType.includes("gif")) originalFormat = "gif";
  else if (mimeType.includes("bmp")) originalFormat = "bmp";
  else if (mimeType.includes("tiff")) originalFormat = "tiff";

  let outputFormat = settings.format.toLowerCase();
  if (outputFormat === "original") {
    outputFormat = originalFormat;
  }
  if (outputFormat === "jpg") outputFormat = "jpeg";

  const originalSize = buffer.length;
  const isSameFormat = (originalFormat === outputFormat);

  let currentQuality = settings.quality;
  const minQuality = Math.min(50, currentQuality);
  let finalBuffer: Buffer | null = null;
  let message: string | undefined = undefined;

  while (true) {
    let sharpInstance = initializeSharp(buffer);
    sharpInstance = applyMetadataHandling(sharpInstance, settings.stripMetadata);

    switch (outputFormat) {
      case "jpeg":
      case "jpg":
        sharpInstance = sharpInstance.jpeg({ quality: currentQuality, progressive: settings.progressive });
        break;
      case "png":
        if (currentQuality === 100) {
          sharpInstance = sharpInstance.png({ progressive: settings.progressive, compressionLevel: 9 });
        } else {
          // Sharp's PNG palette quantization requires palette: true, but we'll stick to quality parameter which enables palette.
          sharpInstance = sharpInstance.png({ quality: currentQuality, progressive: settings.progressive, compressionLevel: 9, palette: true });
        }
        break;
      case "webp":
        sharpInstance = sharpInstance.webp({ quality: currentQuality, lossless: currentQuality === 100 });
        break;
      case "avif":
        sharpInstance = sharpInstance.avif({ quality: currentQuality, lossless: currentQuality === 100 });
        break;
      case "gif":
        sharpInstance = sharpInstance.gif(); // gif quality not broadly supported by sharp in standard config
        break;
      case "tiff":
        sharpInstance = sharpInstance.tiff({ quality: currentQuality });
        break;
      case "bmp":
        sharpInstance = sharpInstance.toFormat("bmp" as any);
        break;
      default:
        sharpInstance = sharpInstance.webp({ quality: currentQuality });
        outputFormat = "webp";
    }

    let outputBuffer: Buffer;
    try {
      outputBuffer = await sharpInstance.toBuffer();
    } catch (e) {
      // fallback if sharp fails (e.g. unsupported conversion)
      outputBuffer = buffer;
    }

    // Stop if we found a smaller file, or if it's not the same format (we don't strictly enforce size for format conversion)
    if (outputBuffer.length < originalSize || !isSameFormat) {
      finalBuffer = outputBuffer;
      break;
    }

    // It's the same format and output is larger
    currentQuality -= 5;
    if (currentQuality < minQuality) {
      break;
    }
  }

  // After loop, if finalBuffer is still null, it means we never found a smaller version (for same format)
  // Or if the finalBuffer we ended up with is STILL larger than original (edge cases)
  if (!finalBuffer || (isSameFormat && finalBuffer.length >= originalSize)) {
    finalBuffer = buffer; // Return original
    message = "This image is already highly optimized. Returning the original file because no smaller version could be produced without reducing quality.";
  }

  const metadata = await getMetadata(finalBuffer);
  
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const filename = `${nameWithoutExt}-compressed.${outputFormat === "jpeg" ? "jpg" : outputFormat}`;

  return {
    buffer: finalBuffer,
    width: metadata.width || 0,
    height: metadata.height || 0,
    outputFormat,
    filename,
    message,
  };
}
