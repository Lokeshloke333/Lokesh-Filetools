import { processBackgroundRemoval } from "./backgroundRemoval";
import { AIQualityMode } from "./aiConstants";
import { BrowserAICapabilities } from "./browserCapabilities";

// Define the incoming message type
export interface WorkerProcessMessage {
  id: string;
  action: "process";
  originalImageData: ImageData;
  resizedImageData: ImageData;
  qualityMode: AIQualityMode;
  capabilities: BrowserAICapabilities;
  padX?: number;
  padY?: number;
  innerWidth?: number;
  innerHeight?: number;
}

// Ensure TypeScript knows this is a worker context
declare const self: any;

let abortController: AbortController | null = null;

self.addEventListener("message", async (event: MessageEvent) => {
  const data = event.data;

  if (data.action === "abort") {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    return;
  }

  if (data.action === "process") {
    const { id, originalImageData, resizedImageData, qualityMode, capabilities, padX, padY, innerWidth, innerHeight } = data as WorkerProcessMessage;

    abortController = new AbortController();

    try {
      const processedImageData = await processBackgroundRemoval(
        originalImageData,
        resizedImageData,
        {
          qualityMode,
          capabilities,
          signal: abortController.signal,
          padX,
          padY,
          innerWidth,
          innerHeight,
          onProgress: (stage, percent) => {
            self.postMessage({ id, type: "progress", stage, percent });
          }
        }
      );

      // Transfer the buffer back to the main thread for performance
      self.postMessage(
        { id, type: "success", result: processedImageData },
        [processedImageData.data.buffer] // Transfer ownership
      );
    } catch (error: unknown) {
      const errObj = error instanceof Error ? error : new Error(String(error));
      if (errObj.message === "Aborted") {
        self.postMessage({ id, type: "aborted" });
      } else {
        self.postMessage({
          id,
          type: "error",
          error: {
            name: errObj.name || "Error",
            message: errObj.message || String(error)
          }
        });
      }
    } finally {
      abortController = null;
    }
  }
});
