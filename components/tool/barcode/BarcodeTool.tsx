"use client";

import React, { useState } from "react";
import { BarcodeSettingsPanel } from "./BarcodeSettingsPanel";
import { BarcodePreview } from "./BarcodePreview";
import { BarcodeSettings, DEFAULT_BARCODE_SETTINGS } from "./types";

export function BarcodeTool() {
  const [settings, setSettings] = useState<BarcodeSettings>(DEFAULT_BARCODE_SETTINGS);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <BarcodeSettingsPanel settings={settings} onChange={setSettings} />
      </div>
      <div className="lg:col-span-2 h-full min-h-[400px]">
        <BarcodePreview settings={settings} />
      </div>
    </div>
  );
}
