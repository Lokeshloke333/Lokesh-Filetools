import { EnhancerSettings } from "./types";

export class ImageProcessor {
  /**
   * Applies all settings to a given image and returns the data URL.
   * If maxWidth/maxHeight are provided, the image is scaled down before processing (useful for previews).
   */
  public static async processImage(
    src: string,
    settings: EnhancerSettings,
    maxWidth?: number,
    maxHeight?: number
  ): Promise<string> {
    const img = await this.loadImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Could not get 2d context");

    let width = img.naturalWidth;
    let height = img.naturalHeight;

    if (maxWidth && maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Apply hardware-accelerated CSS filters first (fastest)
    ctx.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`;
    ctx.drawImage(img, 0, 0, width, height);

    // If vibrance, sharpen, or denoise are 0, we can skip pixel manipulation
    if (settings.vibrance === 0 && settings.sharpen === 0 && settings.denoise === 0) {
      return canvas.toDataURL("image/png");
    }

    // 2. Perform pixel manipulations
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // A. Vibrance
    if (settings.vibrance !== 0) {
      const amount = settings.vibrance / 100; // -1 to 1
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const max = Math.max(r, g, b);
        const avg = (r + g + b) / 3;
        const amt = ((Math.abs(max - avg) * 2 / 255) * amount) * 100;
        
        if (amt !== 0) {
          const factor = (amt > 0) ? (amt / 100) : (amt / 100);
          data[i] = r + (r - max) * factor;
          data[i + 1] = g + (g - max) * factor;
          data[i + 2] = b + (b - max) * factor;
        }
      }
    }

    // Since convolutions are expensive, we only do them if needed
    // B. Denoise (Box Blur / Gaussian approximation)
    if (settings.denoise > 0) {
      const strength = settings.denoise / 100; // 0 to 1
      const kernel = [
        1 * strength, 2 * strength, 1 * strength,
        2 * strength, 4 + (1 - strength) * 8, 2 * strength,
        1 * strength, 2 * strength, 1 * strength
      ];
      this.applyConvolution(data, width, height, kernel);
    }

    // C. Sharpen
    if (settings.sharpen > 0) {
      const strength = settings.sharpen / 10; // 0 to 10
      const kernel = [
        0, -1 * strength, 0,
        -1 * strength, 1 + 4 * strength, -1 * strength,
        0, -1 * strength, 0
      ];
      this.applyConvolution(data, width, height, kernel);
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  }

  /**
   * Automatically calculates ideal settings based on histogram analysis
   */
  public static async calculateAutoEnhance(src: string): Promise<EnhancerSettings> {
    const img = await this.loadImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { brightness: 100, contrast: 100, saturation: 100, vibrance: 0, sharpen: 0, denoise: 0 };

    // Scale down for fast analysis
    const width = 200;
    const height = Math.floor((img.naturalHeight / img.naturalWidth) * width);
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let totalLuminance = 0;
    let minLuma = 255;
    let maxLuma = 0;

    for (let i = 0; i < data.length; i += 4) {
      // Perceived luminance
      const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      totalLuminance += luma;
      if (luma < minLuma) minLuma = luma;
      if (luma > maxLuma) maxLuma = luma;
    }

    const avgLuma = totalLuminance / (width * height);
    
    // Logic: 
    // If average is too dark (< 100), boost brightness. 
    // If average is too bright (> 155), lower brightness slightly.
    let targetBrightness = 100;
    if (avgLuma < 100) targetBrightness = 100 + (100 - avgLuma) * 0.5;
    else if (avgLuma > 155) targetBrightness = 100 - (avgLuma - 155) * 0.3;

    // Contrast logic: 
    // If dynamic range (max - min) is low, boost contrast heavily.
    const dynamicRange = maxLuma - minLuma;
    let targetContrast = 100;
    if (dynamicRange < 150) targetContrast = 100 + (150 - dynamicRange) * 0.4;
    else targetContrast = 105; // slight boost always looks good

    return {
      brightness: Math.floor(Math.min(200, Math.max(50, targetBrightness))),
      contrast: Math.floor(Math.min(200, Math.max(50, targetContrast))),
      saturation: 110, // slight boost
      vibrance: 20, // push muted colors
      sharpen: 15, // crisp it up
      denoise: 0 // leave denoise off unless manually requested to preserve details
    };
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // Basic 3x3 Convolution Kernel implementation
  private static applyConvolution(data: Uint8ClampedArray, width: number, height: number, kernel: number[]) {
    const side = Math.round(Math.sqrt(kernel.length));
    const halfSide = Math.floor(side / 2);
    
    const src = new Uint8ClampedArray(data);
    const sw = width;
    const sh = height;
    const w = sw;
    const h = sh;

    const divisor = kernel.reduce((a, b) => a + b, 0) || 1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dstOff = (y * w + x) * 4;
        let r = 0, g = 0, b = 0;

        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = y + cy - halfSide;
            const scx = x + cx - halfSide;

            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              const srcOff = (scy * sw + scx) * 4;
              const wt = kernel[cy * side + cx];

              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }
        }
        data[dstOff] = r / divisor;
        data[dstOff + 1] = g / divisor;
        data[dstOff + 2] = b / divisor;
      }
    }
  }
}
