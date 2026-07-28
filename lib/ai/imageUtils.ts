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
  isMattingModel: boolean = false
): ImageData {
  const data = originalImageData.data;
  const canvasWidth = originalImageData.width;
  const canvasHeight = originalImageData.height;

  const scaleX = maskWidth / canvasWidth;
  const scaleY = maskHeight / canvasHeight;

  for (let y = 0; y < canvasHeight; y++) {
    for (let x = 0; x < canvasWidth; x++) {
      // Find corresponding pixel in the mask (bilinear interpolation approximation via nearest neighbor + feathering logic)
      const maskX = Math.min(Math.floor(x * scaleX), maskWidth - 1);
      const maskY = Math.min(Math.floor(y * scaleY), maskHeight - 1);
      
      const maskIdx = maskY * maskWidth + maskX;
      
      let alphaVal = maskData[maskIdx];
      
      if (!isMattingModel) {
        // Edge Refinement: Soft Thresholding for segmentation models
        // Many models output logits or probabilities that are a bit "fuzzy".
        // We apply a soft S-curve or clamp to clean up the mask.
        
        // 1. Remove small noise in the background
        if (alphaVal < 0.1) {
          alphaVal = 0;
        } 
        // 2. Solidify core foreground (fills holes)
        else if (alphaVal > 0.9) {
          alphaVal = 1;
        } 
        // 3. Smooth the transition (feathering edges for hair/fur)
        else {
          // Smoothstep function for nicer gradients on edges
          alphaVal = alphaVal * alphaVal * (3 - 2 * alphaVal);
        }
      }
      // For matting models (like MODNet), the raw mask is a highly accurate alpha matte
      // which already correctly captures hair and transparency.
      // Applying thresholding to a matting model destroys fine details and can result in
      // a completely black output if the subject probabilities are low.

      // Set the alpha channel of the original image data
      const pixelIdx = (y * canvasWidth + x) * 4;
      let a = Math.round(alphaVal * 255);
      
      // Fix for HTML5 Canvas Premultiplied Alpha Bug:
      // When putImageData is called with A=0, the canvas premultiplies the RGB values by 0,
      // irrevocably destroying the original RGB data (turning them into 0,0,0 black).
      // By enforcing a minimum alpha of 1 (0.4% opacity, visually completely transparent),
      // we force the browser to perfectly preserve and un-premultiply the original RGB values
      // when exporting the transparent PNG via toBlob.
      if (a === 0) a = 1;
      
      data[pixelIdx + 3] = a;
    }
  }

  return originalImageData;
}
