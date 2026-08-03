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
    onProgress?: (progress: number) => void
  ): Promise<string> {
    
    // Ensure initialized
    await this.init(scale);

    // Patch size prevents WebGL out-of-memory errors on large images
    // Padding helps remove edge artifacts between tiles
    return await upscalerInstance.upscale(src, {
      patchSize: 64,
      padding: 2,
      progress: (percent: number) => {
        if (onProgress) {
          onProgress(percent * 100);
        }
      }
    });
  }
}
