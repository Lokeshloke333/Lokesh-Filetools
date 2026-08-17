"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool/ToolLayout";
import { ToolHeader } from "@/components/tool/ToolHeader";
import { RelatedTools } from "@/components/tool/RelatedTools";
import { FAQSection } from "@/components/tool/FAQSection";
import { AboutTool } from "@/components/tool/AboutTool";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ArrowRight, AlertTriangle, Cpu, Zap, Star } from "lucide-react";
import { formatFileSize } from "@/lib/utils/image";
import { AIUploadZone } from "@/components/ai/AIUploadZone";
import { ModelLoader } from "@/components/ai/ModelLoader";
import { AIProgress } from "@/components/ai/AIProgress";
import { AIResultCard } from "@/components/ai/AIResultCard";
import { ImagePreview } from "@/components/image/ImagePreview";
import { detectBrowserAICapabilities, BrowserAICapabilities } from "@/lib/ai/browserCapabilities";
import { validateImageForAI } from "@/lib/ai/imageValidation";
import { downloadBlob } from "@/lib/ai/imageDownload";
import { AIQualityMode, getModelForMode } from "@/lib/ai/aiConstants";
import { loadImage } from "@/lib/ai/imageUtils";

interface BackgroundRemoverClientProps {
  children?: React.ReactNode;
}

export default function BackgroundRemoverClient({ children }: BackgroundRemoverClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [capabilities, setCapabilities] = useState<BrowserAICapabilities | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStage, setProgressStage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    detectBrowserAICapabilities().then(setCapabilities);
    
    // Instantiate the Web Worker with a relative path for strict Next.js Webpack compatibility in production
    workerRef.current = new Worker(new URL("../../../lib/ai/bgWorker.ts", import.meta.url));

    return () => {
      if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
      if (workerRef.current) workerRef.current.terminate();
    };
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    const { valid, error: validationError } = validateImageForAI(selectedFile);
    if (!valid) {
      setError(validationError || "Invalid file");
      return;
    }

    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    setFile(selectedFile);
    setOriginalImageUrl(URL.createObjectURL(selectedFile));
    setProcessedBlob(null);
    setProcessedUrl(null);
    setError(null);
  };

  const extractImageData = (img: HTMLImageElement, targetWidth: number, targetHeight: number): ImageData => {
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas context missing");
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  };

  const handleStartProcessing = async () => {
    if (!file || !capabilities || !workerRef.current || !originalImageUrl) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      setProgressStage("Removing background...");
      setProgressPercent(5);

      const img = await loadImage(originalImageUrl);
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;

      // 1. Get original ImageData
      const originalImageData = extractImageData(img, originalWidth, originalHeight);

      // 2. Resize to exact model dimensions using aspect-ratio preserving letterbox
      const modelConfig = getModelForMode("high");
      const [expectedWidth, expectedHeight] = modelConfig.inputSize;

      const scale = Math.min(expectedWidth / originalWidth, expectedHeight / originalHeight);
      const innerWidth = Math.round(originalWidth * scale);
      const innerHeight = Math.round(originalHeight * scale);
      const padX = Math.round((expectedWidth - innerWidth) / 2);
      const padY = Math.round((expectedHeight - innerHeight) / 2);

      const resizeCanvas = document.createElement("canvas");
      resizeCanvas.width = expectedWidth;
      resizeCanvas.height = expectedHeight;
      const resizeCtx = resizeCanvas.getContext("2d", { willReadFrequently: true });
      if (!resizeCtx) throw new Error("Canvas context missing");
      
      // Fill with mean color to prevent zero-padding artifacts
      resizeCtx.fillStyle = "rgb(128,128,128)";
      resizeCtx.fillRect(0, 0, expectedWidth, expectedHeight);
      resizeCtx.drawImage(img, padX, padY, innerWidth, innerHeight);
      
      const resizedImageData = resizeCtx.getImageData(0, 0, expectedWidth, expectedHeight);

      // 3. Send to Worker
      const workerId = Math.random().toString(36).substring(7);

      const workerPromise = new Promise<ImageData>((resolve, reject) => {
        const handler = (e: MessageEvent) => {
          const { id, type, stage, percent, result, error: workerError } = e.data;
          if (id !== workerId) return;

          if (type === "progress") {
            setProgressStage(stage);
            setProgressPercent(percent);
          } else if (type === "success") {
            workerRef.current?.removeEventListener("message", handler);
            resolve(result);
          } else if (type === "aborted") {
            workerRef.current?.removeEventListener("message", handler);
            reject(new Error("Aborted"));
          } else if (type === "error") {
            workerRef.current?.removeEventListener("message", handler);
            const err = new Error(workerError.message);
            err.name = workerError.name;
            reject(err);
          }
        };

        workerRef.current?.addEventListener("message", handler);

        // Send pixel data
        workerRef.current?.postMessage({
          id: workerId,
          action: "process",
          originalImageData,
          resizedImageData,
          qualityMode: "high",
          capabilities,
          padX,
          padY,
          innerWidth,
          innerHeight
        });
      });

      const processedImageData = await workerPromise;

      // 4. Convert processed ImageData back to Blob
      setProgressStage("Finalizing...");
      setProgressPercent(95);

      const outCanvas = document.createElement("canvas");
      outCanvas.width = processedImageData.width;
      outCanvas.height = processedImageData.height;
      outCanvas.getContext("2d")?.putImageData(processedImageData, 0, 0);

      const outBlob = await new Promise<Blob>((resolve, reject) => {
        outCanvas.toBlob((b) => b ? resolve(b) : reject(new Error("Failed to create PNG")), "image/png", 1.0);
      });

      setProcessedBlob(outBlob);
      setProcessedUrl(URL.createObjectURL(outBlob));
    } catch (err: any) {
      if (err.message === "Aborted") {
        setError("Processing cancelled.");
      } else if (err.name === "ModelLoadError") {
        setError(err.message || "Model failed to load.");
      } else if (err.name === "ONNXInitError") {
        setError(err.message || "ONNX Runtime initialization failed.");
      } else if (err.name === "MemoryError") {
        setError(err.message || "Insufficient browser memory.");
      } else {
        console.error("BG Removal Error:", err);
        setError(err.message || "An error occurred during AI processing.");
      }
    } finally {
      setIsProcessing(false);
      setProgressStage("");
      setProgressPercent(0);
    }
  };

  const handleCancel = () => {
    if (workerRef.current) {
      workerRef.current.postMessage({ action: "abort" });
    }
  };


  const clearAll = () => {
    handleCancel();
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setFile(null);
    setOriginalImageUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setError(null);
  };

  const handleDownload = () => {
    if (processedBlob && file) {
      const originalName = file.name.replace(/\.[^/.]+$/, "");
      downloadBlob(processedBlob, `${originalName}_bg_removed.png`);
    }
  };

  const faqs = [
    {
      question: "Is Background Remover free?",
      answer: "Yes, our AI Background Remover is completely free to use without any hidden limits."
    },
    {
      question: "Are my images uploaded?",
      answer: "No, all AI processing happens entirely in your browser using ONNX WebAssembly and WebGPU. Your images never leave your device."
    },
    {
      question: "Does this work offline?",
      answer: "Once the AI model is downloaded to your browser cache on your first visit, the tool works completely offline."
    },
    {
      question: "Which image formats are supported?",
      answer: "We support standard web image formats including JPG/JPEG, PNG, and WebP."
    },
    {
      question: "Can I download transparent PNG?",
      answer: "Yes, the tool outputs a high-quality transparent PNG file by default."
    },
    {
      question: "How accurate is the AI?",
      answer: "We use state-of-the-art AI models that are highly accurate at distinguishing foreground subjects (people, products, animals) from complex backgrounds."
    }
  ];

  return (
    <ToolLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <ToolHeader 
          title="AI Background Remover"
          subtitle="Remove image backgrounds instantly using private AI processing directly inside your browser."
          icon={<ImageIcon className="w-6 h-6 text-purple-500" />}
        />

        {/* Display capabilities info playfully if WebGPU is available */}
        {capabilities && !file && capabilities.webGpuSupported && (
           <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 flex items-center justify-center gap-2 text-sm font-medium text-purple-700 animate-in fade-in max-w-sm mx-auto shadow-sm">
              <Cpu className="w-4 h-4" />
              WebGPU Hardware Acceleration Enabled
           </div>
        )}
        
        {!processedBlob && !file && (
          <div className="space-y-6 animate-in fade-in">

            <AIUploadZone 
              onFileSelect={handleFileSelect}
              error={error}
              onErrorClear={() => setError(null)}
            />
          </div>
        )}

        {!processedBlob && file && originalImageUrl && (
          <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {isProcessing && progressStage.includes("Loading AI") && (
              <ModelLoader stage={progressStage} progress={progressPercent} />
            )}
            
            {isProcessing && !progressStage.includes("Loading AI") && (
              <AIProgress stage={progressStage} progress={progressPercent} />
            )}

            <div className="mb-8">
               <ImagePreview image={originalImageUrl} />
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 mb-8">
               <div className="flex-1 text-center sm:text-left min-w-0">
                 <h3 className="text-lg font-bold text-slate-800 truncate mb-1">{file.name}</h3>
                 <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-sm text-slate-500">
                    <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">{file.type || 'image/unknown'}</span>
                    <span>•</span>
                    <span>{formatFileSize(file.size)}</span>
                 </div>
               </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start text-left max-w-md mx-auto mt-6">
                    <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
                <div className="mt-8 flex justify-center">
                  <Button 
                    size="lg" 
                    className="w-full max-w-md h-14 rounded-2xl text-base font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20 transition-all"
                    onClick={handleStartProcessing}
                    disabled={isProcessing}
                  >
                    Remove Background <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
            )}
            
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" onClick={isProcessing ? handleCancel : clearAll} className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                  {isProcessing ? "Cancel Processing" : "Remove File"}
               </Button>
            </div>
          </div>
        )}

        {processedBlob && processedUrl && originalImageUrl && (
          <AIResultCard 
             originalImage={originalImageUrl}
             processedImage={processedUrl}
             originalSize={file!.size}
             processedSize={processedBlob.size}
             onDownload={handleDownload}
             onReset={clearAll}
          />
        )}
      </div>

      <div className="mt-16 border-t border-slate-200 pt-16 max-w-6xl mx-auto w-full">
         <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">How It Works</h2>
         <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center max-w-4xl mx-auto">
            {[
              { step: 1, title: "Upload Image", desc: "Drag and drop your file" },
              { step: 2, title: "AI Detection", desc: "AI maps the foreground" },
              { step: 3, title: "Processing", desc: "Background is erased" },
              { step: 4, title: "Preview", desc: "Check the transparency" },
              { step: 5, title: "Download", desc: "Save as PNG" }
            ].map(s => (
               <div key={s.step} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                     {s.step}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">{s.title}</h4>
                  <p className="text-xs text-slate-500">{s.desc}</p>
               </div>
            ))}
         </div>
      </div>

      <div className="mt-16 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: "AI Powered", desc: "State of the art machine learning models." },
             { title: "Completely Private", desc: "Images never leave your browser." },
             { title: "Browser Processing", desc: "Powered by WebGPU & WebAssembly." },
             { title: "Transparent PNG", desc: "Output preserves perfect alpha channels." },
             { title: "No Uploads", desc: "Save time by bypassing server uploads." },
             { title: "Fast Processing", desc: "Leverages local hardware acceleration." }
           ].map((f, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
               <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</div>
                 {f.title}
               </h4>
               <p className="text-sm text-slate-600">{f.desc}</p>
             </div>
           ))}
        </div>
      </div>

      <RelatedTools />
      <FAQSection faqs={faqs} />
      
      <AboutTool 
        title="About our AI Engine"
        content={
          <>
            <p>
              To provide incredibly accurate background removal while ensuring 100% privacy, we utilize <strong>ONNX Runtime Web</strong>. Instead of sending your personal photos to a remote server for processing, our application downloads a lightweight, pre-trained neural network directly into your browser's local cache.
            </p>
            <p>
              Whenever possible, we tap into <strong>WebGPU</strong> to utilize your device's graphics card, drastically accelerating the AI inference. If WebGPU isn't available, we seamlessly fall back to highly optimized WebAssembly (WASM).
            </p>
          </>
        }
      />
      {children}
    </ToolLayout>
  );
}
