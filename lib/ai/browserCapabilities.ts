export interface BrowserAICapabilities {
  webGpuSupported: boolean;
  wasmSupported: boolean;
  webGlSupported: boolean;
  recommendedProvider: "webgpu" | "wasm" | "webgl";
}

export async function detectBrowserAICapabilities(): Promise<BrowserAICapabilities> {
  const caps: BrowserAICapabilities = {
    webGpuSupported: false,
    wasmSupported: typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function",
    webGlSupported: false,
    recommendedProvider: "wasm",
  };

  // Check WebGPU
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter) {
        caps.webGpuSupported = true;
        caps.recommendedProvider = "webgpu";
      }
    } catch (e) {
      console.warn("WebGPU supported but requestAdapter failed", e);
    }
  }

  // Check WebGL (as fallback if WebGPU not available)
  if (!caps.webGpuSupported && typeof document !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (gl) {
        caps.webGlSupported = true;
        // Sometimes WebGL is faster than WASM, sometimes not. WASM with SIMD/Threads is usually very good.

        // We'll stick to WASM as the secondary fallback for ONNX Runtime Web as it's more stable.
      }
    } catch (e) {
      console.warn("WebGL check failed", e);
    }
  }

  return caps;
}
