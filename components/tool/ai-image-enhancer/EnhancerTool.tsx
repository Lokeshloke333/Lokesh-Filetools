"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import { ImageItem, EnhancerSettings, DEFAULT_ENHANCER_SETTINGS } from "./types";
import { ImageProcessor } from "./ImageProcessor";
import { SettingsPanel } from "./SettingsPanel";
import { EnhancerWorkspace } from "./EnhancerWorkspace";
import { BatchCarousel } from "./BatchCarousel";

export function EnhancerTool() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [settings, setSettings] = useState<EnhancerSettings>(DEFAULT_ENHANCER_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Store batch settings specifically (map of image ID to settings)
  const [batchSettings, setBatchSettings] = useState<Record<string, EnhancerSettings>>({});

  const handleImagesUpload = (files: File[]) => {
    const newImages = files.map(f => ({
      id: uuidv4(),
      file: f,
      originalSrc: URL.createObjectURL(f),
      name: f.name
    }));
    
    setImages(prev => [...prev, ...newImages]);
    
    // Auto-select the first new image if this is the first upload
    if (images.length === 0) {
      setCurrentIndex(0);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length === 0) {
        setSettings(DEFAULT_ENHANCER_SETTINGS);
        return [];
      }
      // Adjust index if necessary
      if (currentIndex >= filtered.length) {
        setCurrentIndex(filtered.length - 1);
      }
      return filtered;
    });
  };

  const handleSettingsChange = (newSettings: EnhancerSettings) => {
    setSettings(newSettings);
    if (images[currentIndex]) {
      setBatchSettings(prev => ({
        ...prev,
        [images[currentIndex].id]: newSettings
      }));
    }
  };

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex);
    const id = images[newIndex]?.id;
    if (id && batchSettings[id]) {
      setSettings(batchSettings[id]);
    } else {
      setSettings(DEFAULT_ENHANCER_SETTINGS);
    }
  };

  const handleAutoEnhance = async () => {
    if (!images[currentIndex]) return;
    const recommended = await ImageProcessor.calculateAutoEnhance(images[currentIndex].originalSrc);
    handleSettingsChange(recommended);
  };

  const handleApplyToAll = () => {
    const newBatch: Record<string, EnhancerSettings> = {};
    images.forEach(img => {
      newBatch[img.id] = { ...settings };
    });
    setBatchSettings(newBatch);
  };

  const handleDownload = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      if (images.length === 1) {
        // Single download
        const result = await ImageProcessor.processImage(images[0].originalSrc, settings);
        triggerDownload(result, `enhanced-${images[0].name}`);
      } else {
        // Batch ZIP download
        const zip = new JSZip();
        for (const img of images) {
          const imgSettings = batchSettings[img.id] || DEFAULT_ENHANCER_SETTINGS;
          const result = await ImageProcessor.processImage(img.originalSrc, imgSettings);
          const base64Data = result.split(',')[1];
          zip.file(`enhanced-${img.name}`, base64Data, { base64: true });
        }
        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        triggerDownload(url, "enhanced-images.zip");
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error("Export failed", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className={images.length > 0 ? "grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" : "block"}>
        
        {/* Left Settings Sidebar */}
        {images.length > 0 && (
          <div className="lg:col-span-1 hidden lg:block h-full">
            <SettingsPanel 
              settings={settings} 
              onChange={handleSettingsChange} 
              onAutoEnhance={handleAutoEnhance}
              onApplyToAll={handleApplyToAll}
              isBatch={images.length > 1}
            />
          </div>
        )}

        {/* Main Workspace */}
        <div className={images.length > 0 ? "lg:col-span-3" : "w-full"}>
          <EnhancerWorkspace 
            images={images}
            currentIndex={currentIndex}
            settings={settings}
            onImagesUpload={handleImagesUpload}
            onDownload={handleDownload}
            isProcessing={isProcessing}
          />
          
          <BatchCarousel 
            images={images}
            currentIndex={currentIndex}
            onSelect={handleIndexChange}
            onRemove={handleRemoveImage}
          />
        </div>

        {/* Mobile Settings (Visible below workspace on mobile) */}
        <div className="lg:hidden col-span-1">
          {images.length > 0 && (
            <SettingsPanel 
              settings={settings} 
              onChange={handleSettingsChange} 
              onAutoEnhance={handleAutoEnhance}
              onApplyToAll={handleApplyToAll}
              isBatch={images.length > 1}
            />
          )}
        </div>

      </div>
    </div>
  );
}
