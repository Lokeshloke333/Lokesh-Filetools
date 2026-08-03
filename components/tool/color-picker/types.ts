export interface ColorInfo {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

// Color Calculation utilities
export function generateColorInfo(hex: string): ColorInfo {
  const [r, g, b] = hexToRgb(hex);

  // HSL
  let rP = r / 255;
  let gP = g / 255;
  let bP = b / 255;
  let max = Math.max(rP, gP, bP), min = Math.min(rP, gP, bP);
  let h = 0, s, l = (max + min) / 2;
  let d = max - min;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rP: h = (gP - bP) / d + (gP < bP ? 6 : 0); break;
      case gP: h = (bP - rP) / d + 2; break;
      case bP: h = (rP - gP) / d + 4; break;
    }
    h /= 6;
  }
  const hslStr = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  // HSV
  let v = max;
  let sHSV = max === 0 ? 0 : d / max;
  const hsvStr = `hsv(${Math.round(h * 360)}, ${Math.round(sHSV * 100)}%, ${Math.round(v * 100)}%)`;

  // CMYK
  let c = 1 - rP;
  let m = 1 - gP;
  let y = 1 - bP;
  let k = Math.min(c, m, y);
  
  if (k === 1) {
    c = m = y = 0;
  } else {
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
  }
  const cmykStr = `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;

  return {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, 1)`,
    hsl: hslStr,
    hsv: hsvStr,
    cmyk: cmykStr
  };
}
