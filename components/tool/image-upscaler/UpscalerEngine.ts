import { UpscaleFactor } from "./types";

let UpscalerConstructor: any = null;
let upscalerInstance: any = null;
let currentScale: number | null = null;

export class UpscalerEngine {
  /**
   * Initializes the Upscaler.js library and tfjs, lazily to avoid breaking SSR.
   */
  public static async init(scale: UpscaleFactor = 2): Promise<void> {
    if (typeof window === "undefined") return;

    if (!UpscalerConstructor) {
      // Lazy load tensorflow and upscaler
      await import('@tensorflow/tfjs');
      const UpscalerModule = await import('upscaler');
      UpscalerConstructor = UpscalerModule.default;
    }

    // Initialize or re-initialize if scale changed
    if (!upscalerInstance || currentScale !== scale) {
      currentScale = scale;
      upscalerInstance = new UpscalerConstructor({
        model: (await import('@upscalerjs/default-model')).default
      });
    }
  }

  /**
   * Disposes of the current model to free up memory.
   */
  public static async dispose(): Promise<void> {
    if (upscalerInstance) {
      await upscalerInstance.dispose();
      upscalerInstance = null;
      currentScale = null;
    }
  }

  /**
   * Upscales an image source.
   */
  public static async upscale(
    src: string, 
    scale: UpscaleFactor, 
    onProgress?: (progress: number, status: string) => void
  ): Promise<string> {
    
    if (onProgress) onProgress(0, "Loading model...");
    await this.init(scale);

    if (scale === 2) {
      if (onProgress) onProgress(10, "Preparing image...");
      
      return await upscalerInstance.upscale(src, {
        patchSize: 64,
        padding: 2,
        progress: (percent: number) => {
          if (onProgress) {
            onProgress(10 + (percent * 80), "Upscaling (2x)...");
          }
        }
      });
    } else if (scale === 4) {
      // 4x is achieved by upscaling 2x twice to avoid loading a heavy 4x model.
      if (onProgress) onProgress(5, "Preparing image...");
      
      const firstPass = await upscalerInstance.upscale(src, {
        patchSize: 64,
        padding: 2,
        progress: (percent: number) => {
          if (onProgress) {
            onProgress(5 + (percent * 45), "Upscaling pass 1/2...");
          }
        }
      });

      if (onProgress) onProgress(50, "Preparing second pass...");

      const secondPass = await upscalerInstance.upscale(firstPass, {
        patchSize: 64,
        padding: 2,
        progress: (percent: number) => {
          if (onProgress) {
            onProgress(50 + (percent * 45), "Upscaling pass 2/2...");
          }
        }
      });

      return secondPass;
    }

    throw new Error(`Unsupported scale factor: ${scale}`);
  }
}
