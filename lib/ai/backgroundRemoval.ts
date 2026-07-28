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
  options.onProgress?.("Analyzing Image...", 60);
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
  options.onProgress?.("Removing Background...", 70);
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
  options.onProgress?.("Refining Edges...", 90);
  const dims = outputTensor.dims;
  
  // Safely extract dimensions regardless of whether shape is [1,1,H,W] or [H,W]
  const maskHeight = dims.length >= 2 ? dims[dims.length - 2] : modelConfig.inputSize[1];
  const maskWidth = dims.length >= 1 ? dims[dims.length - 1] : modelConfig.inputSize[0];
  const maskData = outputTensor.data as Float32Array;

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

  const isMattingModel = modelConfig.id === "modnet";

  const processedImageData = applyAlphaMaskToImageData(
    maskData,
    maskWidth,
    maskHeight,
    originalImageData,
    isMattingModel
  );

  // Cleanup Tensors explicitly after we extract the mask data
  AILogger.log("Cleaning up inference tensors");
  if (typeof inputTensor.dispose === "function") inputTensor.dispose();
  if (typeof outputTensor.dispose === "function") outputTensor.dispose();

  options.onProgress?.("Finalizing...", 100);
  return processedImageData;
}
