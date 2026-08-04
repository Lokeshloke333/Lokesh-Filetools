const CACHE_NAME = "fileinator-ai-models-v1";

export async function fetchModelWithCache(url: string, onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
  // Check if Cache API is supported (it isn't in some incognito modes or older browsers)
  const isCacheSupported = typeof globalThis !== "undefined" && "caches" in globalThis;

  if (isCacheSupported) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        onProgress?.(100);
        return await cachedResponse.arrayBuffer();
      }
    } catch (e) {
      console.warn("Failed to read from cache:", e);
    }
  }

  // Fetch from network with progress
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch model from ${url}: ${response.statusText}`);
  }

  const contentLength = response.headers.get("Content-Length");
  let total = contentLength ? parseInt(contentLength, 10) : 0;
  
  // Hugging Face hides Content-Length due to CORS. If it's an ONNX model, assume ~200MB to enable the stream reader progress.
  if (total === 0 && url.endsWith(".onnx")) {
    total = 207000000; 
  }
  
  if (!total || !response.body) {
    // Cannot track progress, just fetch and cache
    const arrayBuffer = await response.arrayBuffer();
    if (isCacheSupported) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, new Response(arrayBuffer.slice(0)));
      } catch (e) {
        console.warn("Failed to write to cache:", e);
      }
    }
    onProgress?.(100);
    return arrayBuffer;
  }

  // Stream reader to track progress
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    if (value) {
      chunks.push(value);
      loaded += value.length;
      if (onProgress) {
        onProgress(Math.round((loaded / total) * 100));
      }
    }
  }

  // Concatenate chunks
  const arrayBuffer = new Uint8Array(loaded);
  let position = 0;
  for (const chunk of chunks) {
    arrayBuffer.set(chunk, position);
    position += chunk.length;
  }

  if (isCacheSupported) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(url, new Response(arrayBuffer.buffer.slice(0)));
    } catch (e) {
      console.warn("Failed to write to cache:", e);
    }
  }

  return arrayBuffer.buffer;
}
