import { useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

// Singleton FFmpeg instance across the module to avoid multiple heavy initializations
let globalFfmpegInstance: FFmpeg | null = null;
let isGlobalLoaded = false;
let globalLoadPromise: Promise<void> | null = null;

export function useFFmpeg() {
  const [isLoaded, setIsLoaded] = useState(isGlobalLoaded);
  const [loadStatus, setLoadStatus] = useState<string>("");

  const loadFFmpeg = useCallback(async () => {
    if (isGlobalLoaded && globalFfmpegInstance) {
      setIsLoaded(true);
      return globalFfmpegInstance;
    }

    if (globalLoadPromise) {
      setLoadStatus("Waiting for engine to load...");
      await globalLoadPromise;
      setIsLoaded(true);
      return globalFfmpegInstance!;
    }

    setLoadStatus("Loading multi-threaded engine...");

    globalLoadPromise = (async () => {
      globalFfmpegInstance = new FFmpeg();
      
      globalFfmpegInstance.on("log", ({ message }) => {
        console.log("[FFmpeg]", message);
      });

      const isMultiThread = typeof window !== "undefined" && window.crossOriginIsolated;

      if (isMultiThread) {
        try {
          console.log("[FFmpeg] Cross-Origin Isolation active: trying multi-threaded core (@ffmpeg/core-mt)");
          const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/umd";
          await globalFfmpegInstance.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
          });
          isGlobalLoaded = true;
          return;
        } catch (mtError) {
          console.warn("[FFmpeg] Multi-threaded core failed to load, falling back to single-threaded core:", mtError);
          globalFfmpegInstance = new FFmpeg();
          globalFfmpegInstance.on("log", ({ message }) => {
            console.log("[FFmpeg]", message);
          });
        }
      }

      console.log("[FFmpeg] Loading single-threaded core (@ffmpeg/core)");
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await globalFfmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      
      isGlobalLoaded = true;
    })();

    try {
      await globalLoadPromise;
      setIsLoaded(true);
      setLoadStatus("");
      return globalFfmpegInstance!;
    } catch (err) {
      globalLoadPromise = null;
      isGlobalLoaded = false;
      throw err;
    }
  }, []);

  const getFFmpeg = useCallback(() => {
    if (!isGlobalLoaded || !globalFfmpegInstance) {
      throw new Error("FFmpeg is not loaded yet. Call loadFFmpeg first.");
    }
    return globalFfmpegInstance;
  }, []);

  return {
    isLoaded,
    loadStatus,
    loadFFmpeg,
    getFFmpeg
  };
}
