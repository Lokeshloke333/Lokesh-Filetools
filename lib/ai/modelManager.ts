import { fetchModelWithCache } from "./modelCache";
import { BrowserAICapabilities } from "./browserCapabilities";
import { AILogger } from "./aiLogger";
import { ONNXInitError, ModelLoadError } from "./aiErrors";

// Dynamic import type so we don't break SSR
type OrtType = typeof import("onnxruntime-web");
let ortInstance: OrtType | null = null;

// Cache the active session
let activeSession: import("onnxruntime-web").InferenceSession | null = null;
let activeModelId: string | null = null;

export async function getOrt(): Promise<OrtType> {
  if (ortInstance) return ortInstance;
  
  // Dynamically import ONNX Runtime Web
  // Using require is generally avoided in ES modules, but for dynamic import in Next.js it works well to avoid SSR issues.
  const ort = (await import("onnxruntime-web")) as OrtType;
  
  // Set WASM paths since Next.js chunks break local loading
  ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/";
  
  ortInstance = ort;
  return ort;
}

export async function loadModelSession(
  modelUrl: string,
  modelId: string,
  capabilities: BrowserAICapabilities,
  onProgress?: (progress: number) => void
) {
  // If we already have this exact model loaded, return it
  if (activeSession && activeModelId === modelId) {
    onProgress?.(100);
    return activeSession;
  }

  // Release old session if it exists to free memory
  if (activeSession) {
    try {
      if (typeof activeSession.release === "function") {
        await activeSession.release();
      }
    } catch (e) {
      console.warn("Failed to release previous session", e);
    }
    activeSession = null;
    activeModelId = null;
  }

  const ort = await getOrt();

  // Determine provider
  const executionProvider = capabilities.recommendedProvider;
  
  // Set some env configs
  if (executionProvider === "wasm") {
    const concurrency = typeof navigator !== "undefined" && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 1;
    ort.env.wasm.numThreads = Math.min(concurrency, 4);
  }

  // 1. Download/Fetch Model ArrayBuffer
  AILogger.log(`Starting download/fetch for model: ${modelId}`);
  AILogger.time(`ModelFetch_${modelId}`);
  onProgress?.(10); // Start
  
  let modelBuffer: ArrayBuffer;
  try {
    modelBuffer = await fetchModelWithCache(modelUrl, (progress) => {
      // Map download progress (0-100) to 10-80% of total loading progress
      onProgress?.(10 + Math.round(progress * 0.7));
    });
  } catch (err: unknown) {
    const errObj = err instanceof Error ? err : new Error(String(err));
    AILogger.error(`Failed to fetch model ${modelId}`, err);
    throw new ModelLoadError(errObj.message || "Failed to fetch AI model from network or cache.");
  }
  AILogger.timeEnd(`ModelFetch_${modelId}`);

  onProgress?.(85); // Model downloaded, creating session

  // 2. Create Inference Session
  AILogger.log(`Creating InferenceSession with provider: ${executionProvider}`);
  AILogger.time(`SessionInit_${modelId}`);
  
  const sessionOptions: import("onnxruntime-web").InferenceSession.SessionOptions = {
    executionProviders: [executionProvider],
  };

  if (executionProvider === "webgpu") {
    sessionOptions.preferredOutputLocation = "cpu";
  }

  // Internal helper to create session with retry
  const createSessionWithRetry = async (options: import("onnxruntime-web").InferenceSession.SessionOptions, retries = 1): Promise<import("onnxruntime-web").InferenceSession> => {
    for (let i = 0; i <= retries; i++) {
      try {
        AILogger.log(`Attempt ${i + 1} to create ONNX session...`);
        return await ort.InferenceSession.create(modelBuffer, options);
      } catch (err) {
        AILogger.warn(`Session creation attempt ${i + 1} failed.`, err);
        if (i === retries) throw err;
      }
    }
    throw new Error("Unreachable");
  };

  try {
    const session = await createSessionWithRetry(sessionOptions);
    activeSession = session;
    activeModelId = modelId;
    AILogger.timeEnd(`SessionInit_${modelId}`);
    onProgress?.(100);
    return session;
  } catch (error: unknown) {
    const errObj = error instanceof Error ? error : new Error(String(error));
    AILogger.error("Failed to create ONNX session:", error);
    if (executionProvider === "webgpu" && capabilities.wasmSupported) {
      AILogger.log("WebGPU session creation failed. Falling back to WASM.");
      sessionOptions.executionProviders = ["wasm"];
      try {
        const session = await createSessionWithRetry(sessionOptions);
        activeSession = session;
        activeModelId = modelId;
        AILogger.timeEnd(`SessionInit_${modelId}`);
        onProgress?.(100);
        return session;
      } catch (fallbackError: unknown) {
        const fbErrObj = fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
        AILogger.error("Fallback WASM session creation failed:", fallbackError);
        throw new ONNXInitError(fbErrObj.message || "ONNX Runtime initialization failed on fallback.");
      }
    }
    throw new ONNXInitError(errObj.message || "ONNX Runtime initialization failed.");
  }
}

export function releaseSession() {
  if (activeSession) {
    try {
       if (typeof activeSession.release === "function") {
          activeSession.release();
       }
    } catch {
      // Ignore
    }
    activeSession = null;
    activeModelId = null;
  }
}
