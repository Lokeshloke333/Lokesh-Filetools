import { getOrt, loadModelSession } from "@/lib/ai/modelManager";
import { detectBrowserAICapabilities } from "@/lib/ai/browserCapabilities";
import { AI_MODELS } from "@/lib/ai/aiConstants";

export class InpaintingEngine {
  /**
   * AI-based object removal using LaMa ONNX.
   */
  public static async process(
    imageData: ImageData,
    maskData: ImageData,
    onProgress?: (progress: number, status: string) => void
  ): Promise<ImageData> {
    
    if (onProgress) onProgress(5, "Preparing AI engine...");
    
    console.log("[Inpainting] Original Image Size:", imageData.width, "x", imageData.height);
    console.log("[Inpainting] Mask Size:", maskData.width, "x", maskData.height);
    
    // Validate mask size
    if (imageData.width !== maskData.width || imageData.height !== maskData.height) {
      throw new Error("Image and mask dimensions do not match!");
    }

    const capabilities = await detectBrowserAICapabilities();
    const modelDef = AI_MODELS.LAMA;
    
    // Load Model
    if (onProgress) onProgress(10, "Loading LaMa model...");
    console.log("[Inpainting] Loading LaMa ONNX model...");
    
    let session;
    try {
      session = await loadModelSession(modelDef.url, modelDef.id, capabilities, (p) => {
        if (onProgress) onProgress(10 + p * 0.2, "Loading LaMa model...");
      });
      console.log("[Inpainting] Model loaded successfully.");
    } catch (e) {
      console.error("[Inpainting] Failed to load model:", e);
      throw e;
    }

    if (onProgress) onProgress(30, "Generating mask...");

    // 1. Resize image and mask to 512x512 for LaMa
    const inputSize = 512;
    console.log("[Inpainting] Resizing inputs to", inputSize, "x", inputSize);
    
    // We use a temporary canvas to scale down
    const origCanvas = document.createElement("canvas");
    origCanvas.width = imageData.width;
    origCanvas.height = imageData.height;
    const origCtx = origCanvas.getContext("2d")!;
    origCtx.putImageData(imageData, 0, 0);

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = maskData.width;
    maskCanvas.height = maskData.height;
    const maskCtx = maskCanvas.getContext("2d")!;
    maskCtx.putImageData(maskData, 0, 0);

    const scaleCanvas = document.createElement("canvas");
    scaleCanvas.width = inputSize;
    scaleCanvas.height = inputSize;
    const scaleCtx = scaleCanvas.getContext("2d")!;

    // Draw scaled image
    scaleCtx.drawImage(origCanvas, 0, 0, inputSize, inputSize);
    const scaledImgData = scaleCtx.getImageData(0, 0, inputSize, inputSize);

    // Draw scaled mask
    scaleCtx.clearRect(0, 0, inputSize, inputSize);
    scaleCtx.drawImage(maskCanvas, 0, 0, inputSize, inputSize);
    const scaledMaskData = scaleCtx.getImageData(0, 0, inputSize, inputSize);

    if (onProgress) onProgress(40, "Creating tensors...");
    
    // 2. Prepare Tensors
    // Image: [1, 3, 512, 512] float32 normalized 0-1
    // Mask: [1, 1, 512, 512] float32 (1 = remove, 0 = keep)
    const imgFloat32 = new Float32Array(3 * inputSize * inputSize);
    const maskFloat32 = new Float32Array(inputSize * inputSize);

    let maskCount = 0;
    for (let i = 0; i < inputSize * inputSize; i++) {
      // Image data (RGB)
      imgFloat32[i] = scaledImgData.data[i * 4] / 255.0; // R
      imgFloat32[i + inputSize * inputSize] = scaledImgData.data[i * 4 + 1] / 255.0; // G
      imgFloat32[i + 2 * inputSize * inputSize] = scaledImgData.data[i * 4 + 2] / 255.0; // B

      // Mask data (read alpha channel or any color channel, assume brush is drawn opaque)
      // The mask is typically drawn in green, so alpha > 0 means masked.
      const isMasked = scaledMaskData.data[i * 4 + 3] > 128 ? 1.0 : 0.0;
      maskFloat32[i] = isMasked;
      if (isMasked > 0) maskCount++;
    }

    console.log("[Inpainting] Scaled Mask pixel count:", maskCount);

    console.log("[Inpainting] Detailed Stats:", {
      imageWidth: imageData.width,
      imageHeight: imageData.height,
      maskWidth: maskData.width,
      maskHeight: maskData.height,
      modelLoaded: !!session,
      maskPixels: maskCount,
    });
    
    if (maskCount === 0) {
      console.log("[Inpainting] Empty mask, returning original image.");
      if (onProgress) onProgress(100, "Complete");
      return imageData;
    }

    const ort = await getOrt();
    const imageTensor = new ort.Tensor("float32", imgFloat32, [1, 3, inputSize, inputSize]);
    const maskTensor = new ort.Tensor("float32", maskFloat32, [1, 1, inputSize, inputSize]);

    if (onProgress) onProgress(50, "Removing object (AI Inference)...");
    
    // 3. Run Inference
    console.log("[Inpainting] Session Inputs:", session.inputNames);
    
    // Try to log metadata if it exists
    try {
      console.log("[Inpainting] Session Metadata:", (session as any).inputMetadata);
    } catch (e) {
      // ignore
    }

    console.log("[Inpainting] Input Tensors:", {
      image: {
        dims: imageTensor.dims,
        type: imageTensor.type
      },
      mask: {
        dims: maskTensor.dims,
        type: maskTensor.type
      }
    });

    // Create the input feed dynamically based on what the model actually expects
    const feeds: Record<string, import("onnxruntime-web").Tensor> = {};
    if (session.inputNames.length >= 2) {
      feeds[session.inputNames[0]] = imageTensor;
      feeds[session.inputNames[1]] = maskTensor;
    } else {
      feeds["image"] = imageTensor;
      feeds["mask"] = maskTensor;
    }

    console.log("[Inpainting] AI inference started...");
    const startTime = performance.now();
    let results;
    try {
      results = await session.run(feeds);
    } catch (e) {
      console.error("[Inpainting] Inference Error caught:", e);
      // throw the actual error so it displays the stack trace in the catch block
      throw e;
    }
    const endTime = performance.now();
    console.log(`[Inpainting] AI inference ended. Duration: ${(endTime - startTime).toFixed(2)}ms`);

    if (onProgress) onProgress(85, "Rendering...");

    // 4. Extract Output
    // Output is usually named 'output' or 'output_0', [1, 3, 512, 512] float32
    // Some models use 'output', some use 'output_0'
    const outputName = session.outputNames[0];
    const outTensor = results[outputName];
    const outData = outTensor.data as Float32Array;

    const finalScaledImgData = new ImageData(inputSize, inputSize);
    for (let i = 0; i < inputSize * inputSize; i++) {
      finalScaledImgData.data[i * 4] = Math.max(0, Math.min(255, outData[i] * 255.0)); // R
      finalScaledImgData.data[i * 4 + 1] = Math.max(0, Math.min(255, outData[i + inputSize * inputSize] * 255.0)); // G
      finalScaledImgData.data[i * 4 + 2] = Math.max(0, Math.min(255, outData[i + 2 * inputSize * inputSize] * 255.0)); // B
      finalScaledImgData.data[i * 4 + 3] = 255; // A
    }

    // 5. Composite back to original size
    if (onProgress) onProgress(95, "Compositing...");
    console.log("[Inpainting] Compositing back to", imageData.width, "x", imageData.height);
    
    // Scale the 512x512 output back to original size
    scaleCtx.putImageData(finalScaledImgData, 0, 0);
    const resultCanvas = document.createElement("canvas");
    resultCanvas.width = imageData.width;
    resultCanvas.height = imageData.height;
    const resultCtx = resultCanvas.getContext("2d")!;
    
    // Smooth scaling for the filled area
    resultCtx.imageSmoothingEnabled = true;
    resultCtx.imageSmoothingQuality = "high";
    resultCtx.drawImage(scaleCanvas, 0, 0, imageData.width, imageData.height);
    
    const resizedOutData = resultCtx.getImageData(0, 0, imageData.width, imageData.height);
    const finalData = new Uint8ClampedArray(imageData.data); // Start with a copy of original
    const origMaskData = maskData.data;

    // Blend: only replace pixels where the original mask was drawn!
    // We add a tiny bit of feathering by checking alpha of original mask.
    for (let i = 0; i < imageData.width * imageData.height; i++) {
      const maskAlpha = origMaskData[i * 4 + 3];
      if (maskAlpha > 0) {
        const blend = maskAlpha / 255.0;
        finalData[i * 4] = finalData[i * 4] * (1 - blend) + resizedOutData.data[i * 4] * blend;
        finalData[i * 4 + 1] = finalData[i * 4 + 1] * (1 - blend) + resizedOutData.data[i * 4 + 1] * blend;
        finalData[i * 4 + 2] = finalData[i * 4 + 2] * (1 - blend) + resizedOutData.data[i * 4 + 2] * blend;
        // Keep original alpha
      }
    }

    console.log("[Inpainting] Complete.");
    if (onProgress) onProgress(100, "Complete");
    return new ImageData(finalData, imageData.width, imageData.height);
  }
}
