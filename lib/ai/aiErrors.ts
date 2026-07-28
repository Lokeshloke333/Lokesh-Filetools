/**
 * Specific error classes for AI Runtime to replace generic errors.
 */

export class ModelLoadError extends Error {
  constructor(message: string = "Model failed to load.") {
    super(message);
    this.name = "ModelLoadError";
  }
}

export class BrowserSupportError extends Error {
  constructor(message: string = "Browser does not support required features.") {
    super(message);
    this.name = "BrowserSupportError";
  }
}

export class ONNXInitError extends Error {
  constructor(message: string = "ONNX Runtime initialization failed.") {
    super(message);
    this.name = "ONNXInitError";
  }
}

export class InferenceError extends Error {
  constructor(message: string = "Inference failed.") {
    super(message);
    this.name = "InferenceError";
  }
}

export class MemoryError extends Error {
  constructor(message: string = "Insufficient browser memory.") {
    super(message);
    this.name = "MemoryError";
  }
}
