"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageItem, ToolMode, BrushStroke } from "./types";
import { RemoverWorkspace } from "./RemoverWorkspace";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brush, Eraser, Move, Wand2 } from "lucide-react";

export function ObjectRemoverTool() {
  const [image, setImage] = useState<ImageItem | null>(null);
  
  // Tool state
  const [toolMode, setToolMode] = useState<ToolMode>('brush');
  const [brushSize, setBrushSize] = useState(30);
  
  // History state
  const [history, setHistory] = useState<BrushStroke[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Ready");

  const handleImageUpload = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setImage({
      id: uuidv4(),
      file: f,
      originalSrc: URL.createObjectURL(f),
      name: f.name
    });
    // Reset state
    setHistory([[]]);
    setHistoryIndex(0);
    setToolMode('brush');
  };

  const currentStrokes = history[historyIndex] || [];

  const handleStrokeEnd = (stroke: BrushStroke) => {
    // Drop future history if we draw after undoing
    const newHistory = history.slice(0, historyIndex + 1);
    const newStrokes = [...currentStrokes, stroke];
    newHistory.push(newStrokes);
    
    // Keep max 20 history states to avoid memory bloat
    if (newHistory.length > 20) newHistory.shift();
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={image ? "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" : "block"}>
        
        {/* Left Toolbar */}
        {image && (
          <div className="lg:col-span-1 h-full">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-full max-h-[calc(100vh-200px)]">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0 rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <h2 className="font-semibold text-slate-800">Toolbar</h2>
                </div>
              </div>

              <div className="p-5 flex-1 space-y-6">
                
                {/* Tool Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-700">Select Tool</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      disabled={isProcessing}
                      onClick={() => setToolMode('brush')}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        toolMode === 'brush' 
                          ? 'border-purple-500 bg-purple-50 text-purple-700' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50'
                      }`}
                    >
                      <Brush className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Draw</span>
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => setToolMode('erase')}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        toolMode === 'erase' 
                          ? 'border-purple-500 bg-purple-50 text-purple-700' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50'
                      }`}
                    >
                      <Eraser className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Erase</span>
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={() => setToolMode('pan')}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                        toolMode === 'pan' 
                          ? 'border-purple-500 bg-purple-50 text-purple-700' 
                          : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50'
                      }`}
                    >
                      <Move className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Pan</span>
                    </button>
                  </div>
                </div>

                {/* Brush Size */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-semibold text-slate-700">Brush Size</Label>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                      {brushSize}px
                    </span>
                  </div>
                  <Slider 
                    value={[brushSize]}
                    onValueChange={(val) => setBrushSize(val[0])}
                    min={5}
                    max={150}
                    step={1}
                    disabled={isProcessing || toolMode === 'pan'}
                    className="py-2"
                  />
                  
                  {/* Brush size preview */}
                  <div className="h-20 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden">
                    <div 
                      className="bg-green-400/50 rounded-full transition-all border border-green-500"
                      style={{ width: brushSize, height: brushSize }}
                    />
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 rounded-b-3xl text-center">
                Scroll to zoom in/out
              </div>
            </div>
          </div>
        )}

        {/* Workspace */}
        <div className={image ? "lg:col-span-3" : "w-full"}>
          <RemoverWorkspace 
            image={image}
            toolMode={toolMode}
            brushSize={brushSize}
            onImageUpload={handleImageUpload}
            strokes={currentStrokes}
            onStrokeEnd={handleStrokeEnd}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            progress={progress}
            setProgress={setProgress}
            status={status}
            setStatus={setStatus}
          />
        </div>

      </div>
    </div>
  );
}
