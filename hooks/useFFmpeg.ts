import { useState, useRef, useCallback } from "react";
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
    if (isGlobalLoaded) {
      setIsLoaded(true);
      return globalFfmpegInstance!;
    }

    if (globalLoadPromise) {
      setLoadStatus("Waiting for engine to load...");
      await globalLoadPromise;
      setIsLoaded(true);
      return globalFfmpegInstance!;
    }

    setLoadStatus("Loading converter engine...");

    globalLoadPromise = (async () => {
      globalFfmpegInstance = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      globalFfmpegInstance.on('log', ({ message }) => {
        console.log("[FFmpeg]", message);
      });
      
      await globalFfmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      isGlobalLoaded = true;
    })();

    await globalLoadPromise;
    setIsLoaded(true);
    setLoadStatus("");
    
    return globalFfmpegInstance!;
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
