export interface BarcodeSettings {
  value: string;
  format: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontOptions: string;
  font: string;
  textAlign: string;
  textPosition: string;
  textMargin: number;
  fontSize: number;
  background: string;
  lineColor: string;
  margin: number;
}

export const BARCODE_FORMATS = [
  { value: "CODE128", label: "Code 128 (Standard)" },
  { value: "CODE39", label: "Code 39" },
  { value: "EAN13", label: "EAN-13" },
  { value: "EAN8", label: "EAN-8" },
  { value: "UPC", label: "UPC-A" },
  { value: "UPCE", label: "UPC-E" },
  { value: "ITF14", label: "ITF-14" },
  { value: "ITF", label: "ITF (Interleaved 2 of 5)" },
  { value: "MSI", label: "MSI" },
  { value: "pharmacode", label: "Pharmacode" },
  { value: "codabar", label: "Codabar" }
];

export const DEFAULT_BARCODE_SETTINGS: BarcodeSettings = {
  value: "FILEINATOR123",
  format: "CODE128",
  width: 2,
  height: 100,
  displayValue: true,
  fontOptions: "",
  font: "monospace",
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10
};
