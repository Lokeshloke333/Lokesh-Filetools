import { getOrt } from "./modelManager";

export async function loadImage(fileOrBlob: File | Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof Image === "undefined") {
      return reject(new Error("loadImage can only run in the browser"));
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    
    if (typeof fileOrBlob === "string") {
      img.src = fileOrBlob;
    } else {
      img.src = URL.createObjectURL(fileOrBlob);
    }
  });
}

/**
 * Preprocesses an image data buffer for the ONNX model.
 * Assumes the imageData is already resized to inputWidth x inputHeight.
 * Outputs a Float32Array Tensor.
 */
export async function preprocessImageData(
  imageData: ImageData,
  mean: number[],
  std: number[]
) {
  const { data, width, height } = imageData;
  const float32Data = new Float32Array(3 * width * height);

  // Normalize and reorganize data from HWC (RGBA) to CHW (RGB)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const outIdx = y * width + x;
      // R channel
      float32Data[outIdx] = (r - mean[0]) / std[0];
      // G channel
      float32Data[width * height + outIdx] = (g - mean[1]) / std[1];
      // B channel
      float32Data[2 * width * height + outIdx] = (b - mean[2]) / std[2];
    }
  }

  const ort = await getOrt();
  return new ort.Tensor("float32", float32Data, [1, 3, height, width]);
}

/**
 * Applies the alpha mask to the original ImageData and applies edge refinement.
 * This runs inside the Web Worker.
 */
export function applyAlphaMaskToImageData(
  maskData: Float32Array,
  maskWidth: number,
  maskHeight: number,
  originalImageData: ImageData,
  isMattingModel: boolean = false,
  padX: number = 0,
  padY: number = 0,
  innerWidth: number = maskWidth,
  innerHeight: number = maskHeight
): ImageData {
  const data = originalImageData.data;
  const canvasWidth = originalImageData.width;
  const canvasHeight = originalImageData.height;

  // Map original canvas space [0, canvasWidth] to the mask inner bounds space [padX, padX + innerWidth]
  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      // Find fractional coordinates in the mask's inner image space
      const srcX = padX + (x / Math.max(1, canvasWidth - 1)) * (innerWidth - 1);
      const srcY = padY + (y / Math.max(1, canvasHeight - 1)) * (innerHeight - 1);
      
      // Bilinear interpolation
      const x1 = Math.floor(srcX);
      const y1 = Math.floor(srcY);
      const x2 = Math.min(x1 + 1, maskWidth - 1);
      const y2 = Math.min(y1 + 1, maskHeight - 1);
      
      const dx = srcX - x1;
      const dy = srcY - y1;
      
      const val11 = maskData[y1 * maskWidth + x1];
      const val12 = maskData[y2 * maskWidth + x1];
      const val21 = maskData[y1 * maskWidth + x2];
      const val22 = maskData[y2 * maskWidth + x2];
      
      const top = val11 * (1 - dx) + val21 * dx;
      const bottom = val12 * (1 - dx) + val22 * dx;
      let alphaVal = top * (1 - dy) + bottom * dy;
      
      if (!isMattingModel) {
        // Edge Refinement: Soft Thresholding for segmentation models
        if (alphaVal < 0.1) {
          alphaVal = 0;
        } else if (alphaVal > 0.9) {
          alphaVal = 1;
        } else {
          alphaVal = alphaVal * alphaVal * (3 - 2 * alphaVal);
        }
      }

      const pixelIdx = (y * canvasWidth + x) * 4;
      let a = Math.round(alphaVal * 255);
      
      // Fix for HTML5 Canvas Premultiplied Alpha Bug
      if (a === 0) a = 1;
      
      data[pixelIdx + 3] = a;
    }
  }

  return originalImageData;
}
