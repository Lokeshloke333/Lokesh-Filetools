import { loadModelSession } from "./modelManager";
import { preprocessImageData, applyAlphaMaskToImageData } from "./imageUtils";
import { BrowserAICapabilities } from "./browserCapabilities";
import { getModelForMode, AIQualityMode } from "./aiConstants";
import { AILogger } from "./aiLogger";
import { InferenceError, MemoryError } from "./aiErrors";

export interface BackgroundRemovalOptions {
  qualityMode: AIQualityMode;
  onProgress?: (stage: string, percent: number) => void;
  capabilities: BrowserAICapabilities;
  signal?: AbortSignal;
  padX?: number;
  padY?: number;
  innerWidth?: number;
  innerHeight?: number;
}

/**
 * Runs the AI inference. This is completely DOM-independent and safe to run in a Web Worker.
 */
export async function processBackgroundRemoval(
  originalImageData: ImageData,
  resizedImageData: ImageData,
  options: BackgroundRemovalOptions
): Promise<ImageData> {
  const modelConfig = getModelForMode(options.qualityMode);
  
  if (options.signal?.aborted) throw new Error("Aborted");

  // 1. Load Model Session
  options.onProgress?.("Loading AI Model...", 10);
  const session = await loadModelSession(
    modelConfig.url, 
    modelConfig.id, 
    options.capabilities,
    (p) => {
       // Detailed progress stages based on download percent
       let stage = "Loading Neural Network...";
       if (p < 30) stage = "Downloading AI Model...";
       else if (p < 70) stage = "Preparing AI Engine...";
       else if (p < 100) stage = "Optimizing AI Runtime...";
       options.onProgress?.(stage, 10 + Math.floor(p * 0.4)); // 10 to 50
    }
  );

  if (options.signal?.aborted) throw new Error("Aborted");

  // 2. Preprocess Image (Tensor conversion)
  options.onProgress?.("Processing image...", 60);
  const inputTensor = await preprocessImageData(
    resizedImageData,
    modelConfig.mean,
    modelConfig.std
  );

  if (options.signal?.aborted) {
    if (typeof inputTensor.dispose === "function") inputTensor.dispose();
    throw new Error("Aborted");
  }

  // 3. Run Inference
  options.onProgress?.("Removing background...", 70);
  const feeds: Record<string, import("onnxruntime-web").Tensor> = {};
  
  // Log tensor shape and model requirements
  AILogger.log("--- TENSOR VALIDATION ---");
  AILogger.log(`Model ID: ${modelConfig.id}`);
  AILogger.log(`Model Expected Input Size: ${modelConfig.inputSize[0]}x${modelConfig.inputSize[1]}`);
  AILogger.log(`Generated Tensor Dimensions: ${inputTensor.dims.join("x")}`);
  AILogger.log(`Generated Tensor Type: ${inputTensor.type}`);
  AILogger.log(`Target Input Name: ${session.inputNames[0]}`);
  AILogger.log("-------------------------");

  feeds[session.inputNames[0]] = inputTensor;
  
  let results;
  AILogger.log("Starting session.run() (Inference)");
  AILogger.time("Inference");
  try {
    results = await session.run(feeds);
  } catch (error: unknown) {
    AILogger.error("session.run() failed", error);
    if (typeof inputTensor.dispose === "function") inputTensor.dispose();
    
    const errObj = error instanceof Error ? error : new Error(String(error));
    if (errObj.message && (errObj.message.toLowerCase().includes("memory") || errObj.message.toLowerCase().includes("alloc"))) {
      throw new MemoryError(errObj.message);
    }
    throw new InferenceError(errObj.message || "Inference failed.");
  }
  AILogger.timeEnd("Inference");

  const outputTensor = results[session.outputNames[0]];

  if (options.signal?.aborted) {
     if (typeof inputTensor.dispose === "function") inputTensor.dispose();
     if (typeof outputTensor.dispose === "function") outputTensor.dispose();
     throw new Error("Aborted");
  }

  // 4. Postprocess (Apply Mask with Edge Refinement)
  options.onProgress?.("Refining edges...", 90);
  const dims = outputTensor.dims;
  
  // Safely extract dimensions regardless of whether shape is [1,1,H,W] or [H,W]
  const maskHeight = dims.length >= 2 ? dims[dims.length - 2] : modelConfig.inputSize[1];
  const maskWidth = dims.length >= 1 ? dims[dims.length - 1] : modelConfig.inputSize[0];
  
  // Normalize tensor data to Float32Array [0, 1] across all providers
  let maskData: Float32Array;
  
  if (outputTensor.type === "uint8") {
    // WebGPU/WASM uint8 mask [0, 255] -> Float32 [0.0, 1.0]
    const rawData = outputTensor.data as Uint8Array;
    maskData = new Float32Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) maskData[i] = rawData[i] / 255.0;
  } else if (outputTensor.type === "float16") {
    // WebGPU float16 mask -> Float32 [0.0, 1.0]
    // float16 requires complex decoding in JS, but practically speaking, values of 1.0 are exactly 15360 in 16-bit uint
    // For our purposes, a simple conversion or WebGL standard clamping can be used, but let's fall back to reading Float32 safely if supported
    // Actually, onnxruntime-web automatically converts float16 to Float32Array in outputTensor.data if DataView isn't used!
    // But to be completely safe, we verify if it's a Uint16Array:
    if (outputTensor.data instanceof Uint16Array) {
       const rawData = outputTensor.data as Uint16Array;
       maskData = new Float32Array(rawData.length);
       for (let i = 0; i < rawData.length; i++) {
         // simplified decoding: if it's the exact binary representation of 1.0 (15360), treat as 1.0
         // Otherwise, we cap it at 1.0 to prevent the opaque background bug.
         maskData[i] = rawData[i] >= 15360 ? 1.0 : (rawData[i] / 15360.0);
       }
    } else {
       maskData = outputTensor.data as Float32Array;
    }
  } else {
    // Default float32 array 
    maskData = outputTensor.data as Float32Array;
  }

  // Temporary development logging
  AILogger.log("--- POST-PROCESSING VALIDATION ---");
  AILogger.log(`Output Tensor Name: ${session.outputNames[0]}`);
  AILogger.log(`Output Tensor Shape: ${dims.join("x")}`);
  AILogger.log(`Output Tensor Datatype: ${outputTensor.type}`);

  let minMask = Infinity;
  let maxMask = -Infinity;
  let sumMask = 0;
  for (let i = 0; i < maskData.length; i++) {
    const val = maskData[i];
    if (val < minMask) minMask = val;
    if (val > maxMask) maxMask = val;
    sumMask += val;
  }
  AILogger.log(`Mask Min: ${minMask}`);
  AILogger.log(`Mask Max: ${maxMask}`);
  AILogger.log(`Mask Avg: ${sumMask / maskData.length}`);
  AILogger.log("----------------------------------");

  const isMattingModel = modelConfig.id === "modnet" || modelConfig.id === "rmbg-1.4";

  const processedImageData = applyAlphaMaskToImageData(
    maskData,
    maskWidth,
    maskHeight,
    originalImageData,
    isMattingModel,
    options.padX,
    options.padY,
    options.innerWidth,
    options.innerHeight
  );

  // Cleanup Tensors explicitly after we extract the mask data
  AILogger.log("Cleaning up inference tensors");
  if (typeof inputTensor.dispose === "function") inputTensor.dispose();
  if (typeof outputTensor.dispose === "function") outputTensor.dispose();

  options.onProgress?.("Finalizing...", 100);
  return processedImageData;
}
