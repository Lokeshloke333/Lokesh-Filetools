// Constants for AI Models and processing
export const AI_MODELS = {
  // RMBG-1.4: High Quality, larger model (~170MB)
  HIGH_QUALITY: {
    url: "https://huggingface.co/briaai/RMBG-1.4/resolve/main/onnx/model.onnx",
    id: "rmbg-1.4",
    inputSize: [1024, 1024],
    mean: [128.0, 128.0, 128.0],
    std: [128.0, 128.0, 128.0],
  },
  // MODNet: Fast Mode, extremely fast and WebGPU/WebGL compatible (~26MB ONNX)
  FAST: {
    url: "https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx",
    id: "modnet",
    inputSize: [512, 512],
    mean: [127.5, 127.5, 127.5], 
    std: [127.5, 127.5, 127.5],
  },
  // LaMa Inpainting Model (Fixed 512x512)
  LAMA: {
    url: "https://huggingface.co/mayocream/lama-manga-onnx/resolve/main/lama-manga.onnx",
    id: "lama-inpaint",
    inputSize: [512, 512],
    mean: [0, 0, 0], // Not using norm for basic preprocess
    std: [1, 1, 1]
  }
};

export type AIQualityMode = "fast" | "high" | "inpaint";

export function getModelForMode(mode: AIQualityMode) {
  if (mode === "inpaint") return AI_MODELS.LAMA;
  return mode === "high" ? AI_MODELS.HIGH_QUALITY : AI_MODELS.FAST;
}

